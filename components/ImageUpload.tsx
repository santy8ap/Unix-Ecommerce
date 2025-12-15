'use client'

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { CldUploadWidget } from 'next-cloudinary'
import { Upload, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react'

type ImageUploadProps = {
    value: string[]
    onChange: (urls: string[]) => void
    maxFiles?: number
}

export default function ImageUpload({
    value = [],
    onChange,
    maxFiles = 5
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)

    // Handle Cloudinary uploads
    const handleCloudinaryUpload = (result: any) => {
        if (result.event === 'success') {
            const imageUrl = result.info.secure_url
            onChange([...value, imageUrl])
            toast.success('Image uploaded successfully')
        }
    }

    // Handle drag and drop for additional uploads
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return
        if (value.length >= maxFiles) {
            toast.error(`Maximum ${maxFiles} images allowed`)
            return
        }

        setUploading(true)
        const uploadedUrls: string[] = []
        const toastId = toast.loading(`Uploading ${acceptedFiles.length} image(s)...`)

        for (let i = 0; i < acceptedFiles.length; i++) {
            const file = acceptedFiles[i]
            setUploadProgress(((i + 1) / acceptedFiles.length) * 100)

            try {
                // Convert file to base64
                const reader = new FileReader()
                const base64Promise = new Promise<string>((resolve, reject) => {
                    reader.onload = () => resolve(reader.result as string)
                    reader.onerror = reject
                    reader.readAsDataURL(file)
                })

                const base64 = await base64Promise

                // Upload via our API route
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        image: base64,
                        folder: 'red-estampacion/products'
                    }),
                })

                if (!response.ok) {
                    const errorData = await response.json()
                    throw new Error(errorData.error || 'Error uploading image')
                }

                const data = await response.json()
                uploadedUrls.push(data.url)
            } catch (error) {
                console.error('Error uploading image:', error)
                toast.error(`Error uploading ${file.name}`)
            }
        }

        if (uploadedUrls.length > 0) {
            onChange([...value, ...uploadedUrls])
            toast.success(`${uploadedUrls.length} image(s) uploaded successfully`, { id: toastId })
        } else {
            toast.error('Could not upload images', { id: toastId })
        }

        setUploading(false)
        setUploadProgress(0)
    }, [value, onChange, maxFiles])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
        },
        maxFiles: maxFiles - value.length,
        disabled: uploading || value.length >= maxFiles
    })

    const removeImage = (index: number) => {
        const newImages = value.filter((_, i) => i !== index)
        onChange(newImages)
        toast.success('Image removed')
    }

    const moveImage = (from: number, to: number) => {
        const newImages = [...value]
        const [removed] = newImages.splice(from, 1)
        newImages.splice(to, 0, removed)
        onChange(newImages)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-bold text-slate-700">
                    Gallery ({value.length}/{maxFiles})
                </label>
                {value.length > 0 && (
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full font-bold">
                        {value.length} uploaded
                    </span>
                )}
            </div>

            {/* Preview Grid */}
            {value.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {value.map((url, index) => (
                        <div
                            key={`${url}-${index}`}
                            className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50"
                        >
                            <Image
                                src={url}
                                alt={`Preview ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                                {index > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => moveImage(index, index - 1)}
                                        className="p-1.5 bg-white/90 rounded-lg hover:bg-white transition text-slate-900"
                                        title="Move left"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="p-1.5 bg-red-500/90 text-white rounded-lg hover:bg-red-500 transition"
                                    title="Remove"
                                >
                                    <X className="w-4 h-4" />
                                </button>

                                {index < value.length - 1 && (
                                    <button
                                        type="button"
                                        onClick={() => moveImage(index, index + 1)}
                                        className="p-1.5 bg-white/90 rounded-lg hover:bg-white transition text-slate-900"
                                        title="Move right"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {/* Badge */}
                            {index === 0 && (
                                <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-lg font-bold">
                                    Cover
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Area */}
            {value.length < maxFiles && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Cloudinary Upload Widget */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                        <ImageIcon className="w-8 h-8 text-slate-400 mb-3" />
                        <h3 className="text-sm font-bold text-slate-900 mb-1">Cloud Upload</h3>
                        <p className="text-xs text-slate-500 mb-4">Use Cloudinary widget</p>
                        <CldUploadWidget
                            uploadPreset="red_estampacion"
                            onSuccess={handleCloudinaryUpload}
                            options={{
                                maxFiles: maxFiles - value.length,
                                folder: 'red-estampacion/products',
                                sources: ['local', 'url', 'camera'],
                                multiple: true,
                                showPoweredBy: false,
                                clientAllowedFormats: ['jpg', 'png', 'webp', 'gif'],
                                maxFileSize: 10485760, // 10MB
                                cropping: true,
                                croppingAspectRatio: 1,
                                croppingShowDimensions: true,
                                croppingValidateDimensions: true,
                            }}
                        >
                            {({ open }) => (
                                <button
                                    type="button"
                                    onClick={() => open()}
                                    className="w-full bg-white border border-slate-200 hover:border-slate-300 text-slate-700 py-2.5 rounded-lg transition text-sm font-bold shadow-sm"
                                >
                                    Select Files
                                </button>
                            )}
                        </CldUploadWidget>
                    </div>

                    {/* Dropzone */}
                    <div
                        {...getRootProps()}
                        className={`
                            border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center
                            ${isDragActive
                                ? 'border-slate-900 bg-slate-50'
                                : 'border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                            }
                            ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                    >
                        <input {...getInputProps()} />

                        {uploading ? (
                            <div className="space-y-3 w-full">
                                <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto" />
                                <p className="text-xs font-bold text-slate-900">Uploading... {Math.round(uploadProgress)}%</p>
                                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className="bg-slate-900 h-full rounded-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <>
                                <Upload className={`w-8 h-8 mb-3 ${isDragActive ? 'text-slate-900' : 'text-slate-400'}`} />
                                <p className="text-sm font-bold text-slate-900 mb-1">
                                    {isDragActive ? 'Drop files here' : 'Drag & Drop'}
                                </p>
                                <p className="text-xs text-slate-500">
                                    or click to browse
                                </p>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
"use client";

import { useState } from "react";
import { Heart, Download, Share2, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";

interface OutfitCardProps {
  outfit: {
    id?: string;
    name: string;
    description: string;
    items: string[];
    imageUrl?: string | null;
    isGeneratingImage?: boolean;
  };
  onSave?: (outfit: any) => Promise<void>;
  onGenerateImage?: (outfit: any) => Promise<string | null>;
  onImageGenerated?: (imageUrl: string) => void;
  showActions?: boolean;
}

export function OutfitCard({ 
  outfit, 
  onSave, 
  onGenerateImage, 
  onImageGenerated,
  showActions = true
}: OutfitCardProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState(outfit.imageUrl);

  const handleSave = async () => {
    if (!onSave) return;
    
    try {
      setIsSaving(true);
      await onSave(outfit);
      toast.success("¡Outfit guardado! Puedes encontrarlo en tu armario");
    } catch (error) {
      console.error("Error saving outfit:", error);
      toast.error("No se pudo guardar el outfit");
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!onGenerateImage) return;
    
    try {
      setIsGenerating(true);
      const imageUrl = await onGenerateImage(outfit);
      if (imageUrl) {
        setCurrentImage(imageUrl);
        if (onImageGenerated) {
          onImageGenerated(imageUrl);
        }
        toast.success("¡Imagen generada! La imagen del outfit ha sido creada con éxito");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("No se pudo generar la imagen del outfit");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!currentImage) return;

    try {
      const response = await fetch(currentImage);
      if (!response.ok) throw new Error("download_failed");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `outfit-${outfit.name.toLowerCase().replace(/\s+/g, "-")}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);
      toast.success("¡Imagen descargada! La imagen se ha guardado en tu dispositivo");
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error("No se pudo descargar la imagen");
    }
  };

  return (
    <div className="bg-gray-900/30 border border-gray-700 rounded-xl overflow-hidden hover:border-indigo-500/50 transition-colors h-full flex flex-col">
      <div className="p-1 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
      
      {/* Imagen del outfit */}
      <div className="relative aspect-[3/4] bg-gray-800 flex items-center justify-center">
        {currentImage ? (
          <Image
            src={currentImage}
            alt={outfit.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="text-center p-6">
            <ImageIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-sm text-gray-400">
              {isGenerating ? 'Generando imagen...' : 'Sin imagen generada'}
            </p>
          </div>
        )}
        
        {isGenerating && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-white">{outfit.name}</h3>
          {showActions && onSave && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSave}
              disabled={isSaving}
              className="text-gray-400 hover:text-white"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Heart className="h-5 w-5" />
              )}
              <span className="sr-only">Guardar outfit</span>
            </Button>
          )}
        </div>
        
        <p className="text-gray-400 text-sm italic mb-4 line-clamp-2">
          {outfit.description}
        </p>

        <div className="mt-auto">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Prendas:</h4>
          <ul className="space-y-1 mb-4">
            {outfit.items.slice(0, 3).map((item, index) => (
              <li 
                key={index} 
                className="flex items-center gap-2 text-sm bg-gray-800/50 p-2 rounded-lg text-gray-300"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                <span className="truncate">{item}</span>
              </li>
            ))}
            {outfit.items.length > 3 && (
              <li className="text-xs text-gray-500 text-right">
                +{outfit.items.length - 3} más
              </li>
            )}
          </ul>

          {showActions && (
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleGenerateImage}
                disabled={isGenerating}
                className="text-xs"
              >
                {isGenerating ? (
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                ) : (
                  <ImageIcon className="mr-1 h-3 w-3" />
                )}
                {currentImage ? 'Regenerar' : 'Generar'}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownloadImage}
                disabled={!currentImage}
                className="text-xs"
              >
                <Download className="mr-1 h-3 w-3" />
                Descargar
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

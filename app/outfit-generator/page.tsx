"use client";

import { useState, useEffect } from "react";
import { ClosetItem } from "@/components/OutfitGenerator/OutfitForm";
import { motion } from "framer-motion";
import { Sparkles, Shirt, Image as ImageIcon, Heart, Loader2 } from "lucide-react";
import { OutfitForm } from "@/components/OutfitGenerator/OutfitForm";
import { OutfitCard } from "@/components/OutfitGenerator/OutfitCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Outfit {
  id?: string;
  name: string;
  description: string;
  items: string[];
  imageUrl?: string | null;
  isGeneratingImage?: boolean;
  style?: string;
}

export default function OutfitGeneratorPage() {
  const { data: session } = useSession();
  const router = useRouter();
  // toast is now available from sonner
  const [isLoading, setIsLoading] = useState(false);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [savedOutfits, setSavedOutfits] = useState<Outfit[]>([]);
  const [activeTab, setActiveTab] = useState("generate");
  const [closetItems, setClosetItems] = useState<Array<{id: string, name: string, category: string}>>([]);

  // Cargar prendas del closet y outfits guardados
  useEffect(() => {
    if (session?.user?.id) {
      fetchClosetItems();
      fetchSavedOutfits();
    }
  }, [session]);

  const fetchClosetItems = async () => {
    try {
      const response = await fetch("/api/closet");
      const data = await response.json();
      if (data.items) {
        setClosetItems(data.items);
      }
    } catch (error) {
      console.error("Error fetching closet items:", error);
      toast.error("No se pudieron cargar las prendas del armario");
    }
  };

  const fetchSavedOutfits = async () => {
    try {
      const response = await fetch("/api/outfits");
      const data = await response.json();
      if (data.outfits) {
        setSavedOutfits(data.outfits);
      }
    } catch (error) {
      console.error("Error fetching saved outfits:", error);
      toast.error("No se pudieron cargar los outfits guardados");
    }
  };

  const handleGenerateOutfits = async (data: {
    closetItems: ClosetItem[];
    colorPalette: string;
    style: string;
    season: string;
    occasion: string;
    notes: string;
  }) => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/ai/outfits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          userId: session.user.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al generar los outfits");
      }

      const result = await response.json();
      const newOutfits = result.outfits.map((outfit: any) => ({
        ...outfit,
        isGeneratingImage: false,
        style: data.style
      }));
      
      setOutfits(newOutfits);
      setActiveTab("results");
      
      toast.success("¡Outfits generados! Aquí tienes tus combinaciones personalizadas");
    } catch (error) {
      console.error("Error generating outfits:", error);
      toast.error("No se pudieron generar los outfits. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImage = async (outfit: Outfit) => {
    if (!session) return null;
    
    try {
      // Actualizar el estado para mostrar el indicador de carga
      const updatedOutfits = outfits.map(o => 
        o.name === outfit.name ? { ...o, isGeneratingImage: true } : o
      );
      setOutfits(updatedOutfits);
      
      // Llamar a la API para generar la imagen
      const formData = new FormData();
      formData.append('name', outfit.name);
      formData.append('description', outfit.description);
      formData.append('items', JSON.stringify(outfit.items));
      formData.append('prompt', `Outfit: ${outfit.name}. ${outfit.description}. Style: ${outfit.style || 'casual'}.`);
      
      const response = await fetch('/api/outfits', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Error al generar la imagen');
      
      const result = await response.json();
      return result.imageUrl || null;
    } catch (error) {
      console.error('Error generating image:', error);
      return null;
    }
  };

  const handleSaveOutfit = async (outfit: Outfit) => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', outfit.name);
      formData.append('description', outfit.description);
      formData.append('items', JSON.stringify(outfit.items));
      
      // Si hay una imagen, la incluimos
      if (outfit.imageUrl) {
        const imageResponse = await fetch(outfit.imageUrl);
        const blob = await imageResponse.blob();
        formData.append('image', new File([blob], 'outfit.png', { type: 'image/png' }));
      }

      const response = await fetch("/api/outfits", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Error al guardar el outfit");

      const savedOutfit = await response.json();
      setSavedOutfits(prev => [savedOutfit, ...prev]);
      
      toast.success("¡Outfit guardado! Puedes encontrarlo en tu colección guardada");
      
      return savedOutfit;
    } catch (error) {
      console.error("Error saving outfit:", error);
      toast.error("No se pudo guardar el outfit");
      throw error;
    }
  };

  const handleImageGenerated = (imageUrl: string) => {
    // Actualizar el outfit con la nueva imagen generada
    setOutfits(prev => 
      prev.map(o => ({
        ...o,
        imageUrl: o.name === outfits[0]?.name ? imageUrl : o.imageUrl,
        isGeneratingImage: false
      }))
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-4"
          >
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Generador de Outfits con IA
          </h1>
          <p className="text-gray-400 text-lg">
            Crea looks increíbles con las prendas de tu armario
          </p>
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8 bg-gray-800/50">
            <TabsTrigger 
              value="generate" 
              className="flex items-center gap-2"
              onClick={() => setActiveTab("generate")}
            >
              <Sparkles className="w-4 h-4" />
              Generar
            </TabsTrigger>
            <TabsTrigger 
              value="results" 
              className="flex items-center gap-2"
              disabled={outfits.length === 0}
              onClick={() => setActiveTab("results")}
            >
              <ImageIcon className="w-4 h-4" />
              Resultados
            </TabsTrigger>
            <TabsTrigger 
              value="saved" 
              className="flex items-center gap-2"
              onClick={() => setActiveTab("saved")}
            >
              <Heart className="w-4 h-4" />
              Guardados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-xl">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Shirt className="w-5 h-5 text-indigo-400" />
                    Preferencias del outfit
                  </h2>
                  <OutfitForm 
                    onSubmit={handleGenerateOutfits} 
                    isLoading={isLoading}
                    closetItems={closetItems}
                  />
                </div>
              </div>
              
              <div className="lg:col-span-2">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-xl h-full flex items-center justify-center">
                  <div className="text-center max-w-md">
                    <div className="p-4 bg-indigo-500/10 rounded-full inline-block mb-4">
                      <Sparkles className="w-10 h-10 text-indigo-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Genera tus outfits</h3>
                    <p className="text-gray-400 mb-6">
                      Completa el formulario y deja que nuestra IA cree combinaciones únicas con las prendas de tu armario.
                    </p>
                    <Button 
                      onClick={() => {
                        const form = document.getElementById('outfit-form');
                        if (form) {
                          form.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Comenzar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="results" className="mt-0">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-indigo-400" />
                  Resultados
                </h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setActiveTab("generate")}
                >
                  Generar más
                </Button>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Generando tus outfits...</p>
                  </div>
                </div>
              ) : outfits.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {outfits.map((outfit, index) => (
                    <OutfitCard
                      key={index}
                      outfit={outfit}
                      onSave={handleSaveOutfit}
                      onGenerateImage={handleGenerateImage}
                      onImageGenerated={handleImageGenerated}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-gray-900/30 rounded-xl border-2 border-dashed border-gray-700">
                  <Sparkles className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-400 mb-2">
                    No hay resultados aún
                  </h3>
                  <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                    Genera nuevos outfits completando el formulario.
                  </p>
                  <Button 
                    onClick={() => setActiveTab("generate")}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    Ir al generador
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="saved" className="mt-0">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-xl">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-400" />
                Outfits guardados
              </h2>
              
              {savedOutfits.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedOutfits.map((outfit) => (
                    <OutfitCard
                      key={outfit.id}
                      outfit={outfit}
                      showActions={false}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-gray-900/30 rounded-xl border-2 border-dashed border-gray-700">
                  <Heart className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-400 mb-2">
                    Aún no tienes outfits guardados
                  </h3>
                  <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                    Genera y guarda tus outfits favoritos para verlos aquí.
                  </p>
                  <Button 
                    onClick={() => setActiveTab("generate")}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    Generar outfits
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
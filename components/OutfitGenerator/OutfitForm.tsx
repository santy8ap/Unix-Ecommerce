"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export interface ClosetItem {
  id: string;
  name: string;
  category: string;
}

interface OutfitFormProps {
  onSubmit: (data: {
    closetItems: ClosetItem[];
    colorPalette: string;
    style: string;
    season: string;
    occasion: string;
    notes: string;
  }) => void;
  isLoading: boolean;
  closetItems: ClosetItem[];
}

export function OutfitForm({ onSubmit, isLoading, closetItems }: OutfitFormProps) {
  const [selectedItems, setSelectedItems] = useState<ClosetItem[]>([]);
  const [formData, setFormData] = useState({
    colorPalette: "",
    style: "",
    season: "",
    occasion: "",
    notes: "",
  });

  const handleItemToggle = (item: ClosetItem) => {
    setSelectedItems(prev => 
      prev.some(i => i.id === item.id)
        ? prev.filter(i => i.id !== item.id)
        : [...prev, item]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      closetItems: selectedItems,
    });
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="closetItems">Selecciona prendas de tu armario</Label>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {closetItems.map((item) => {
              const isSelected = selectedItems.some(selected => selected.id === item.id);
              return (
                <div 
                  key={item.id}
                  onClick={() => handleItemToggle(item)}
                  className={`p-3 border rounded-md cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                      : 'hover:bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.category}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="style">Estilo</Label>
            <Select
              value={formData.style}
              onValueChange={(value) => handleChange('style', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecciona un estilo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="deportivo">Deportivo</SelectItem>
                <SelectItem value="elegante">Elegante</SelectItem>
                <SelectItem value="bohemio">Bohemio</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="season">Temporada</Label>
            <Select
              value={formData.season}
              onValueChange={(value) => handleChange('season', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecciona una temporada" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primavera">Primavera</SelectItem>
                <SelectItem value="verano">Verano</SelectItem>
                <SelectItem value="otono">Otoño</SelectItem>
                <SelectItem value="invierno">Invierno</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="colorPalette">Paleta de colores (opcional)</Label>
          <Input
            id="colorPalette"
            placeholder="Ej: azul, blanco, beige"
            value={formData.colorPalette}
            onChange={(e) => handleChange('colorPalette', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="occasion">Ocasión (opcional)</Label>
          <Input
            id="occasion"
            placeholder="Ej: Cita, trabajo, fiesta"
            value={formData.occasion}
            onChange={(e) => handleChange('occasion', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="notes">Notas adicionales (opcional)</Label>
          <Textarea
            id="notes"
            placeholder="¿Alguna preferencia o requisito especial?"
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            className="mt-1"
            rows={3}
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-indigo-600 hover:bg-indigo-700"
        disabled={isLoading || !formData.style || !formData.season}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generando...
          </>
        ) : (
          'Generar Outfits'
        )}
      </Button>
    </form>
  );
}

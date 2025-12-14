"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shirt, Plus, Trash2, Tag, Loader2, LogIn } from "lucide-react";
import { useSession, signIn } from "next-auth/react";

interface ClosetItem {
  id: string;
  name: string;
  category: string;
}

export default function ClosetPage() {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<ClosetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("");
  const [adding, setAdding] = useState(false);

  // Cargar prendas al iniciar
  useEffect(() => {
    fetchCloset();
  }, []);

  const fetchCloset = async () => {
    try {
      const res = await fetch("/api/closet");
      const data = await res.json();
      if (data.items) {
        setItems(data.items);
      }
    } catch (error) {
      console.error("Error cargando armario:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    setAdding(true);
    try {
      const res = await fetch("/api/closet/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newItemName,
          category: newItemCategory || "General",
        }),
      });

      if (res.ok) {
        setNewItemName("");
        setNewItemCategory("");
        fetchCloset(); // Recargar lista
      }
    } catch (error) {
      console.error("Error guardando prenda:", error);
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("¿Seguro que quieres eliminar esta prenda?")) return;

    // Optimismo UI: eliminar visualmente inmediato
    setItems(items.filter((item) => item.id !== id));

    try {
      await fetch(`/api/closet/${id}`, { method: "DELETE" });
    } catch (error) {
      console.error("Error eliminando prenda:", error);
      fetchCloset(); // Revertir si falló
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Cabecera */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-4"
          >
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-lg">
              <Shirt className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Mi Armario Digital
          </h1>
          <p className="text-gray-400 text-lg">
            Guarda tus prendas favoritas para usarlas con tu estilista IA.
          </p>
        </div>

        {status === "loading" ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          </div>
        ) : !session ? (
          <div className="text-center py-12 bg-gray-800/30 rounded-2xl border border-gray-700 border-dashed max-w-lg mx-auto">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-indigo-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Inicia sesión para ver tu armario
            </h3>
            <p className="text-gray-400 mb-6">
              Necesitas una cuenta para guardar tus prendas.
            </p>
            <button
              onClick={() => signIn("google")}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition flex items-center gap-2 mx-auto"
            >
              <LogIn className="w-5 h-5" />
              Iniciar Sesión con Google
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Columna Izquierda: Formulario de Agregar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-xl sticky top-24">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-indigo-400" />
                  Agregar Prenda
                </h2>
                <form onSubmit={handleAddItem} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Nombre de la prenda
                    </label>
                    <input
                      type="text"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      placeholder="Ej: Camisa de lino blanca"
                      className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Categoría (Opcional)
                    </label>
                    <input
                      type="text"
                      value={newItemCategory}
                      onChange={(e) => setNewItemCategory(e.target.value)}
                      placeholder="Ej: Verano, Trabajo, Zapatos..."
                      className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={adding || !newItemName.trim()}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {adding ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}
                    Guardar en Armario
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Columna Derecha: Lista de Prendas */}
            <div className="lg:col-span-2">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-12 bg-gray-800/30 rounded-2xl border border-gray-700 border-dashed">
                  <Shirt className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-300">
                    Tu armario está vacío
                  </h3>
                  <p className="text-gray-500">
                    Agrega prendas usando el formulario de la izquierda.
                  </p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        layout
                        className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex justify-between items-center group hover:border-indigo-500/50 transition"
                      >
                        <div>
                          <h3 className="font-medium text-white">
                            {item.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Tag className="w-3 h-3 text-gray-500" />
                            <span className="text-xs text-gray-400 bg-gray-700/50 px-2 py-0.5 rounded-full">
                              {item.category || "General"}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition opacity-0 group-hover:opacity-100"
                          title="Eliminar prenda"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

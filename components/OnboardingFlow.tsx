/**
 * Componente de Onboarding UNIX
 * Primera experiencia del usuario para configurar su perfil de moda con IA
 */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Palette,
  Shirt,
  Check,
  ArrowRight,
  ArrowLeft,
  Sun,
  Snowflake,
  Scale,
  Briefcase,
  Activity,
  Flower2,
} from "lucide-react";
import { toast } from "sonner";

interface OnboardingProps {
  onComplete: () => void;
}

const SKIN_TONES = [
  {
    value: "warm",
    label: "Cálido",
    description: "Subtono dorado/amarillo",
    colors: ["#D4AF37", "#8B4513", "#FF8C00"],
    icon: Sun,
  },
  {
    value: "cool",
    label: "Frío",
    description: "Subtono rosado/azul",
    colors: ["#C0C0C0", "#4169E1", "#FF69B4"],
    icon: Snowflake,
  },
  {
    value: "neutral",
    label: "Neutro",
    description: "Equilibrio entre ambos",
    colors: ["#F5F5DC", "#696969", "#800020"],
    icon: Scale,
  },
];

const STYLE_TYPES = [
  {
    value: "casual",
    label: "Casual",
    icon: Shirt,
    description: "Relajado y cómodo",
  },
  {
    value: "formal",
    label: "Formal",
    icon: Briefcase,
    description: "Profesional y elegante",
  },
  {
    value: "sporty",
    label: "Deportivo",
    icon: Activity,
    description: "Activo y dinámico",
  },
  {
    value: "elegant",
    label: "Elegante",
    icon: Sparkles,
    description: "Sofisticado y refinado",
  },
  {
    value: "bohemian",
    label: "Bohemio",
    icon: Flower2,
    description: "Artístico y libre",
  },
];

export default function OnboardingFlow({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [skinTone, setSkinTone] = useState<string>("");
  const [styleType, setStyleType] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const steps = [
    {
      title: "Bienvenido a UNIX",
      subtitle: "Tu asistente personal de moda con IA",
    },
    {
      title: "Identifica tu tono de piel",
      subtitle: "Esto nos ayudará a recomendarte colores que te favorecen",
    },
    {
      title: "Elige tu estilo",
      subtitle: "Personaliza tus recomendaciones según tu gusto",
    },
    {
      title: "¡Listo!",
      subtitle: "Generando tu perfil de moda personalizado...",
    },
  ];

  const handleNext = async () => {
    if (step === 0) {
      setStep(1);
    } else if (step === 1) {
      if (!skinTone) {
        toast.error("Por favor selecciona tu tono de piel");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!styleType) {
        toast.error("Por favor selecciona tu estilo");
        return;
      }
      setStep(3);
      await completeOnboarding();
    }
  };

  const handleBack = () => {
    if (step > 0 && step < 3) {
      setStep(step - 1);
    }
  };

  const completeOnboarding = async () => {
    setIsAnalyzing(true);

    try {
      // Guardar preferencias
      const prefsResponse = await fetch("/api/users/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skinTone,
          styleType,
          onboardingCompleted: true,
        }),
      });

      if (!prefsResponse.ok) throw new Error("Error guardando preferencias");

      // Generar análisis de colorimetría
      const colorResponse = await fetch("/api/ai/colorimetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skinTone,
          useAI: true, // Usar IA de Gemini
        }),
      });

      if (!colorResponse.ok) {
        // Si falla la IA, intentar sin IA
        await fetch("/api/ai/colorimetry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            skinTone,
            useAI: false,
          }),
        });
      }

      // Pequeño delay para efecto
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("¡Perfil creado exitosamente!");
      onComplete();
    } catch (error) {
      console.error("Error en onboarding:", error);
      toast.error("Hubo un error. Inténtalo de nuevo.");
      setStep(2);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((s, i) => (
              <div
                key={i}
                className={`flex-1 h-1 rounded-full mx-1 transition-all duration-500 ${
                  i <= step
                    ? "bg-gradient-to-r from-purple-500 to-pink-500"
                    : "bg-slate-800"
                }`}
              />
            ))}
          </div>
          <p className="text-center text-slate-400 text-sm">
            Paso {Math.min(step + 1, steps.length)} de {steps.length}
          </p>
        </div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl"
        >
          <AnimatePresence mode="wait">
            {/* Step 0: Welcome */}
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center"
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {steps[step].title}
                </h1>
                <p className="text-xl text-slate-300 mb-8">
                  {steps[step].subtitle}
                </p>
                <div className="space-y-4 text-left max-w-md mx-auto mb-8">
                  {[
                    {
                      icon: Palette,
                      text: "Análisis de colorimetría personalizado",
                    },
                    { icon: Shirt, text: "Generador de outfits con IA" },
                    { icon: Sparkles, text: "Recomendaciones inteligentes" },
                  ].map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3 text-slate-300"
                    >
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-4 h-4 text-purple-400" />
                      </div>
                      {feature.text}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 1: Skin Tone */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-3xl font-bold mb-2 text-white text-center">
                  {steps[step].title}
                </h2>
                <p className="text-slate-400 mb-8 text-center">
                  {steps[step].subtitle}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {SKIN_TONES.map((tone) => (
                    <motion.button
                      key={tone.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSkinTone(tone.value)}
                      className={`relative p-6 rounded-2xl border-2 transition-all ${
                        skinTone === tone.value
                          ? "border-purple-500 bg-purple-500/10"
                          : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                      }`}
                    >
                      {skinTone === tone.value && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className="mb-3">
                        <tone.icon className="w-8 h-8 mx-auto text-slate-300" />
                      </div>
                      <h3 className="font-bold text-white mb-1">
                        {tone.label}
                      </h3>
                      <p className="text-sm text-slate-400 mb-3">
                        {tone.description}
                      </p>
                      <div className="flex gap-2 justify-center">
                        {tone.colors.map((color, i) => (
                          <div
                            key={i}
                            className="w-6 h-6 rounded-full border-2 border-slate-700"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Style */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-3xl font-bold mb-2 text-white text-center">
                  {steps[step].title}
                </h2>
                <p className="text-slate-400 mb-8 text-center">
                  {steps[step].subtitle}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {STYLE_TYPES.map((style) => (
                    <motion.button
                      key={style.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setStyleType(style.value)}
                      className={`relative p-6 rounded-2xl border-2 transition-all ${
                        styleType === style.value
                          ? "border-pink-500 bg-pink-500/10"
                          : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                      }`}
                    >
                      {styleType === style.value && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className="mb-2">
                        <style.icon className="w-8 h-8 mx-auto text-slate-300" />
                      </div>
                      <h3 className="font-bold text-white mb-1 text-sm">
                        {style.label}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {style.description}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Processing */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-24 h-24 mx-auto mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-ping opacity-75" />
                  <div className="relative w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-12 h-12 text-white animate-pulse" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold mb-4 text-white">
                  {steps[step].title}
                </h2>
                <p className="text-slate-300 mb-2">{steps[step].subtitle}</p>
                <p className="text-sm text-slate-500">
                  Esto puede tomar unos segundos...
                </p>

                <div className="mt-8 flex justify-center gap-2">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-3 h-3 bg-purple-500 rounded-full"
                      animate={{ y: [0, -10, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation buttons */}
          {step < 3 && (
            <div className="flex gap-4 mt-8">
              {step > 0 && (
                <button
                  onClick={handleBack}
                  className="flex-1 px-6 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Atrás
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={isAnalyzing}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {step === 2 ? "¡Comenzar!" : "Siguiente"}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

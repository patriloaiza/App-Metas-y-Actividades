import React, { useState } from 'react';
import { X, HeartHandshake, Sparkles, Send, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { playSuccessChime } from '../utils/audio';

interface DarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DarModal: React.FC<DarModalProps> = ({ isOpen, onClose }) => {
  const { addLadrillo, selectedDate } = useApp();
  const [darText, setDarText] = useState('');
  const [tipo, setTipo] = useState<'publicacion' | 'ayuda' | 'conocimiento'>('publicacion');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!darText.trim()) return;

    // Convert into today's action or brick
    addLadrillo({
      fecha: selectedDate,
      titulo: `DAR: ${darText.trim()}`,
      bloqueTipo: 'BCM',
      duracionMinutos: 45,
      completada: false,
      categoria: 'VALOR (DAR)',
      origenRuta: 'Principio DAR: Dar antes de recibir',
      colorIdentificador: '#DC2626',
      impacto: 'Alto'
    });

    playSuccessChime();
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setDarText('');
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#162720]/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white border border-[#E4DEC3] rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-[#EAE6DF] flex items-center justify-between bg-[#FDF8F6]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FCEEEA] flex items-center justify-center text-[#9E3E2B] border border-[#F5D2C8]">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-[#9E3E2B]">
                Principio DAR (Entrega de Valor)
              </h2>
              <p className="text-xs text-[#7A6058]">
                "El éxito en la vida y en el negocio es directamente proporcional al valor que das al mundo."
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#7A6058] mb-1.5">
              ¿Qué valor vas a entregar hoy desinteresadamente?
            </label>
            <textarea
              rows={3}
              value={darText}
              onChange={e => setDarText(e.target.value)}
              placeholder="Ej: Publicar un carrusel con la mayor lección que aprendí perdiendo dinero el mes pasado..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D4CE] text-sm text-[#1E2522] focus:ring-2 focus:ring-[#9E3E2B] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            {[
              { id: 'publicacion', label: '📱 Contenido / Reflexión' },
              { id: 'ayuda', label: '🤝 Ayuda a un colega o cliente' },
              { id: 'conocimiento', label: '💡 Compartir recurso gratuito' }
            ].map(item => (
              <button
                type="button"
                key={item.id}
                onClick={() => setTipo(item.id as any)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  tipo === item.id
                    ? 'bg-[#9E3E2B] text-white border-[#9E3E2B]'
                    : 'bg-[#FDF8F6] text-[#7A6058] border-[#F5D2C8]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#69726E] hover:bg-gray-100 rounded-xl"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saved || !darText.trim()}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#9E3E2B] hover:bg-[#832F1F] text-white text-xs font-bold shadow transition-all disabled:opacity-50"
            >
              {saved ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>¡Convertido en Ladrillo!</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Agendar como Ladrillo de DAR</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

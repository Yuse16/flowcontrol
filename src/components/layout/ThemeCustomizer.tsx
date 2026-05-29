"use client";
import { useState, useEffect } from 'react';
import { useDesign } from '@/context/DesignContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, X, RotateCcw, Layout, Type, Square, 
  MousePointer2, ChevronRight, ChevronLeft, 
  Pencil, Eye, Settings, Move, Monitor, Layers, Box, Maximize
} from 'lucide-react';

export function ThemeCustomizer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isInspectorActive, setIsInspectorActive] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { 
    settings, 
    selectedElementId, 
    setSelectedElementId, 
    updateGlobalSettings, 
    updateElementStyle, 
    resetSettings 
  } = useDesign();

  // Handle Inspector Mode
  useEffect(() => {
    if (!isInspectorActive) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      target.classList.add('granular-inspector-hover');
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      target.classList.remove('granular-inspector-hover');
    };

    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const target = e.target as HTMLElement;
      
      // Get or Create a unique design-id
      let designId = target.getAttribute('data-design-id');
      if (!designId) {
        designId = `el-${Math.random().toString(36).substr(2, 9)}`;
        target.setAttribute('data-design-id', designId);
      }

      setSelectedElementId(designId);
      setIsInspectorActive(false);
      setActiveSection('element-props');
      setIsOpen(true);
    };

    document.body.classList.add('cursor-crosshair');
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('click', handleClick, { capture: true });

    return () => {
      document.body.classList.remove('cursor-crosshair');
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('click', handleClick, { capture: true });
      document.querySelectorAll('.granular-inspector-hover').forEach(el => el.classList.remove('granular-inspector-hover'));
    };
  }, [isInspectorActive]);

  const currentElementStyle = selectedElementId ? (settings.overrides[selectedElementId] || {}) : {};

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .granular-inspector-hover {
          outline: 2px dashed #ff5c00 !important;
          outline-offset: -2px !important;
          background-color: rgba(255, 92, 0, 0.1) !important;
        }
        .wp-customizer {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background: #f0f0f1;
        }
      `}} />

      {/* Floating Triggers */}
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-3">
        <button 
          onClick={() => setIsInspectorActive(!isInspectorActive)}
          className={`w-12 h-12 flex items-center justify-center rounded-full shadow-lg transition-all ${isInspectorActive ? 'bg-orange-500 text-white animate-pulse' : 'bg-white text-orange-500 border border-orange-500 hover:bg-orange-50'}`}
          title="Seleccionar elemento para editar"
        >
          <MousePointer2 size={20} />
        </button>

        <button 
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 flex items-center justify-center bg-[#2271b1] text-white rounded-full shadow-lg hover:bg-[#135e96] transition-all"
          title="Personalizar"
        >
          <Settings size={20} />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="fixed top-0 left-0 h-full w-[320px] wp-customizer z-[100] shadow-2xl flex flex-col border-r border-[#dcdcde]"
          >
            {/* Header WP-Style */}
            <div className="p-3 bg-[#1d2327] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings size={16} className="text-[#72aee6]" />
                <span className="text-xs font-bold uppercase tracking-wider">Editor de Diseño</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-[#72aee6] hover:text-white p-1">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {!activeSection ? (
                /* Menú Principal */
                <div className="bg-white">
                   <div className="p-5 border-b border-[#f0f0f1]">
                     <h2 className="text-sm font-bold text-[#1d2327]">Ajustes de UZALA</h2>
                     <p className="text-[10px] text-[#646970]">Estás editando el diseño de la aplicación.</p>
                   </div>
                   
                   <button 
                    onClick={() => setActiveSection('global')}
                    className="w-full flex items-center justify-between px-4 py-4 border-b border-[#f0f0f1] hover:bg-[#f6f7f7] transition-colors"
                   >
                     <div className="flex items-center gap-3">
                       <Palette size={18} className="text-[#8c8f94]" />
                       <span className="text-sm font-medium">Diseño Global</span>
                     </div>
                     <ChevronRight size={16} className="text-[#8c8f94]" />
                   </button>

                   {selectedElementId && (
                     <button 
                      onClick={() => setActiveSection('element-props')}
                      className="w-full flex items-center justify-between px-4 py-4 border-b border-[#f0f0f1] bg-orange-50 hover:bg-orange-100 transition-colors"
                     >
                       <div className="flex items-center gap-3 text-orange-700">
                         <Box size={18} />
                         <span className="text-sm font-bold italic">Editar Elemento Seleccionado</span>
                       </div>
                       <ChevronRight size={16} />
                     </button>
                   )}

                   <div className="p-6">
                     <button 
                       onClick={resetSettings}
                       className="w-full py-2 border border-[#d63638] text-[#d63638] rounded text-[10px] font-bold hover:bg-[#d63638] hover:text-white transition-all"
                     >
                       LIMPIAR TODA LA PERSONALIZACIÓN
                     </button>
                   </div>
                </div>
              ) : (
                /* Secciones Específicas */
                <div className="bg-white min-h-full">
                  <button 
                    onClick={() => setActiveSection(null)}
                    className="w-full flex items-center gap-2 px-4 py-3 bg-[#f6f7f7] border-b border-[#dcdcde] text-[#2271b1] text-xs font-bold"
                  >
                    <ChevronLeft size={16} /> VOLVER AL MENÚ
                  </button>

                  <div className="p-5 space-y-8">
                    {/* SECCIÓN GLOBAL */}
                    {activeSection === 'global' && (
                      <>
                        <div className="space-y-4">
                          <h3 className="text-xs font-black uppercase text-gray-400">Estilo Base</h3>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase text-[#3c434a]">Color de Marca</label>
                            <input 
                              type="color" 
                              value={settings.global.primaryColor}
                              onChange={(e) => updateGlobalSettings({ primaryColor: e.target.value })}
                              className="w-full h-8 rounded border border-[#8c8f94]"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase text-[#3c434a]">Fondo de la App</label>
                            <input 
                              type="color" 
                              value={settings.global.background || '#f1f5f9'}
                              onChange={(e) => updateGlobalSettings({ background: e.target.value })}
                              className="w-full h-8 rounded border border-[#8c8f94]"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* PROPIEDADES DEL ELEMENTO (GRANULAR) */}
                    {activeSection === 'element-props' && selectedElementId && (
                      <div className="space-y-6">
                        <div className="p-3 bg-orange-50 border border-orange-100 rounded-lg">
                           <h4 className="text-[10px] font-bold text-orange-800 uppercase mb-1">ID del Elemento</h4>
                           <code className="text-[10px] bg-white px-2 py-1 rounded block overflow-hidden text-ellipsis">{selectedElementId}</code>
                        </div>

                        {/* COLORES Y TRANSPARENCIA */}
                        <div className="space-y-4">
                          <h3 className="text-xs font-black uppercase text-gray-400 flex items-center gap-2">
                            <Palette size={14} /> Colores y Opacidad
                          </h3>
                          
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[#3c434a]">Color de Fondo</label>
                            <input 
                              type="color" 
                              value={currentElementStyle.backgroundColor || '#ffffff'}
                              onChange={(e) => updateElementStyle(selectedElementId, { backgroundColor: e.target.value })}
                              className="w-full h-8 rounded border border-[#8c8f94]"
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <label className="text-[10px] font-bold text-[#3c434a]">Transparencia</label>
                              <span className="text-[10px] font-mono">{currentElementStyle.opacity || '1'}</span>
                            </div>
                            <input 
                              type="range" min="0" max="1" step="0.1"
                              value={currentElementStyle.opacity || '1'}
                              onChange={(e) => updateElementStyle(selectedElementId, { opacity: e.target.value })}
                              className="w-full accent-orange-500"
                            />
                          </div>
                        </div>

                        {/* TEXTO */}
                        <div className="space-y-4">
                          <h3 className="text-xs font-black uppercase text-gray-400 flex items-center gap-2">
                            <Type size={14} /> Texto Específico
                          </h3>
                          
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[#3c434a]">Color de Letra</label>
                            <input 
                              type="color" 
                              value={currentElementStyle.color || '#000000'}
                              onChange={(e) => updateElementStyle(selectedElementId, { color: e.target.value })}
                              className="w-full h-8 rounded border border-[#8c8f94]"
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <label className="text-[10px] font-bold text-[#3c434a]">Tamaño Letra</label>
                              <span className="text-[10px] font-mono">{currentElementStyle.fontSize || '16px'}</span>
                            </div>
                            <input 
                              type="range" min="8" max="72" step="1"
                              value={parseInt(currentElementStyle.fontSize || '16px')}
                              onChange={(e) => updateElementStyle(selectedElementId, { fontSize: `${e.target.value}px` })}
                              className="w-full accent-orange-500"
                            />
                          </div>
                        </div>

                        {/* TAMAÑO Y ESPACIO */}
                        <div className="space-y-4">
                          <h3 className="text-xs font-black uppercase text-gray-400 flex items-center gap-2">
                            <Maximize size={14} /> Tamaño y Padding
                          </h3>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <label className="text-[10px] font-bold text-[#3c434a]">Espaciado Interno (Padding)</label>
                              <span className="text-[10px] font-mono">{currentElementStyle.padding || '0px'}</span>
                            </div>
                            <input 
                              type="range" min="0" max="100" step="1"
                              value={parseInt(currentElementStyle.padding || '0px')}
                              onChange={(e) => updateElementStyle(selectedElementId, { padding: `${e.target.value}px` })}
                              className="w-full accent-orange-500"
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <label className="text-[10px] font-bold text-[#3c434a]">Ancho (Opcional)</label>
                              <span className="text-[10px] font-mono">{currentElementStyle.width || 'auto'}</span>
                            </div>
                            <input 
                              type="range" min="50" max="1200" step="10"
                              onChange={(e) => updateElementStyle(selectedElementId, { width: `${e.target.value}px` })}
                              className="w-full accent-orange-500"
                            />
                          </div>
                        </div>

                        <button 
                          onClick={() => {
                            const newOverrides = { ...settings.overrides };
                            delete newOverrides[selectedElementId];
                            updateGlobalSettings({}); // Trigger update
                            updateElementStyle(selectedElementId, { color: undefined, backgroundColor: undefined, opacity: undefined }); // Clear
                            setSelectedElementId(null);
                            setActiveSection(null);
                          }}
                          className="w-full py-2 bg-gray-100 text-gray-500 rounded text-[10px] font-bold hover:bg-red-50"
                        >
                          ELIMINAR ESTILOS DE ESTE ELEMENTO
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-[#f0f0f1] border-t border-[#dcdcde] flex items-center justify-between">
               <button 
                 onClick={() => setIsOpen(false)}
                 className="px-6 py-2 bg-[#2271b1] text-white rounded text-sm font-bold shadow-sm hover:bg-[#135e96] transition-all"
               >
                 Publicar
               </button>
               <div className="flex gap-2">
                 <button className="p-2 text-[#646970] hover:text-[#2271b1]"><Monitor size={16} /></button>
                 <button className="p-2 text-[#646970] hover:text-[#2271b1]"><Settings size={16} /></button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

import React, { useState } from 'react';
import { usePaperStash } from '../context/PaperStashContext';
import { ChevronLeft, Plus, Edit2, Trash2, X, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Paper } from '../types';
import { cn } from '../lib/utils';

export function PaperStash() {
  const { papers, addPaper, updatePaper, deletePaper } = usePaperStash();
  const navigate = useNavigate();
  const [editingPaper, setEditingPaper] = useState<Paper | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [form, setForm] = useState({
    color: '',
    size: '',
    quantity: 1,
    type: '',
    notes: '',
  });

  const handleOpenAdd = () => {
    setForm({ color: '', size: '', quantity: 1, type: '', notes: '' });
    setIsAdding(true);
  };

  const handleOpenEdit = (paper: Paper) => {
    setEditingPaper(paper);
    setForm({
      color: paper.color,
      size: paper.size,
      quantity: paper.quantity,
      type: paper.type,
      notes: paper.notes || '',
    });
    setIsAdding(true);
  };

  const handleCloseForm = () => {
    setIsAdding(false);
    setEditingPaper(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPaper) {
      updatePaper(editingPaper.id, form);
    } else {
      addPaper(form);
    }
    handleCloseForm();
  };

  const confirmDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this paper?')) {
      deletePaper(id);
    }
  };

  return (
    <div className="pb-32 px-5 pt-12 space-y-8 max-w-md mx-auto min-h-screen text-ink">
      <header className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-paper flex items-center justify-center text-ink shadow-sm border border-crease-light active:scale-95 transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={handleOpenAdd}
            className="w-10 h-10 rounded-full bg-ink text-paper-light flex items-center justify-center shadow-md active:scale-95 transition-all"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div>
          <h1 className="text-3xl font-heading text-ink">Paper Stash</h1>
          <p className="text-ink-light text-sm mt-2">Manage your origami paper collection.</p>
        </div>
      </header>

      {papers.length === 0 ? (
        <div className="bg-paper rounded-[2rem] border border-crease-light border-dashed p-10 flex flex-col items-center justify-center text-center shadow-sm py-16">
           <div className="w-16 h-16 bg-paper-light border border-crease-light rounded-full flex items-center justify-center mb-6 text-ink-light">
             <FileText className="w-6 h-6" />
           </div>
           <h3 className="font-heading text-xl text-ink font-semibold mb-2">Your stash is empty</h3>
           <p className="text-[13px] font-medium text-ink-light mb-8 leading-relaxed max-w-[220px]">
             Keep track of your origami paper colors, sizes, and types.
           </p>
           <button 
             onClick={handleOpenAdd}
             className="px-8 py-3.5 bg-ink text-paper-light rounded-full text-[11px] font-bold uppercase tracking-widest shadow-md hover:bg-ink-dark active:scale-[0.98] transition-all"
           >
             Add Paper
           </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence>
            {papers.map((paper) => (
              <motion.div
                key={paper.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-paper rounded-[2rem] p-5 shadow-sm border border-crease-light relative overflow-hidden group"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-10">
                    <h3 className="font-heading font-semibold text-lg text-ink break-words leading-tight">{paper.color}</h3>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-paper px-3 py-1 rounded-full border border-crease text-ink-light">
                        {paper.size}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-paper px-3 py-1 rounded-full border border-crease text-ink-light">
                        {paper.type}
                      </span>
                    </div>
                    {paper.notes && (
                      <p className="text-xs text-ink-light mt-4 line-clamp-2 leading-relaxed">
                        {paper.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end shrink-0 pl-4 border-l border-crease-light/50">
                    <span className="font-heading text-2xl font-bold text-ink">{paper.quantity}</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-ink-light">Sheets</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-5 pt-4 border-t border-crease/50">
                  <button 
                    onClick={() => handleOpenEdit(paper)}
                    className="flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-ink bg-paper-light border border-crease-light hover:bg-paper transition-all flex justify-center items-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button 
                    onClick={() => confirmDelete(paper.id)}
                    className="w-10 h-10 shrink-0 rounded-xl text-red-500 bg-red-50 border border-red-100 hover:bg-red-100 transition-all flex justify-center items-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[200] bg-paper-light flex flex-col md:rounded-[2.5rem] md:overflow-hidden overflow-y-auto"
          >
            <div className="sticky top-0 w-full px-6 py-5 flex items-center justify-between bg-paper-light/90 backdrop-blur-md z-10 border-b border-crease-light">
               <h2 className="font-heading text-xl text-ink">{editingPaper ? 'Edit Paper' : 'Add Paper'}</h2>
               <button 
                 onClick={handleCloseForm}
                 className="w-10 h-10 rounded-full bg-paper flex items-center justify-center text-ink shadow-sm border border-crease-light active:scale-95 transition-all"
               >
                 <X className="w-5 h-5" />
               </button>
            </div>
            <div className="px-6 py-8 flex-1 max-w-md mx-auto w-full">
              <form onSubmit={handleSave} className="space-y-6">
                
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-ink-light ml-2">Paper Color</label>
                  <input 
                    required
                    type="text"
                    placeholder="e.g. Cherry Red, Mint Green"
                    value={form.color}
                    onChange={(e) => setForm({...form, color: e.target.value})}
                    className="w-full bg-paper border border-crease rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-ink-light ml-2">Size (cm)</label>
                    <input 
                      required
                      type="text"
                      placeholder="e.g. 15x15"
                      value={form.size}
                      onChange={(e) => setForm({...form, size: e.target.value})}
                      className="w-full bg-paper border border-crease rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-ink-light ml-2">Quantity</label>
                    <input 
                      required
                      type="number"
                      min="0"
                      placeholder="0"
                      value={form.quantity}
                      onChange={(e) => setForm({...form, quantity: Math.max(0, parseInt(e.target.value) || 0)})}
                      className="w-full bg-paper border border-crease rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-ink-light ml-2">Paper Type</label>
                  <input 
                    required
                    type="text"
                    placeholder="e.g. Kami, Foil, Kraft, Washi"
                    value={form.type}
                    onChange={(e) => setForm({...form, type: e.target.value})}
                    className="w-full bg-paper border border-crease rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all shadow-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-ink-light ml-2">Notes (Optional)</label>
                  <textarea 
                    placeholder="Where did you buy it? What patterns is it good for?"
                    value={form.notes}
                    onChange={(e) => setForm({...form, notes: e.target.value})}
                    rows={3}
                    className="w-full bg-paper border border-crease rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all shadow-sm resize-none"
                  />
                </div>

                <div className="pt-8 pb-10">
                  <button 
                    type="submit"
                    className="w-full py-4 bg-ink text-paper-light rounded-full font-bold tracking-widest uppercase text-xs shadow-md hover:bg-ink-dark transition-all active:scale-[0.98]"
                  >
                    {editingPaper ? 'Save Changes' : 'Add to Stash'}
                  </button>
                </div>

              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

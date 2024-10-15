import { create } from 'zustand';

interface ModalStoreState {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const useModalStore = create<ModalStoreState>((set) => ({
  isOpen: false, // Estado inicial del modal, cerrado por defecto
  openModal: () => set({ isOpen: true }), // Función para abrir el modal
  closeModal: () => set({ isOpen: false }), // Función para cerrar el modal
}));

export default useModalStore;

import { ref, type Ref } from 'vue';

export interface UseModalFormOptions {
  visible: Ref<boolean>;
  title?: Ref<string>;
  onSuccess?: () => void | Promise<void>;
  onCancel?: () => void;
}

export interface UseModalFormReturn {
  formVisible: Ref<boolean>;
  modalTitle: Ref<string>;
  isEdit: Ref<boolean>;
  currentId: Ref<number | null>;
  openModal: (id?: number) => void;
  closeModal: () => void;
  handleSubmit: (submitFn: () => Promise<void>) => Promise<void>;
  resetForm: () => void;
}

export function useModalForm(options: UseModalFormOptions): UseModalFormReturn {
  const { visible, title, onSuccess, onCancel } = options;

  const formVisible = visible;
  const isEdit = ref(false);
  const currentId = ref<number | null>(null);
  const modalTitle = title || ref('');

  const openModal = (id?: number) => {
    if (id) {
      isEdit.value = true;
      currentId.value = id;
      modalTitle.value = '编辑';
    } else {
      isEdit.value = false;
      currentId.value = null;
      modalTitle.value = '新建';
    }
    formVisible.value = true;
  };

  const closeModal = () => {
    formVisible.value = false;
    isEdit.value = false;
    currentId.value = null;
    onCancel?.();
  };

  const handleSubmit = async (submitFn: () => Promise<void>) => {
    try {
      await submitFn();
      closeModal();
      await onSuccess?.();
    } catch (error) {
      console.error('Form submission failed:', error);
    }
  };

  const resetForm = () => {
    isEdit.value = false;
    currentId.value = null;
    modalTitle.value = '';
  };

  return {
    formVisible,
    modalTitle,
    isEdit,
    currentId,
    openModal,
    closeModal,
    handleSubmit,
    resetForm,
  };
}

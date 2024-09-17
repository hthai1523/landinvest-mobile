// store/usePostStore.ts
import { create } from 'zustand';

interface FormPost {
    title: string;
    tags: string[];
    content: string;
}

interface PostState {
    value: FormPost;
    images: string[];
    setValue: (newValue: FormPost) => void;
    setImages: (newImages: string[]) => void;
    addImage: (image: string) => void;
    removeImage: (index: number) => void;
    addTag: (tag: string) => void;       // Thêm hàm addTag
    removeTag: (index: number) => void;  // Thêm hàm removeTag
    reset: () => void;
}

export const usePostStore = create<PostState>((set) => ({
    value: { title: '', tags: [], content: '' },
    images: [],
    setValue: (newValue) => set({ value: newValue }),
    setImages: (newImages) => set({ images: newImages }),
    addImage: (image) => set((state) => ({ images: [...state.images, image] })),
    removeImage: (index) =>
        set((state) => ({
            images: state.images.filter((_, i) => i !== index),
        })),
    
    // Thêm tag mới vào mảng tags
    addTag: (tag) =>
        set((state) => ({
            value: {
                ...state.value,
                tags: [...state.value.tags, tag],  // Thêm tag vào mảng
            },
        })),
    
    // Xóa tag khỏi mảng tags theo chỉ số index
    removeTag: (index) =>
        set((state) => ({
            value: {
                ...state.value,
                tags: state.value.tags.filter((_, i) => i !== index),  // Xóa tag tại index
            },
        })),

    // Reset tất cả các giá trị
    reset: () =>
        set({
            value: { title: '', tags: [], content: '' }, 
            images: [],
        }),
}));

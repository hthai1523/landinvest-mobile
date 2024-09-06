import { create } from 'zustand';
import { Filters } from './filterSelectors';


interface Actions {
    setFilters: (category: keyof Filters, id: number) => void
    getFilters: (category: keyof Filters) => number[];
    getAllFilters: () => Filters;
}

const useFilterStore = create<Filters & Actions>((set, get) => ({
    house: [],
    date: [],
    landArea: [],
    priceRange: [],
    setFilters(category, id) {
        set((state) => ({
            ...state,
            [category]: state[category].includes(id) ? [] : [id]
        }))
    },
    getFilters(category) {
        return get()[category] || []; 
    },
    getAllFilters() {
            const { house, date, landArea, priceRange } = get();
            return { house, date, landArea, priceRange };
    }
}))

export default useFilterStore
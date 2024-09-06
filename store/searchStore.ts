import { PlaceResult } from '@/constants/interface';
import { create } from 'zustand';

// Define the State type with correct defaults
type State = Pick<PlaceResult, 'lat' | 'lon' | 'boundingbox'> & {
    coordinates: PlaceResult['geojson']['coordinates'];
    districtId: number | null;
    searchQuery: string;
};

// Define Action type
type Action = {
    doSetSearchResult: (result: State) => void;
    doSearch: (query: string) => void;
    resetSearch: () => void;
    doSetDistrictId: (value: number | null) => void;
};

// Combine State and Action types into the store type
type Store = State & Action;

// Create the Zustand store
const useSearchStore = create<Store>((set) => ({
    lat: 0,
    lon: 0,
    searchQuery: '',
    boundingbox: [0, 0, 0, 0], // Initialize with a default tuple of numbers
    coordinates: [], // Initialize with an empty array of coordinates
    districtId: null,

    doSetSearchResult: ({ lat, lon, boundingbox, coordinates }) => 
        set({ lat, lon, boundingbox, coordinates }),

    doSearch: (query: string) => set({ searchQuery: query }),

    resetSearch: () => set({ searchQuery: '' }),

    doSetDistrictId: (value: number | null) => set({ districtId: value }),
}));

export default useSearchStore;

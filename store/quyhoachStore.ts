import { ListMarker } from '@/constants/interface';
import { create } from 'zustand';

interface State {
    listMarkers: ListMarker[] | null;
    listIdQuyHoach: string[];
    boundingboxQuyHoach: { lat: number; lon: number } | null;
}

type Action = {
    doSetListMarkers: (listMarkers: ListMarker[] | null) => void;
    doSetListIdQuyHoach: (listIdQuyHoach: string[]) => void;
    doSetBoundingboxQuyHoach: (lat: number, lon: number) => void;
};

// Create the Zustand store
const useQuyHoachStore = create<State & Action>((set) => ({
    listMarkers: null,
    listIdQuyHoach: [],
    boundingboxQuyHoach: null,

    doSetListMarkers: (listMarkers: ListMarker[] | null) => set({ listMarkers }),

    doSetListIdQuyHoach: (listIdQuyHoach: string[]) => set({ listIdQuyHoach }),

    doSetBoundingboxQuyHoach: (lat: number, lon: number) =>
        set({ boundingboxQuyHoach: { lat, lon } }),
}));

export default useQuyHoachStore;

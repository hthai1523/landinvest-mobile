import {  ListMarker, PlaceResult } from '@/constants/interface';
import { create } from 'zustand';

interface State {
    listMarkers: ListMarker[] | null
}

type Action = {
    doSetListMarkers: (listMarkers: ListMarker[] | null) => void
};

// Create the Zustand store
const useMarkerStore = create<State & Action>((set) => ({
    listMarkers: null,
    doSetListMarkers: (listMarkers: ListMarker[] | null) => set({ listMarkers }),
}));

export default useMarkerStore;

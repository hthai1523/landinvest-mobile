import { filterByDate } from '@/constants/filter';
import { ListMarker } from '@/constants/interface';

export interface Filters {
    house: number[];
    date: number[];
    landArea: number[];
    priceRange: number[];
}

const getLandAreaRange = (id: number): { min: number; max: number } => {
    switch (id) {
        case 1:
            return { min: 0, max: 200 };
        case 2:
            return { min: 200, max: 500 };
        case 3:
            return { min: 500, max: 1000 };
        case 4:
            return { min: 1000, max: Infinity };
        default:
            return { min: 0, max: Infinity };
    }
};

// Typing for getPriceRange function
const getPriceRange = (id: number): { min: number; max: number } => {
    switch (id) {
        case 1:
            return { min: 0, max: 500_000_000 };
        case 2:
            return { min: 500_000_000, max: 1_000_000_000 };
        case 3:
            return { min: 1_000_000_000, max: 2_000_000_000 };
        case 4:
            return { min: 2_000_000_000, max: 4_000_000_000 };
        case 5:
            return { min: 4_000_000_000, max: 10_000_000_000 };
        case 6:
            return { min: 10_000_000_000, max: Infinity };
        default:
            return { min: 0, max: Infinity };
    }
};

// Typing for getHouseType function
const getHouseType = (id: number): string => {
    switch (id) {
        case 1:
            return 'Nhà bán';
        case 2:
            return 'Đất bán';
        default:
            return 'Nhà bán';
    }
};
const selectFilteredMarkers = ({ listMarker, filters }: { listMarker: ListMarker[] | null; filters: Filters }) => {
    if (!listMarker) return [];

    return listMarker.filter((item) => {
        const houseMatch =
            filters.house.length === 0 ||
            (function () {
                const type = getHouseType(filters.house[0]);
                return item.typeArea === type;
            })();

        const dateMatch =
            filters.date.length === 0 ||
            (function () {
                const dateFilter = filterByDate.find((filter) => filter.id === filters.date[0]);
                if (!dateFilter) return false;

                const dateAdded = new Date(item.addAt);
                const now = new Date();
                const daysSinceAdded = Math.floor((now.getTime() - dateAdded.getTime()) / (1000 * 60 * 60 * 24));

                switch (filters.date[0]) {
                    case 1:
                        return daysSinceAdded <= 90;
                    case 2:
                        return daysSinceAdded > 90 && daysSinceAdded <= 180;
                    case 3:
                        return daysSinceAdded > 180 && daysSinceAdded <= 360;
                    case 4:
                        return daysSinceAdded > 360;
                    default:
                        return false;
                }
            })();

        const landAreaMatch =
            filters.landArea.length === 0 ||
            (function () {
                const rangeId = filters.landArea[0];
                const { min, max } = getLandAreaRange(rangeId);
                return item.area >= min && item.area <= max;
            })();

        const priceRangeMatch =
            filters.priceRange.length === 0 ||
            (function () {
                const rangeId = filters.priceRange[0];
                const { min, max } = getPriceRange(rangeId);
                return item.priceOnM2 >= min && item.priceOnM2 <= max;
            })();

        return houseMatch && dateMatch && landAreaMatch && priceRangeMatch;
    });
};

export default selectFilteredMarkers;

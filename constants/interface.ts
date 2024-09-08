export interface Address {
    city: string;
    ISO3166_2_lvl4: string;
    country: string;
    country_code: string;
}

export interface GeoJSON {
    type: string;
    coordinates: number[];
}

export interface PlaceResult {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    lat: number;
    lon: number;
    class: string;
    type: string;
    place_rank: number;
    importance: number;
    addresstype: string;
    name: string;
    display_name: string;
    address: Address;
    boundingbox: [number, number, number, number];
    geojson: GeoJSON;
}

export interface ImageLink {
    id: number;
    imageUrl: string;
}

export interface ListMarker {
    addAt: string;
    area: number;
    description: string;
    id: number;
    idDistrict: number;
    idUser: number;
    imageLink: ImageLink[];
    latitude: number;
    longitude: number;
    priceOnM2: number;
    typeArea: string;
}

export interface QuyHoachResponse {
    boundingbox: string;
    description: string;
    huyen_image: string;
    id: number;
    idDistrict: number;
    idProvince: number;
}

export interface LocationData {
    administrativeArea: string;
    country: string;
    countryCode: string;
    locality: string;
    name: string;
    postalCode: string | null;
    subAdministrativeArea: string;
    subLocality: string;
    subThoroughfare: string | null;
    thoroughfare: string | null;
}

export interface ResponseDataListMarkers {
    data: ListMarker[];
    status: number;
}

export interface ListTagItem {
    id: string;
    title: string;
    imageUrl: string;
    type: 'tag' | 'admin' | 'post' | 'user';
    details: TagDetails | AdminDetails | PostDetails | UserDetails;
}

interface TagDetails {
    tagPostCount: number;
}

interface AdminDetails {
    adminIsOnline: boolean;
}

interface PostDetails {
    postedBy: string;
}

interface UserDetails {
    userJoinedTime: string;
}

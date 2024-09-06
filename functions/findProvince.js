import axios from 'axios';
import { fetchDistrictsByProvinces, fetchProvinces } from '../services/api';

const fetchProvinceName = async (lat, lon) => {
    try {
        if (lat && lon) {
            const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
                params: {
                    format: 'json',
                    lat,
                    lon,
                    addressdetails: 1,
                },
            });
            const address = response.data.address;
            let provinceName = address.state || address.province || address.city;
            let districtName = address.county || address.district || address.city_district || address.suburb || address.town || address.village;
  
            if (districtName) {
              districtName = districtName.replace(/district/i, '').trim();
            }

            if (provinceName) {
                provinceName = provinceName.replace(/province/i, '').trim();
            }

            return { provinceName, districtName } || 'Unknown';
        }
    } catch (error) {
        console.error('Error fetching province name:', error);
        return 'Unknown';
    }
};

export const getProvince = async (provinceName) => {
    const provincesList = await fetchProvinces();
    const province = provincesList.find(
        (province) => province.TenTinhThanhPho.toLowerCase() === provinceName.toLowerCase(),
    );
    return province || null;
};

export const getDistrict = async (provinceId) => {
    const districtsList = await fetchDistrictsByProvinces(provinceId);
    return districtsList || null;
};

export default fetchProvinceName;

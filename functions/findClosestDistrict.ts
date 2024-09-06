import axios from "axios";

interface District {
  DistrictID: string;
  DistrictName: string;
}

interface FindClosestDistrictResponse {
  found: boolean;
  districtId?: string;
  districtName?: string;
  similarity?: number;
  message?: string;
  error?: string;
}

export const findClosestDistrict = async (provinceId: string, districtName: string): Promise<FindClosestDistrictResponse> => {
  try {
    const response = await axios.get<District[]>(`https://apilandinvest.gachmen.org/api/districts/Byprovince/${provinceId}`);
    const districts = response.data;

    const normalizedSearchName = districtName.toLowerCase().replace(/[^\w\s]/gi, '');

    const calculateSimilarity = (name1: string, name2: string): number => {
      const words1 = name1.split(' ');
      const words2 = name2.split(' ');
      let matchCount = 0;

      words1.forEach(word => {
        if (words2.includes(word)) matchCount++;
      });

      return matchCount / Math.max(words1.length, words2.length);
    };

    let closestDistrict: District | null = null;
    let highestSimilarity = 0;

    districts.forEach(district => {
      const normalizedDistrictName = district.DistrictName.toLowerCase().replace(/[^\w\s]/gi, '');
      const similarity = calculateSimilarity(normalizedSearchName, normalizedDistrictName);

      if (similarity > highestSimilarity) {
        highestSimilarity = similarity;
        closestDistrict = district;
      }
    });

    if (closestDistrict) {
      return {
        found: true,
        districtId: closestDistrict.DistrictID,
        districtName: closestDistrict.DistrictName,
        similarity: highestSimilarity
      };
    } else {
      return {
        found: false,
        message: 'Không tìm thấy quận/huyện phù hợp'
      };
    }

  } catch (error) {
    console.error('Lỗi khi tìm quận/huyện:', error);
    return {
      found: false,
      message: 'Lỗi khi tìm quận/huyện',
      error: (error as Error).message
    };
  }
};

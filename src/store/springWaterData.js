import { XMLParser } from 'fast-xml-parser';

export const fetchSpringWaterData = async () => {
  const serviceKey = '1hn%2BgLY7OOgfyP87C0jNZaIzN31HriUkwkZh7nfUzSLnsHtZlPP4nJwHbq%2FD30TINtoXvx0VNwOC255%2BFQA%2FKA%3D%3D';
  const apiUrl = `http://apis.data.go.kr/1480523/WaterQualityService/getWaterMeasuringList?serviceKey=${serviceKey}&resultType=xml`;

  try {
    const response = await fetch(apiUrl);
    const text = await response.text(); // XML 데이터를 텍스트로 가져옴

    const parser = new XMLParser();
    const jsonData = parser.parse(text); // XML을 JSON으로 파싱

    if (jsonData.response && jsonData.response.body && jsonData.response.body.items && jsonData.response.body.items.item) {
      return jsonData.response.body.items.item.map(item => {
        const lat = parseFloat(item.latDgr) + (parseFloat(item.latMin) / 60) + (parseFloat(item.latSec) / 3600);
        const lon = parseFloat(item.lonDgr) + (parseFloat(item.lonMin) / 60) + (parseFloat(item.lonSec) / 3600);

        return {
          name: item.ptNm, // 약수터 이름
          lat: lat, // 소수점 형식의 위도
          lon: lon, // 소수점 형식의 경도
        };
      });
    } else {
      console.error('API response format error or items is missing:', jsonData);
      return [];
    }
  } catch (error) {
    console.error('Error fetching spring water data:', error);
    return [];
  }
};

/**
 *  @author 김봉준
 *  @date   2023-07-25
 *  proj4의 좌표계를 관리하는 파일
 */

// //좌표계 변환을 위한 epsg:5178 좌표계 정의(UTM-K (Bessel))
// proj4.defs(
//     "EPSG:5178",
//     "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=500000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs"
// );
// //좌표계 변환을 위한 epsg:5179 좌표계 정의(UTM-K (GRS80))
// proj4.defs(
//     "EPSG:5179",
//     "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs "
// );
// //좌표계 변환을 위한 epsg:5180 좌표계 정의(서부원점(GRS80))
// proj4.defs(
//     "EPSG:5180",
//     "+proj=tmerc +lat_0=38 +lon_0=125 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +units=m +no_defs"
// );
// //좌표계 변환을 위한 epsg:5181 좌표계 정의(중부원점(GRS80))
// proj4.defs(
//     "EPSG:5181", 
//     "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +units=m +no_defs"
// );
// //좌표계 변환을 위한 epsg:5182 좌표계 정의(제주원점(GRS80))
// proj4.defs(
//     "EPSG:5182",
//     "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=550000 +ellps=GRS80 +units=m +no_defs"
// );
// //좌표계 변환을 위한 epsg:5183 좌표계 정의(동부원점(GRS80))
// proj4.defs(
//     "EPSG:5183",
//     "+proj=tmerc +lat_0=38 +lon_0=129 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +units=m +no_defs"
// );
// //좌표계 변환을 위한 epsg:5184 좌표계 정의(동해(울릉)원점(GRS80))
// proj4.defs(
//     "EPSG:5184",
//     "+proj=tmerc +lat_0=38 +lon_0=131 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +units=m +no_defs"
// );

// //현재 국토지리정보원 표준
// //좌표계 변환을 위한 epsg:5185 좌표계 정의(서부원점(GRS80))
// proj4.defs(
//     "EPSG:5185",
//     "+proj=tmerc +lat_0=38 +lon_0=125 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs"
// );
// //좌표계 변환을 위한 epsg:5186 좌표계 정의(중부원점(GRS80))
// proj4.defs(
//     "EPSG:5186",
//     "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs"
// );
// //좌표계 변환을 위한 epsg:5187 좌표계 정의(동부원점(GRS80))
// proj4.defs(
//     "EPSG:5187",
//     "+proj=tmerc +lat_0=38 +lon_0=129 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs"
// );
// //좌표계 변환을 위한 epsg:5188 좌표계 정의(동해(울릉)원점(GRS80))
// proj4.defs(
//     "EPSG:5188",
//     "+proj=tmerc +lat_0=38 +lon_0=131 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs"
// );

// //openlayer에 좌표계 정의 내용을 적용
// ol.proj.proj4.register(proj4);

const projDefinitions = {
    //좌표계 변환을 위한 epsg:5178 좌표계 정의(UTM-K (Bessel))
    "EPSG:5178": {
      projString: "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=500000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs",
      description: "UTM-K (Bessel)"
    },
    //좌표계 변환을 위한 epsg:5179 좌표계 정의(UTM-K (GRS80))
    "EPSG:5179": {
      projString: "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
      description: "UTM-K (GRS80)"
    },
    //좌표계 변환을 위한 epsg:5180 좌표계 정의(서부원점(GRS80))
    "EPSG:5180": {
      projString: "+proj=tmerc +lat_0=38 +lon_0=125 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +units=m +no_defs",
      description: "서부원점(GRS80)"
    },
    //좌표계 변환을 위한 epsg:5181 좌표계 정의(중부원점(GRS80))
    "EPSG:5181": {
      projString: "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +units=m +no_defs",
      description: "중부원점(GRS80)"
    },
    //좌표계 변환을 위한 epsg:5182 좌표계 정의(제주원점(GRS80))
    "EPSG:5182": {
      projString: "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=550000 +ellps=GRS80 +units=m +no_defs",
      description: "제주원점(GRS80)"
    },
    //좌표계 변환을 위한 epsg:5183 좌표계 정의(동부원점(GRS80))
    "EPSG:5183": {
      projString: "+proj=tmerc +lat_0=38 +lon_0=129 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +units=m +no_defs",
      description: "동부원점(GRS80)"
    },
    //좌표계 변환을 위한 epsg:5184 좌표계 정의(동해(울릉)원점(GRS80))
    "EPSG:5184": {
      projString: "+proj=tmerc +lat_0=38 +lon_0=131 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +units=m +no_defs",
      description: "동해(울릉)원점(GRS80)"
    },
    //현재 국토지리정보원 표준
    //좌표계 변환을 위한 epsg:5185 좌표계 정의(서부원점(GRS80))
    "EPSG:5185": {
      projString: "+proj=tmerc +lat_0=38 +lon_0=125 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs",
      description: "서부원점(GRS80)"
    },
    //좌표계 변환을 위한 epsg:5186 좌표계 정의(중부원점(GRS80))
    "EPSG:5186": {
      projString: "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs",
      description: "중부원점(GRS80)"
    },
    //좌표계 변환을 위한 epsg:5187 좌표계 정의(동부원점(GRS80))
    "EPSG:5187": {
      projString: "+proj=tmerc +lat_0=38 +lon_0=129 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs",
      description: "동부원점(GRS80)"
    },
    //좌표계 변환을 위한 epsg:5188 좌표계 정의(동해(울릉)원점(GRS80))
    "EPSG:5188": {
      projString: "+proj=tmerc +lat_0=38 +lon_0=131 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs",
      description: "동해(울릉)원점(GRS80)"
    },
};

//특정 객체의 값을 이용해 좌표계를 openlayers에 정의하는 함수
function registerProj4CoordinateSystem(){
    new Promise((resolve, reject) => {
        // 각 EPSG 코드에 대한 좌표계 정의를 proj4에 등록
        Object.keys(projDefinitions).forEach((epsgCode) => {
            proj4.defs(epsgCode, projDefinitions[epsgCode].projString);
            addCoordinateSystemSelectOption(epsgCode, projDefinitions[epsgCode].description)
        });
        
        // 모든 좌표계가 정의되고 나면 resolve 호출
        resolve();
    }).then(() => {
        // OpenLayers에 proj4 등록
        ol.proj.proj4.register(proj4);
    }).catch((error) => {
        console.error("An error occurred: ", error);
    });
}
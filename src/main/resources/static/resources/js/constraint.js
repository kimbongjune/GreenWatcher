/**
 *  @author 김봉준
 *  @date   2023-07-25
 *  지도 서비스의 전역 변수를 관리하는 파일
 */

//지도의 최대 줌 레벨
const MAX_ZOOM_LEVEL = 20;
//지도의 최소 줌 레벨
const MIN_ZOOM_LEVEL = 6;
//지도의 최초 줌 레벨
const DEFAULT_ZOOM_LEVEL = 15;

//vworld 건물 레이어 WMS API 요청 아이디
const BUILDING_LAYER_ID = "lt_c_spbd";
//vworld 시도 경계 레이어 WMS API 요청 아이디
const SIDO_LAYER_ID = "lt_c_adsido";
//vworld 시/군/구 경계 레이어 WMS API 요청 아이디
const SIGUNGU_LAYER_ID = "lt_c_adsigg";
//vworld 읍/면/동 경계 레이어 WMS API 요청 아이디
const MYEONDONG_LAYER_ID = "lt_c_ademd";
//vworld 리 경계 레이어 WMS API 요청 아이디
const RI_LAYER_ID = "lt_c_adri";
//vworld 도로 레이어 WMS API 요청 아이디
const ROAD_LAYER_ID = "lt_l_moctlink";
//vworld 연속지적도 WMS API 요청 아이디
const CADASTRAL_MAP_LAYER_ID = "lp_pa_cbnd_bubun";
//vworld 산불위험 예측지도 WMS API 요청 아이디
const MOUNTAIN_FIRE_MAP_LAYER_ID = "lt_c_kfdrssigugrade";
//vworld 소방서관할구역 WMS API 요청 아이디
const FIRESTATION_JURISDICTION = "lt_c_usfsffb";
//vworld 재해위험지구 WMS API 요청 아이디
const DISASTER_DANGER_LAYER_ID = "lt_c_up201";

//vworld API 키를 저장하기 위한 변수.
let VWORLD_API_KEY;

//vworld API 키는 현재 url에 따라 달라지기에 내부망 접속 설정을 위해 두개 발급받고, 상황에 따라 API키를 다르게 사용함
if (window.location.href.includes("192")) {
    VWORLD_API_KEY = "055CF644-B04A-3772-BF8A-B31B9CDD6364";
} else {
    VWORLD_API_KEY = "8B59640B-09A5-3D52-A8C0-905278114E27";
}

//kakao API키를 저장하기 위한 변수
const KAKAO_REST_API_KEY = "a75f661f8fd50587142251f0476ef2da";

//한국 전역을 포함하는 Extent 객체
const KOREA_EXTENT = ol.proj.transformExtent([123.75, 33.55, 131.88, 39.44],"EPSG:4326","EPSG:3857");

//지도의 중앙 좌표를 입력하기 위한 div 엘리먼트
const info = document.getElementById("coordinate");
//지도의 중앙 주소를 입력하기 위한 div 엘리먼트
const addressInfo = document.getElementById("address");
//지도의 스와이프 레이어를 컨트롤 하기위한 range 엘리먼트
const swipe = document.getElementById("swipe");
//지도의 스와이프 레이어와 연동되어 세로 선을 긋기 위한 div 엘리먼트
const line = document.getElementById("line");
//지도의 줌 레벨을 입력하기 위한 div 엘리먼트
const zoomInfo = document.getElementById("zoom-info");

//지도의 클릭 레이어를 담을 변수
let clickCurrentLayer;
//지도의 팝업 오버레이를 담을 변수
let clickCurrentOverlay;

//건물 레이어를 담을 변수
let buildingLayer;
//시도 경계 레이어를 담을 변수
let sidoLayer;
//시/군/구 경계 레이어를 담을 변수
let sigunguLayer;
//읍/면/동 경계 레이어를 담을 변수
let myeondongLayer;
//리 경계 레이어를 담을 변수
let riLayer;
//도로 레이어를 담을 변수
let roadLayer;
//연속 지적도 레이어를 담을 변수
let cadastralMapLayer;
//산불위험 예측지도 레이어를 담을 변수
let mountaionFireMapLayer;
//소방서 관할구역 레이어를 담을 변수
let firestationJurisdictionLayer;
//재해 위험지구 레이어를 담을 변수
let disasterDangerLayer;
//재해 위험지구 레이어를 담을 변수
let graticuleLayer;
//geoJson 형태의 API를 파싱하여 담을 변수
let geojsonFormat = new ol.format.GeoJSON();
//레이더 레이어를 담을 변수
let webGlVectorLayer;
//CCTV 레이어를 담을 변수
let clusterLayer;

//SGIS의 API를 호출하기 위한 API Accesss 키를 저장하기 위한 변수
let SgisApiAccessKey;

//swipe 레이어를 저장하기 위한 변수
let swipeLayer;

//길이측정 overlay의 html 엘리먼트
let measureTooltipElement;
//길이측정 overlay
let measureTooltip;

//면적측정 overlay의 html 엘리먼트
let areaTooltipElement;
//면적측정 overlay
let areaTooltip;

//경로탐색 overlay의 html 엘리먼트
let routeTooltipElement;
//경로탐색 overlay
let routeTooltip;

//반경측정 overlay의 html 엘리먼트
let circleTooltipElement;
//반경측정 overlay
let circleTooltip;

//Extent 인터렉션 영역의 html 엘리먼트
let extentInteractionTooltipElement;
//Extent 인터렉션 overlay
let extentInteractionTooltip;

// 현재 그려지고 있는 feature
let sketch;

//직선을 그리는 draw객체
let measurePolygon;
//면적을 그리는 draw객체
let areaPolygon;
//원을 그리는 draw객체
let circlePolygon;

//베이스 지도와 서브 지도에 각각 사용할 로컬스토리지 고유 아이디
const MAIN_MAP_LOCALSTORAGE_ID = 1
const SUB_MAP_LOCALSTORAGE_ID = 2


//주소를 키밸류로 찾기 위한 전역변수
const addressMapping = {
    "dong": {
        param: "LT_C_ADEMD_INFO",
        attrFilter: "emd_kor_nm"
    },
    "sigugun": {
        param: "LT_C_ADSIGG_INFO",
        attrFilter: "sig_kor_nm"
    },
    "sido": {
        param: "LT_C_ADSIDO_INFO",
        attrFilter: "ctp_kor_nm"
    }
}

//경로탐색 토글 버튼의 아이콘 클래스 이름과 버튼의 title을 담은 객체. 경로탐색 셀렉트의 밸류에 따라 객체로 반환된다.
const routesKindObject = {
    1: { className: "fa fa-car", title: "자동차 경로" },
    2: { className: "fa fa-male", title: "도보 경로" },
    3: { className: "fa fa-bicycle", title: "자전거 경로" },
};
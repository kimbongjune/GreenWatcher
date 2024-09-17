/**
 *  @author 김봉준
 *  @date   2023-07-29
 *  네트워크 요청 함수를 관리하는 파일
 */

//SGIS의 API Accesss키를 받아오기 위한 API 요청 함수 ref : https://sgis.kostat.go.kr/developer/html/newOpenApi/api/dataApi/basics.html
async function requestSgisApiAccessKey(){
    try {
        const response = await axios.get("https://sgisapi.kostat.go.kr/OpenAPI3/auth/authentication.json", {
            params: {
                consumer_key: "8eafb7c1729e4ef3a607",
                consumer_secret: "e3e846d81e634f189586",
            },
        });
        console.log(response.data);
        return response.data.result.accessToken;
    } catch(error) {
        console.error("Error:", error);
    }
}

//vworld API를 이용해 장소를 검색하는 함수
function searchPlace(query, page = 1) {
    return $.ajax({
        url: "http://api.vworld.kr/req/search",
        dataType: "jsonp",
        data: {
            service: "search",
            request: "search",
            version: 2.0,
            crs: "EPSG:3857",
            size: 10,
            page: page,
            query: query,
            type: "place",
            format: "json",
            errorformat: "json",
            key: `${VWORLD_API_KEY}`,
        },
    });
}

//vworld API를 이용해 주소를 검색하는 함수
function searchAddress(query, page = 1) {
    return $.ajax({
        url: "http://api.vworld.kr/req/search",
        dataType: "jsonp",
        data: {
            service: "search",
            request: "search",
            version: 2.0,
            crs: "EPSG:3857",
            size: 10,
            page: page,
            query: query,
            type: "address",
            category: "road",
            format: "json",
            errorformat: "json",
            key: `${VWORLD_API_KEY}`,
        },
    });
}

//vworld API를 이용해 행정구역을 검색하는 함수
function searchDistrict(query, page = 1) {
    return $.ajax({
        url: "http://api.vworld.kr/req/search",
        dataType: "jsonp",
        data: {
            service: "search",
            request: "search",
            version: 2.0,
            crs: "EPSG:3857",
            size: 10,
            page: page,
            query: query,
            type: "district",
            category: "L4",
            format: "json",
            errorformat: "json",
            key: `${VWORLD_API_KEY}`,
        },
    });
}

//vworld API를 이용해 도로명을 검색하는 함수
function searchRoad(query, page = 1) {
    return $.ajax({
        url: "http://api.vworld.kr/req/search",
        dataType: "jsonp",
        data: {
            service: "search",
            request: "search",
            version: 2.0,
            crs: "EPSG:3857",
            size: 10,
            page: page,
            query: query,
            type: "road",
            format: "json",
            errorformat: "json",
            key: `${VWORLD_API_KEY}`,
        },
    });
}

//vworld data api 호출 공통 함수
function requestDataLayer(data, coordinate){
    let url = "https://api.vworld.kr/req/data?";
    url += "service=data";
    url += "&request=GetFeature";
    url += `&data=${data}`;
    url += `&key=${VWORLD_API_KEY}`; // Replace with your actual API key
    url += "&format=json";
    url += "&crs=EPSG:3857";
    url += `&geomFilter=POINT(${coordinate[0]} ${coordinate[1]})`;
    url += "&domain=http://127.0.0.1:3000/openlayers_test.html";

    $.ajax({
        url: url,
        type: "GET",
        dataType: "jsonp",
        async: false,
        jsonpCallback: "callback",
        success: function (data) {
            console.log(data);
            if (data.response.status != "OK") {
                return;
            }
            const geoInfoObject = data.response.result.featureCollection.features[0];
            const geojsonObject = geoInfoObject.geometry;

            const vectorSource = new ol.source.Vector({
                features: new ol.format.GeoJSON().readFeatures(geojsonObject),
            });
            vectorSource.set("ctp_kor_nm",data.response.result.featureCollection.features[0].properties.ctp_kor_nm);
            vectorSource.set("ctp_eng_nm",data.response.result.featureCollection.features[0].properties.ctp_eng_nm);

            const vectorStyle = new ol.style.Style({
                fill: new ol.style.Fill({
                    color: "rgba(135,206,250, 0.5)", // Skyblue color fill with opacity
                }),
                stroke: new ol.style.Stroke({
                    color: "orange", // Orange stroke color
                    width: 2,
                }),
            });

            const vector_layer = new ol.layer.Vector({
                source: vectorSource,
                style: vectorStyle,
            });
            vector_layer.set("ctp_kor_nm_layer",data.response.result.featureCollection.features[0].properties.ctp_kor_nm + "_layer");

            map.addLayer(vector_layer);
            clickCurrentLayer = vector_layer;

            const selectedValue = $(".coordinate-system-selector").val();
            const coord = ol.proj.transform(coordinate,"EPSG:3857",selectedValue);

            let overlayElement = document.createElement("div");
            overlayElement.className = "ol-popup";
            overlayElement.innerHTML += `<a href="#" id="popup-closer" class="ol-popup-closer"></a>`;
            overlayElement.innerHTML += `<div id="popup-content">
                                            <div class="ol-popup-title">연속 지적도 정보</div>
                                                <code class="code">
                                                    <div class="popup-coordinate">${coord}</div><span>주소</span><br>
                                                    <div class="leftBottom__etcBtn">
                                                        <ul>
                                                            <li class="select customSelect">
                                                                <p onclick="searchLocalAddress(this)">${
                                                                    geoInfoObject
                                                                        .properties
                                                                        .addr
                                                                }</p>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </code>
                                                <br>
                                                <div style="float: left;">공시지가 : ${
                                                    geoInfoObject.properties.jiga != ""
                                                        ? geoInfoObject.properties.jiga.replace(
                                                              /\B(?=(\d{3})+(?!\d))/g,
                                                              ","
                                                          )
                                                        : "--"
                                                }&#8361;, 지목 : ${geoInfoObject.properties.jibun.slice(-1)}</div>
                                            </div>`;
            const overlay = new ol.Overlay({
                element: overlayElement,
                position: coordinate,
            });
            // Add the overlay to the map
            map.addOverlay(overlay);
            clickCurrentOverlay = overlay;

            const deleteButton = overlayElement.querySelector(".ol-popup-closer");
            deleteButton.addEventListener("click", function () {
                map.removeLayer(vector_layer);
                map.removeOverlay(clickCurrentOverlay);
            });
        },
        beforesend: function () {},
        error: function (xhr, stat, err) {
            console.log(xhr, stat, err)
        },
    });
}
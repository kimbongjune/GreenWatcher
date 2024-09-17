/**
 *  @author 김봉준
 *  @date   2023-07-25
 *  지도 서비스의 지도 객체를 관리하는 파일
 */

//openlayers 지도의 view 객체
const mapView = new ol.View({
    center: [14128579.82, 4512570.74],
    maxZoom: MAX_ZOOM_LEVEL,
    zoom: DEFAULT_ZOOM_LEVEL,
    minZoom: MIN_ZOOM_LEVEL,
    constrainResolution: true,
    rotation: 0,
    // center: [-8910887.277395891, 5382318.072437216],
    // maxZoom: 19,
    // zoom: 15
});

//openlayers 지도 객체
const map = new ol.Map({
    target: document.getElementById("map"),
    pixelRatio: 1,
    view: mapView,
    interactions: ol.interaction.defaults.defaults({
        shiftDragZoom: false,
    }),
});

//OSM 지도 객체 유저 레이어를 컨트롤 할 때 사용한다.
const subMap = new ol.Map({
    target: document.getElementById("sub-map"),
    pixelRatio: 1,
    view : new ol.View({
        center : map.getView().getCenter(),
        maxZoom: MAX_ZOOM_LEVEL,
        minZoom: MIN_ZOOM_LEVEL,
        zoom : map.getView().getZoom(),
        constrainResolution: true,
        rotation : map.getView().getRotation()
    }),
    interactions: ol.interaction.defaults.defaults({
        shiftDragZoom: false,
    }),
    layers : [new ol.layer.Tile({source: new ol.source.OSM()})]
});

//지도 객체의 로딩이 시작되면 동작하는 이벤트 리스너
function mapLoadStartEventListener(){
    map.getTargetElement().classList.add("spinner");
}

//지도 객체의 로딩이 완료되면 동작하는 이벤트 리스너
function mapLoadEndEventListener(){
    const center = mapView.getCenter();
    const selectedValue = $(".coordinate-system-selector").val();
    const coordinate = formatCoordinate(center, "EPSG:3857", selectedValue);
    info.innerHTML = coordinate
    $("#first-coordinate").val(coordinate.split(",")[0])
    $("#second-coordinate").val(coordinate.split(",")[1])
    const zoomLevel = map.getView().getZoom();
    zoomInfo.innerHTML = `level: ${zoomLevel}`;
    map.getTargetElement().classList.remove("spinner");
}

//지도의 이동이 종료되었을 때 동작하는 이벤트 리스너. 지도 중앙좌표와 줌 레벨을 표시한다.
async function mapMoveEndEventListener(){
    const view = map.getView();
    const center = view.getCenter();
    const coordinate = ol.proj.transform(center, "EPSG:3857", "EPSG:4326");
    //await reverseGeoCodingToRegion(coordinate[0], coordinate[1]);
    const zoom = map.getView().getZoom();
    zoomInfo.innerHTML = `level: ${zoom}`;
    $(document).trigger("kakaoregionapi", [coordinate[0], coordinate[1]]);
}

//현재 위치(geoLocation)를 얻어와 해당 좌표에 마커를 찍는 함수
function locationMarker(coordinate) {
    removeKakaoReverseGeocodingApiEventListener()
    const source = objectControllVectorLayer.getSource();
    const features = source.getFeatures();
    for (let i = 0; i < features.length; i++) {
        let feature = features[i];
        if (
            ol.coordinate.equals(
                feature.getGeometry().getCoordinates(),
                coordinate
            )
        ) {
            // If a marker already exists at the coordinate, remove it
            if (feature.get("attribute") == "position") {
                source.removeFeature(feature);
            }
        }
    }
    const template = "현재 위치";
    const iconStyle = new ol.style.Style({
        image: new ol.style.Icon({
            scale: 0.6,
            src: pinIcon,
            opacity: 1,
        }),
        text: new ol.style.Text({
            offsetY: 25,
            text: template,
            font: "15px Open Sans,sans-serif",
            fill: new ol.style.Fill({ color: "#111" }),
            stroke: new ol.style.Stroke({ color: "#eee", width: 2 }),
        }),
    });
    const feature = new ol.Feature({
        type: "removable",
        geometry: new ol.geom.Point(coordinate),
        attribute: "position",
    });

    feature.setStyle(iconStyle);
    objectControllVectorLayer.getSource().addFeature(feature);
}

//지도 클릭시 동작하는 이벤트 리스너. 클릭 좌표에 해당하는 feature를 vworld API를 이용해 받아온다.
function mapClickEventListener(evt){
    let cctvFound = false;
    const originalEvent = evt.originalEvent;
    if (measurePolygon || areaPolygon || circlePolygon) {
        return;
    }
    if (originalEvent.shiftKey || originalEvent.ctrlKey || originalEvent.altKey) {
        evt.preventDefault();
        return;
    }
    if (printControl.isOpen()) {
        return;
    }
    if (clickCurrentLayer) {
        map.removeLayer(clickCurrentLayer);
    }

    if (clickCurrentOverlay) {
        map.removeOverlay(clickCurrentOverlay);
    }

    if (!ol.events.condition.shiftKeyOnly(evt)) {
        extentInteraction.setExtent(undefined);
        map.removeOverlay(extentInteractionTooltip);
    }

    map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
        if (feature.get("features")) {
            // It's a cluster, so check the original features within.
            const originalFeatures = feature.get("features");
            for (let i = 0; i < originalFeatures.length; i++) {
                if (originalFeatures[i].get("cctvFeature")) {
                    cctvFound == false
                        ? (cctvFound = true)
                        : (cctvFound = true);
                    //console.log(originalFeatures[i]);
                }
            }
        }
    });

    if (cctvFound) {
        evt.stopPropagation();
        return;
    }

    requestDataLayer("LP_PA_CBND_BUBUN", evt.coordinate)
}

//지도 위에 마커를 찍는 함수. 커스텀 속성을 이용해 마커 객체를 컨트롤 한다.
function addMarker(coordinate, template = "", attribute = "", searchType = "") {
    const templates = template != "" ? template : "현재 위치";
    const iconStyle = new ol.style.Style({
        image: new ol.style.Icon({
            scale: 0.6,
            src: pinIcon,
            opacity: 1,
        }),
        text: new ol.style.Text({
            offsetY: 25,
            text: templates,
            font: "15px Open Sans,sans-serif",
            fill: new ol.style.Fill({ color: "#111" }),
            stroke: new ol.style.Stroke({ color: "#eee", width: 2 }),
        }),
    });
    const feature = new ol.Feature({
        type: searchType != "" ? searchType : "removable",
        geometry: new ol.geom.Point(coordinate),
        attribute: attribute != "" ? attribute : "position",
    });

    feature.setStyle(iconStyle);
    objectControllVectorLayer.getSource().addFeature(feature);
}

//지도 위치가 이동할 때 동작하는 이벤트 리스너. 길이와 면적 측정시 마우스 커서를 변경하고, 지도 위에 특정 레이어가 존재한다면 커서를 변경한다.
function mapPointMoveEventListener(e){
    if (e.dragging) return;

    const pixel = map.getEventPixel(e.originalEvent);
    const hit = map.hasFeatureAtPixel(pixel);

    if (
        $(areaCheckbox).is(":checked") ||
        $(measureCheckbox).is(":checked") ||
        $(areaCircleCheckbox).is(":checked")
    ) {
        map.getTargetElement().style.cursor = changeMouseCursor();
    } else {
        map.getTargetElement().style.cursor = hit ? "pointer" : "";
    }
}

//지도 위에서 마우스 드래그가 발생할 때 동작하는 이벤트 리스너. 지도 중앙 좌표를 html 엘리먼트에 갱신한다.
function mapPointDragEventListener(e){
    const center = mapView.getCenter();
    const selectedValue = $(".coordinate-system-selector").val();
    const coordinate = formatCoordinate(center, "EPSG:3857", selectedValue);
    info.innerHTML = coordinate
    $("#first-coordinate").val(coordinate.split(",")[0])
    $("#second-coordinate").val(coordinate.split(",")[1])
}


//측정레이어 삭제 버튼을 클릭했을 때 동작하는 이벤트 리스너. 지도 위의 면적 및 길이측적 벡터 레이어와 툴팁 오버레이를 전부 삭제한다.
function removeMeasureEventListener(){
    //지도 위의 모든 오버레이 제거
    map.getOverlays().getArray().slice(0).forEach(function (overlay) {
        map.removeOverlay(overlay);
    });
    //레이어 중 경로탐색 레이어 삭제
    map.getLayers().getArray().slice().forEach(function (layer) {
        if (layer.get("type") === "routeLayer") {
            map.removeLayer(layer);
        }
    });
    //마커중 중 경로탐색 마커 삭제
    objectControllVectorLayer.getSource().getFeatures().forEach(function (feature) {
        if (feature.get("attribute") == "start" || feature.get("attribute") == "end") {
            objectControllVectorLayer.getSource().removeFeature(feature);
        }
    });
    //경로탐색 결과 초기화
    const instructionsElement = document.getElementById("sidenav");
    instructionsElement.innerHTML = "";
    //extentInteraction 객체 삭제
    if (extentInteraction) {
        extentInteraction.setExtent(undefined);
    }
    //그리기 객체 전부 삭제
    lineSource.clear();
    polygonSource.clear();
    cricleSource.clear();
}

//내위치 버튼을 클릭했을 때 동작하는 이벤트 리스너. 현재 내 위치에 마커를 찍고 지도 센터를 옮긴다.
function currentPositionEventListener(){
    if ("geolocation" in navigator) {
        /* geolocation is available */
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            const coordinate = ol.proj.transform(
                [longitude, latitude],
                "EPSG:4326",
                "EPSG:3857"
            );
            //console.log(coordinate)
            map.getView().setCenter(coordinate);
            if (map.getView().getZoom() < 14) {
                map.getView().setZoom(14);
            }
            locationMarker(coordinate);
        });
    } else {
        /* geolocation IS NOT available */
    }
}

//배경지도 변경 드롭다운 메뉴의 아이템을 클릭했을 때 동작하는 이벤트 리스너. 기존 이벤트(아이템 클릭시 드롭다운 닫힘)를 취소시키고 해당하는 아이템으로 메인 지도의 레이어를 세팅한다.
function basemapDropdownSelectEventListener(e){
    e.preventDefault(); // This will prevent the default action of the a tag
    const clickedId = this.id;
    // Add active class to clicked a tag and remove from others
    $("ul.dropdown-menu a.dropdown-item").removeClass("active");
    $(this).addClass("active");

    map.getLayers()
        .getArray()
        .slice()
        .forEach(function (layer) {
            if (layer.get("type") === "map") {
                map.removeLayer(layer);
            } else if (layer.get("type") === "submap") {
                layer.setZIndex(1);
            } else {
                layer.setZIndex(2);
            }
        });

    switch (clickedId) {
        case "baseMap":
            map.addLayer(baseLayer);
            break;
        case "compositeMap":
            map.addLayer(satelliteLayer);
            map.addLayer(textLayer);
            break;
        case "aerialMap":
            map.addLayer(satelliteLayer);
            break;
        case "bwMap":
            map.addLayer(greyLayer);
            break;
        case "nightMap":
            map.addLayer(midnightLayer);
            break;
        default:
        //console.log("Invalid map type");
    }
    map.renderSync();
}

//툴팁 overlay 클릭시 동작하는 이벤트 리스너. 클릭시 해당 툴팁이 툴팁 오버레이중 최 상단으로 올라온다.
function tooltipOverlayClickEventListener(event){
    event.stopPropagation(); // 자식 엘리먼트의 클릭 이벤트 전파(stopPropagation)

    const overlays = map.getOverlays().getArray();
    let highestZIndex = 0;

    overlays.forEach((overlay) => {
        let overlayElement = overlay.getElement();

        if (overlayElement) {
            let overlayZIndex = Number(window.getComputedStyle(overlayElement).zIndex);
            if (!isNaN(overlayZIndex) && overlayZIndex > highestZIndex) {
                highestZIndex = overlayZIndex;
            }
        }
    });

    // 선택된 오버레이의 ZIndex를 가장 높게 설정합니다.
    const selectedOverlayElement = $(this).parent()[0];
    $(selectedOverlayElement.parentElement).css("z-index", highestZIndex + 1);
    selectedOverlayElement.style.zIndex = highestZIndex + 1;
}
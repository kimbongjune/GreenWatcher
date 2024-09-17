/**
 *  @author 김봉준
 *  @date   2023-08-02
 *  지도 서비스의 경로탐색을 관리하는 파일
 */

//OSRM을 이용한 경로탐색 요청 및 지도위에 표출하는 함수
function searchRouteSummury(startFeature, endFeature, routeFlag) {
    //let osrmUrl = `https://router.project-osrm.org/route/v1/driving/`;
    const osrmCarUrl = `http://192.168.10.99:6001/route/v1/driving/`;
    const osrmFootUrl = `http://192.168.10.99:6002/route/v1/driving/`;
    const osrBikemUrl = `http://192.168.10.99:6003/route/v1/driving/`;
    const startCoordinate = ol.proj.transform(startFeature.getGeometry().getCoordinates(), "EPSG:3857", "EPSG:4326");
    const endCoordinate = ol.proj.transform(endFeature.getGeometry().getCoordinates(), "EPSG:3857", "EPSG:4326");

    const urlSuffix = `${startCoordinate};${endCoordinate}?overview=full&geometries=geojson&steps=true`;

    let requestUrl = "";
    let routeKind = "";
    if (routeFlag == 1) {
        requestUrl = osrmCarUrl.concat(urlSuffix);
        routeKind = "차량";
    } else if (routeFlag == 2) {
        requestUrl = osrmFootUrl.concat(urlSuffix);
        routeKind = "도보";
    } else {
        requestUrl = osrBikemUrl.concat(urlSuffix);
        routeKind = "자전거";
    }

    axios.get(requestUrl)
        .then(function (response) {
            const data = response.data
            //console.log(data)
            const instructions = data.routes[0].legs[0].steps.map((step) =>
                        `<a data-coordinate="${ol.proj.transform(
                            step.maneuver.location,
                            "EPSG:4326",
                            "EPSG:3857"
                        )}" href="#">${
                            step.maneuver.type == "depart"
                                ? "시작점"
                                : step.maneuver.type == "arrive"
                                ? "도착점"
                                : ""
                        }${step.maneuver.modifier} ${step.name} ${
                            step.distance
                        }m</a>`
                ) // instruction 추출
                .join("<br>");
            const instructionsElement = document.getElementById("sidenav");
            instructionsElement.innerHTML = "";
            instructionsElement.innerHTML = `<h4>${startFeature.get("address")} -> <br> ${endFeature.get("address")}</h4>`;
            instructionsElement.innerHTML += `<h5>${convertMetersToKilometersAndMeters(data.routes[0].distance)}, ${convertSecondsToHoursAndMinutes( data.routes[0].duration)}</h5>`;
            instructionsElement.innerHTML += instructions;
            const coordinates = data.routes[0].geometry.coordinates.map((c) =>ol.proj.transform(c, "EPSG:4326", "EPSG:3857"));

            let toolTipElement = createDrawTooltip(-15, 0, "top-left");
            routeTooltipElement = toolTipElement.element;
            routeTooltip = toolTipElement.tooltip;
            routeTooltip.set("type", "route");

            routeTooltipElement.innerHTML = `<div class="tooltip-content">
                                                <div class="tooltip-case">${routeKind} : 
                                                    <span class="tooltip-info-text-line">${convertMetersToKilometersAndMeters(data.routes[0].distance)}</span>
                                                </div>
                                                <div class="tooltip-case">예상 소요시간 : 
                                                    <span class="tooltip-info-text-line">${convertSecondsToHoursAndMinutes( data.routes[0].duration)}</span>
                                                </div>
                                                <button id="show-route-btn" class="delete-btn">지우기</button>
                                            </div>
                                        </div>`;
            routeTooltip.setPosition(endFeature.getGeometry().getCoordinates());
            routeTooltipElement.parentElement.style.pointerEvents = "none";
            const deleteButton = routeTooltipElement.querySelector(".delete-btn");

            const lineStyle = [
                new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: "#E9E9E8", // 외곽선 색상 (회색)
                        width: 6, // 외곽선 두께
                    }),
                }),
                new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: "#969A96", // 내부선 색상 (검은색)
                        width: 4, // 내부선 두께
                        lineDash: [6, 10], // 검은색 점선
                    }),
                }),
            ];

            // OSRM에서 반환한 실제 시작지점
            const osrmStart = ol.proj.transform(
                data.routes[0].legs[0].steps[0].geometry.coordinates[0],
                "EPSG:4326",
                "EPSG:3857"
            );
            // OSRM에서 반환한 실제 종료지점
            const osrmEnd = ol.proj.transform(
                data.routes[0].legs[0].steps[
                    data.routes[0].legs[0].steps.length - 1
                ].geometry.coordinates[0],
                "EPSG:4326",
                "EPSG:3857"
            );

            // 사용자가 선택한 시작지점과 OSRM이 계산한 시작지점 사이에 선을 그림
            const startLineString = new ol.geom.LineString([
                osrmStart,
                startFeature.getGeometry().getCoordinates(),
            ]);
            const startLineFeature = new ol.Feature({
                geometry: startLineString,
                name: "Start Line",
            });
            startLineFeature.setStyle(lineStyle);

            //console.log(osrmStart, startFeature.getGeometry().getCoordinates())

            // 사용자가 선택한 종료지점과 OSRM이 계산한 종료지점 사이에 선을 그림
            const endLineString = new ol.geom.LineString([
                osrmEnd,
                endFeature.getGeometry().getCoordinates(),
            ]);
            const endLineFeature = new ol.Feature({
                geometry: endLineString,
                name: "End Line",
            });
            endLineFeature.setStyle(lineStyle);

            const route = new ol.geom.LineString(coordinates);

            const routeFeature = new ol.Feature({
                geometry: route,
                name: "Route",
            });

            const routeSource = new ol.source.Vector({
                features: [routeFeature],
            });

            routeSource.addFeature(startLineFeature);
            routeSource.addFeature(endLineFeature);

            const routeLayer = new ol.layer.Vector({
                source: routeSource,
                style: [
                    new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: "#0000ff", // 바깥선 색상 (파랑)
                            width: 6, // 바깥선 두께
                        }),
                    }),
                    new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: "#6F79BC", // 안쪽 색상 (연한 파랑)
                            width: 4, // 안쪽 선 두께
                        }),
                    }),
                ],
                type: "routeLayer",
            });

            map.addLayer(routeLayer);

            const overlayToRemove = routeTooltip;

            deleteButton.addEventListener("click", function () {
                map.removeLayer(routeLayer);
                map.removeOverlay(overlayToRemove);
                const source = objectControllVectorLayer.getSource();
                const features = source.getFeatures();
                for (let i = 0; i < features.length; i++) {
                    const feature = features[i];
                    if (feature && feature.get("attribute") == "start") {
                        source.removeFeature(feature);
                    }
                    if (feature && feature.get("attribute") == "end") {
                        source.removeFeature(feature);
                    }
                }
                instructionsElement.innerHTML = "";
                const element = document.getElementById("offcanvasScrolling");
                if (element.classList.contains("show")) {
                    document.getElementById("route-result-toggle-button").click();
                } else {

                }
            });

            const routeExtent = route.getExtent();

            map.getView().fit(routeExtent, {
                size: map.getSize(),
                padding: [200, 200, 200, 200], // 상, 우, 하, 좌 방향으로의 패딩
            });

            const element = document.getElementById("offcanvasScrolling");
            if (!element.classList.contains("show")) {
                document.getElementById("route-result-toggle-button").click();
            } else {

            }
        }).catch(function (error) {
            console.log(error);
        }).finally(function () {
            routeTooltipElement = null;
        });
}


//경로탐색 셀렉트박스의 값이 변경될 때 동작하는 이벤트 리스너. 시작, 도착 마커가 찍혀있는 여부에 따라 경로탐색을 진행한다.
function routeKindSelectChangeListener(e){
    const selectedOption = e.target.value;
    console.log("Selected option:", selectedOption);

    const source = objectControllVectorLayer.getSource();
    const features = source.getFeatures();
    const startFeature = features.find(
        (feature) => feature.get("attribute") === "start"
    );
    const endFeature = features.find(
        (feature) => feature.get("attribute") === "end"
    );
    //console.log(startFeature, endFeature)
    if (startFeature && endFeature) {
        map.getOverlays()
            .getArray()
            .slice(0)
            .forEach(function (overlay) {
                if (overlay.get("type") === "route") {
                    map.removeOverlay(overlay);
                }
            });
        map.getLayers()
            .getArray()
            .slice()
            .forEach(function (layer) {
                if (layer.get("type") === "routeLayer") {
                    map.removeLayer(layer);
                }
            });
        searchRouteSummury(startFeature, endFeature, selectedOption);
    }
}

//경로탐색 결과 컨테이너를 클릭할 때 동작하는 이벤트 리스너. a태그를 클릭할 때 data로 저장된 좌표를 이용해 지도의 중앙을 이동한다.
function routeResultContainerClickListener(event){
    if (event.target.tagName === "A") {
        const customValue = event.target.getAttribute("data-coordinate");

        const coords = customValue.split(",").map(Number);
        map.getView().animate({
            zoom: map.getView().getZoom(),
            center: coords,
            duration: 500,
        });
    }
}

//경로탐색 결과 컨테이너에 마우스가 호버될 때 동작하는 이벤트 리스너. a태그위에 마우스가 호버될 때 data로 저장된 좌표를 가져와 지도 위에 포인트를 찍는다.
function routeResultContainerMouseOverListener(event){
    if (event.target.tagName === "A") {
        const customValue = event.target.getAttribute("data-coordinate");

        const coordinates = customValue.split(",").map(Number);
        const x = parseFloat(coordinates[0]);
        const y = parseFloat(coordinates[1]);

        const pointFeature = new ol.Feature(new ol.geom.Point([x, y]));

        // 기존의 포인트를 지우고 새로운 포인트를 추가합니다.
        routeVectorSource.clear();
        routeVectorSource.addFeature(pointFeature);
    }
}

//경로탐색 결과 컨테이너에 마우스가 호버 해제될 때 동작하는 이벤트 리스너. 지도 위에 찍었던 포인트를 지운다.
function routeResultContainerMouseOutListener(event){
    if (event.target.tagName === "A") {
        routeVectorSource.clear();
    }
}
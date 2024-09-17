/**
 *  @author 김봉준
 *  @date   2023-07-27
 *  지도 서비스의 인터렉션을 관리하는 파일.
 */

//지도에 시프트 마우스 드래그를 이용한 Extent 인터렉션을 인터렉션을 담을 변수
const extentInteraction = new ol.interaction.Extent({
    condition : function (mapBrowserEvent) {
        if (
            $(areaCheckbox).is(":checked") ||
            $(measureCheckbox).is(":checked") ||
            $(areaCircleCheckbox).is(":checked")
        ) {
            return false;
        }
        return (
            ol.events.condition.shiftKeyOnly(mapBrowserEvent) &&
            mapBrowserEvent.originalEvent.button !== 2
        );
    },
    boxStyle: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: "blue",
            width: 1,
        }),
        fill: new ol.style.Fill({
            color: "rgba(0, 0, 255, 0)",
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: "#FFFFFF",
            }),
        }),
    }),
    pointerStyle: new ol.style.Style({
        image: new ol.style.Circle({
            radius: 0,
            fill: new ol.style.Fill({
                color: "#FFFFFF",
            }),
        }),
    }),
});

//지도에 Extent 인터렉션을 추가하는 함수
function addExtentInteraction() {
    extentInteraction.on("extentchanged", function (event) {
        const extent = extentInteraction.getExtent();
        if (
            $(areaCheckbox).is(":checked") ||
            $(measureCheckbox).is(":checked") ||
            $(areaCircleCheckbox).is(":checked")
        ) {
            // console.log($(areaCheckbox).is(":checked"))
            // console.log($(measureCheckbox).is(":checked"))
            // console.log($(areaCheckbox).is(":checked"))
            return;
        }
        //console.log(extentInteraction)
        if (extent) {
            const bottomLeft = ol.extent.getBottomLeft(extent);
            const bottomRight = ol.extent.getBottomRight(extent);
            const topLeft = ol.extent.getTopLeft(extent);
            // console.log(bottomLeft)
            // console.log(bottomRight)
            // console.log(topLeft)
            // console.log(topRight)
            const bottomLeftLonLat = ol.proj.transform(
                bottomLeft,
                "EPSG:3857",
                "EPSG:4326"
            );
            const bottomRightLonLat = ol.proj.transform(
                bottomRight,
                "EPSG:3857",
                "EPSG:4326"
            );
            const topLeftLonLat = ol.proj.transform(
                topLeft,
                "EPSG:3857",
                "EPSG:4326"
            );

            const widthDistance = ol.sphere.getDistance(
                bottomLeftLonLat,
                bottomRightLonLat
            );
            const heigthDistance = ol.sphere.getDistance(
                topLeftLonLat,
                bottomLeftLonLat
            );

            const area = widthDistance * heigthDistance;
            // console.log('가로 길이: ' + widthDistance + ' meters');
            // console.log('세로 길이: ' + heigthDistance + ' meters');
            // console.log('면적: ' + area + ' square meters');
            window.selectedExtent = extent;
            //console.log("Width: " + width + ", Height: " + height + ", Area: " + area);

            removeExtentInteractionTooltip();
            if(widthDistance != 0 || widthDistance != 0){
                let toolTipElement = createDrawTooltip(-15, 0, "top-left");
                extentInteractionTooltipElement = toolTipElement.element;
                extentInteractionTooltip = toolTipElement.tooltip;
                //createExtentInteractionTooltip();
                extentInteractionTooltipElement.innerHTML =
                    createExtentInteractionTooltipHtml(
                        widthDistance,
                        heigthDistance,
                        area
                    );
    
                extentInteractionTooltip.setPosition(bottomRight);
                extentInteractionTooltipElement.parentElement.style.pointerEvents =
                    "none";
            }
            
            // var transformedExtent  = ol.proj.transformExtent(extent, 'EPSG:3857', 'EPSG:4326');
            // console.log(transformedExtent)
        }
    });

    map.addInteraction(extentInteraction);
}

//extent 인터렉션의 오버레이를 지우고, html 엘리먼트와 overlay 객체를 초기화 하는 함수
function removeExtentInteractionTooltip() {
    if (extentInteractionTooltip) {
        map.removeOverlay(extentInteractionTooltip);
        extentInteractionTooltipElement = null;
        extentInteractionTooltip = null;
    }
}

//지도에 컨트롤 마우스 드래그를 이용한 DragBox 인터렉션을 인터렉션을 담을 변수
const dragBox = new ol.interaction.DragBox({
    condition: ol.events.condition.platformModifierKeyOnly,
});

//지도에 DragBox 인터렉션을 추가하는 함수
function addDragBoxInteraction() {
    dragBox.on("boxend", function (evt) {
        const boxExtent = dragBox.getGeometry().getExtent();
        //console.log("박스 그리기 끝", boxExtent)
        // var url = 'https://api.vworld.kr/req/data?';
        // url += 'service=data';
        // url += '&request=GetFeature';
        // url += '&data=LP_PA_CBND_BUBUN';
        // url += `&key=${VWORLD_API_KEY}`; // Replace with your actual API key
        // url += '&format=json';
        // url += "&crs=EPSG:3857";
        // url += "&size=1000";
        // url += `&geomFilter=BOX(${boxExtent[0]},${boxExtent[1]},${boxExtent[2]},${boxExtent[3]})`;
        // url +=  "&domain=http://127.0.0.1:3000/openlayers_test.html"

        // $.ajax({
        //     url: url,
        //     type: 'GET',
        //     dataType: "jsonp",
        //     async : false,
        //     jsonpCallback: 'callback',
        //     success: function(data) {
        //         console.log(data)
        //         if(data.response.status != "OK"){
        //             return;
        //         }
        //         var geoInfoObject = data.response.result.featureCollection.features[0];
        //         var geojsonObject = geoInfoObject.geometry;

        //         var vectorSource = new ol.source.Vector({
        //             features: (new ol.format.GeoJSON()).readFeatures(geojsonObject)
        //         });
        //         vectorSource.set("ctp_kor_nm",data.response.result.featureCollection.features[0].properties.ctp_kor_nm);
        //         vectorSource.set("ctp_eng_nm",data.response.result.featureCollection.features[0].properties.ctp_eng_nm);
        //         //layer.getSource().getKeys()로 확인

        //         var vectorStyle = new ol.style.Style({
        //             fill: new ol.style.Fill({
        //                 color: 'rgba(135,206,250, 0.5)', // Skyblue color fill with opacity
        //             }),
        //             stroke: new ol.style.Stroke({
        //                 color: 'orange', // Orange stroke color
        //                 width: 2
        //             }),
        //         });

        //         var vector_layer = new ol.layer.Vector({
        //           source: vectorSource,
        //           style: vectorStyle
        //         })
        //         vector_layer.set("ctp_kor_nm_layer",data.response.result.featureCollection.features[0].properties.ctp_kor_nm+"_layer");
        //         //layer.getKeys() 로 확인

        //         map.addLayer(vector_layer);
        //         clickCurrentLayer = vector_layer

        //         var overlayElement = document.createElement('div');
        //         overlayElement.className = "ol-popup";
        //         overlayElement.innerHTML += `<a href="#" id="popup-closer" class="ol-popup-closer"></a>`
        //         overlayElement.innerHTML += `<div id="popup-content">
        //                                         <div class="ol-popup-title">정보</div>
        //                                             <code class="code">${evt.coordinate}<br>주소<br>
        //                                                 <div class="leftBottom__etcBtn">
        //                                                     <ul>
        //                                                         <li class="select customSelect">
        //                                                             <p onclick="searchLocalAddress(this)">${geoInfoObject.properties.addr}</p>
        //                                                         </li>
        //                                                     </ul>
        //                                                 </div>
        //                                             </code>
        //                                             <br>
        //                                             <div style="float: left;">공시지가 : ${geoInfoObject.properties.jiga != "" ? geoInfoObject.properties.jiga.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : "--"}&#8361;, 지목 : ${geoInfoObject.properties.jibun.slice(-1)}</div>
        //                                         </div>`
        //         var overlay = new ol.Overlay({
        //             element: overlayElement,
        //             position: evt.coordinate
        //         });
        //         // Add the overlay to the map
        //         map.addOverlay(overlay);
        //         clickCurrentOverlay = overlay;

        //         var deleteButton = overlayElement.querySelector(".ol-popup-closer");
        //         deleteButton.addEventListener("click", function () {
        //             map.removeLayer(vector_layer);
        //             map.removeOverlay(clickCurrentOverlay);
        //         });
        //     },
        //     beforesend: function(){

        //     },
        //     error: function(xhr, stat, err) {}
        //   });
    });

    dragBox.on("boxstart", function () {
        //console.log("박스 그리기 시작")
    });

    map.addInteraction(dragBox);
}

//지도 위에 GPX, GeoJson, IGC, KML, TopoJson 파일을 Drag & Drop으로 표시하기 위한 인터렉션을 담을 변수
let dragAndDropInteraction;

//지도에 Drag & Drop 인터렉션을 추가하는 함수
function addDragAndDropInteraction() {
    if (dragAndDropInteraction) {
        map.removeInteraction(dragAndDropInteraction);
    }
    dragAndDropInteraction = new ol.interaction.DragAndDrop({
        formatConstructors: [
            ol.format.GPX,
            ol.format.GeoJSON,
            ol.format.IGC,
            new ol.format.KML({ extractStyles: false }),
            ol.format.TopoJSON,
        ],
    });

    dragAndDropInteraction.on("addfeatures", function (event) {
        const vectorSource = new ol.source.Vector({
            features: event.features,
        });

        let layerExtent = vectorSource.getExtent();

        if (!ol.extent.intersects(layerExtent, KOREA_EXTENT)) {
            alert("한국이 아닌 지형의 파일은 레이어를 추가할 수 없습니다.");
            return;
        }

        map.addLayer(
            new ol.layer.Vector({
                source: vectorSource,
            })
        );
        map.getView().fit(vectorSource.getExtent());
    });
    map.addInteraction(dragAndDropInteraction);
}


//지도에 뒤로가기, 새로고침시 이전 상태를 저장하기 위한 Link 인터렉션을 추가하는 함수
function addLinkInteraction(map) {
    map.addInteraction(new ol.interaction.Link());
}

//cctv cluster 레이어의 스타일 최적화를 위한 스타일 캐시를 저장할 변수
let cctvClusterLayerStyleCache = {};

//cctv cluster 레이어의 스타일 객체를 반환하는 함수
function getCctvClusterLayerStyle(feature, resolution) {
    const size = feature.get("features").length;
    let style = cctvClusterLayerStyleCache[size];
    if (!style) {
        const color =
            size > 25 ? "192,0,0" : size > 8 ? "255,128,0" : "0,128,0";
        const radius = Math.max(8, Math.min(size * 0.75, 20));
        const dashes = (2 * Math.PI * radius) / 6;
        const dash = [0, dashes, dashes, dashes, dashes, dashes, dashes];
        style = cctvClusterLayerStyleCache[size] = new ol.style.Style({
            image: new ol.style.Circle({
                radius: radius,
                stroke: new ol.style.Stroke({
                    color: "rgba(" + color + ",0.5)",
                    width: 15,
                    lineDash: dash,
                    lineCap: "butt",
                }),
                fill: new ol.style.Fill({
                    color: "rgba(" + color + ",1)",
                }),
            }),
            text: new ol.style.Text({
                text: size.toString(),
                fill: new ol.style.Fill({
                    color: "#fff",
                }),
                font: "10px Arial",
            }),
        });
    }
    return [style];
}

//cctv cluster 레이어를 담을 변수
const cctvSelectCluster = new ol.interaction.SelectCluster({
    // 부모를 클릭하여 자식이 표시될때 부모와 자식간의 거리(px 단위)
    pointRadius: 7,
    animate: true,
    // 부모와 자식 사이에 그려질 선에 대한 스타일
    featureStyle: function () {
        return [
            new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 5,
                    stroke: new ol.style.Stroke({
                        color: "blue",
                        width: 3,
                    }),
                    fill: new ol.style.Fill({
                        color: "rgba(0,255,255,0.3)",
                    }),
                }),
                stroke: new ol.style.Stroke({
                    color: "rgba(0, 0, 255, 1)",
                    width: 1,
                }),
            }),
        ];
    },
    // 부모가 선택된 상태에서 다시 부모와 자식이 선택될때 선택된 요소의 스타일
    style: function (f, res) {
        const cluster = f.get("features");
        if (!cluster) {
            return;
        }
        if (cluster.length > 1) {
            // 부모 스타일
            return getCctvClusterLayerStyle(f, res);
        } else {
            // 자식 스타일
            return [
                new ol.style.Style({
                    image: new ol.style.Circle({
                        stroke: new ol.style.Stroke({
                            color: "rgba(0,0,192,0.5)",
                            width: 2,
                        }),
                        fill: new ol.style.Fill({ color: "rgba(0,0,192,0.3)" }),
                        radius: 5,
                    }),
                }),
            ];
        }
    },
});

//지도에 cctv cluster레이어의 인터렉션을 추가하는 함수
function addCctvInteraction(){
    //cctv cluster 레이어가 클릭되었을 때 발생하는 이벤트
    cctvSelectCluster.getFeatures().on(["add"], function (e) {
        const originalFeatures = e.element.get("features");
        if (!originalFeatures) {
            e.stopPropagation();
            return;
        }
        //console.log("@", originalFeatures)
        const overlayElement = document.createElement("div");
        overlayElement.className = "ol-popup";

        let contentHTML = `<a href="#" id="popup-closer" class="ol-popup-closer"></a>
            <div id="popup-content">
                <div class="ol-popup-title">CCTV 정보</div>
                <code class="code break-line">`;

        if (originalFeatures.length > 1) {
            contentHTML += `선택 개수 : ${originalFeatures.length}<br>`;
            for (let i = 0; i < originalFeatures.length; i++) {
                contentHTML += `<span class="cctv-name" data-coordinate-attribute="${originalFeatures[
                    i
                ]
                    .getGeometry()
                    .getCoordinates()}">${originalFeatures[i].get(
                    "cctvname"
                )}</span> : <a href="#" onclick="stremVideo('${originalFeatures[i]
                    .get("cctvurl")
                    .toString()}', '${originalFeatures[i]
                    .get("cctvname")
                    .toString()}');">CCTV 보기</a><br>`;
                if (i == 4 && originalFeatures.length > 5) {
                    contentHTML += `외 ${originalFeatures.length - i - 1} 곳`;
                    break;
                }
            }
        } else {
            contentHTML += `CCTV 이름 : ${originalFeatures[0].get("cctvname")}<br>
                영상 : <a href="#" onclick="stremVideo('${originalFeatures[0]
                    .get("cctvurl")
                    .toString()}', '${originalFeatures[0]
                .get("cctvname")
                .toString()}');">CCTV 보기</a>`;
        }
        contentHTML += `</code></div>`;

        overlayElement.innerHTML = contentHTML;
        const overlay = new ol.Overlay({
            element: overlayElement,
            position: e.element.getGeometry().getCoordinates(),
        });
        // Add the overlay to the map
        map.addOverlay(overlay);
        clickCurrentOverlay = overlay;

        const deleteButton = overlayElement.querySelector(".ol-popup-closer");
        deleteButton.addEventListener("click", function () {
            if (cctvSelectCluster) {
                cctvSelectCluster.clear();
            }
            map.removeOverlay(clickCurrentOverlay);
        });
    });

    //지도에 cctv cluster 인터렉션을 추가한다.
    map.addInteraction(cctvSelectCluster);
}


//지도위에 길이측정 레이어, 툴팁을 표시하는 함수
function addLineInteraction() {
    measurePolygon = new ol.interaction.Draw({
        source: lineSource,
        type: "LineString",
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: "rgba(255,0,94)",
                width: 3,
            }),
        }),
        stopClick: true,
        freehandCondition: ol.events.condition.never,
        condition: (e) =>
            ol.events.condition.noModifierKeys(e) && ol.events.condition.primaryAction(e),
    });

    map.addInteraction(measurePolygon);

    let overlayDisplayed = false;

    measurePolygon.on("drawstart", function (evt) {
        sketch = evt.feature;

        sketch.getGeometry().on("change", function (evt) {
            const geom = evt.target;
            //var output = formatLength((geom));
            measureTooltipElement.innerHTML = createDrawingAreaTooltipHtml(
                "line",
                this,
                true
            );
            measureTooltip.setPosition(geom.getLastCoordinate());
            measureTooltipElement.parentElement.style.pointerEvents = "none";
            if (geom.getCoordinates().length > 2 && !overlayDisplayed) {
                measureTooltipElement.className = "tooltip tooltip-static";
                overlayDisplayed = true;
            }
        });

        //createMeasureTooltip();
        let toolTipElement = createDrawTooltip();
        measureTooltipElement = toolTipElement.element;
        measureTooltip = toolTipElement.tooltip;
    });

    measurePolygon.on("drawend", function (evt) {
        //ol.Observable.unByKey(listener);
        if (!overlayDisplayed) {
            map.removeOverlay(measureTooltip);
        }

        const feature = evt.feature; // 그리기가 완료된 feature를 가져옵니다.
        feature.setStyle(
            new ol.style.Style({
                // feature의 스타일을 설정합니다.
                stroke: new ol.style.Stroke({
                    color: "rgba(255,0,94)",
                    width: 3,
                }),
            })
        );
        const coordinateLength = sketch.getGeometry().getCoordinates().length;
        if (coordinateLength < 2) {
            setTimeout(function () {
                lineSource.removeFeature(evt.feature);
                map.removeOverlay(measureTooltip);
            }, 0);
        } else {
            const overlayToRemove = measureTooltip;
            measureTooltipElement.innerHTML = createDrawingAreaTooltipHtml("line", evt.feature.getGeometry(), false);
            const deleteButton = measureTooltipElement.querySelector(".delete-btn");

            deleteButton.addEventListener("click", function () {
                // 해당 feature 제거
                lineSource.removeFeature(evt.feature);
                // 해당 tooltip 제거
                map.removeOverlay(overlayToRemove);
            });
            sketch = null;
            measureTooltipElement = null;
            overlayDisplayed = false;
            measureTooltip = null;
            map.removeInteraction(measurePolygon);
            addLineInteraction();
        }
    });
}

//지도위에 면적측정 레이어, 툴팁을 표시하는 함수
function addPolygonInteraction() {
    areaPolygon = new ol.interaction.Draw({
        source: polygonSource,
        type: "Polygon",
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: "blue",
                width: 3,
            }),
            fill: new ol.style.Fill({
                color: "rgba(0, 0, 255, 0.1)",
            }),
        }),
        stopClick: true,
        freehandCondition: ol.events.condition.never,
        condition: (e) =>
            ol.events.condition.noModifierKeys(e) &&
            ol.events.condition.primaryAction(e),
    });

    map.addInteraction(areaPolygon);

    let listenerKey;

    areaPolygon.on("drawstart", function (evt) {
        sketch = evt.feature;

        let lastMouseCoordinate;

        listenerKey = map.on("pointermove", function (evt) {
            lastMouseCoordinate = evt.coordinate;
        });

        // 이벤트 핸들러 추가
        sketch.getGeometry().on("change", function (evt) {
            //var output = formatArea((geom));
            areaTooltipElement.innerHTML = createDrawingAreaTooltipHtml("polygon", this, true);
            areaTooltip.setPosition(lastMouseCoordinate);
            areaTooltipElement.parentElement.style.pointerEvents = "none";
        });

        //createAreaTooltip();
        let toolTipElement = createDrawTooltip();
        areaTooltipElement = toolTipElement.element;
        areaTooltip = toolTipElement.tooltip;
    });

    areaPolygon.on("drawend", function (evt) {
        const coordinateLength = sketch.getGeometry().getCoordinates()[0].length;
        if (coordinateLength < 4) {
            setTimeout(function () {
                console.log(areaTooltip)
                polygonSource.removeFeature(evt.feature);
                map.removeOverlay(areaTooltip);
                return;
            }, 0);
        }else{
            const feature = evt.feature;
            const geometry = feature.getGeometry();
            const coordinates = geometry.getCoordinates()[0];
            const lastCoordinate = coordinates[coordinates.length - 2];
    
            const overlayToRemove = areaTooltip;
            areaTooltipElement.innerHTML = createDrawingAreaTooltipHtml("polygon", evt.feature.getGeometry(), false);
    
            const deleteButton = areaTooltipElement.querySelector(".delete-btn");
            deleteButton.addEventListener("click", function () {
                // 해당 feature 제거
                polygonSource.removeFeature(evt.feature);
                // 해당 tooltip 제거
                map.removeOverlay(overlayToRemove);
            });
    
            areaTooltip.setPosition(lastCoordinate);
    
            map.removeInteraction(areaPolygon);
            sketch = null;
            areaTooltipElement = null;
            areaTooltip = null;
            addPolygonInteraction();
    
            ol.Observable.unByKey(listenerKey);
            listenerKey = null;
        }


    });
}

//지도위에 반경측정 레이어, 툴팁을 표시하는 함수
function addCircleInteraction() {
    circlePolygon = new ol.interaction.Draw({
        source: cricleSource,
        type: "Circle",
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: "green",
                width: 3,
            }),
            fill: new ol.style.Fill({
                color: "rgba(107,208,137, 0.3)",
            }),
        }),
        stopClick: true,
        freehandCondition: ol.events.condition.never,
        condition: (e) =>
            ol.events.condition.noModifierKeys(e) && ol.events.condition.primaryAction(e),
    });

    map.addInteraction(circlePolygon);

    let listenerKey;

    circlePolygon.on("drawstart", function (evt) {
        let lastMouseCoordinate;

        listenerKey = map.on("pointermove", function (evt) {
            lastMouseCoordinate = evt.coordinate;
        });

        sketch = evt.feature;
        //console.log(sketch.getGeometry())
        // 이벤트 핸들러 추가
        sketch.getGeometry().on("change", function (evt) {
            //var output = formatCircleArea((geom));
            circleTooltipElement.innerHTML = createDrawingAreaTooltipHtml("circle", this, true);
            circleTooltip.setPosition(lastMouseCoordinate);
            circleTooltipElement.parentElement.style.pointerEvents = "none";
        });
        //createCircleAreaTooltip();
        let toolTipElement = createDrawTooltip();
        circleTooltipElement = toolTipElement.element;
        circleTooltip = toolTipElement.tooltip;
    });

    circlePolygon.on("drawend", function (evt) {
        const geom = evt.target;
        //console.log(geom);
        const coordinateLength = geom.sketchCoords_.length;
        //console.log(sketch.getGeometry())
        if (coordinateLength < 2) {
            setTimeout(function () {
                cricleSource.removeFeature(evt.feature);
                map.removeOverlay(circleTooltip);
            }, 0);
        }

        const overlayToRemove = circleTooltip;
        circleTooltipElement.innerHTML = createDrawingAreaTooltipHtml("circle", evt.feature.getGeometry(), false);

        const deleteButton = circleTooltipElement.querySelector(".delete-btn");
        deleteButton.addEventListener("click", function () {
            // 해당 feature 제거
            cricleSource.removeFeature(evt.feature);
            // 해당 tooltip 제거
            map.removeOverlay(overlayToRemove);
        });

        map.removeInteraction(circlePolygon);
        sketch = null;
        circleTooltipElement = null;
        circleTooltip = null;
        addCircleInteraction();

        ol.Observable.unByKey(listenerKey);
        listenerKey = null;
    });
}


//그리기 체크박스가 체크될 때 동작하는 이벤트 리스너
function handleDrawCheckboxChangeListener(){
    const checked = this.checked
    const id = this.id
    if(checked)uncheckedCheckBox(this);
    switch(id) {
        case 'measureCheckbox':
            measureCheckboxChangeListener(checked)
            console.log("길이", checked)
            break;
        case 'areaCheckbox':
            areaCheckboxChangeListener(checked)
            console.log("면적", checked)
            break;
        case 'areaCircleCheckbox':
            areaCircleCheckboxChangeListener(checked)
            console.log("반경", checked)
            break;
    }
}

//거리측정 체크박스가 체크될 때 실행하는 함수
function measureCheckboxChangeListener(checked){
    if (checked) {
        addLineInteraction();
        $("#remove-measure").attr("disabled", true);
        if (areaTooltip) {
            map.removeOverlay(areaTooltip);
        }
        if (circleTooltip) {
            map.removeOverlay(circleTooltip);
        }
    } else {
        if (measurePolygon) {
            map.removeInteraction(measurePolygon);
            if (measureTooltipElement) {
                measureTooltipElement = null;
            }
        }
        measurePolygon = null;
        sketch = null;
        $("#remove-measure").attr("disabled", false);
    }
}

//면적측정 체크박스가 체크될 때 실행하는 함수
function areaCheckboxChangeListener(checked){
    if (checked) {
        addPolygonInteraction();
        $("#remove-measure").attr("disabled", true);
        if (measureTooltip) {
            map.removeOverlay(measureTooltip);
        }
        if (circleTooltip) {
            map.removeOverlay(circleTooltip);
        }
    } else {
        if (areaPolygon) {
            map.removeInteraction(areaPolygon);
            if (areaTooltipElement) {
                areaTooltipElement = null;
            }
        }
        areaPolygon = null;
        sketch = null;
        $("#remove-measure").attr("disabled", false);
    }
}

//반경측정 체크박스가 체크될 때 실행하는 함수
function areaCircleCheckboxChangeListener(checked){
    if (checked) {
        addCircleInteraction();
        $("#remove-measure").attr("disabled", true);
        if (measureTooltip) {
            map.removeOverlay(measureTooltip);
        }
        if (areaTooltip) {
            map.removeOverlay(areaTooltip);
        }
    } else {
        if (circlePolygon) {
            map.removeInteraction(circlePolygon);
            if (circleTooltipElement) {
                circleTooltipElement = null;
            }
        }
        circlePolygon = null;
        sketch = null;
        $("#remove-measure").attr("disabled", false);
    }
}
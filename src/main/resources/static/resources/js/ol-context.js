/**
 *  @author 김봉준
 *  @date   2023-07-26
 *  ol-contextMenu 라이브러리를 관리하는 폴더
 */

//ol-context 마커 아이콘
const pinIcon = "https://cdn.jsdelivr.net/gh/jonataswalker/ol-contextmenu@604befc46d737d814505b5d90fc171932f747043/examples/img/pin_drop.png";
//ol-context 지도 중앙위치 아이콘
const centerIcon = "https://cdn.jsdelivr.net/gh/jonataswalker/ol-contextmenu@604befc46d737d814505b5d90fc171932f747043/examples/img/center.png";
//ol-context 목록 아이콘
const listIcon = "https://cdn.jsdelivr.net/gh/jonataswalker/ol-contextmenu@604befc46d737d814505b5d90fc171932f747043/examples/img/view_list.png";

//pdf 아이콘
const pdfIcon = pdfIcoSrc;
//이미지 아이콘
const imageIcon = imageIcoSrc;
//삭제 아이콘
const deleteIcon = deleteIcoSrc;
//새로고침 아이콘
const refreshIcon = refreshIcoSrc;
//시작 마커 아이콘
const startMarkerIcon = startMarkerIcoSrc;
//종료 마커 아이콘
const endMarkerIcon = endMarkerIcoSrc;
//북마커 마커 아이콘
const bookMarkerIcon = bookMarkerIconSrc;

//ol-context zoom 클래스 설정
const namespace = "ol-ctx-menu";
const icon_class = "-icon";
const zoom_in_class = "-zoom-in";
const zoom_out_class = "-zoom-out";

//ol-context 기본 메뉴 아이템 구성 리스트
const contextmenuItems = [
    {
        text: "출발",
        classname: "start-item",
        icon: startMarkerIcon,
        callback: startMarker,
    },
    {
        text: "도착",
        classname: "end-item",
        icon: endMarkerIcon,
        callback: endMarker,
    },
    {
        text: "지도 중앙 이동",
        classname: "bold",
        icon: centerIcon,
        callback: center,
    },
    {
        text: "북마크",
        classname: "bold",
        icon: bookMarkerIcon,
        callback: bookMark,
    },
    {
        text: "좌표",
        classname: "ol-coordinate",
        callback: center,
    },
    {
        text: "기타 작업",
        icon: listIcon,
        items: [
            {
                text: "지도 중앙 이동",
                icon: centerIcon,
                callback: center,
            },
            {
                text: "마커 추가",
                icon: pinIcon,
                callback: marker,
            },
        ],
    },
    {
        text: "마커 추가",
        icon: pinIcon,
        callback: marker,
    },
    {
        text: "새로 고침",
        icon: refreshIcon,
        callback: refresh,
    },
    "-",
    {
        text: "줌 인",
        classname: [namespace + zoom_in_class, namespace + icon_class].join(
            " "
        ),
        callback: zoomIn,
    },
    {
        text: "줌 아웃",
        classname: [namespace + zoom_out_class, namespace + icon_class].join(
            " "
        ),
        callback: zoomOut,
    },
];

//ol-context 마커 위에서 발생하는 메뉴 아이템 구성 리스트
const removeMarkerItem = {
    text: "마커 삭제",
    classname: "marker",
    icon: deleteIcon,
    callback: removeMarker,
};

//ol-context extentInteraction 위에서 발생하는 메뉴 아이템 구성 리스트
const captureItem = [
    {
        text: "이미지 저장",
        classname: "center",
        icon: imageIcon,
        callback: imageCapture,
    },
    {
        text: "pdf 저장",
        icon: pdfIcon,
        classname: "marker",
        callback: exportPdf,
    },
    {
        text: "줌",
        classname: [namespace + zoom_in_class, namespace + icon_class].join(
            " "
        ),
        callback: zoomExntent,
    },
    {
        text: "영역 삭제",
        icon: deleteIcon,
        callback: removeExtent,
    },
];

//ol-context callback 함수. 줌 레벨을 한단계 확대한다.
function zoomIn(obj, map) {
    if (map.getView().getZoom() >= MAX_ZOOM_LEVEL) {
        return alert("줌 인 불가능");
    }
    map.getView().animate({
        zoom: map.getView().getZoom() + 1,
        center: obj.coordinate,
        duration: 500,
    });
}

//ol-context callback 함수. 줌 레벨을 한단계 축소한다
function zoomOut(obj, map) {
    if (map.getView().getZoom() <= MIN_ZOOM_LEVEL) {
        return alert("줌 아웃 불가능");
    }
    map.getView().animate({
        zoom: map.getView().getZoom() - 1,
        center: obj.coordinate,
        duration: 500,
    });
}

//ol-context callback 함수. 화면을 새로고침 한다.
function refresh(obj) {
    window.location.reload();
}

//ol-context callback 함수. 맵의 중앙 위치를 이동한다.
function center(obj) {
    map.getView().animate({
        duration: 700,
        center: obj.coordinate,
    });
}

//ol-context callback 함수. 북마크에 주소, 좌표, 줌레벨을 등록한다.
function bookMark(obj) {
    const modal = new bootstrap.Modal(
        document.getElementById("bookmark-modal"),
        {
            keyboard: true,
            x: obj.coordinate[0],
            y: obj.coordinate[1],
            address: obj.data.address,
        }
    );
    document.getElementById("form-control-address").innerText =
        obj.data.address;
    modal.toggle();
    //console.log(obj)
}

//ol-context callback 함수. extentInteraction로 선택된 영역을 이미지로 저장한다.
function imageCapture() {
    saveExtentAsImage();
}

//ol-context callback 함수. extentInteraction로 선택된 영역만큼 bound한다.
function zoomExntent(obj) {
    //view.setConstrainResolution(false)
    //console.log(obj.data.extent)
    map.getView().fit(obj.data.extent, map.getSize());
    //view.setConstrainResolution(true)
}

//ol-context callback 함수. extentInteraction로 선택된 영역을 PDF로 저장한다.
function exportPdf(obj) {
    saveExtentAsPdf();
}

//ol-context callback 함수. extentInteraction로 선택된 영역 제거한다.
function removeExtent(obj) {
    if (extentInteraction) {
        extentInteraction.setExtent(undefined);
        map.removeOverlay(extentInteractionTooltip);
    }
}

//ol-context callback 함수. 특정 마커를 삭제한다.
function removeMarker(obj) {
    if (
        obj.data.marker.get("attribute") == "start" ||
        obj.data.marker.get("attribute") == "end"
    ) {
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
    }
    objectControllVectorLayer.getSource().removeFeature(obj.data.marker);
}

//ol-context callback 함수. 지도위에 마커를 그린다.
function marker(obj) {
    const template = "좌표 : ({x}, {y})";
    const iconStyle = new ol.style.Style({
        image: new ol.style.Icon({ scale: 0.6, src: pinIcon }),
        text: new ol.style.Text({
            offsetY: 25,
            text: ol.coordinate.format(obj.coordinate, template, 12),
            font: "15px Open Sans,sans-serif",
            fill: new ol.style.Fill({ color: "#111" }),
            stroke: new ol.style.Stroke({ color: "#eee", width: 2 }),
        }),
    });
    const feature = new ol.Feature({
        type: "removable",
        geometry: new ol.geom.Point(obj.coordinate),
    });

    feature.setStyle(iconStyle);
    objectControllVectorLayer.getSource().addFeature(feature);
}

//ol-context callback 함수. 지도위에 경로탐색 시작 마커를 그린다
async function startMarker(obj) {
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
    const coord4326 = ol.proj.transform(
        obj.coordinate,
        "EPSG:3857",
        "EPSG:4326"
    );
    const address = await reverseGeoCoding(coord4326[0], coord4326[1]);
    const source = objectControllVectorLayer.getSource();
    const features = source.getFeatures();
    for (let i = 0; i < features.length; i++) {
        let feature = features[i];
        if (feature && feature.get("attribute") == "start") {
            source.removeFeature(feature);
        }
    }
    const iconStyle = new ol.style.Style({
        image: new ol.style.Icon({ scale: 0.6, src: startMarkerIcon }),
        text: new ol.style.Text({
            offsetY: 25,
            text: address,
            font: "15px Open Sans,sans-serif",
            fill: new ol.style.Fill({ color: "#111" }),
            stroke: new ol.style.Stroke({ color: "#eee", width: 2 }),
        }),
    });
    const feature = new ol.Feature({
        type: "removable",
        geometry: new ol.geom.Point(obj.coordinate),
        attribute: "start",
        address: address,
    });

    feature.setStyle(iconStyle);
    objectControllVectorLayer.getSource().addFeature(feature);

    const endFeature = features.find(
        (feature) => feature.get("attribute") === "end"
    );
    if (endFeature) {
        const selectElement = document.querySelector(".form-select-sm");
        const selectedOption = selectElement.value;
        searchRouteSummury(feature, endFeature, selectedOption);
    }
}

//ol-context callback 함수. 지도위에 경로탐색 종료 마커를 그린다
async function endMarker(obj) {
    map.getOverlays()
        .getArray()
        .slice(0)
        .forEach(function (overlay) {
            //console.log("@")
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
    const coord4326 = ol.proj.transform(
        obj.coordinate,
        "EPSG:3857",
        "EPSG:4326"
    );
    const address = await reverseGeoCoding(coord4326[0], coord4326[1]);
    const source = objectControllVectorLayer.getSource();
    const features = source.getFeatures();
    for (let i = 0; i < features.length; i++) {
        let feature = features[i];
        if (feature && feature.get("attribute") == "end") {
            source.removeFeature(feature);
        }
    }

    const iconStyle = new ol.style.Style({
        image: new ol.style.Icon({ scale: 0.6, src: endMarkerIcon }),
        text: new ol.style.Text({
            offsetY: 25,
            text: address,
            font: "15px Open Sans,sans-serif",
            fill: new ol.style.Fill({ color: "#111" }),
            stroke: new ol.style.Stroke({ color: "#eee", width: 2 }),
        }),
    });
    const feature = new ol.Feature({
        type: "removable",
        geometry: new ol.geom.Point(obj.coordinate),
        attribute: "end",
        address: address,
    });

    feature.setStyle(iconStyle);
    objectControllVectorLayer.getSource().addFeature(feature);
    const startFeature = features.find(
        (feature) => feature.get("attribute") === "start"
    );
    if (startFeature) {
        const selectElement = document.querySelector(".form-select-sm");
        const selectedOption = selectElement.value;

        searchRouteSummury(startFeature, feature, selectedOption);

        // console.log('Current selected option:', selectedOption);
        // console.log("끝 마커를 찍었고 시작 지점의 마커도 존재한다")
    }
}

//ol-context 초기화
const contextmenu = new ContextMenu({
    width: 300,
    defaultItems: false,
    items: contextmenuItems,
});

map.addControl(contextmenu);

//ol-context 메뉴가 열리기 전에 발생하는 이벤트 면적/길이 측정을 진행하는 동안에는 메뉴를 열지 않는다.
contextmenu.on("beforeopen", function (evt) {
    if (printControl.isOpen()) {
        $(document).on("contextmenu", function (e) {
            e.preventDefault();
        });
        contextmenu.disable();
        return;
    }
    if ($(areaCheckbox).is(":checked") || $(measureCheckbox).is(":checked") || $(areaCircleCheckbox).is(":checked")) {
        contextmenu.disable();
        if (measurePolygon) {
            //console.log(draw);
            measurePolygon.finishDrawing();
            if (measureTooltipElement) {
                measureTooltipElement.parentNode.removeChild(measureTooltipElement);
            }
            map.removeInteraction(measurePolygon);
            addLineInteraction();
            return;
        }
        if (areaPolygon) {
            areaPolygon.finishDrawing();
            if (areaTooltipElement) {
                areaTooltipElement.parentNode.removeChild(areaTooltipElement);
            }
            map.removeInteraction(areaPolygon);
            addPolygonInteraction();
            return;
        }

        if (circlePolygon) {
            circlePolygon.abortDrawing();
            if (circleTooltipElement) {
                circleTooltipElement.parentNode.removeChild(
                    circleTooltipElement
                );
            }
            map.removeInteraction(circlePolygon);
            addCircleInteraction();
            return;
        }
    } else {
        return contextmenu.enable();
    }
});

//ol-context 메뉴가 열릴 때 발생하는 이벤트
contextmenu.on("open", async function (evt) {
    let isInsideExtent = false;
    if (extentInteraction.getExtent()) {
        isInsideExtent = ol.extent.containsCoordinate(
            extentInteraction.getExtent(),
            evt.coordinate
        );
    }
    const feature = map.forEachFeatureAtPixel(evt.pixel, (ft) => ft);

    if (feature && feature.get("type") === "removable") {
        contextmenu.clear();
        removeMarkerItem.data = { marker: feature };
        contextmenu.push(removeMarkerItem);
    } else if (isInsideExtent) {
        contextmenu.clear();
        captureItem[2].data = { extent: extentInteraction.getExtent() };
        contextmenu.extend(captureItem);
    } else {
        const selectedValue = $(".coordinate-system-selector").val();
        const coord4326 = ol.proj.transform(
            evt.coordinate,
            "EPSG:3857",
            "EPSG:4326"
        );
        const coordinate = ol.proj.transform(
            evt.coordinate,
            "EPSG:3857",
            selectedValue
        );
        //console.log(coordinate);
        const address = await reverseGeoCoding(coord4326[0], coord4326[1]);
        console.log(address)
        contextmenu.clear();
        contextmenuItems[3].data = { address: address };
        contextmenu.extend(contextmenuItems);
        document.querySelector(
            ".ol-coordinate"
        ).innerText = `${coordinate[0]},\n${coordinate[1]}\n${address}`;
        //contextmenu.extend(contextmenu.getDefaultItems());
    }
});
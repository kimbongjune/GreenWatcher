/**
 *  @author 김봉준
 *  @date   2023-07-25
 *  지도 서비스의 컨트롤을 관리하는 파일
 */

//지도에 축적 컨트롤을 추가하는 함수
function addScaleControl(...maps) {
    maps.forEach(map => {
        const control = new ol.control.ScaleLine({
            units: "metric", // 미터법
            bar: true, // scalebars
            steps: 4, // scalebars 개수
            text: true, // scale 비율 텍스트 표시 플래그
            minWidth: 200, // 최소 너비
        });
        map.addControl(control);
    });
}

//지도에서 축적 컨트롤을 제거하는 함수
function removeScaleControl(...maps) {
    maps.forEach(map => {
        // 모든 컨트롤들을 가져옴
        const controls = map.getControls().getArray();

        // 특정 클래스 이름을 가진 컨트롤을 찾아내기
        const scaleControl = controls.find(control => control instanceof ol.control.ScaleLine);

        // 컨트롤이 지도에 있으면 제거
        if (scaleControl) {
            map.removeControl(scaleControl);
        }
    });
}

//베이스지도, 서브지도에 축적 컨트롤 추가
addScaleControl(map, subMap)

//지도에 줌 슬라이더 컨트롤을 추가하는 함수
function addZoomControl(...maps) {
    maps.forEach(map => {
        const control = new ol.control.ZoomSlider();
        map.addControl(control);
    })
}

//지도에서 줌 슬라이더 컨트롤을 제거하는 함수
function removeZoomControl(...maps) {
    maps.forEach(map => {
        // 모든 컨트롤들을 가져옴
        const controls = map.getControls().getArray();

        // ol.control.ZoomSlider 인스턴스를 찾아내기
        const zoomControl = controls.find(control => control instanceof ol.control.ZoomSlider);

        // 컨트롤이 지도에 있으면 제거
        if (zoomControl) {
            map.removeControl(zoomControl);
        }
    });
}

//베이스지도, 서브지도에 줌 슬라이더 컨트롤 추가
addZoomControl(map, subMap)

//지도에 풀 스크린 컨트롤을 추가하는 함수
function addFullScreenControl(...maps) {
    maps.forEach(map => {
        const control = new ol.control.FullScreen({
            className: "ol-fullscreen-control",
        });
        map.addControl(control);
    })
}

//지도에서 풀 스크린 컨트롤을 제거하는 함수
function removeFullScreenControl(...maps) {
    maps.forEach(map => {
        const controls = map.getControls().getArray();
        const fullScreenControl = controls.find(control => control instanceof ol.control.FullScreen);
        if (fullScreenControl) {
            map.removeControl(fullScreenControl);
        }
    });
}

//베이스지도, 서브지도에 풀 스크린 컨트롤 추가
addFullScreenControl(map, subMap)

//베이스 지도의 오버뷰 맵에 표시할 지도 객체
const mainMapOverviewMap = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url: `http://api.vworld.kr/req/wmts/1.0.0/${VWORLD_API_KEY}/Base/{z}/{y}/{x}.png`,
        serverType: "geoserver",
        crossOrigin: "anonymous",
    }),
    preload: Infinity,
    type: "map",
});

//서브 지도의 오버뷰 맵에 표시할 지도 객체
const subMapOverviewMap = new ol.layer.Tile({
    source: new ol.source.OSM(),
    preload: Infinity,
    type: "map",
});

//오버뷰맵에 추가할 맵 객체
const overviewMapConfigs = [
    {
        map: map,
        layer: mainMapOverviewMap,
        localStorageId: MAIN_MAP_LOCALSTORAGE_ID,
    },
    {
        map: subMap,
        layer: subMapOverviewMap,
        localStorageId: SUB_MAP_LOCALSTORAGE_ID,
    }
];

//지도에 오버뷰맵 컨트롤을 추가하기 위한 함수
function addOverviewMapControl(mapConfigs) {
    mapConfigs.forEach(object => {
        const { map, layer, localStorageId } = object;

        const control = new ol.control.OverviewMap({
            className: "ol-overviewmap ol-custom-overviewmap",
            view: new ol.View({
                projection: "EPSG:3857",
                center: mapView.getCenter(),
                maxZoom: MAX_ZOOM_LEVEL,
                zoom: mapView.getZoom(),
                minZoom: MIN_ZOOM_LEVEL,
                constrainResolution: true,
            }),
            layers: [layer],
            rotateWithView: true,
            collapsed:
                localStorage.getItem(`overviewMapCollapse${localStorageId}`) === "true"
                    ? true
                    : false,
        });

        control.getOverviewMap().on("change:size", function () {
            const isCollapsed = control.getCollapsed();
            localStorage.setItem(`overviewMapCollapse${localStorageId}`, isCollapsed);
        });

        map.addControl(control);
    });
}

//지도에서 오버뷰맵 컨트롤을 제거하기 위한 함수
function removeOverviewMapControl(...maps) {
    maps.forEach(map => {
        const controls = map.getControls().getArray();
        const overviewMapControl = controls.find(control => control instanceof ol.control.OverviewMap);
        if (overviewMapControl) {
            map.removeControl(overviewMapControl);
        }
    });
}

//베이스지도, 서브지도에 오버뷰맵 컨트롤 추가
addOverviewMapControl(overviewMapConfigs)

//지도의 센터 타겟 컨트롤을 추가하는 함수
function addCenterTargetControl(...maps) {
    maps.forEach(map => {
        const control = new ol.control.Target({
            style: [
                new ol.style.Style({
                    image: new ol.style.RegularShape({
                        points: 4,
                        radius: 11,
                        radius1: 0,
                        radius2: 0,
                        snapToPixel: true,
                        stroke: new ol.style.Stroke({ color: "#fff", width: 3 }),
                    }),
                }),
                new ol.style.Style({
                    image: new ol.style.RegularShape({
                        points: 4,
                        radius: 11,
                        radius1: 0,
                        radius2: 0,
                        snapToPixel: true,
                        stroke: new ol.style.Stroke({ color: "black", width: 2 }),
                    }),
                }),
            ],
            composite: "",
        });
        map.addControl(control);
    })
}

//지도에서 센터 타겟 컨트롤을 제거하는 함수
function removeCenterTargetControl(...maps) {
    maps.forEach(map => {
        const controls = map.getControls().getArray();
        const centerTargetControl = controls.find(control => control instanceof ol.control.Target);
        if (centerTargetControl) {
            map.removeControl(centerTargetControl);
        }
    });
}

//베이스지도, 서브지도에 CenterTarget 컨트롤 추가
addCenterTargetControl(map, subMap)

//지도에 ZoomToExtent 컨트롤을 추가하는 함수
function addZoomToExtentControl(...maps) {
    maps.forEach(map => {
        const control =  new ol.control.ZoomToExtent({
            extent: [
                14103925.705518028, 4533240.7238401985, 14229588.180018857,
                4473925.589890901,
            ],
        });
        map.addControl(control);
    })
}
//베이스지도, 서브지도에 ZoomToExtent 컨트롤 추가
addZoomToExtentControl(map, subMap)

//방위계 아이콘을 변경하고 컨트롤 객체에 추가한다.
// var span = document.createElement("span");
// span.innerHTML = '<img src="./resources/img/rotate-removebg.png">';
// map.addControl(new ol.control.Rotate({ autoHide: false, label: span }));

//지도에 방위계 컨트롤을 추가하는 함수
function addRotateControl(...maps) {
    maps.forEach(map => {
        const control = new ol.control.Rotate({
            autoHide: false
        });
        map.addControl(control);
    })
}

//지도에서 방위계 컨트롤을 제거하는 함수
function removeRotateControl(...maps) {
    maps.forEach(map => {
        const controls = map.getControls().getArray();
        const rotateControl = controls.find(control => control instanceof ol.control.Rotate);
        if (rotateControl) {
            map.removeControl(rotateControl);
        }
    });
}

//베이스지도, 서브지도에 Rotate 컨트롤 추가
addRotateControl(map, subMap)

//지도에 ol-ext의 printDialog 컨트롤 추가
const printControl = new ol.control.PrintDialog({
    lang: "ko",
    scales: false,
    className: "ol-print",
});
printControl.setSize("A4");
map.addControl(printControl);

//printDialog가 보여질 떄 발생하는 이벤트. 새로운 지도가 표출되기 때문에 기존에 존재하는 이벤트를 전부 제거하고, 새로운 지도에서의 행위가 기존 지도에 영향을 미쳐 기존 지도의 줌, 센터, 회전각 등을 저장함
printControl.on("show", function () {
    extentInteraction.setActive(false);
    map.removeInteraction(dragBox);

    const storageObject = {
        zoomLevel: map.getView().getZoom(),
        centerCoordinate: map.getView().getCenter(),
        rotate: map.getView().getRotation(),
    };
    const objString = JSON.stringify(storageObject);

    window.localStorage.setItem("beforeState", objString);
});

//printDialog가 사라질 떄 발생하는 이벤트. 제거했던 이벤트를 다시 생성하고, 기존 지도의 값을 불러와  줌, 센터, 회전각을 재설정함
printControl.on("hide", function () {
    extentInteraction.setActive(true);
    map.addInteraction(dragBox);
    contextmenu.enable();
    const value = JSON.parse(window.localStorage.getItem("beforeState"));
    map.getView().setCenter(value.centerCoordinate);
    map.getView().setZoom(value.zoomLevel);
    map.getView().setRotation(value.rotate);
    window.localStorage.removeItem("beforeState");
});

//printDialog의 이미지저장, PDF저장 이벤트
printControl.on(["print", "error"], function (e) {
    // Print success
    if (e.image) {
        if (e.pdf) {
            // Export pdf using the print info
            const pdf = new jspdf.jsPDF({
                orientation: e.print.orientation,
                unit: e.print.unit,
                format: e.print.size,
            });
            pdf.addImage(
                e.image,
                "JPEG",
                e.print.position[0],
                e.print.position[0],
                e.print.imageWidth,
                e.print.imageHeight
            );
            pdf.save(e.print.legend ? "legend.pdf" : "map.pdf");
        } else {
            // Save image as file
            e.canvas.toBlob(
                function (blob) {
                    const name =
                        (e.print.legend ? "legend." : "map.") +
                        e.imageType.replace("image/", "");
                    saveAs(blob, name);
                },
                e.imageType,
                e.quality
            );
        }
    } else {
        console.warn("No canvas to export");
    }
});
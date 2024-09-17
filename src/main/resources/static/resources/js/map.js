//지도에 Drag & Drop 인터렉션 추가
addDragAndDropInteraction();

//지도에 DragBox 인터렉션 추가
addDragBoxInteraction();

//지도에 Extent 인터렉션 추가
addExtentInteraction();

//지도에 뒤로가기, 새로고침시 이전 상태를 저장하기 위한 Link 인터렉션 추가
addLinkInteraction(map);
//지도에 cctv cluster레이어의 인터렉션 추가
addCctvInteraction()

//카카오 지오코딩 API 로직 활성화
addKakaoCoordinateToRegionApiEventListener()

//지도 객체의 로딩이 시작되면 실행되는 이벤트
map.on("loadstart", mapLoadStartEventListener);

//지도 객체의 로드가 완료되면 동작하는 이벤트
map.on("loadend", mapLoadEndEventListener);

//지도 클릭 이벤트
map.on("click", mapClickEventListener);

//지도의 이동이 종료되었을 때 발생하는 이벤트.
map.on("moveend", mapMoveEndEventListener);

//지도 위에서 마우스 드래그가 발생할 때 발생하는 이벤트.
map.on("pointerdrag", mapPointDragEventListener);

//Extent 인터렉션 오버레이에 표시할 html을 생성하는 함수
function createExtentInteractionTooltipHtml(width, heght, measure) {

    const tooltipElementClass = "tooltip-info-text-line";
    const tooltipInfoWidth = convertingLength(width);
    //console.log(tooltipInfoWidth)
    const tooltipInfoHeight = convertingLength(heght);
    const tooltipInfoMeasure = convertingMeasure(measure);

    let tooltipInfoWidthText = tooltipInfoWidth[0];
    let tooltipInfoWidthUnit = tooltipInfoWidth[1];

    let tooltipInfoHeightText = tooltipInfoHeight[0];
    let tooltipInfoHeightUnit = tooltipInfoHeight[1];

    let tooltipInfoMeasureText = tooltipInfoMeasure[0];
    let tooltipInfoMeasureUnit = tooltipInfoMeasure[1];
    let text = `<div class="tooltip-content">`;
    text += `<div class="tootip-case">가로 길이 : <span class="${tooltipElementClass}">${tooltipInfoWidthText}</span>${tooltipInfoWidthUnit}</div>`;
    text += `<div class="tootip-case">세로 길이 : <span class="${tooltipElementClass}">${tooltipInfoHeightText}</span>${tooltipInfoHeightUnit}</div>`;
    text += `<div class="tootip-case">면적 : <span class="${tooltipElementClass}">${tooltipInfoMeasureText}</span>${tooltipInfoMeasureUnit}</div>`;
    return text;
}

//길이측정, 면적측정, 반경측정이 그려질 때 오버레이에 표시할 html을 생성하는 함수
function createDrawingAreaTooltipHtml(targetInfo, geom, isDrawing) {
    let tooltipCase = "";
    let tooltipElementClass = "";
    let tooltipInfo = "";
    switch (targetInfo) {
        case "line":
            tooltipCase = "총 길이 : ";
            tooltipElementClass = "tooltip-info-text-line";
            tooltipInfo = formatLength(geom);
            break;
        case "circle":
            tooltipCase = "총 면적 : ";
            tooltipElementClass = "tooltip-info-text-circle";
            tooltipInfo = formatCircleArea(geom);
            break;
        case "polygon":
            tooltipCase = "총 면적 : ";
            tooltipElementClass = "tooltip-info-text-polygon";
            tooltipInfo = formatArea(geom);
            break;
    }
    let tooltipInfoText = tooltipInfo[0];
    let tooltipInfoUnit = tooltipInfo[1];
    let text = `<div class="tooltip-content">`;
    text += `<div class="tootip-case">${tooltipCase}<span class="${tooltipElementClass}">${tooltipInfoText}</span>${tooltipInfoUnit}</div>`;
    if (tooltipInfo[2] != null) {
        text += `<div class="tootip-case">반경 : <span class="${tooltipElementClass}">${tooltipInfo[2]}</span>${tooltipInfo[3]}</div>`;
    }
    if (isDrawing) {
        text +=
            '<div class="tooltip_box"><span class="tooltip_text">마우스 오른쪽 버튼 또는 \'esc\'키를 눌러 마침</span></div>';
    } else {
        text += `<button class="delete-btn">지우기</button></div>`;
    }
    return text;
}

//오버레이의 html을 초기화 하는 함수
function createDrawTooltip(offsetX = 0, offsetY = 0, position = "bottom-center") {
    let element = document.createElement("div");
    element.className = 'tooltip tooltip-measure';
    element.style.zIndex = 1;
    let tooltip = new ol.Overlay({
        element: element,
        offset: [offsetX, offsetY],
        positioning: position
    });
    map.addOverlay(tooltip);
    return {element, tooltip};
}

//체크박스의 중복 체크를 해제하기 위한 함수. 그리기도구의 체크박스가 체크될 때 동작하며, 자신을 제외한 체크박스의 체크를 해제한다.
function uncheckedCheckBox(selectCheckBox) {
    //체크박스에 부여된 클래스 이름으로 체크박스를 순회한다.
    document.querySelectorAll(".measure").forEach(function (e) {
        //이벤트가 트리거된 체크박스가 아닐경우 동작한다
        if (e !== selectCheckBox && e.checked) {
            e.checked = false;
            //체크박스의 onChange 이벤트를 강제로 트리거시킨다.
            const event = new Event("change");
            e.dispatchEvent(event);
        }
    });
}

//그리기 체크박스가 체크될 때 발생하는 이벤트
$('.draw-checkbox').change(handleDrawCheckboxChangeListener);

//키보드 입력이 발생될 때 발생하는 이벤트.
$(window).keydown(keyDownEventListener);

//지도 위치가 이동할 때 발생하는 이벤트.
map.on("pointermove", mapPointMoveEventListener);

//툴팁 overlay 클릭 이벤트.
$(document).on("click", ".tooltip-content", tooltipOverlayClickEventListener);

//측정레이어 삭제 버튼을 클릭했을 때 발생하는 이벤트.
$("#remove-measure").on("click", removeMeasureEventListener);

//내위치 버튼을 클릭했을 때 발생하는 이벤트.
$("#current-position").on("click", currentPositionEventListener);

//북마크 열기 버튼을 클릭했을 때 발생하는 이벤트. 북마크 목록을 표출한다.
$("#olcontrolBookmarkMaximizeDiv").click(function() {
    $("#olControlBookmarkContent").toggle();
    $("#olcontrolBookmarkMaximizeDiv").css("display", "none");
    $("#olcontrolBookmarkMinimizeDiv").css("display", "block");
});

//북마크 닫기 버튼을 클릭했을 때 발생하는 이벤트. 북마크 목록을 숨긴다.
$("#olcontrolBookmarkMinimizeDiv").click(function() {
    $("#olControlBookmarkContent").toggle();
    $("#olcontrolBookmarkMinimizeDiv").css("display", "none");
    $("#olcontrolBookmarkMaximizeDiv").css("display", "block");
});

//북마크 추가 버튼을 클릭했을 때 발생하는 이벤트.
$("#btn-add-bookmark").click(addBookmark);

//북마크의 삭제버튼을 클릭했을 때 발생하는 이벤트.
$("#bookmark-container").on("click", ".olControlBookmarkRemove", removeBookmark);

//북마크 모달창이 열릴 때 발생하는 이벤트. 마우스 오른쪽클릭을 방지한다.
$(document).on("show.bs.modal", ".bookmark-modal", function () {
    $(document).on("contextmenu", function (e) {
        e.preventDefault();
    });
});

//북마크 모달창이 닫힐 때 발생하는 이벤트. 북마크 이름입력 input을 초기화한다.
$(document).on("hidden.bs.modal", ".bookmark-modal", function () {
    document.getElementById("recipient-name").value = "";
    $(document).off("contextmenu");
});

//html 엘리먼트가 로드가 완료되면 실행되는 이벤트. 북마크 로컬스토리지를 조회하여 북마크 엘리먼트에 세팅한다. SGIS의 인증키를 받아온다.
$(document).ready(function () {
    
    //맵에 기본 맵 레이어 추가
    map.addLayer(baseLayer);

    (async () => {
        SgisApiAccessKey = await requestSgisApiAccessKey();
    })();
    
    initBookmarkHtml()
    
    replaceControlTitle();

    //좌측 Collapse 메뉴가 보여질 때 실행되는 이벤트 Collapse 메뉴 토글 버튼의 아이콘을 변경한다.
    $("#sidebar").on("show.bs.collapse", function () {
        $("#sidebar-toggle-button i")
            .removeClass("bi bi-chevron-right")
            .addClass("bi bi-chevron-left");
    });

    //좌측 Collapse 메뉴가 가려질 때 실행되는 이벤트. Collapse 메뉴 토글 버튼의 아이콘을 변경한다.
    $("#sidebar").on("hide.bs.collapse", function () {
        $("#sidebar-toggle-button i")
            .removeClass("bi bi-chevron-left")
            .addClass("bi bi-chevron-right");
    });

    //Collapse 메뉴 토글 버튼 클릭 이벤트. 분리된 상단 사이드바와 하단 사이드바를 같이 토글 시킨다.
    $("#sidebar-toggle-button").on("click", function () {
        $("#bottom-sidebar").collapse("toggle");
        $("#top-sidebar").collapse("toggle");
    });

    //우측 경로탐색 offcanvas 메뉴가 보여질 때 실행되는 이벤트. 토글 버튼의 아이콘을 변경한다.
    $("#offcanvasScrolling").on("show.bs.offcanvas", function () {
        $("#route-result-toggle-button i").removeClass().addClass("bi-x-lg");
        $("#route-result-toggle-button").attr("title", "닫기");
    });

    //우측 경로탐색 offcanvas 메뉴가 가려질 때 실행되는 이벤트. 토글 버튼의 아이콘, title을 경로탐색 셀렉트의 값에 따라 변경한다.
    $("#offcanvasScrolling").on("hide.bs.offcanvas", function () {
        //경로탐색 셀렉트의 밸류 1:차량, 2:도보, 3:자전거
        const selectedValue = $("#route-kind-select").val();
        
        //토글 버튼의 아이콘 클래스 이름과 버튼의 title을 담을 변수.
        const { className, title } = routesKindObject[selectedValue] || {};
        $("#route-result-toggle-button i")
            .removeClass("bi-x-lg")
            .addClass(className);
        $("#route-result-toggle-button").attr("title", title);
    });

    //지도의 기본 레이어를 변경하는 dropdown menu의 아이템이 클릭되었을 때 발생하는 이벤트. 아이템 클릭시 dropdown menu가 닫히는 것을 원치 않아 기본 이벤트를 방지함.
    $(".dropdown-menu").on("click", function (e) {
        e.stopPropagation();
    });

    initializeAddressSelection()
    registerProj4CoordinateSystem()
});

//북마크의 아이템을 클릭했을 때 발생하는 이벤트. 로컬스토리지에서 해당하는 데이터를 가져와 저장했던 줌 레벨, 좌표를 이용해 해당 위치로 이동한다.
$("#bookmark-container").on("click", ".olControlBookmarkLink", function () {
    const index = $(".olControlBookmarkLink").index(this);
    const storageKey = $(".olControlBookmarkLink").eq(index).text();

    const value = JSON.parse(
        window.localStorage.getItem(`bookmark-${storageKey}`)
    );

    map.getView().setCenter([value.x, value.y]);
    map.getView().setZoom(value.zoom);
});

//배경지도 변경 드롭다운 메뉴의 아이템을 클릭했을 때 발생하는 이벤트.
$("ul.dropdown-menu a.dropdown-item").click(basemapDropdownSelectEventListener);

//경로탐색 결과 컨테이너에 마우스가 호버될 때 발생하는 이벤트.
$("#sidenav").on("mouseover", routeResultContainerMouseOverListener);

//경로탐색 결과 컨테이너에 마우스가 호버 해제될 때 발생하는 이벤트.
$("#sidenav").on("mouseout", routeResultContainerMouseOutListener);

//경로탐색 결과 컨테이너를 클릭할 때 발생하는 이벤트
$("#sidenav").click(routeResultContainerClickListener);

//경로탐색 셀렉트박스의 값이 변경될 때 발생하는 이벤트.
$("#route-kind-select").on("change", routeKindSelectChangeListener);

// document.getElementById('mountaion-fire-map-checkbox').addEventListener('change', function() {
//     if (this.checked) {
//         if(mountaionFireMapLayer){
//             map.removeLayer(mountaionFireMapLayer)
//             mountaionFireMapLayer = null;
//         }
//         mountaionFireMapLayer = requestWmsLayer(MOUNTAIN_FIRE_MAP_LAYER_ID)
//     }else{
//         if(mountaionFireMapLayer){
//             map.removeLayer(mountaionFireMapLayer)
//             mountaionFireMapLayer = null;
//         }
//     }
// })

// document.getElementById('firestation-jurisdiction-checkbox').addEventListener('change', function() {
//     if (this.checked) {
//         if(firestationJurisdictionLayer){
//             map.removeLayer(firestationJurisdictionLayer)
//             firestationJurisdictionLayer = null;
//         }
//         firestationJurisdictionLayer = requestWmsLayer(FIRESTATION_JURISDICTION)
//     }else{
//         if(firestationJurisdictionLayer){
//             map.removeLayer(firestationJurisdictionLayer)
//             firestationJurisdictionLayer = null;
//         }
//     }
// })

// document.getElementById('disaster-danger-checkbox').addEventListener('change', function() {
//     if (this.checked) {
//         if(disasterDangerLayer){
//             map.removeLayer(disasterDangerLayer)
//             disasterDangerLayer = null;
//         }
//         disasterDangerLayer = requestWmsLayer(DISASTER_DANGER_LAYER_ID)
//     }else{
//         if(disasterDangerLayer){
//             map.removeLayer(disasterDangerLayer)
//             disasterDangerLayer = null;
//         }
//     }
// })

// //오버뷰 맵이 클릭되었을 때 발생하는 이벤트
// $(".ol-overviewmap button").click(function () {
//     setTimeout(function () {
//         const isCollapsed = overviewMapControl.getCollapsed();
//         localStorage.setItem("overviewMapCollapsed", isCollapsed);
//     }, 0);
// });

//스와이프레이어 선택 셀렉트 변경시 발생 이벤트. 
$("#mapLayerSelect").on("change", swipeLayerChnageListener)

//스와이프레이어 range 변경시 발생 이벤트.
swipe.addEventListener("input", swipeRangeInputListener)

//좌표계 셀렉트 변경 이벤트.
$(".coordinate-system-selector").change(coordinateSystemSelectChangeListener).data("prevValue", $(".coordinate-system-selector").val());

//좌표계 셀렉트 변경시 동작하는 리스너. 클릭 팝업, context-menu, 중앙 좌표 등 좌표값을 좌표계 값에 따라 변경함.
function coordinateSystemSelectChangeListener(){
    const prevValue = $(this).data("prevValue");
    const selectedValue = $(this).val();

    if (contextmenu.isOpen()) {
        let li = $(".ol-coordinate");
        let htmlContent = li.html();
        let htmlLines = htmlContent.split("<br>");
        let address = htmlLines[2];
        let newCoordinates = ol.proj.transform(
            [parseFloat(htmlLines[0]), parseFloat(htmlLines[1])],
            prevValue,
            selectedValue
        );
        htmlLines[0] = `${newCoordinates[0]},`;
        htmlLines[1] = newCoordinates[1];
        htmlLines[2] = address;
        li.html(htmlLines.join("<br>"));
    }

    if ($(".popup-coordinate").length) {
        let htmlLines = $(".popup-coordinate").text().split(",");
        let newCoordinates = ol.proj.transform(
            [parseFloat(htmlLines[0]), parseFloat(htmlLines[1])],
            prevValue,
            selectedValue
        );
        $(".popup-coordinate").text(newCoordinates);
    }

    let coordinateValue = $("#coordinate").text().split(",");
    const coordinate = formatCoordinate([parseFloat(coordinateValue[0]), parseFloat(coordinateValue[1])], prevValue, selectedValue);
    info.innerHTML = coordinate
    $("#first-coordinate").val(coordinate.split(",")[0])
    $("#second-coordinate").val(coordinate.split(",")[1])

    $(this).data("prevValue", selectedValue);
}

//특정 피쳐를 삭제하는 함수
function removeSearchFeatures(source, attribute) {
    const features = source.getFeatures();
    features
        .filter((feature) => feature.get("attribute") === attribute)
        .forEach((feature) => source.removeFeature(feature));
}

//장소검색 결과 html 리터럴을 분리한 함수
function createPlaceItem(item, searchQuery) {
    return `
        <tr class="address-table-first-child"></tr>
        <tr>
            <td scope="row" colspan="3" class="address-name">
                <span class="address-name-span">${addHighlight(item.title, searchQuery)}</span>
            </td>
        </tr>
        <tr>
            <td scope="row" colspan="3" class="address-category">
                <span>${addHighlight(item.category, searchQuery)}</span>
            </td>
        </tr>
        <tr style="cursor:pointer" onclick="clickAddress(event, '${item.title}', 'place')">
            <td scope="row" colspan="3" class="address-parcel">
                <div class="badge bg-warning text-wrap" style="width: 3rem;">지번</div>
                <span data-coord="${item.point.x}, ${item.point.y}">${addHighlight(item.address.parcel, searchQuery)}</span>
            </td>
        </tr>
        <tr style="cursor:pointer" onclick="clickAddress(event, '${item.title}', 'place')">
            <td scope="row" colspan="3" class="address-road">
                <div class="badge bg-primary text-wrap" style="width: 3rem;">도로명</div>
                <span data-coord="${item.point.x}, ${item.point.y}">${addHighlight(item.address.road, searchQuery)}</span>
            </td>
        </tr>
        <tr class="address-table-last-child"></tr>
    `;
}

//주소검색 결과 html 리터럴을 분리한 함수
function createAddressItem(item, searchQuery) {
    return `
        <tr class="address-table-first-child"></tr>
        <tr style="cursor:pointer" onclick="clickAddress(event, '${item.address.road}', 'address')">
            <td scope="row" colspan="3" class="address-name">
                <span class="address-name-span" data-coord="${item.point.x}, ${item.point.y}">(${item.address.zipcode}) ${addHighlight(item.address.road, searchQuery)}</span>
            </td>
        </tr>
        <tr class="address-table-last-child-md"></tr>
    `;
}

//행정구역 결과 html 리터럴을 분리한 함수
function createDistrictItem(item, searchQuery) {
    return `
        <tr class="address-table-first-child"></tr>
        <tr onclick="clickGeoData(event, 'district')" style="cursor:pointer">
            <td scope="row" colspan="3" class="address-name">
                <span class="address-name-span" data-district-code="${item.id}" data-geo-url="${item.geometry}" data-coord="${item.point.x}, ${item.point.y}">(${item.id}) ${addHighlight(item.title, searchQuery)}</span>
            </td>
        </tr>
        <tr class="address-table-last-child-md"></tr>
    `;
}

//도로명 결과 html 리터럴을 분리한 함수
function createRoadItem(item, searchQuery) {
    return `
        <tr class="address-table-first-child"></tr>
        <tr onclick="clickGeoData(event, 'road')" style="cursor:pointer">
            <td scope="row" colspan="3" class="address-name">
                <span class="address-name-span" title="${item.district}" data-geo-url="${item.geometry}">(${item.id}) ${addHighlight(item.title, searchQuery)}</span>
            </td>
        </tr>
        <tr class="address-table-last-child-md"></tr>
    `;
}

//특정 엘리먼트에 장소검색 결과를 동적으로 생성하는 함수
function addPlace(elementId, response, searchQuery, pagenation = 3) {
    const source = objectControllVectorLayer.getSource();
    removeSearchFeatures(source, "place");

    $(`#${elementId}`).empty();
    let htmlContent = "";

    if (elementId.includes("all")) {
        htmlContent += `
            <thead>
                <tr>
                    <td scope="col">장소</td>
                    <td scope="col" class="text-danger search-place-count">${parseInt(response.response.record.total).toLocaleString("ko-KR")}건</td>
                    <td>
                        <a href="#" class="link-secondary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover place-more-view">
                            <span>더보기</span>
                            <i class="bi bi-chevron-right"></i>
                        </a>
                    </td>
                </tr>
            </thead>
        `;
    }

    if (response.response.result && response.response.result.items.length > 0) {
        const items = response.response.result.items;
        const maxLength = Math.min(items.length, pagenation);
        htmlContent += "<tbody>";

        for (let i = 0; i < maxLength; i++) {
            if (!elementId.includes("all") && $("#place-tab").hasClass("active")) {
                addMarker([items[i].point.x, items[i].point.y], items[i].title, "place", "search");
            }

            htmlContent += createPlaceItem(items[i], searchQuery);
        }

        htmlContent += "</tbody>";
    }

    $(`#${elementId}`).append(htmlContent);
}

//특정 엘리먼트에 주소검색 결과를 동적으로 생성하는 함수
function addAddress(elementId, response, searchQuery, pagenation = 3) {
    const source = objectControllVectorLayer.getSource();
    removeSearchFeatures(source, "address");

    $(`#${elementId}`).empty();
    let htmlContent = "";

    if (elementId.includes("all")) {
        htmlContent += `
            <thead>
                <tr>
                    <td scope="col">주소</td>
                    <td scope="col" class="text-danger search-address-count">${parseInt(
                        response.response.record.total
                    ).toLocaleString("ko-KR")}건</td>
                    <td>
                        <a href="#" class="link-secondary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover address-more-view">
                            <span>더보기</span>
                            <i class="bi bi-chevron-right"></i>
                        </a>
                    </td>
                </tr>
            </thead>
        `;
    }
    if (response.response.result && response.response.result.items.length > 0) {
        const items = response.response.result.items;
        const maxLength = Math.min(items.length, pagenation);
        htmlContent += "<tbody>";

        for (let i = 0; i < maxLength; i++) {
            if (!elementId.includes("all") && $("#address-tab").hasClass("active")) {
                addMarker([items[i].point.x, items[i].point.y], items[i].address.road, "address", "search");
            }

            htmlContent += createAddressItem(items[i], searchQuery);
        }

        htmlContent += "</tbody>";
    }

    $(`#${elementId}`).append(htmlContent);
}

//특정 엘리먼트에 행정구역 검색 결과를 동적으로 생성하는 함수
function addDistrict(elementId, response, searchQuery, pagenation = 3) {
    $(`#${elementId}`).empty();
    let htmlContent = "";

    if (elementId.includes("all")) {
        htmlContent += `
            <thead>
                <tr>
                    <td scope="col">행정구역</th>
                    <td scope="col" class="text-danger search-district-count">${parseInt(response.response.record.total).toLocaleString("ko-KR")}건</td>
                    <td>
                        <a href="#" class="link-secondary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover district-more-view">
                            <span>더보기</span>
                            <i class="bi bi-chevron-right"></i>
                        </a>
                    </td>
                </tr>
            </thead>
        `;
    }

    if (response.response.result && response.response.result.items.length > 0) {
        const items = response.response.result.items;
        const maxLength = Math.min(items.length, pagenation);
        htmlContent += "<tbody>";

        for (let i = 0; i < maxLength; i++) {
            htmlContent += createDistrictItem(items[i], searchQuery);
        }

        htmlContent += "</tbody>";
    }

    $(`#${elementId}`).append(htmlContent);
}

//특정 엘리먼트에 도로명 검색 결과를 동적으로 생성하는 함수
function addRoad(elementId, response, searchQuery, pagenation = 3) {
    $(`#${elementId}`).empty();
    let htmlContent = "";

    if (elementId.includes("all")) {
        htmlContent += `
            <thead>
                <tr>
                    <td scope="col">도로명</th>
                    <td scope="col" class="text-danger search-road-count">${parseInt(response.response.record.total).toLocaleString("ko-KR")}건</th>
                    <td>
                        <a href="#" class="link-secondary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover road-more-view">
                            <span>더보기</span>
                            <i class="bi bi-chevron-right"></i>
                        </a>
                    </td>
                </tr>
            </thead>
        `;
    }

    if (response.response.result && response.response.result.items.length > 0) {
        const items = response.response.result.items;
        const maxLength = Math.min(items.length, pagenation);
        htmlContent += "<tbody>";

        for (let i = 0; i < maxLength; i++) {
            htmlContent += createRoadItem(items[i], searchQuery);
        }

        htmlContent += "</tbody>";
    }

    $(`#${elementId}`).append(htmlContent);
}

//장소검색, 주소검색시 생성한 엘리먼트를 클릭할 시 해당 위치에 마커, feature, overlay를 생성하고 지도 중앙을 이동하는 함수
function clickAddress(event, category, attribute) {
    const target = event.target;

    const source = objectControllVectorLayer.getSource();
    const features = source.getFeatures();
    for (let i = 0; i < features.length; i++) {
        const feature = features[i];
        if (feature.get("type") == "click") {
            source.removeFeature(feature);
        }
    }

    // 클릭한 요소가 <span>인지 확인합니다.
    if (target.tagName.toLowerCase() === "span" || "mark") {
        // data-coord 속성의 값을 가져옵니다.
        console.log($(target).text());
        const coords =
            target.tagName.toLowerCase() === "mark"
                ? $(target).parent().data("coord")
                : target.getAttribute("data-coord");
        if (!coords) {
            return;
        }
        const coordinates = coords.split(", ");

        const coordinate = [
            parseFloat(coordinates[0]),
            parseFloat(coordinates[1]),
        ];
        addMarker(coordinate, category, attribute, "click");
        map.getView().setCenter(coordinate);
        if (map.getView().getZoom() < 14) {
            map.getView().setZoom(14);
        }

        if (clickCurrentLayer) {
            map.removeLayer(clickCurrentLayer);
        }

        if (clickCurrentOverlay) {
            map.removeOverlay(clickCurrentOverlay);
        }

        requestDataLayer("LP_PA_CBND_BUBUN", coordinates)
    }
}

//TODO 추후 추가 예정, 행정구역, 도로명 검색결과는 feature를 요청하는 API url이기 떄문에 서버 생성 이후 이어서 개발
function clickGeoData(event, type) {
    const target = event.target;

    // 클릭한 요소가 <span>인지 확인합니다.
    if (target.tagName.toLowerCase() === "span" || "mark") {
        //         var format = new ol.format.WKT();
        //         var feature5181 = format.readFeature("MULTIPOLYGON(((1107777.5945 1780522.2654,1107849.3517 1780256.7622,1108232.4563 1780033.8702,1108382.8717 1779974.9638,1108540.391 1779921.9983,1108722.1813 1779887.8993,1108798.5895 1779884.818,1109227.5084 1779819.8033,1109576.4159 1779760.0072,1110028.2352 1779602.742,1110068.7179 1779567.3681,1110097.4039 1779519.0238,1110189.4324 1779504.7103,1110526.3051 1779234.0037,1110573.7195 1779187.4256,1110659.5115 1779077.4544,1110732.9381 1778911.1059,1110898.7123 1778609.6045,1111031.922 1778560.7622,1111047.2583 1778545.3174,1111100.1549 1778492.045,1111209.8561 1778329.9151,1111225.8697 1778290.3849,1111246.102 1778240.4297,1111293.0519 1778070.2227,1111307.1948 1778057.1263,1111245.76 1777928.8221,1111157.8862 1777803.6529,1111153.1196 1777800.4682,1111147.773 1777796.8955,1111059.544 1777737.9339,1111043.1754 1777706.017,1111017.9914 1777656.8854,1110984.1032 1777449.0146,1110967.9216 1777210.289,1111084.2938 1777033.3263,1111131.9569 1776994.3552,1111147.5926 1776981.5709,1111171.134 1776962.3236,1111371.3798 1776866.1929,1111422.0293 1776816.5069,1111490.3129 1776749.5221,1111522.5799 1776649.1294,1111545.3786 1776530.1412,1111614.8472 1776348.1026,1111687.5969 1776270.1799,1111821.5956 1776161.9585,1111933.2332 1776102.9199,1112074.6886 1776060.376,1112135.1732 1776039.2653,1112278.6782 1775969.9747,1112324.4805 1775911.7409,1112347.884 1775864.741,1112359.1978 1775842.0062,1112291.0357 1775436.2331,1112191.9351 1775137.2767,1112114.4671 1774695.1626,1112087.528 1774404.8324,1112080.1162 1774390.7844,1112069.6771 1774371.0055,1112042.0405 1774329.0749,1111988.4749 1774280.0941,1111922.9558 1774253.6386,1111920.3399 1774252.5823,1111847.9661 1774202.2924,1111722.6342 1774099.7396,1111693.1273 1774052.3841,1111673.5952 1774019.564,1111666.8536 1774008.23,1111646.0923 1773973.2933,1111639.1905 1773955.1508,1111654.3034 1773943.9366,1111746.9486 1773875.1924,1111807.7093 1773830.107,1111887.3575 1773665.6329,1112052.0219 1773256.7621,1112039.9416 1773197.1066,1112037.2842 1773056.0095,1112172.7494 1772739.582,1112181.844 1772712.4946,1112208.621 1772632.7381,1112204.2682 1772612.3169,1112185.3896 1772523.7597,1111930.6613 1772097.324,1111826.1894 1771908.3352,1111923.3368 1771842.2487,1111762.7555 1771607.2283,1111694.1922 1771417.9325,1111716.4868 1771202.8417,1111709.24 1771135.4147,1111652.8534 1771029.2915,1111563.3638 1771028.7854,1111649.9931 1770866.6764,1111749.8875 1770740.4528,1111767.5471 1770718.4054,1111806.7421 1770675.1354,1111874.4395 1770598.6744,1111969.6837 1770405.792,1112101.4057 1770132.799,1112102.3835 1770128.5777,1112111.1205 1770090.2724,1112128.7525 1770005.3018,1112237.9275 1769906.974,1112380.3239 1769822.3556,1112643.0999 1769745.1478,1112678.8231 1769700.9276,1112859.5021 1769626.795,1112874.1303 1769626.2962,1112900.0319 1769625.4132,1112979.1107 1769622.7038,1113217.9849 1769466.4588,1113221.7313 1769463.6472,1113247.5155 1769444.2874,1113256.2509 1769437.7274,1113260.9559 1769434.1884,1113361.9025 1769280.2932,1113412.3187 1769178.5822,1113457.1717 1769075.9418,1113620.9277 1768695.0416,1113679.1876 1768532.9876,1113634.8627 1768508.9696,1113510.5883 1768441.6296,1113431.5331 1768341.0784,1113405.5613 1768289.1086,1113401.3922 1768254.152,1113395.9681 1768208.6702,1113390.9751 1768166.75,1113449.9805 1767677.5292,1113481.7477 1767440.1296,1113517.0861 1767253.45,1113739.6123 1766761.766,1113844.9859 1766392.6742,1113820.3161 1765947.5382,1113791.6075 1765837.237,1113743.2383 1765718.666,1113631.5087 1765487.0424,1113511.7249 1765332.661,1113580.7829 1765125.714,1113837.4561 1764978.096,1113842.7201 1764974.138,1113843.239 1764973.4838,1113847.3691 1764968.2756,1113856.6685 1764937.6044,1113853.9109 1764928.034,1113849.1039 1764917.5246,1113700.1525 1764597.9576,1113692.5797 1764583.7592,1113687.8297 1764576.2512,1113684.8709 1764571.6442,1113644.5653 1764513.5682,1113635.1037 1764501.7794,1113629.1471 1764497.2494,1113590.8803 1764471.5842,1113738.006 1764090.6761,1113737.8619 1764078.7726,1113737.3047 1764037.4486,1113736.9183 1764012.022,1113689.0679 1763974.352,1113649.0325 1763950.6316,1113607.1179 1763925.7982,1113572.1571 1763905.9686,1113552.0509 1763894.5648,1113536.2071 1763884.9316,1113519.9105 1763875.0148,1113467.4269 1763842.9626,1113440.7657 1763826.6698,1113430.2147 1763820.0862,1113427.8521 1763818.6086,1113390.2852 1763794.8802,1113338.6609 1763752.356,1113316.4073 1763729.5342,1113314.1715 1763726.253,1113311.6163 1763722.4796,1113293.2015 1763694.3076,1113141.6395 1763439.2818,1113093.7103 1763356.1024,1113064.2287 1763289.1956,1112943.6907 1763066.8372,1112932.5557 1763051.3714,1112917.0853 1763043.33,1112655.9067 1762937.5322,1112491.0115 1762873.189,1112459.6955 1762862.9166,1112439.9205 1762849.806,1112431.8951 1762843.9756,1112074.7251 1762527.5628,1111984.8577 1762442.6278,1111900.5637 1762386.8706,1111875.5209 1762370.5924,1111848.5836 1762353.0872,1111841.5319 1762348.5048,1111772.1055 1762337.1154,1111752.1841 1762333.85,1111740.6939 1762331.971,1111721.2467 1762334.2516,1111701.2359 1762336.5986,1111634.7499 1762344.4052,1111520.5169 1762360.3856,1111467.1999 1762396.7008,1111414.4155 1762433.5496,1111406.8527 1762438.8294,1111400.5491 1762443.241,1111379.2449 1762458.1538,1111238.2746 1762594.953,1111031.3423 1762757.3164,1110753.9799 1762951.4198,1110660.9253 1763046.8073,1110616.2262 1763056.413,1110588.107 1763069.4766,1110548.0372 1763075.6141,1110529.4638 1763073.612,1110431.0172 1763059.6889,1110425.6616 1763056.905,1110325.797 1762956.1885,1110406.501 1762790.4987,1110495.0085 1762739.2871,1110535.3309 1762722.0026,1110557.7438 1762702.0209,1110650.7123 1762612.5258,1110652.9618 1762607.5285,1110652.742 1762606.3277,1110651.5502 1762599.8198,1110672.9509 1762289.7213,1110758.9673 1761969.5751,1110790.5974 1761881.9924,1110800.0347 1761803.1905,1110783.5136 1761589.0778,1110781.5896 1761573.1117,1110745.8128 1761359.9041,1110700.8401 1761296.9371,1110575.4889 1761102.5423,1110550.2541 1761016.7015,1110549.7952 1760908.5442,1110551.2246 1760900.9313,1110554.5887 1760893.4204,1110565.7549 1760871.6074,1110577.7047 1760853.9079,1110589.6545 1760836.2085,1110597.4887 1760822.7837,1110654.4034 1760693.1739,1110652.2739 1760683.4745,1110651.5129 1760680.0085,1110644.1331 1760653.8728,1110638.0259 1760636.4216,1110563.2458 1760593.8019,1110367.4146 1760491.0149,1110360.8906 1760488.8353,1110350.1149 1760485.2353,1110342.1723 1760485.7537,1110340.6286 1760485.8553,1110327.689 1760508.5027,1110318.8363 1760526.8863,1110285.4702 1760589.8299,1110277.4007 1760596.3417,1110275.8873 1760597.5623,1110272.8283 1760599.7354,1110269.8574 1760601.8456,1110223.2229 1760632.9833,1110205.8327 1760634.2743,1110164.7065 1760636.7577,1110112.4884 1760613.766,1110009.4799 1760505.0462,1109781.9843 1760312.5408,1109720.2723 1760261.7255,1109437.9587 1759940.0025,1109407.3586 1759904.1655,1109373.6891 1759855.7805,1109357.1702 1759831.8305,1109326.3908 1759779.9531,1109325.6816 1759773.3573,1109324.8558 1759765.6237,1109323.4872 1759752.6405,1109322.7531 1759745.6745,1109276.2919 1759711.2147,1109196.186 1759609.2252,1109172.1934 1759571.6178,1109171.1514 1759550.9773,1109170.5436 1759217.0667,1109175.2456 1759189.7754,1109179.9476 1759162.4851,1109217.6116 1759020.8707,1109253.2793 1758980.4393,1109266.242 1758965.7454,1109366.5418 1758893.9925,1109498.1321 1758778.5552,1109596.7491 1758652.5744,1109631.2225 1758608.0793,1109658.714 1758572.5834,1109678.2087 1758499.9292,1109682.3919 1758424.6371,1109683.0389 1758336.5964,1109684.87 1758328.2198,1109752.5785 1758035.8962,1109846.5575 1757669.6102,1109914.0107 1757601.6864,1110001.833 1757394.1419,1109941.4533 1757370.8598,1109347.7363 1757102.4036,1109340.3781 1757097.3386,1109128.4333 1756903.2424,1109126.9157 1756900.2976,1109123.0267 1756889.0526,1108972.9733 1756614.793,1108919.1113 1756597.1574,1108778.8513 1756543.1394,1108754.0953 1756525.3144,1108667.4725 1756462.9436,1108662.6929 1756458.8091,1108489.0469 1756277.4706,1108487.2069 1756274.1776,1108477.1257 1756256.135,1108469.4145 1756241.4566,1108464.6843 1756197.4218,1108464.1301 1756143.8904,1108461.9725 1756109.3316,1108455.5377 1756100.0468,1108417.5221 1756065.7662,1108207.2183 1755985.8038,1108122.0829 1756009.7452,1108031.8707 1756088.6936,1107978.3241 1756164.6104,1107941.2869 1756251.9982,1107827.6249 1756251.5058,1107769.5339 1756227.4464,1107643.8879 1756127.129,1107630.0045 1756092.1407,1107623.8985 1756056.3342,1107619.1697 1755986.5424,1107613.0179 1755961.0256,1107573.5659 1755874.7002,1107553.3779 1755842.3176,1107513.2753 1755800.5064,1107465.6665 1755784.735,1107382.5845 1755757.2124,1107356.5249 1755749.1263,1107288.8703 1755746.6675,1106861.0293 1755503.2098,1106860.1726 1755501.2783,1106766.6329 1755026.8264,1106767.1267 1754933.4066,1106773.8007 1754881.348,1106783.5109 1754816.0572,1106808.2459 1754726.0868,1106811.2457 1754717.076,1106915.2501 1754488.3982,1107005.1207 1754331.3004,1107095.4011 1754184.717,1107147.1234 1754164.274,1107168.6877 1754160.954,1107194.0171 1754164.3296,1107234.7955 1754095.5724,1107285.1185 1753905.7036,1107304.9303 1753697.6566,1107294.6281 1753627.9456,1107293.2493 1753620.3796,1107286.2797 1753590.4654,1107240.989 1753485.5978,1107209.8765 1753408.2072,1107214.6131 1753244.7686,1107236.6909 1753130.9896,1107246.5283 1753109.2018,1107281.5225 1753079.0676,1107301.1291 1753065.1872,1107301.5847 1753065.723,1107306.7811 1753071.0688,1107442.4949 1753055.7386,1107481.4107 1753008.1594,1107513.9753 1752957.7932,1107690.7081 1752644.8676,1107702.6645 1752606.8676,1107705.7159 1752537.2452,1107707.0341 1752507.168,1107707.8329 1752472.9176,1107812.1783 1752089.8214,1107868.9857 1752047.3682,1107960.6349 1751966.0116,1108016.4205 1751898.0358,1108035.2173 1751870.7038,1108054.3379 1751826.2116,1108080.0645 1751701.144,1108043.7851 1751653.0316,1108013.9243 1751627.9832,1108008.9317 1751609.7374,1107978.4667 1751469.7354,1107975.9275 1751268.2286,1107968.5109 1751123.7104,1107961.5267 1751053.4062,1107935.1705 1750979.0532,1107921.2753 1750948.0012,1107890.9107 1750927.5764,1107850.9845 1750901.3304,1107843.9963 1750896.7366,1107816.6929 1750695.3976,1107844.8427 1750558.121,1107931.0698 1750358.273,1107792.6486 1750205.2756,1107616.2191 1750026.8458,1107540.2778 1749969.708,1107526.5361 1749922.865,1107524.5395 1749738.8971,1107634.5281 1749617.6719,1107736.0222 1749524.2803,1107787.6976 1749429.9381,1107795.205 1749204.0191,1107722.2751 1748990.1557,1107704.7593 1748939.4967,1107668.3807 1748892.7511,1107632.9991 1748857.6697,1107429.2347 1748684.4729,1107249.4687 1748578.4695,1107170.3403 1748510.3183,1107004.0176 1748341.9,1106999.3727 1748312.3573,1107002.5736 1748247.8345,1107018.4001 1748080.9143,1107033.9744 1748024.7965,1107043.2802 1747986.2229,1107044.7178 1747974.6697,1107044.128 1747921.9231,1107018.7792 1747884.6069,1106689.1537 1747822.9671,1106682.0796 1747823.4688,1106570.4488 1747831.3879,1106536.3777 1747840.7091,1106282.1978 1747848.9427,1106125.3029 1747823.8105,1105982.5584 1747769.1398,1105975.9521 1747754.0082,1105912.0684 1747594.8935,1105910.5445 1747591.0974,1105909.0193 1747587.2988,1105885.6364 1747583.4766,1105489.5113 1747623.7037,1105236.7266 1747757.6963,1104940.239 1747633.5264,1104614.8559 1747457.155,1104527.7882 1747292.6169,1104508.226 1747244.3537,1104481.8127 1747167.9291,1104387.0827 1747067.7863,1104334.4442 1747012.1401,1103778.2864 1746740.9277,1103735.6654 1746525.9732,1103732.2682 1746508.8387,1103686.8434 1746371.8081,1103442.5079 1746238.4555,1103151.6389 1746146.8479,1102969.4529 1746099.0859,1102867.1997 1746097.2958,1102830.9497 1746133.9789,1102678.6927 1746154.983,1102305.8017 1746202.5459,1102267.4918 1746188.7762,1101925.4319 1745967.8096,1101728.593 1745814.6003,1101684.6906 1745696.7054,1101302.1351 1745753.7173,1101301.0745 1745937.6914,1101203.3226 1746015.948,1101160.4514 1746044.0402,1101088.0031 1746103.4743,1100763.1221 1746523.0779,1100756.0903 1746558.0511,1100754.6075 1746910.7113,1100760.8471 1747003.7382,1100787.0992 1747042.2881,1100790.4555 1747047.2165,1100816.9608 1747071.8217,1100857.8748 1747109.8028,1100910.4988 1747158.6545,1101003.7431 1747250.9309,1101022.8758 1747299.741,1101025.5445 1747390.7007,1100954.3901 1747605.0216,1100922.7773 1747670.4063,1100869.0352 1747747.488,1100760.508 1747884.4685,1100637.567 1747924.9787,1100633.3063 1747926.3822,1100384.0783 1748186.608,1100382.3259 1748222.5236,1100381.6439 1748236.5038,1100397.7059 1748335.1038,1100558.163 1748536.412,1100627.7967 1748606.8124,1100727.8318 1748666.2557,1100795.3614 1748717.2293,1100829.2615 1748795.4162,1100822.6507 1748830.7662,1100816.3531 1748864.4412,1100795.2786 1748905.5613,1100763.5903 1748951.9289,1100719.1819 1749028.8354,1100750.9376 1749195.7196,1100726.7701 1749523.2681,1100613.883 1749674.5044,1100601.5391 1749691.0414,1100593.048 1749702.4167,1100299.6219 1749742.9049,1100297.6872 1749743.0046,1100290.7064 1749743.3642,1100146.1137 1749750.544,1100023.6044 1749647.5099,1099933.2243 1749587.649,1099714.0191 1749493.534,1099562.1507 1749480.2143,1099424.9002 1749473.7724,1099274.1213 1749496.4825,1099074.2896 1749540.2749,1099035.9003 1749539.9652,1098949.9164 1749523.7638,1098913.4014 1749447.7848,1098940.0143 1749353.9286,1098767.1152 1749031.5234,1098693.4702 1748986.1593,1098536.8417 1748901.1454,1098523.0079 1748910.1775,1098494.9903 1748928.4706,1098130.3323 1749233.9859,1098091.7187 1749313.6557,1098083.7332 1749330.1955,1098022.0518 1749437.5049,1097952.0551 1749548.9203,1097878.6841 1749651.4728,1097706.4696 1749686.5314,1097342.0691 1749476.123,1097103.3943 1749334.5848,1096916.8349 1749223.756,1096836.5771 1749218.4021,1096579.5639 1749332.1025,1096546.6803 1749396.1147,1096454.2787 1749481.9595,1096284.6194 1749459.7604,1096202.2757 1749390.0461,1096175.5567 1749360.2118,1096158.2824 1749278.5332,1096129.6473 1749135.5256,1095999.1141 1748776.4241,1095951.2347 1748674.2311,1095834.5594 1748582.9838,1095590.1855 1748447.2718,1095536.4951 1748426.558,1095390.7784 1748420.6406,1095226.954 1748328.0465,1095172.365 1748293.1397,1094744.106 1747967.0574,1094659.6255 1747884.3517,1094557.6943 1747703.3879,1094434.8263 1747517.6675,1094377.6364 1747500.0408,1094310.9896 1747480.1258,1094241.5055 1747463.261,1093915.7011 1747353.157,1093463.6226 1747178.2842,1092979.035 1746759.8284,1092992.1784 1746735.689,1093036.9815 1746653.4029,1093055.9699 1746619.8514,1093080.0391 1746597.7779,1093111.1439 1746569.2519,1093168.0698 1746491.327,1093174.4745 1746482.5596,1093223.18 1746391.8074,1093277.3998 1746189.1727,1093488.6064 1745780.976,1093531.2127 1745713.97,1093419.4233 1745430.0635,1093355.9802 1744975.1338,1093570.0987 1744777.7369,1093660.566 1744689.6578,1093537.4932 1744409.2449,1093446.478 1744253.142,1093316.9326 1744003.4546,1093323.5037 1743858.5775,1093329.0357 1743736.6102,1093332.2238 1743716.128,1093354.7304 1743571.5351,1093365.5713 1743501.8886,1093189.6811 1743464.6808,1093015.2467 1743478.3589,1092678.2333 1743327.0122,1092463.0499 1743223.4543,1092136.3155 1743055.7725,1091957.4801 1742806.6081,1091955.0513 1742778.298,1091836.5751 1742607.7054,1091710.5622 1742567.3614,1091496.7295 1742517.0909,1091361.642 1742523.8893,1091353.4631 1742524.8542,1091292.0287 1742482.6109,1091247.2303 1742426.605,1091209.7688 1742368.0896,1091183.2735 1742317.1263,1091180.5955 1742300.8998,1091172.7267 1742252.9496,1091191.4623 1742203.4103,1091207.3061 1742161.5175,1091261.3059 1742084.0453,1091305.4019 1742021.1762,1091315.4751 1742006.8145,1091321.9897 1741976.4505,1091334.8691 1741894.8617,1091336.2873 1741497.5111,1091264.0191 1741357.1355,1091236.7579 1741304.1827,1091245.966 1741114.4255,1091235.6099 1740723.8535,1091223.1571 1740632.5365,1091168.3329 1740380.1621,1091142.7484 1740026.9427,1091142.3856 1739816.0629,1091142.3546 1739797.6643,1091248.341 1739720.0075,1091275.8113 1739699.8798,1091355.4233 1739593.0108,1091490.13 1739404.3594,1091496.2382 1739379.7869,1091500.2411 1739307.0754,1091497.3736 1739268.7135,1091428.5583 1739008.2981,1091422.9082 1738999.8026,1091386.7799 1738952.4057,1091280.5348 1738822.8773,1091194.3439 1738722.1929,1091102.0799 1738622.3947,1091054.7837 1738590.3231,1091004.2915 1738567.9967,1090976.9761 1738556.7399,1090882.2239 1738534.2463,1090787.0201 1738528.2895,1090735.5825 1738530.8713,1090594.2766 1738550.6497,1090504.1087 1738558.2499,1090148.1325 1738554.9483,1090140.0755 1738546.0833,1090127.6549 1738523.7843,1089781.4219 1738334.6679,1089474.6325 1738203.5217,1089005.0224 1738099.8969,1088976.9869 1738094.3699,1088941.3517 1738093.8489,1088928.1389 1738096.7723,1088903.8519 1738104.9167,1088852.7209 1738123.6527,1088819.8931 1738226.7137,1088791.9967 1738330.9157,1088791.6167 1738363.2009,1088791.5033 1738373.7677,1088789.6187 1738421.1027,1088780.8979 1738501.1569,1088777.0611 1738531.9745,1088737.0773 1738616.7901,1088681.7783 1738667.881,1088677.0058 1738672.2903,1088628.2317 1738690.3474,1088589.2398 1738704.7827,1088477.1689 1738702.4693,1088453.4767 1738697.0537,1088407.3837 1738680.3043,1088380.7373 1738667.0441,1088332.4497 1738614.4194,1088318.7532 1738599.1524,1088216.7609 1738485.4667,1087920.7902 1738282.2722,1087887.0062 1738263.7744,1087775.2928 1738263.2664,1087485.965 1738274.1018,1087438.4842 1738304.9599,1087409.7109 1738323.867,1087213.8538 1738457.4376,1087172.8912 1738487.1472,1086945.9574 1738694.7027,1086938.1769 1738693.7056,1086899.7354 1738684.8844,1086874.4506 1738678.4848,1086805.5562 1738654.4128,1086772.2935 1738635.303,1086690.1107 1738586.2908,1086686.9034 1738582.9646,1086684.6829 1738578.9628,1086682.9081 1738574.9774,1086682.4051 1738564.72,1086689.5339 1738530.4386,1086689.3221 1738513.0286,1086681.4003 1738477.2476,1086675.4181 1738459.286,1086599.6533 1738339.661,1086303.1333 1738279.587,1086236.0763 1738286.875,1086047.1615 1738365.0637,1085864.2901 1738366.7584,1085772.7517 1738426.8834,1085754.5735 1738435.9356,1085735.8957 1738442.2378,1085723.7105 1738444.2052,1085712.0699 1738444.9404,1085692.5995 1738441.8516,1085687.7153 1738434.1432,1085683.1155 1738426.8834,1085630.1559 1738251.3358,1085212.6631 1737922.5692,1085232.2361 1737818.0304,1085230.5966 1737787.1334,1085155.6443 1737568.9134,1085101.4783 1737551.0734,1085077.0305 1737543.3778,1085010.6884 1737537.388,1084990.6102 1737547.668,1084920.4327 1737585.2256,1084906.2791 1737579.3268,1084898.3307 1737576.0132,1084849.5353 1737516.013,1084478.1135 1736927.7578,1084382.7874 1736738.8464,1084371.7949 1736691.2878,1084308.5153 1736568.6434,1084307.2137 1736567.9206,1084198.3735 1736603.8054,1084111.0723 1736682.1182,1084017.7615 1736764.0292,1083832.601 1736925.222,1083795.4995 1736954.3756,1083781.3237 1736962.8392,1083732.892 1736981.0572,1083590.4832 1736956.4096,1083575.7877 1736953.256,1083560.2673 1736945.2058,1083553.4569 1736940.0312,1083535.8853 1736920.0346,1083514.2947 1736891.9276,1083482.5121 1736845.2364,1083466.0283 1736818.504,1083447.0693 1736782.3182,1083379.1779 1736640.9432,1083192.8837 1736498.9856,1082930.0757 1736371.6946,1082888.0433 1736251.2788,1082766.6259 1736064.8208,1082684.0291 1735989.143,1082140.8793 1735765.7424,1081943.0742 1735933.6342,1081882.2357 1736035.3796,1081879.8735 1736038.119,1081827.0927 1736074.1124,1081822.3099 1736075.815,1081443.3619 1735906.8422,1081187.0439 1735777.696,1081126.5967 1735705.9668,1081115.1051 1735714.9152,1081079.1699 1735742.8972,1081073.6689 1735747.1806,1080617.0093 1735506.892,1080518.9465 1735402.5222,1080460.6007 1735327.2642,1080403.9445 1735257.6306,1080265.4073 1735249.686,1080148.0661 1735246.4296,1080102.9569 1735228.6964,1080101.2167 1735228.0122,1080060.0331 1735193.2122,1080042.8973 1735104.6608,1079924.7137 1734854.6402,1079922.7093 1734852.7222,1079508.0553 1734879.7028,1079449.0967 1734894.9824,1079440.4057 1734897.2348,1079045.8575 1735056.6698,1078936.6979 1735148.4716,1078920.2997 1735162.6378,1078909.5547 1735182.0846,1078900.0381 1735253.2304,1078953.6849 1735325.5948,1079007.3321 1735397.9584,1079102.9883 1735504.9765,1079272.6893 1735554.9784,1079350.1633 1735577.0874,1079554.5413 1735637.928,1080452.6718 1736120.6994,1080496.2602 1736175.2484,1080538.1293 1736228.4144,1080566.7561 1736265.0944,1080893.8085 1736714.8708,1080948.3035 1736803.717,1080988.3067 1736870.0596,1081068.6143 1737003.572,1081115.9461 1737103.7462,1081169.4689 1737218.0274,1081603.6951 1737772.851,1081609.0771 1737802.335,1081618.0847 1737851.6816,1081655.5011 1738058.8116,1081664.2733 1738107.7635,1081656.2931 1738173.8466,1081641.5667 1738286.6432,1081632.5195 1738354.1026,1081616.2271 1738470.2784,1081480.6773 1739194.4264,1081420.4229 1739305.1176,1081284.9957 1739553.614,1080856.6987 1739975.0488,1080729.6239 1740089.1262,1080184.7651 1740484.731,1079965.9983 1740642.1746,1079171.1041 1741324.0286,1079101.9715 1741385.7854,1079041.0937 1741441.088,1078967.9761 1741508.4144,1078036.8223 1742493.3414,1077922.0947 1742667.0522,1077867.9897 1742749.065,1077817.7409 1742825.4442,1077681.6335 1743037.8835,1077661.7163 1743068.9822,1077637.6469 1743107.4752,1077565.8852 1743223.6252,1077556.1047 1743244.2354,1077542.6557 1743272.5766,1077523.1557 1743314.4326,1077452.2067 1743466.8864,1077389.8645 1743640.2714,1077363.0137 1743715.5186,1077323.6101 1743827.587,1077239.8469 1744084.15,1077218.8507 1744149.1834,1077205.6205 1744188.5265,1077126.8283 1744490.5655,1077111.5473 1744549.9936,1077104.6223 1744584.1838,1077088.9421 1744663.7613,1077041.0125 1744912.001,1077032.5419 1745130.724,1077051.8717 1745538.1894,1077057.1737 1745639.5464,1077102.3031 1745692.817,1077374.8185 1746010.2966,1077501.5149 1746091.812,1077605.0015 1746146.1053,1077693.2695 1746164.8221,1077955.2653 1746115.2344,1078110.7543 1746069.7886,1078247.0819 1746029.943,1078891.203 1745776.192,1079138.4569 1745651.3362,1079331.3791 1745553.893,1079443.8133 1745512.7593,1079667.3941 1745433.4919,1079857.3012 1745386.9171,1080089.7143 1745375.4235,1080226.7213 1745368.6199,1080266.7616 1745366.447,1080657.8754 1745334.2189,1080804.7965 1745313.2067,1081156.0807 1745255.3965,1081979.8821 1744983.2583,1082530.2359 1744782.0647,1082741.7683 1744799.187,1082820.2068 1744805.7672,1083155.0829 1744849.0601,1083276.6327 1744892.0331,1083435.4772 1744948.8353,1083475.5963 1744971.8065,1083501.0367 1744986.7581,1083517.8598 1744997.1961,1083523.9189 1745001.6817,1083726.0996 1745169.0087,1084325.2391 1745803.0762,1084382.7182 1745874.7987,1084407.4206 1745905.6426,1084413.2629 1745913.0632,1084418.2759 1745920.8962,1084436.2451 1745952.3575,1084488.8717 1746045.9739,1084541.5305 1746290.8666,1084561.1608 1746431.4649,1084562.7509 1746535.8009,1084562.8922 1746636.2937,1084562.9441 1746899.4001,1084538.3641 1747065.4589,1084462.7563 1747624.3429,1084449.5875 1747694.0491,1084442.1183 1747732.2068,1084439.3692 1747740.3594,1084417.9875 1747803.7668,1084405.6876 1747838.2275,1084401.7438 1747849.2765,1084339.0036 1747985.1595,1084305.1289 1748044.1033,1084273.5178 1748099.1074,1084156.2975 1748190.1628,1084058.0974 1748266.0219,1083963.8524 1748340.3118,1083550.9803 1748694.6031,1083514.4472 1748735.2753,1083498.4481 1748753.4629,1083442.6547 1748816.8889,1083423.0467 1748839.4889,1082840.3358 1749255.5373,1082524.5351 1749452.904,1081303.3435 1750132.1486,1081105.0439 1750225.7989,1081043.4403 1750255.0924,1081017.4617 1750272.9152,1080763.3125 1750449.7818,1080671.3995 1750519.553,1080581.4287 1750588.822,1080503.0589 1750705.838,1080455.8069 1750806.4414,1080258.5157 1751165.5938,1080073.1931 1751409.5938,1079931.5441 1751586.3062,1079923.7722 1751594.86,1079887.7725 1751642.0236,1079864.5929 1751681.8156,1079852.1409 1751717.2512,1079849.5399 1751762.9882,1079851.4387 1751776.613,1079858.3872 1751826.4698,1079866.4709 1751883.9462,1079947.8127 1752053.7814,1080241.8099 1752620.1374,1080413.5771 1752987.0697,1080443.2105 1753037.8022,1080481.0251 1753102.1578,1080523.1797 1753172.7064,1080586.7109 1753276.5322,1080635.4861 1753355.6732,1080644.0939 1753365.7626,1080676.4543 1753403.6924,1080727.0197 1753462.1658,1080811.0469 1753556.7902,1080864.0287 1753616.3188,1080891.5409 1753646.6758,1080944.4267 1753704.702,1080964.8387 1753726.6906,1081013.0519 1753785.2812,1081063.0807 1753846.743,1081123.7544 1753954.0294,1081167.6497 1754052.0394,1081186.6821 1754095.2936,1081217.7609 1754177.6658,1081232.0557 1754215.9446,1081257.9105 1754310.9377,1081266.6761 1754343.9109,1081273.7105 1754393.8046,1081281.9929 1754461.0442,1081395.5011 1754827.1909,1081467.7132 1754994.3864,1081568.0341 1755221.7551,1081892.2065 1755929.1938,1082054.6905 1756243.4717,1082217.0829 1756256.6881,1082273.7403 1756261.2991,1082276.2561 1756292.7722,1082289.1937 1756454.3237,1082322.7113 1756497.2595,1082390.8197 1756583.9451,1082421.0808 1756622.4599,1082441.4196 1756648.1705,1082491.2271 1756648.4644,1082549.4929 1756648.8077,1082555.1418 1756648.8407,1082742.4616 1756649.9348,1082740.5294 1756982.7917,1082740.3455 1757013.4385,1082773.0797 1757013.6285,1083010.8621 1757015.002,1083147.4885 1757015.7911,1083173.7039 1757028.8621,1083194.5695 1757041.2141,1083194.0891 1757124.5719,1083192.7711 1757352.2809,1083192.6055 1757379.5667,1083213.0239 1757379.6859,1085010.1041 1757390.1463,1085011.1209 1757220.2323,1085012.237 1757029.2935,1085021.1488 1757026.6967,1085803.8383 1757031.2403,1086904.0294 1757026.8681,1087677.9661 1757042.1569,1087729.8221 1757057.9017,1087817.0545 1757098.6055,1087843.7276 1757111.3867,1087970.2653 1757180.0957,1087957.132 1757246.4817,1088021.1322 1757485.212,1088331.1641 1757749.3002,1088345.3418 1757761.386,1088518.3692 1757979.824,1088593.7505 1758075.0065,1088618.1267 1758105.7997,1088618.4239 1758106.1751,1088622.0441 1758110.7447,1088670.0079 1758171.2811,1088775.53820114 1758118.20499996,1088777.20550336 1758119.64333547,1088780.19379997 1758164.02169991,1088793.90649986 1758367.82970238,1088795.6425991 1758393.68670082,1088798.1563015 1758494.63620186,1088802.49010277 1758671.04010201,1088802.69109917 1758741.29990196,1088800.4049015 1758782.57370186,1088791.22089958 1758948.21970177,1088781.84010124 1759026.1019001,1088773.30050087 1759096.92130089,1088742.22010231 1759280.26650047,1088701.53450203 1759400.1359005,1088696.64590263 1759414.54010201,1088648.75710106 1759584.19190025,1088613.29330127 1759737.11910029,1088087.2189 1759955.6623,1088005.1339 1759989.7704,1087984.8631 1759998.1934,1087896.7947 1760067.8874,1087859.9963 1760097.465,1087838.3767 1760114.8805,1087485.1625 1760650.045,1087500.7924 1760775.6506,1087488.7097 1760770.7216,1087295.0059 1760788.8225,1087212.9027 1760818.1187,1086728.6441 1760990.9719,1086645.1992 1761043.0522,1086592.0533 1761076.2221,1086513.6467 1761125.1595,1086281.2517 1761270.2155,1086222.8483 1761302.4267,1085788.0779 1761542.1769,1085713.7876 1761563.2337,1085309.8001 1761677.7395,1085127.7983 1761686.9073,1084958.6665 1761695.4249,1084758.6262 1761705.2977,1084538.3302 1761716.177,1084401.9874 1761757.7083,1084290.6857 1761791.6197,1084105.9124 1761847.9257,1083309.4871 1761923.5056,1083000.4635 1761947.7237,1082782.9013 1762045.9518,1082710.6395 1762078.5718,1082256.6847 1762088.8186,1080967.8927 1762090.5048,1080435.2739 1762087.1172,1080284.2743 1762093.8141,1080052.6387 1762003.9808,1079777.3533 1762171.1236,1079772.8245 1762242.4696,1079770.2355 1762316.2544,1079767.1669 1762787.4334,1079766.1667 1763066.2428,1079775.2583 1763249.302,1079827.6177 1763593.7948,1079890.1683 1763762.0828,1079928.1045 1763853.7268,1079963.4739 1763918.674,1079995.3349 1763956.52,1080032.8163 1764000.9278,1080041.9323 1764012.5098,1080076.1429 1764060.8076,1080090.4895 1764081.7028,1080188.6695 1764243.2758,1080204.2979 1764274.3104,1080240.3567 1764373.7996,1080287.9623 1764542.7064,1080301.8543 1764594.7498,1080396.6339 1765072.9262,1080758.4081 1766010.7788,1080867.2565 1766288.3086,1080902.3091 1766357.377,1080904.2961 1766361.292,1080937.0847 1766413.0344,1080956.9637 1766438.6096,1080973.6516 1766461.5836,1081006.2309 1766507.133,1081021.6191 1766540.3144,1081051.1649 1766605.7706,1081125.1157 1766902.614,1081129.5677 1766922.9862,1081143.8721 1767007.0976,1081127.4421 1767291.1718,1081125.9221 1767407.1212,1081384.6331 1767459.8333,1081440.9769 1767471.1126,1081591.9761 1767477.0612,1081860.7825 1767502.4672,1082020.4879 1767776.0963,1082048.9117 1767912.5294,1082077.6673 1768023.1478,1082086.0033 1768050.968,1082087.2799 1768055.228,1082128.8365 1768150.673,1082472.1025 1768685.6375,1082512.0117 1768732.614,1082600.3167 1768804.0806,1082691.9409 1768950.0208,1082784.4589 1769216.666,1082825.1347 1769405.6034,1082821.9715 1769454.8942,1082818.0449 1769555.2678,1082826.2399 1769770.5068,1082828.7777 1769792.9654,1083052.7953 1769880.575,1083312.0533 1769963.9866,1083340.1529 1769999.9862,1083408.6023 1770171.0827,1083423.2705 1770217.4074,1083416.0251 1770422.9256,1083435.9753 1770547.322,1083560.9265 1770471.5289,1083581.0349 1770459.9379,1083592.9993 1770457.1207,1083675.1411 1770471.1609,1083680.4333 1770478.0317,1083689.8031 1770498.4439,1083690.6391 1770503.2397,1083690.9217 1770507.2765,1083690.9669 1770507.9237,1083683.8505 1770524.7143,1083676.5881 1770535.0551,1083716.4483 1770648.6585,1083770.6801 1770702.0613,1083980.7375 1770845.3729,1084148.1439 1770896.8231,1084601.9521 1770959.7995,1084643.9807 1770946.852,1084647.4325 1770946.5371,1084681.1381 1770945.067,1084777.595 1771029.9002,1084805.0243 1771058.4674,1084828.1885 1771131.699,1084849.6343 1771199.5544,1084857.0309 1771222.9586,1084890.6155 1771327.0052,1084931.2557 1771356.5376,1085005.0037 1771365.6462,1085248.9913 1771353.3826,1085544.1453 1771316.2898,1085624.6493 1771326.091,1085723.1423 1771345.8838,1085758.4119 1771374.4398,1085823.3717 1771427.0738,1085880.1367 1771473.068,1085941.4621 1771522.7822,1085971.4705 1771675.7141,1086000.6525 1771905.8789,1086031.0281 1772158.286,1086058.6739 1772248.544,1086172.5571 1772214.291,1086232.7043 1772141.0022,1086324.7621 1772098.2022,1086393.1671 1772072.2426,1086575.6337 1772064.9308,1086658.9817 1772011.3984,1086789.3289 1771902.4822,1086919.3972 1771765.139,1087304.5753 1771748.0292,1087479.9963 1771719.9594,1087714.7573 1771623.6284,1087885.0581 1771530.661,1087974.6875 1771468.5126,1088013.7723 1771426.3956,1088022.9347 1771416.5222,1088076.4313 1771302.2924,1088080.4659 1771262.5492,1088091.1937 1771139.6682,1088099.3179 1771037.5506,1088061.1333 1770611.476,1088016.0199 1770485.5696,1087989.4839 1770411.511,1087905.6655 1770262.7446,1087834.9339 1770129.2692,1087821.0481 1770094.9952,1087804.6879 1770043.4397,1087809.7523 1769901.2452,1087831.0625 1769475.8538,1087874.4003 1769412.0294,1087856.7219 1769350.3712,1087845.7353 1769312.0526,1087768.0647 1769080.2495,1087753.4761 1769061.5133,1087709.9985 1769005.7212,1087606.7223 1768886.1248,1087407.9581 1768678.2907,1087333.1721 1768660.4968,1087219.3887 1768604.095,1087160.3901 1768527.338,1087110.7169 1768425.2981,1087152.7485 1768349.585,1087233.1019 1768261.89,1087288.2373 1768186.6505,1087289.1611 1768182.0258,1087313.1015 1768061.6394,1087311.3901 1767810.403,1087332.4773 1767498.7996,1087389.6477 1767416.4296,1087424.6066 1767389.668,1087437.5531 1767379.7573,1087455.0678 1767366.3494,1087607.5426 1767242.1056,1087672.912 1767155.2229,1087721.0288 1767091.2702,1087837.6214 1766980.1908,1087955.9594 1766904.1974,1087982.5336 1766887.8187,1088017.0394 1766866.5515,1088054.1804 1766891.9217,1088150.848 1766968.5096,1088208.5034 1767046.5216,1088303.8693 1767131.9606,1088366.2136 1767109.3198,1088676.96 1766956.0692,1088799.801 1766881.3236,1088849.2416 1766862.1045,1088883.4732 1766992.9472,1088904.8338 1767031.837,1088975.7999 1767098.5582,1089149.4062 1767221.077,1089160.6806 1767228.3778,1089203.863 1767245.0488,1089246.1912 1767255.2452,1089334.443 1767243.0794,1089398.6596 1767226.73,1089525.4583 1767089.4394,1089571.6978 1766952.9034,1089632.803 1766820.0946,1089760.0758 1766556.6956,1089926.1727 1766305.666,1089955.3585 1766315.4424,1090160.9314 1766384.3029,1090176.2075 1766388.2327,1090196.7603 1766380.4142,1090218.2218 1766346.7083,1090267.4995 1766221.1613,1090281.2265 1766152.2529,1090281.8706 1766120.8174,1090282.8661 1766071.0472,1090288.4127 1766001.0325,1090294.1712 1766002.9445,1090337.9162 1766018.218,1090352.9383 1766023.463,1090380.7429 1766033.1892,1090392.5914 1766037.3524,1090430.9553 1766056.42,1090460.4351 1766071.7036,1090525.659 1766137.8538,1090606.3917 1766224.0933,1090624.5941 1766244.2407,1090669.1886 1766304.8442,1090630.0803 1766353.0861,1090687.9472 1766559.7717,1090698.8522 1766586.7914,1090773.999 1767141.1122,1090773.0977 1767544.1752,1090746.8292 1767746.2608,1090859.6826 1768187.1637,1091144.6733 1768615.1073,1091443.8979 1768794.2712,1091459.3719 1768795.0988,1091499.6737 1768797.2542,1091813.3279 1768960.5208,1092238.7382 1769362.1012,1092312.3126 1769473.9786,1092311.371 1769606.6876,1092301.007 1769661.644,1092320.5031 1769699.554,1092527.0393 1769969.244,1092626.9179 1770050.2604,1092711.0812 1770104.5686,1092773.7473 1770140.889,1092800.1351 1770156.1828,1092874.2573 1770151.7231,1092919.5619 1770452.5332,1092926.6311 1770556.7756,1092937.4612 1770626.201,1092944.8893 1770661.1852,1092969.4417 1770733.9889,1092976.4547 1770753.6009,1093248.0699 1771394.6701,1093303.4081 1771455.3565,1093293.2064 1771530.9398,1093298.3511 1771606.3546,1093302.8673 1771639.7655,1093366.7108 1771805.7401,1093332.0743 1772177.1411,1093286.689 1772229.955,1093199.6657 1772584.598,1093258.5917 1772647.3003,1093236.7939 1772896.0174,1093221.3229 1772990.5692,1093163.6766 1773028.5894,1093124.0046 1773130.1552,1093120.8085 1773140.5248,1093158.6739 1773396.0128,1093173.6384 1773470.1254,1093177.618 1773489.8344,1093194.384 1773535.1622,1093229.5408 1773638.6735,1093252.7723 1773707.204,1093288.9258 1773850.1486,1093298.5897 1773904.5994,1093314.2512 1773992.8436,1093315.5858 1774012.1196,1093315.6042 1774012.3855,1093192.4982 1774287.6357,1093132.6769 1774329.0304,1092913.6884 1774457.6732,1092868.2664 1774707.959,1092861.3633 1774744.6902,1092807.9255 1775013.8398,1092715.5959 1775342.3693,1092662.726 1775460.046,1092596.6761 1775866.8018,1092707.6305 1776442.7688,1092746.8416 1776446.7271,1093185.0885 1776360.8378,1093576.2187 1776084.138,1093688.5895 1776033.7765,1093853.2679 1775969.3434,1094018.1831 1775890.0417,1094078.4827 1775838.8846,1094101.3771 1775802.0674,1094333.9343 1775195.508,1094351.2219 1775039.5641,1094345.8515 1774905.5362,1094376.7385 1774831.6044,1094604.6959 1774522.632,1094731.8479 1774479.9418,1094855.6593 1774390.834,1094982.8609 1774296.1559,1095042.7193 1774555.9094,1095209.7927 1775192.3908,1095238.0782 1775483.2904,1095243.4753 1775514.5834,1095305.9041 1775569.7899,1095436.2089 1775628.8748,1095598.1379 1775644.681,1095720.1921 1775607.61,1095994.0498 1775655.7522,1096080.5165 1775744.9484,1096080.3557 1775755.3209,1096078.4732 1775876.6984,1096720.5397 1776259.9919,1097236.4219 1776278.9394,1097478.6465 1776238.7272,1097657.8835 1776155.91,1098280.7312 1776379.669,1098538.9273 1776560.7528,1098525.3017 1776840.175,1098812.1842 1776975.0741,1099016.3473 1777034.123,1099211.3103 1777083.7558,1099418.9847 1777131.877,1099462.0464 1777345.6007,1099534.6038 1777456.4664,1099844.3726 1777936.9098,1100065.9096 1778290.6822,1100448.7321 1778704.8472,1100557.6252 1778817.3563,1100595.3314 1778947.0321,1100638.5383 1779113.9093,1100671.0706 1779271.0965,1100703.1453 1779426.0735,1100816.8706 1779423.2076,1100984.4118 1779381.5597,1101106.9542 1779384.1497,1101261.0576 1779426.4321,1101275.5405 1779461.1841,1101299.3034 1779545.6117,1101336.7384 1779567.3137,1101390.9229 1779578.4057,1101484.5612 1779590.7634,1101889.4856 1779514.2631,1101912.8711 1779530.5265,1102076.12 1779635.2347,1102266.6278 1779727.5398,1102320.1986 1779733.8957,1102464.4154 1779746.9386,1102537.2376 1779746.6056,1102598.2358 1779754.3956,1102628.4674 1779758.2566,1102731.5112 1779795.9281,1102798.8836 1779901.3825,1102797.971 1779903.1098,1102855.2151 1779891.2434,1102991.7083 1779879.801,1103125.4263 1779907.6034,1103126.5933 1779907.846,1103159.3225 1779901.1196,1103364.8539 1779800.4642,1103501.4671 1779720.777,1103544.7373 1779674.2986,1103668.1261 1779592.2418,1103719.6345 1779562.6648,1103730.4723 1779556.4416,1103916.9397 1779642.7848,1103981.8731 1779746.3972,1104014.3037 1779798.166,1104371.9987 1779848.1898,1104593.5991 1779854.3649,1104594.2557 1779854.392,1104913.5989 1779881.6182,1105026.3345 1779927.2352,1105035.4037 1779941.7746,1105140.0825 1780109.7116,1105221.9273 1780167.2626,1105390.9769 1780237.2648,1105689.5925 1780230.0846,1106105.6275 1780243.7586,1106282.2853 1780368.917,1106296.3733 1780378.8981,1106340.8137 1780420.7734,1106919.6037 1780391.4501,1107617.8271 1780551.1334,1107736.703 1780587.4087,1107777.5945 1780522.2654)))", {
        //             dataProjection: 'EPSG:5179',
        //             featureProjection: 'EPSG:3857'
        //           });
        //           var vectorSources = new ol.source.Vector({
        //             features: [feature5181],
        //           });
        //           var vectorLayer = new ol.layer.Vector({
        //             source: vectorSources,
        //             style: new ol.style.Style({
        //                 fill: new ol.style.Fill({
        //                     color: 'rgba(135,206,250, 0.5)', // Skyblue color fill with opacity
        //                 }),
        //                 stroke: new ol.style.Stroke({
        //                     color: 'orange', // Orange stroke color
        //                     width: 2
        //                 }),
        //             })
        //           });
        //           map.addLayer(vectorLayer)
        //           map.getView().fit(vectorSources.getExtent());
        // map.getView().setCenter(ol.extent.getCenter(vectorSources.getExtent()));
        //TODO 추후 서버 생성시 진행 예정
        // if (clickCurrentLayer) {
        //     map.removeLayer(clickCurrentLayer);
        // }
        // if (clickCurrentOverlay) {
        //     map.removeOverlay(clickCurrentOverlay);
        // }
        // const geoUrl = target.getAttribute('data-geo-url');
        // $.ajax({
        //     url : "/api",
        //     data : {
        //         url : geoUrl
        //     },
        //     success: function(data) {
        //         console.log(data)
        //         var geoInfoObject = data.features[0];
        //         var geojsonObject = geoInfoObject.geometry;
        //         const format = new ol.format.GeoJSON({
        //             featureProjection: "EPSG:3857",
        //         });
        //         const feature = format.readFeature(geojsonObject);
        //         var vectorSource = new ol.source.Vector({
        //             features: [feature]
        //         });
        //         const geometry = feature.getGeometry();
        //         const center = ol.extent.getCenter(geometry.getExtent());
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
        //         //layer.getKeys() 로 확인
        //         map.addLayer(vector_layer);
        //         clickCurrentLayer = vector_layer
        //         var selectedValue = $(".coordinate-system-selector").val();
        //         var coord = ol.proj.transform(center, "EPSG:3857", selectedValue)
        //         var overlayElement = document.createElement('div');
        //         overlayElement.className = "ol-popup";
        //         overlayElement.innerHTML += `<a href="#" id="popup-closer" class="ol-popup-closer"></a>`
        //         overlayElement.innerHTML += `<div id="popup-content">
        //                                         <div class="ol-popup-title">정보</div>
        //                                             <code class="code">
        //                                                 <div class="popup-coordinate">${coord}</div><span>주소</span><br>
        //                                                 <div class="leftBottom__etcBtn">
        //                                                     <ul>
        //                                                         <li class="select customSelect">
        //                                                             <p onclick="searchLocalAddress(this)">${geoInfoObject.properties.addr == null ? geoInfoObject.properties.title : geoInfoObject.properties.addr}</p>
        //                                                         </li>
        //                                                     </ul>
        //                                                 </div>
        //                                             </code>
        //                                             <br>
        //                                         </div>`
        //         var overlay = new ol.Overlay({
        //             element: overlayElement,
        //             position: center
        //         });
        //         map.getView().setCenter(center);
        //         if(map.getView().getZoom() < 14){
        //             map.getView().setZoom(14)
        //         }
        //         // Add the overlay to the map
        //         map.addOverlay(overlay);
        //         clickCurrentOverlay = overlay;
        //         var deleteButton = overlayElement.querySelector(".ol-popup-closer");
        //         deleteButton.addEventListener("click", function () {
        //             map.removeLayer(vector_layer);
        //             map.removeOverlay(clickCurrentOverlay);
        //         });
        //     },beforesend: function(){
        //     },
        //     error: function(xhr, stat, err) {
        //         console.log(xhr, stat, err)
        //     }
        // })
    }
}

//오버레이의 주소를 클릭하면 동작하는 함수. 해당 주소를 이용해 검색 API를 호출하고 해당 탭으로 이동한다.
function searchLocalAddress(e) {
    console.log(e.innerText);
    const depth1Element = new bootstrap.Tab(
        document.getElementById("profile-tab")
    );
    const depth2Element = new bootstrap.Tab(document.getElementById("all-tab"));
    $("#search-input").val(e.innerText);
    $("#serach-button").data("searchParam", "PARCEL");
    $("#serach-button").click();
    // Show the tab
    depth1Element.show();
    depth2Element.show();
}

//검색 API를 이용한 전체 검색 결과 페이지의 장소 탭 "더보기" 버튼을 클릭하면 발생하는 이벤트. 장소 탭을 트리거시켜 해당 탭으로 이동함
$(document).on("click", ".place-more-view", function (event) {
    event.preventDefault();

    // Get the tab element
    const tabElement = new bootstrap.Tab(document.getElementById("place-tab"));

    // Show the tab
    tabElement.show();
});

//검색 API를 이용한 전체 검색 결과 페이지의 주소 탭 "더보기" 버튼을 클릭하면 발생하는 이벤트. 장소 탭을 트리거시켜 해당 탭으로 이동함
$(document).on("click", ".address-more-view", function (event) {
    event.preventDefault();

    // Get the tab element
    const tabElement = new bootstrap.Tab(
        document.getElementById("address-tab")
    );

    // Show the tab
    tabElement.show();
});

//검색 API를 이용한 전체 검색 결과 페이지의 행정구역 탭 "더보기" 버튼을 클릭하면 발생하는 이벤트. 장소 탭을 트리거시켜 해당 탭으로 이동함
$(document).on("click", ".district-more-view", function (event) {
    event.preventDefault();

    // Get the tab element
    const tabElement = new bootstrap.Tab(
        document.getElementById("district-tab")
    );

    // Show the tab
    tabElement.show();
});

//검색 API를 이용한 전체 검색 결과 페이지의 도로명 탭 "더보기" 버튼을 클릭하면 발생하는 이벤트. 장소 탭을 트리거시켜 해당 탭으로 이동함
$(document).on("click", ".road-more-view", function (event) {
    event.preventDefault();

    // Get the tab element
    const tabElement = new bootstrap.Tab(document.getElementById("road-tab"));

    // Show the tab
    tabElement.show();
});

//주소검색 input에 포커스가 있고, 키보드의 키 이벤트가 발생했을 때 동작하는 이벤트. 엔터키가 눌렸을 때 검색 주소검색 버튼을 클릭하여 주소검색 API를 호출한다.
$("#search-input").on("keypress", function (e) {
    if (e.which == 13) {
        // Check if the key pressed is the Enter key (ASCII value 13)
        $("#serach-button").click();
    }
});

// 페이지네이션 초기화 함수
function initPagination(response, searchFunction, addFunction, elementId, searchQuery, itemsPerPage, containerSelector) {
    $(containerSelector).twbsPagination("destroy");
    $(containerSelector).twbsPagination({
        totalPages: response[0].response.page.total,
        visiblePages: 5,
        hideOnlyOnePage: true,
        first: '<i class="bi bi-chevron-double-left"></i>',
        prev: '<i class="bi bi-chevron-left"></i>',
        next: '<i class="bi bi-chevron-right"></i>',
        last: '<i class="bi bi-chevron-double-right"></i>',
        initiateStartPageClick: true,
        onPageClick: function (event, page) {
            $.when(searchFunction(searchQuery, page)).done(function (response) {
                addFunction(elementId, response, searchQuery, itemsPerPage);
            });
        },
    });
}

//주소검색 버튼이 클릭 되었을 때 발생하는 이벤트. vworld의 검색 API 4건을 호출한다(장소, 주소, 행정구역, 도로명)
$("#serach-button").on("click", function () {
    const searchQuery = $("#search-input").val();
    if (searchQuery.length == 0) {
        return alert("검색어 입력은 필수입니다.");
    }

    $.when(
        searchPlace(searchQuery), //장소검색 API
        searchAddress(searchQuery), //주소검색 API
        searchDistrict(searchQuery), //행정구역검색 API
        searchRoad(searchQuery) //도로명검색 API
    )
    .done(function (placeResponse, addressResponse, districtResponse, roadResponse) {
        //API 응답을 처리한다. 4건의 API의 요청에 대한 응답은 요청 순서대로 반환된다.
        const [placeCount, addressCount, districtCount, roadCount] = [placeResponse, addressResponse, districtResponse, roadResponse].map(response => parseInt(response[0].response.record.total));
        const totalCount = placeCount + addressCount + districtCount + roadCount;

        // Set total count
        $("#all-search-content-name").text(`"${searchQuery}"`);
        $("#all-search-content-count").text(totalCount.toLocaleString("ko-KR"));

        // Set individual counts
        const selectors = [
            ["#place-search-content-name", "#place-search-content-count", placeCount],
            ["#address-search-content-name", "#address-search-content-count", addressCount],
            ["#district-search-content-name", "#district-search-content-count", districtCount],
            ["#road-search-content-name", "#road-search-content-count", roadCount]
        ];
        selectors.forEach(([nameSelector, countSelector, count]) => {
            $(nameSelector).text(`"${searchQuery}"`);
            $(countSelector).text(count.toLocaleString("ko-KR"));
        });

        // 엘리먼트의 id 정보를 가져옴
        const [allPlaceElementId, placeElementId, allAddressElementId, addressElementId, allDistrictElementId, districtElementId, allRoadElementId, roadElementId] =
            ["#all-place-result", "#place-result", "#all-address-result", "#address-result", "#all-district-result", "#district-result", "#all-road-result", "#road-result"].map(selector => $(selector)[0].id);

        // 페이지네이션 초기화
        initPagination(placeResponse, searchPlace, addPlace, placeElementId, searchQuery, 10, ".place-pagination-container");
        initPagination(addressResponse, searchAddress, addAddress, addressElementId, searchQuery, 10, ".address-pagination-container");
        initPagination(districtResponse, searchDistrict, addDistrict, districtElementId, searchQuery, 10, ".district-pagination-container");
        initPagination(roadResponse, searchRoad, addRoad, roadElementId, searchQuery, 10, ".road-pagination-container");

        // 전체검색 엘리먼트에 최초 검색 결과를 표출.
        addPlace(allPlaceElementId, placeResponse[0], searchQuery);
        addAddress(allAddressElementId, addressResponse[0], searchQuery);
        addDistrict(allDistrictElementId, districtResponse[0], searchQuery);
        addRoad(allRoadElementId, roadResponse[0], searchQuery);

        // 가려졌던 검색탭 하위탭을 다시 보여준다.
        $("#middle-sidebar-content, #address-content").css("display", "block");
    })
    .fail(function (err) {
        console.error(err);
    });
});

//좌표 이동 버튼 클릭 이벤트
$("#btn-move-coordinate").on("click", function(){

    const firstCoordinate = $("#first-coordinate").val().trim();
    const secondCoordinate = $("#second-coordinate").val().trim();

    if(firstCoordinate.length <= 0 || secondCoordinate.length <= 0){
        return alert("입력값은 필수입니다.")
    }
    const regex = /^[-0-9.]+$/;
    if (!regex.test(firstCoordinate) || !regex.test(secondCoordinate)) {
        return alert("입력값은 숫자와 소수점만 포함해야 합니다.");
    }
    const coordinate = [parseFloat(firstCoordinate), parseFloat(secondCoordinate)];
    const selectedValue = $(".coordinate-system-selector").val();
    const changedCoordinate = ol.proj.transform(coordinate, selectedValue, "EPSG:3857");
    if (ol.extent.containsCoordinate(KOREA_EXTENT, changedCoordinate)) {
        map.getView().setCenter(changedCoordinate);
    } else {
        return alert("입력된 좌표가 정의된 범위를 벗어났습니다.");
    }
})

//주소 이동 버튼 클릭이벤트. 주소 셀렉트의 값을 이용해 SGIS API를 호출하여 Feature 객체를 반환받아 지도에 오버레이와 같이 표시한다.
$("#btn-move-address").on("click", async function () {
    let addressCode, param

    for (const key in addressMapping) {
        addressCode = $(`#${key}`).val();
        if (addressCode !== "") {
            param = addressMapping[key].param;
            break;
        }
    }

    if (!addressCode) {
        return alert("시도 / 시군구 / 읍면동 중 하나 이상을 선택해주세요");
    }

    const fullAddress = [$("#sido"), $("#sigugun"), $("#dong")].map(ele => ele.find("option:selected").text().replaceAll("선택", "")).join(" ").trimEnd();

    const url = `https://sgisapi.kostat.go.kr/OpenAPI3/boundary/hadmarea.geojson?year=2022&adm_cd=${addressCode}&accessToken=${SgisApiAccessKey}&low_search=0`;

    if (clickCurrentLayer) map.removeLayer(clickCurrentLayer);
    if (clickCurrentOverlay) map.removeOverlay(clickCurrentOverlay);

    try {
        const response = await axios.get(url);
        const data = response.data;

        if (data.errMsg != "Success") {
            throw new Error("API 호출 에러 발생");
        }
        
        const geoInfoObject = data.features[0];
        const geojsonObject = geoInfoObject.geometry;

        const vectorSource = new ol.source.Vector({
            features: new ol.format.GeoJSON().readFeatures(geojsonObject, {
                dataProjection: "EPSG:5179",
                featureProjection: "EPSG:3857",
            }),
        });

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

        map.addLayer(vector_layer);
        clickCurrentLayer = vector_layer;

        const overlayElement = document.createElement("div");
        overlayElement.className = "ol-popup";
        overlayElement.innerHTML += `<a href="#" id="popup-closer" class="ol-popup-closer"></a>`;
        overlayElement.innerHTML += `<div id="popup-content">
                                        <div class="ol-popup-title">정보</div>
                                            <code class="code">
                                                <div class="popup-coordinate">${ol.extent.getCenter(vectorSource.getExtent())}</div>
                                                <span>주소</span><br>
                                                <div class="leftBottom__etcBtn">
                                                    <ul>
                                                        <li class="select customSelect">
                                                            <p onclick="searchLocalAddress(this)">${fullAddress}</p>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </code>
                                            <br>
                                        </div>`;
        const overlay = new ol.Overlay({
            element: overlayElement,
            position: ol.extent.getCenter(vectorSource.getExtent()),
        });

        map.getView().fit(vectorSource.getExtent());
        map.getView().setCenter(ol.extent.getCenter(vectorSource.getExtent()));
        
        let zoomLevel = param === "LT_C_ADSIDO_INFO" ? 8 : param === "LT_C_ADSIGG_INFO" ? 10 : 12;
        if (map.getView().getZoom() < zoomLevel){
            map.getView().setZoom(zoomLevel)
        }

        map.addOverlay(overlay);
        clickCurrentOverlay = overlay;

        const deleteButton = overlayElement.querySelector(".ol-popup-closer");
        deleteButton.addEventListener("click", function () {
            map.removeLayer(vector_layer);
            map.removeOverlay(clickCurrentOverlay);
        });

    } catch (error) {
        console.error(error);
    }
});

//유저 레이어 탭이 보여질 때 실행되는 이벤트. 기존 지도를 가리고 새로운 지도를 생성한다.
$("#contact-tab").on("shown.bs.tab", function (e) {
    $('#map').hide();
    $('#sub-map').show();
})

//유저 레이어 탭이 가려질 때 실행되는 이벤트. 새로운 지도를 가리고 기존 지도를 다시 표출한다.
$("#contact-tab").on("hidden.bs.tab", function (e) {
    $('#sub-map').hide();
    $('#map').show();
})

//상위 주소검색 탭이 숨겨질 때 실행되는 이벤트. 장소, 주소검색 결과의 마커를 삭제한다.
$("#profile-tab").on("hidden.bs.tab", function (e) {
    const source = objectControllVectorLayer.getSource();
    removeSearchFeatures(source, "place")
    removeSearchFeatures(source, "address")
});

//상위 주소검색 탭이 보여질 때 실행되는 이벤트. 열려있는 하위 탭을 찾아 해당하는 검색 결과의 마커를 지도에 표시한다.
$("#profile-tab").on("shown.bs.tab", function (e) {
    const activeSubTab = $(".tab-pane:visible")
    activeSubTab.each(function () {
        const tabId = $(this).attr('id'); // 각 요소의 id 값을 가져옴
        if(tabId == "place-tab-pane"){
            const addressNameSpans = $("#place-tab-pane .address-name-span");

            addressNameSpans.each(function (index, element) {
                const parentTr = $(element).closest("tr");
                const coordSpan = parentTr.nextAll().find("span[data-coord]").first();
                const coord = coordSpan.attr("data-coord").split(",").map(Number);
        
                const addressName = $(element).text();
        
                addMarker(coord, addressName, "place", "search");
            });
        }else if(tabId == "address-tab-pane"){
            $("#address-result .address-name-span").each(function () {
                const coord = $(this).attr("data-coord").split(", ");
                const addressName = $(this).text();
                addMarker(coord, addressName, "address", "search");
            });
        }
    });
    
});

//검색결과 장소 탭이 보여질 때 실행되는 이벤트. 각 span에 data로 저장되어있던 좌표와, 장소 이름을 이용해 지도 위에 마커를 표시한다.
$("#place-tab").on("shown.bs.tab", function (e) {
    const addressNameSpans = $("#place-tab-pane .address-name-span");

    addressNameSpans.each(function (index, element) {
        const parentTr = $(element).closest("tr");
        const coordSpan = parentTr.nextAll().find("span[data-coord]").first();
        const coord = coordSpan.attr("data-coord").split(",").map(Number);

        const addressName = $(element).text();

        addMarker(coord, addressName, "place", "search");
    });
});

//검색결과 장소 탭이 닫힐 때 실행되는 이벤트. 장소 마커를 전체 삭제한다.
$("#place-tab").on("hidden.bs.tab", function (e) {
    const source = objectControllVectorLayer.getSource();
    removeSearchFeatures(source, "place")
});

//검색결과 주소 탭이 보여질 때 실행되는 이벤트. 각 span에 data로 저장되어있던 좌표와, 장소 이름을 이용해 지도 위에 마커를 표시한다.
$("#address-tab").on("shown.bs.tab", function (e) {
    $("#address-result .address-name-span").each(function () {
        let coord = $(this).attr("data-coord").split(", ");
        let addressName = $(this).text();
        addMarker(coord, addressName, "address", "search");
    });
});

//검색결과 주소 탭이 닫힐 때 실행되는 이벤트. 주소 마커를 전체 삭제한다.
$("#address-tab").on("hidden.bs.tab", function (e) {
    const source = objectControllVectorLayer.getSource();
    removeSearchFeatures(source, "address")
});

//검색결과 행정구역 탭이 보여질 때 실행되는 이벤트. TODO : API를 이용해 해당하는 행정구역을 지도 위에 feature와 overlay를 이용해 표시한다.
$("#district-tab").on("shown.bs.tab", function (e) {
    $("#district-result span[data-coord]").each(function () {
        const coord = $(this).attr("data-coord");
        console.log("Coordinate:", coord);
    });
});

//검색결과 행정구역 탭이 닫힐 때 실행되는 이벤트. TODO : 표시된 행정구역 feature와 overlay를 삭제한다.
$("#district-tab").on("hidden.bs.tab", function (e) {
    console.log(e.target.id + " tab is now hidden");
});

//검색결과 도로명 탭이 보여질 때 실행되는 이벤트. TODO : API를 이용해 해당하는 도로를 지도 위에 feature와 overlay를 이용해 표시한다.
$("#road-tab").on("shown.bs.tab", function (e) {
    $("#road-result span[data-coord]").each(function () {
        const coord = $(this).attr("data-coord");
        console.log("Coordinate:", coord);
    });
});

//검색결과 도로명 탭이 닫힐 때 실행되는 이벤트. TODO : 표시된 도로명 feature와 overlay를 삭제한다.
$("#road-tab").on("hidden.bs.tab", function (e) {
    console.log(e.target.id + " tab is now hidden");
});

//좌표를 클릭했을 때 발생하는 이벤트. 콜랩스가 표출되며, 표출 시 발생하는 이벤트와, 표출 후 발생하는 이벤트를 처리한다.
$('#coordinate-collpase').on('show.bs.collapse', function () {
    $('#address-collpase').collapse('hide');
    $('#map-info-address').css('pointer-events', 'none');
}).on('shown.bs.collapse', function () {
    console.log('coordinate collapse has been fully shown');
    $('#map-info-address').css('pointer-events', 'auto');
});
  
//주소를 클릭했을 때 발생하는 이벤트. 콜랩스가 표출되며, 표출 시 발생하는 이벤트와, 표출 후 발생하는 이벤트를 처리한다.
$('#address-collpase').on('show.bs.collapse', function () {
    $('#coordinate-collpase').collapse('hide');
    $('#map-info-coordinate').css('pointer-events', 'none');
}).on('shown.bs.collapse', function () {
    console.log('address collapse has been fully shown');
    $('#map-info-coordinate').css('pointer-events', 'auto');
});
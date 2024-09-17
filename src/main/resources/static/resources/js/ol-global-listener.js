/**
 *  @author 김봉준
 *  @date   2023-07-31
 *  글로벌 영역에서 발생하는 이벤트 리스너를 관리하는 폴더
 */

//키보드 입력이 발생될 때 동작하는 이벤트 리스너. 조건문을 이용해 키 이벤트를 처리한다.
function keyDownEventListener(event){
    if (event.key === "Escape") {
        handleEscKeyEvent()
        return;
    }
}

//ESC키가 입력될 때 동작하는 함수
function handleEscKeyEvent() {
    if(printControl.isOpen()){
        console.log(printControl)
    }
    if (measurePolygon) {
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
            circleTooltipElement.parentNode.removeChild(circleTooltipElement);
        }
        map.removeInteraction(circlePolygon);
        addCircleInteraction();
        return;
    }

    if ($("#popup-content").length) {
        map.removeLayer(clickCurrentLayer);
        map.removeOverlay(clickCurrentOverlay);
        return
    }
    if (contextmenu.isOpen()) {
        contextmenu.closeMenu();
        return
    }
    if (cctvSelectCluster) {
        cctvSelectCluster.clear();
        return
    }
    
}

//카카오 좌표 <-> 행정구역 API를 전역 이벤트 리스너에 등록하는 함수
function addKakaoCoordinateToRegionApiEventListener(){
    $(document).on("kakaoregionapi", reverseGeoCodingToRegion);
}

//카카오 좌표 <-> 행정구역 API를 전역 이벤트 리스너에서 해제하는 함수
function removeKakaoCoordinateToRegionApiEventListener(){
    $(document).off("kakaoregionapi");
}


//카카오 좌표 <-> 주소 API를 전역 이벤트 리스너에 등록하는 함수
function addKakaoReverseGeocodingApiEventListener(){
    $(document).on("kakaorgapi", reverseGeoCoding);
}

//카카오 좌표 <-> 주소 API를 전역 이벤트 리스너에 등록하는 함수
function removeKakaoReverseGeocodingApiEventListener(){
    $(document).off("kakaorgapi");
}

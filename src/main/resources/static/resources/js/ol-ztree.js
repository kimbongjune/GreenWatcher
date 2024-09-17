/**
 *  @author 김봉준
 *  @date   2023-07-25
 *  서비스의 zTree 객체를 관리하는 파일
 */

const zTreeLayerOpenIcon = zTreeLayerOpenIconSrc;
const zTreeLayerItemIcon = zTreeLayerItemIconSrc;

//행정주제도 zTree Setting
const administrativeZTreeSetting = {
    check: {
        enable: true,
        autoCheckTrigger: true,
    },
    data: {
        simpleData: {
            enable: true,
        },
    },
    view: {
        addDiyDom: addDiyDom,
    },
    callback: {
        onCheck: administrativeNodeChecked,
        beforeClick: function (treeId, treeNode, clickFlag) {
            return false;
        },
    },
};

//기본수치지도 zTree Setting
const basicZTreeSetting = {
    check: {
        enable: true,
        autoCheckTrigger: true,
    },
    data: {
        simpleData: {
            enable: true,
        },
    },
    view: {
        addDiyDom: addDiyDom,
    },
    callback: {
        onCheck: basicNodeChecked,
        beforeClick: function (treeId, treeNode, clickFlag) {
            return false;
        },
    },
};

//행정주제도의 tree node 객체
const administrativeThematicMapNodes = [
    {
        id: 1,
        pId: 0,
        name: "용도지역",
        open: true,
        iconClose: zTreeLayerOpenIcon,
        iconOpen: zTreeLayerOpenIcon,
    },
    {
        id: 11,
        pId: 1,
        name: "도시지역",
        icon: zTreeLayerItemIcon,
    },
    {
        id: 12,
        pId: 1,
        name: "관리지역",
        icon: zTreeLayerItemIcon,
    },
    {
        id: 13,
        pId: 1,
        name: "농림지역",
        icon: zTreeLayerItemIcon,
    },
    {
        id: 14,
        pId: 1,
        name: "자연환경보전지역",
        icon: zTreeLayerItemIcon,
    },
    {
        id: 15,
        pId: 1,
        name: "개발제한구역",
        icon: zTreeLayerItemIcon,
    },
    {
        id: 16,
        pId: 1,
        name: "개발행위허가제한지역",
        icon: zTreeLayerItemIcon,
    },
    {
        id: 2,
        pId: 0,
        name: "환경/보호관리",
        open: true,
        iconClose: zTreeLayerOpenIcon,
        iconOpen: zTreeLayerOpenIcon,
    },
    {
        id: 21,
        pId: 2,
        name: "생태자연도",
        icon: zTreeLayerItemIcon,
    },
    {
        id: 22,
        pId: 2,
        name: "국토환경성평가도",
        icon: zTreeLayerItemIcon,
    },
    {
        id: 23,
        pId: 2,
        name: "상수원보호도",
        icon: zTreeLayerItemIcon,
    },
    {
        id: 24,
        pId: 2,
        name: "문화재보호도",
        icon: zTreeLayerItemIcon,
    },
];

//기본수치지도 tree node 객체
const basicThematicMapNodes = [
    {
        id: 3,
        pId: 0,
        name: "기본도",
        open: true,
        iconClose: zTreeLayerOpenIcon,
        iconOpen: zTreeLayerOpenIcon,
    },
    {
        id: 31,
        pId: 3,
        name: "기상 레이더영상",
        icon: zTreeLayerItemIcon,
    },
    {
        id: 32,
        pId: 3,
        name: "도로 CCTV",
        icon: zTreeLayerItemIcon,
    },
    {
        id: 33,
        pId: 3,
        name: "전국도로",
        icon: zTreeLayerItemIcon,
    },
    {
        id: 34,
        pId: 3,
        name: "건물",
        icon: zTreeLayerItemIcon,
    },
    {
        id: 35,
        pId: 3,
        name: "연속지적도",
        icon: zTreeLayerItemIcon,
    },
    {
        id: 4,
        pId: 3,
        name: "행정경계",
        open: false,
        iconClose: zTreeLayerOpenIcon,
        iconOpen: zTreeLayerOpenIcon,
    },
    {
        id: 41,
        pId: 4,
        name: "시도경계",
        icon: zTreeLayerItemIcon,
    },
    {
        id: 42,
        pId: 4,
        name: "시군구경계",
        icon: zTreeLayerItemIcon,
    },
    {
        id: 43,
        pId: 4,
        name: "읍면동경계",
        icon: zTreeLayerItemIcon,
    },
    {
        id: 44,
        pId: 4,
        name: "리경계",
        icon: zTreeLayerItemIcon,
    },
];


//행정주제도의 zTree를 초기화 하고 해당 객체를 담는 변수. 트리가 추가 될 엘리먼트, setting 값, node 객체를 이용해 초기화 한다.
const administrativeThematicMapTree = $.fn.zTree.init(
    $("#administractive-thematic-map-node"),
    administrativeZTreeSetting,
    administrativeThematicMapNodes
);

//행정주제도의 모두체크 버튼을 클릭했을 때 발생하는 이벤트. 트리 객체 전체를 체크한다.
$("#administractive-thematic-map-treeview-check-all").on("click", function () {
    //모두 체크
    administrativeThematicMapTree.checkAllNodes(true);
});

//행정주제도의 모두체크 해제 버튼을 클릭했을 때 발생하는 이벤트. 트리 객체 전체를 체크 해제한다.
$("#administractive-thematic-map-treeview-uncheck-all").on(
    "click",
    function () {
        administrativeThematicMapTree.checkAllNodes(false);
    }
);

//행정주제도의 모두펼침 버튼을 클릭했을 때 발생하는 이벤트. 접혀있는 트리 객체 전체를 펼친다.
$("#administractive-thematic-map-treeview-expand-all").on("click", function () {
    administrativeThematicMapTree.expandAll(true);
});

//행정주제도의 모두접음 버튼을 클릭했을 때 발생하는 이벤트. 펼쳐져 있는 트리 객체 전체를 접는다.
$("#administractive-thematic-map-treeview-collapse-all").on(
    "click",
    function () {
        administrativeThematicMapTree.expandAll(false);
    }
);

//기본수치지도의 zTree를 초기화 하고 해당 객체를 담는 변수. 트리가 추가 될 엘리먼트, setting 값, node 객체를 이용해 초기화 한다.
const basicThematicMapTree = $.fn.zTree.init(
    $("#basic-thematic-map-node"),
    basicZTreeSetting,
    basicThematicMapNodes
);

//기본수치지도의 모두체크 버튼을 클릭했을 때 발생하는 이벤트. 트리 객체 전체를 체크한다.
$("#basic-thematic-map-treeview-check-all").on("click", function () {
    basicThematicMapTree.checkAllNodes(true);
});

//기본수치지도의 모두체크 해제 버튼을 클릭했을 때 발생하는 이벤트. 트리 객체 전체를 체크 해제한다.
$("#basic-thematic-map-treeview-uncheck-all").on("click", function () {
    basicThematicMapTree.checkAllNodes(false);
});

//기본수치지도의 모두펼침 버튼을 클릭했을 때 발생하는 이벤트. 접혀있는 트리 객체 전체를 펼친다.
$("#basic-thematic-map-treeview-expand-all").on("click", function () {
    basicThematicMapTree.expandAll(true);
});

//기본수치지도의 모두접음 버튼을 클릭했을 때 발생하는 이벤트. 펼쳐져 있는 트리 객체 전체를 접는다.
$("#basic-thematic-map-treeview-collapse-all").on("click", function () {
    basicThematicMapTree.expandAll(false);
});

//zTree의 각 노드에 커스텀 엘리먼트를 추가하는 함수. range 엘리먼트를 추가하여 각 레이어의 opacity를 제어한다.
function addDiyDom(treeId, treeNode) {
    const aObj = $("#" + treeNode.tId + "_span");
    if ($("#diyBtn_" + treeNode.id).length > 0) return;
    const editStr =
        "<input type='range' id='diyBtn_space_" +
        treeNode.id +
        "' class='range-input' min='0' max='1' step='0.01' value='1' />";
    aObj.append(editStr);
    aObj.off("click"); // remove click event
    const rangeElement = $("#diyBtn_space_" + treeNode.id);
    //range의 밸류가 변경될 때 발생할 콜백 함수
    rangeElement.on("input", function (e) {
        const rangeValue = e.target.value;
        //console.log(treeNode, rangeValue);
        //레이어의 opacity를 변경하는 함수
        layerOpacityChage(treeNode, rangeValue);
        //하위노드가 존재한다면 하위 노드의 range 밸류도 같이 변경하기 위한 함수
        changeChildrenRange(treeNode, rangeValue);
    });
}

//range의 벨류가 변경될 때 발생하는 함수. 하위 노드가 존재한다면 부모 노드의 range 밸류가 변경될 때 같이 변경된다.
function changeChildrenRange(treeNode, newValue) {
    const childrenNodes = treeNode.children;
    if (childrenNodes) {
        for (let i = 0; i < childrenNodes.length; i++) {
            const childNode = childrenNodes[i];
            const childRangeElement = $("#diyBtn_space_" + childNode.id);
            childRangeElement.val(newValue); // 부모 노드의 range 값으로 설정
            //console.log(childNode, newValue);
            layerOpacityChage(childNode, newValue);
            changeChildrenRange(childNode, newValue); // 현재 노드의 자식 노드들도 변경
        }
    }
}

//행정주제도의 tree node의 체크 콜백 함수. 추후 함수의 내용은 추가할 예정
function administrativeNodeChecked(event, treeId, treeNode) {
    console.log(treeNode); // 체크된 노드에 대한 데이터가 출력됩니다.
}

//기본수치지도의 tree node의 체크 콜백 함수. node의 아이디 값, 체크 여부에 따라 특정 레이어를 지도 위에 표출한다.
function basicNodeChecked(event, treeId, treeNode) {
    //자식이 있는 노드에는 이벤트를 발생시키지 않는다.
    if (treeNode.children) {
        return;
    }
    switch (treeNode.id) {
        case 31: {
            //기상 레이더 레이어 표출 함수
            radarLayerChange(treeNode, treeId);
            break;
        }
        case 32: {
            //도로 CCTV 레이어 표출 함수
            cctvLayerChange(treeNode, treeId);
            break;
        }
        case 33: {
            //전국 도로 레이어 표출 함수
            roadLayerChange(treeNode.checked);
            break;
        }
        case 34: {
            //건물 레이어 표출 함수
            buildLayerChange(treeNode.checked);
            break;
        }
        case 35: {
            //연속지적도 표출 함수
            cadastralLayerChange(treeNode.checked);
            break;
        }
        case 41: {
            //시도 경계 표출 함수
            sidoLayerChange(treeNode.checked);
            break;
        }
        case 42: {
            //시군구 경계 표출 함수
            sigunLayerChange(treeNode.checked);
            break;
        }
        case 43: {
            //읍면동 경계 표출 함수
            dongLayerChange(treeNode.checked);
            break;
        }
        case 44: {
            //리 경계 표출 함수
            riLayerChange(treeNode.checked);
            break;
        }
    }
}

//기본수치지도의 tree node의 커스텀 엘리먼트 range의 콜백 함수. WMS feature의 투명도를 조절한다.
function layerOpacityChage(treeNode, opacity) {
    if (treeNode.children) {
        return;
    }
    const opacityInt = parseFloat(Number(opacity));
    switch (treeNode.id) {
        case 31: {
            if (webGlVectorLayer) {
                webGlVectorLayer.setOpacity(opacityInt);
            }
            //radarLayerChange(treeNode.checked)
            break;
        }
        case 32: {
            if (clusterLayer) {
                clusterLayer.setOpacity(opacityInt);
            }
            //cctvLayerChange(treeNode.checked)
            break;
        }
        case 33: {
            if (roadLayer) {
                roadLayer.setOpacity(opacityInt);
            }
            //roadLayerChange(treeNode.checked)
            break;
        }
        case 34: {
            if (buildingLayer) {
                buildingLayer.setOpacity(opacityInt);
            }
            //buildLayerChange(treeNode.checked)
            break;
        }
        case 35: {
            if (cadastralMapLayer) {
                cadastralMapLayer.setOpacity(opacityInt);
            }
            //cadastralLayerChange(treeNode.checked)
            break;
        }
        case 41: {
            if (sidoLayer) {
                sidoLayer.setOpacity(opacityInt);
            }
            //sidoLayerChange(treeNode.checked)
            break;
        }
        case 42: {
            if (sigunguLayer) {
                sigunguLayer.setOpacity(opacityInt);
            }
            //sigunLayerChange(treeNode.checked)
            break;
        }
        case 43: {
            if (myeondongLayer) {
                myeondongLayer.setOpacity(opacityInt);
            }
            //dongLayerChange(treeNode.checked)
            break;
        }
        case 44: {
            if (riLayer) {
                riLayer.setOpacity(opacityInt);
            }
            //riLayerChange(treeNode.checked)
            break;
        }
    }
}
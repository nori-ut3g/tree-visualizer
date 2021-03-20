import Tools from "./Tools.js";
import anime from "../../animeJS/lib/anime.es.js";

/*
    一度描写されたBox、Arrowは削除せずにOpacityで操作する。
    既にあるDivと新しいDivの差分でアニメーション
 */
export default class Draw {
    constructor(drawSettings) {
        this.targetDiv = document.getElementById(drawSettings.target);
        //animation
        this.needsAnimation = drawSettings.animation;
        this.animationInterval = drawSettings.interval;
        this.animationSteps = 0;
        this.delay = 10000;

        //info
        this.needsInfo = drawSettings.needsInfo;

        //log
        this.log = [];

        //position
        this.boxXMargin = 35;
        this.boxYMargin = 75;
        //
        this.boxXOffset = 0;
        this.boxYOffset = 50;
        if(this.needsAnimation){
            this.tl = anime.timeline({
                easing: 'easeOutExpo',
                duration: this.animationInterval
            });
        }
        // this.initBoxes(boxesData);
        // if(info) this.initInfoBox(info);
    }
    initData(dataConstructor,info) {
        if(this.needsInfo)this.refreshInfobox(info);
        this.dataConstructor = dataConstructor;

    }
    refreshBoxes() {

    }
    refreshArrows() {

    }

    refresh(dataConstructor,info) {
        this.refreshInfobox(info);
        this.dataConstructor = dataConstructor;

    }

    initInfoBox(info) {
        let infoDiv = document.createElement("div");
        infoDiv.setAttribute("id", `info`);
        infoDiv.style.position = "absolute";
        this.targetDiv.append(infoDiv)
        if(this.needsAnimation){
            this.tl.add({
                targets:infoDiv,
                duration:this.animationInterval,
                update: function (){infoDiv.innerHTML = info}
            },`${(this.animationSteps+1) * this.animationInterval+this.delay}`);
        }else{
            infoDiv.innerHTML = info;
        }
    }
    refreshInfobox(info) {
        let infoDiv = document.getElementById("info")
        this.tl.add({
            targets:infoDiv,
            duration:this.animationInterval,
            update: function (){infoDiv.innerHTML = info}
        },`${(this.animationSteps+1) * this.animationSteps+this.delay}`);
    }
    initBoxes(boxesData) {
        let currentConfig = this.setXYPosition(boxesData)
        let boxes = boxesData.boxes;
        for(let ID in boxes) {
            let boxDiv = boxes[ID].createBoxDiv();
            boxDiv.style.backgroundColor = currentConfig[ID].boxColor;
            boxDiv.style.top = this.boxYOffset + "px";
            boxDiv.style.top = this.boxYOffset + "px";
            this.targetDiv.append(boxDiv);
            this.tl.add({
                targets: boxDiv,
                easing: 'easeInOutQuad',
                translateX: currentConfig[ID].x,
                translateY: currentConfig[ID].y,
                opacity: 1
            }, `${(this.animationStep+1) * this.animationTime+this.delay}`)

            let arrows = boxes[ID].getArrows();
            for(let direction in arrows) {
                let arrow = arrows[direction];
                let arrowDiv = arrow.createArrowDiv();
                this.targetDiv.append(arrowDiv);
                arrowDiv.style.top = this.boxYOffset + "px";
                if(boxes[ID].getHasArrow()[direction]){
                    let x1 = currentConfig[ID].arrowTail.x;
                    let x2 = currentConfig[ID][direction+"ArrowHead"].x;
                    let y1 = currentConfig[ID].arrowTail.y;
                    let y2 = currentConfig[ID][direction+"ArrowHead"].y;
                    let lineDiv = document.getElementById("arrowLine-"  + ID + "-" + direction);
                    let length = MathTools.calcArrowLength(x1, x2, y1, y2);
                    lineDiv.style.width = 100*(2**0.5)-5 + "%" ;
                    arrowDiv.style.transformOrigin = "top left";

                    this.tl.add({
                        targets:arrowDiv,
                        width: length * Math.sqrt(2) / 2 + "px",
                        height: length * Math.sqrt(2) / 2 + "px",
                        easing: 'easeInOutQuad',
                        opacity: 1,
                        translateX: currentConfig[ID].arrowTail.x,
                        translateY: currentConfig[ID].arrowTail.y,
                        rotate:`${-45 + MathTools.calcArrowDeg(x1, x2, y1, y2)*180/Math.PI}deg`,
                    },`${(this.animationStep+1) * this.animationTime+this.delay}`);
                }
            }
        }
        this.log.push(currentConfig);
        this.animationStep ++;
    }


    notrefreshBoxes(boxesData,info) {
        this.refreshInfobox(info)
        let previousConfig = this.log[this.animationStep-1];
        let currentConfig = this.setXYPosition(boxesData);
        let boxes = boxesData.boxes;

        //add
        let addList = this.filterAddBox(previousConfig, currentConfig);
        for(let ID of addList) {
            let boxDiv = boxes[ID].createBoxDiv();
            boxDiv.style.backgroundColor = currentConfig[ID].boxColor;
            boxDiv.style.color = currentConfig[ID].textColor;
            boxDiv.style.opacity = 0;
            boxDiv.style.top = this.boxYOffset + "px";
            this.targetDiv.append(boxDiv);
            this.tl.add({
                easing: 'easeInOutQuad',
                targets: boxDiv,
                translateX: currentConfig[ID].x,
                translateY: currentConfig[ID].y,
                opacity: 1,
                duration:this.animationTime,
            },`${(this.animationStep+1) * this.animationTime+this.delay}`)

            //Boxと同時にArrowもopacity0で挿入する。
            //もしかしたらオブジェクトはいらないかも
            let arrows = boxes[ID].getArrows();
            for(let direction in arrows) {
                let arrow = arrows[direction];
                let arrowDiv = arrow.createArrowDiv();
                this.targetDiv.append(arrowDiv);

                let x1 = currentConfig[ID].arrowTail.x;
                let x2 = currentConfig[ID][direction+"ArrowHead"] === null ? 0 :currentConfig[ID][direction+"ArrowHead"].x;
                let y1 = currentConfig[ID].arrowTail.y;
                let y2 = currentConfig[ID][direction+"ArrowHead"]=== null ? this.boxYOffset :currentConfig[ID][direction+"ArrowHead"].y;

                let lineDiv = document.getElementById("arrowLine-"  + ID + "-" + direction);
                let length = MathTools.calcArrowLength(x1, x2, y1, y2);
                lineDiv.style.width = 100*(2**0.6)+"%";
                arrowDiv.style.transformOrigin = "top left";
                arrowDiv.style.opacity = 0;
                arrowDiv.style.top = this.boxYOffset + "px";
                if(boxes[ID].getHasArrow()[direction]){
                    this.tl.add({
                        targets:arrowDiv,
                        width: length * Math.sqrt(2) / 2+ "px",
                        height: length * Math.sqrt(2) / 2+ "px",
                        easing: 'easeInOutQuad',
                        // direction: 'alternate',
                        opacity: 1,
                        translateX: currentConfig[ID].arrowTail.x,
                        translateY: currentConfig[ID].arrowTail.y,
                        rotate:`${-45 + MathTools.calcArrowDeg(x1, x2, y1, y2)*180/Math.PI}deg`,
                    },`${(this.animationStep+1) * this.animationTime+this.delay}`);
                }
            }
        }


        //change
        let changeList = this.filterChangeBox(previousConfig, currentConfig);
        let changeArrowList = this.filterChangeArrow(previousConfig, currentConfig);
        for(let ID of changeArrowList){
            let arrows = boxes[ID].getArrows();
            for(let direction in arrows) {
                let arrow = arrows[direction];
                let arrowDiv = document.getElementById("arrow-"  + ID + "-" + direction)

                if(!boxes[ID].getHasArrow()[direction]){
                    this.tl.add({
                        targets:arrowDiv,
                        opacity:0
                    },`${(this.animationStep+1) * this.animationTime+this.delay}`);
                }else{
                    let x1 = currentConfig[ID].arrowTail.x
                    let x2 = currentConfig[ID][direction+"ArrowHead"].x
                    let y1 = currentConfig[ID].arrowTail.y
                    let y2 = currentConfig[ID][direction+"ArrowHead"].y
                    let lineDiv = document.getElementById("arrowLine-"  + ID + "-" + direction)
                    let length = MathTools.calcArrowLength(x1, x2, y1, y2)
                    lineDiv.style.width = 100*(2**0.5)-5+"%"//length - thickness+ "px";
                    arrowDiv.style.transformOrigin = "top left";
                    // arrowDiv.style.opacity = 0;
                    this.tl.add({
                        targets:arrowDiv,
                        width: length * Math.sqrt(2) / 2+ "px",
                        height: length * Math.sqrt(2) / 2+ "px",
                        easing: 'easeInOutQuad',
                        // direction: 'alternate',
                        opacity: 1,
                        translateX: currentConfig[ID].arrowTail.x,
                        translateY: currentConfig[ID].arrowTail.y,
                        rotate:`${-45 + MathTools.calcArrowDeg(x1, x2, y1, y2)*180/Math.PI}deg`,
                    },`${(this.animationStep+1) * this.animationTime+this.delay}`);
                }
            }
        }

        for(let ID of changeList) {
            let boxDiv = document.getElementById("box-" + ID);
            // console.log(boxDiv)
            this.tl.add({
                targets: boxDiv,
                easing: 'easeInOutQuad',
                translateX: currentConfig[ID].x,
                translateY: currentConfig[ID].y,
                backgroundColor:currentConfig[ID].boxColor,
                duration:this.animationTime
            },`${(this.animationStep+1) * this.animationTime+this.delay}`)
        }

        //delete 実際には消していない、opacityを０にする
        let deleteList = this.filterDeleteBox(previousConfig, currentConfig);
        let deleteArrowList = this.filterDeleteArrow(previousConfig, currentConfig)
        for(let ID of deleteList) {
            let boxDiv = document.getElementById("box-" + ID);

            this.tl.add({
                targets: boxDiv,
                opacity: 0,
                duration:this.animationTime,
            },`${(this.animationStep+1) * this.animationTime+this.delay}`)

            let directions = ["left", "right"]
            //親のBoxを探して削除する必要がある…
            for(let direction of directions) {
                let arrowDiv = document.getElementById("arrow-"  + ID + "-" + direction);
                this.tl.add({
                    targets:arrowDiv,
                    easing: 'easeInOutQuad',
                    // direction: 'alternate',arrow-37-
                    opacity: 0,
                },`${(this.animationStep+1) * this.animationTime+this.delay}`);
            }
        }

        for(let config of deleteArrowList){
            // let config = {"ID":ID,"isDeleteLeft":true,"isDeleteRight":true}
            let ID = config["ID"];
            if(config.isDeleteLeft){
                let arrowDiv = document.getElementById("arrow-"  + ID + "-" + "left" )
                this.tl.add({
                    targets: arrowDiv,
                    opacity:0,
                    easing: 'easeInOutQuad',

                    duration:this.animationTime
                },`${(this.animationStep+1) * this.animationTime+this.delay}`)
            }
            if(config.isDeleteRight){
                let arrowDiv = document.getElementById("arrow-"  + ID + "-" + "right" )
                this.tl.add({
                    targets: arrowDiv,
                    opacity:0,
                    duration:this.animationTime
                },`${(this.animationStep+1) * this.animationTime+this.delay}`)
            }
        }



        this.log.push(currentConfig);
        this.animationStep ++;

    }
    //削除するBox

    filterDeleteBox(previousConfig, currentConfig) {
        let deleteIDList = [];
        for(let ID in previousConfig) {
            if(!currentConfig[ID]) deleteIDList.push(ID)
        }
        return deleteIDList;
    }
    filterDeleteArrow(previousConfig, currentConfig) {
        let deleteIDList = [];
        for(let ID in previousConfig){
            if(!currentConfig[ID]){
                let config = {"ID":ID,"isDeleteLeft":true,"isDeleteRight":true}
                deleteIDList.push(config)

            }else{
                let config = {"ID":ID,"isDeleteLeft":false,"isDeleteRight":false};
                if(!currentConfig[ID]["leftArrowHead"]){
                    config["isDeleteLeft"] = true;
                }
                if(!currentConfig[ID]["rightArrowHead"]){
                    config["isDeleteRight"] = true;
                }
            }
        }
        return deleteIDList;
    }


    //追加するbox

    filterAddBox(previousConfig, currentConfig) {
        let addIDList = [];
        for(let ID in currentConfig) {
            if (!previousConfig[ID]) addIDList.push(ID)
        }
        return addIDList;
    }

    //
    filterAddArrow(previousConfig, currentConfig){
        let addIDList = [];
        for(let ID in currentConfig) {
            if (!previousConfig[ID]) addIDList.push(ID)
        }
        return addIDList;
    }
    //変化させるbox
    filterChangeBox(previousConfig, currentConfig) {
        let changeIDList = [];
        for(let ID in currentConfig) {
            if(currentConfig[ID]){
                if(!previousConfig[ID]){
                    changeIDList.push(ID);
                    continue;
                }

                for(let element in currentConfig[ID]) {
                    if(currentConfig[ID]["x"] !== previousConfig[ID]["x"]){
                        changeIDList.push(ID);
                        break;
                    }
                    if(currentConfig[ID]["y"] !== previousConfig[ID]["y"]){
                        changeIDList.push(ID);
                        break;
                    }
                    if(currentConfig[ID]["boxColor"] !== previousConfig[ID]["boxColor"]){
                        changeIDList.push(ID);
                        break;
                    }
                    if(currentConfig[ID]["textColor"] !== previousConfig[ID]["textColor"]){
                        changeIDList.push(ID);
                        break;
                    }

                }
            }
        }
        return changeIDList;
    }
    filterChangeArrow(previousConfig, currentConfig) {
        let changeIDList = [];

        for(let ID in currentConfig) {
            if(currentConfig[ID]) {
                if(!previousConfig[ID]) continue;

                for (let element in currentConfig[ID]) {

                    if (currentConfig[ID]["arrowTail"] !== previousConfig[ID]["arrowTail"]) {
                        changeIDList.push(ID);
                        break;
                    }
                    if (currentConfig[ID]["leftArrowHead"] !== previousConfig[ID]["leftArrowHead"]) {
                        changeIDList.push(ID);
                        break;
                    }
                    if (currentConfig[ID]["rightArrowHead"] !== previousConfig[ID]["rightArrowHead"]) {
                        changeIDList.push(ID);
                        break;
                    }
                }
            }
        }
        return changeIDList;
    }



    setRootsPosition(){
        let roots = this.dataConstructor.getRootIDs();
        let tmpRootYPosition = 0;
        let rootsPositionList = {};
        for(let root of roots){
            let maxDepth = this.dataConstructor.getMaxDepth(root);
            let drawingAreaWidth = this.boxXMargin * (2 ** (maxDepth-1) + 1);
            let drawingAreaHeight = this.boxYMargin * (maxDepth-1);
            let rootYPosition = tmpRootYPosition;
            tmpRootYPosition += drawingAreaHeight;

            let rootXPosition = Number(drawingAreaWidth) / 2;

            rootsPositionList[root.getID()] = {
                "x":rootXPosition,
                "y":rootYPosition
            }
        }

        // let boxes = boxesData.boxes;
        // let rootIDList = boxesData.rootID;
        // let maxDepthList = boxesData.maxDepth;
        //
        // let rootsPositionList = {};
        // let tmpRootYPosition = 0;
        // for(let i = 0; i < rootIDList.length; i++ ) {
        //     let rootID = rootIDList[i];
        //     let maxDepth = maxDepthList[i];
        //     let drawingAreaWidth = this.boxXMargin * (2 ** (maxDepth-1) + 1);
        //     let drawingAreaHeight = this.boxYMargin * (maxDepth-1);
        //     let rootYPosition = tmpRootYPosition;
        //     tmpRootYPosition += drawingAreaHeight;
        //
        //     let rootXPosition = Number(drawingAreaWidth) / 2;
        //
        //     rootsPositionList[rootID] = {
        //         "x":rootXPosition,
        //         "y":rootYPosition
        //     }
        // }
        return rootsPositionList;
    }

    //log
    /*
    ID:{
    rootID
    x,y:
    boxColor:
    textColor:
    }
     */

    setCurrentLog() {
        this.log.push({box:{},arrow:{}});
        this.log[this.log.length-1].box = this.setBoxXYConfig();
        this.log[this.log.length-1].box = this.setArrowXYConfig();

    }
    setBoxXYConfig() {
        let config = {};
        let nodes = this.dataConstructor.getNodes();
        let rootPositionList = this.setRootsPosition();
        for(let node of nodes) {
            let boxSize = node.getBoxSize();
            let rootID = node.getMyRootID();
            let boxX = (Tools.binToInt(node.getPosition())*2+1) * (rootPositionList[rootID].x * 2)/(2**(node.getPosition().length+1)) - boxSize.width/2;
            let boxY = node.getPosition().length * this.boxYMargin + rootPositionList[rootID].y;

            config[node.getID()] = {
                x: boxX,
                y: boxY,
                boxColor: node.getBoxColor(),
                textColor: node.getTextColor(),

            }
        }
        return config;
    }
    setArrowXYConfig() {

        let boxes = this.dataConstructor.getBoxes();
        let log
        //nodeが新たに加わったか確認
        //nodeが
        /*
        ID:{
        Head x y:
        Tail x y:
        color:

        }
         */


    }

    notsetXYPosition(boxesData) {


        let rootPositionList = this.setRootsPosition(boxesData);
        let xyPositions = {

        };
        let boxes = boxesData.boxes;
        let config = {}
        for(let ID in boxes) {
            let box = boxes[ID];
            let boxSize = box.getBoxSize();
            let rootID = box.getRootID();
            let boxX = (Tools.binToInt(box.getPosition())*2+1) * (rootPositionList[rootID].x * 2)/(2**(box.getPosition().length+1));
            let boxY = box.getPosition().length * this.boxYMargin + rootPositionList[rootID].y;
            let arrowTail = {"x":boxX,"y":boxY+boxSize.width};
            let leftArrowHead = null;
            if(box.getHasArrow()["left"] ){
                leftArrowHead = {"x":(MathTools.binToInt(box.getPosition().concat([0]))*2+1) * (rootPositionList[rootID].x * 2)/(2**(box.getPosition().length+2)) ,"y":arrowTail.y+this.boxYMargin-box.size.height};
            }
            let rightArrowHead = null;
            if(box.getHasArrow()["right"]){
                rightArrowHead = {"x":(MathTools.binToInt(box.getPosition().concat([1]))*2+1) * (rootPositionList[rootID].x * 2)/(2**(box.getPosition().length+2)),"y":arrowTail.y+this.boxYMargin-box.size.height};
            }
            config[ID] = {
                "x":(MathTools.binToInt(box.getPosition())*2+1) * (rootPositionList[rootID].x * 2)/(2**(box.getPosition().length+1)) - box.size.width/2,
                "y":box.getPosition().length * this.boxYMargin + rootPositionList[rootID].y,
                "boxColor":box.getBoxColor(),
                "textColor":box.getTextColor(),
                "arrowTail":arrowTail,
                "leftArrowHead":leftArrowHead,
                "rightArrowHead":rightArrowHead
            }
        }
        return config;
    }

}
/*
arrowを動かす案
１，ボックスが移動してからすっと現れる
opacity0から１へ
すでに矢印があるときはボックスと共に平行移動

基本ボックスと同じように移動させる
ただ、ボックス間の間隔が変わったときは、角度とか色々変化させないといけない


２，左上からそのまましゅっと移動


 */
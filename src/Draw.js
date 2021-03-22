import Tools from "./Tools.js";
import anime from "../../animeJS/anime.es.js";

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
        this.log = [{box:{},arrow:{}}];

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
        if(info) this.initInfoBox(info);
    }
    initData(dataConstructor,info) {
        if(this.needsInfo)this.refreshInfobox(info);
        this.dataConstructor = dataConstructor;

    }


    refresh(dataConstructor,info) {
        this.refreshInfobox(info);
        this.dataConstructor = dataConstructor;
        this.setCurrentLog();
        this.refreshBox();
        this.refreshArrow();
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
        return rootsPositionList;
    }

    refreshBox() {
        //change
        let prevBoxConfig = this.log[this.log.length-2].box;
        let nextBoxConfig = this.log[this.log.length-1].box;
        let nodes = this.dataConstructor.getNodes();

        //add
        for(let ID in nextBoxConfig) {
            let newBoxDiv;
            if (!prevBoxConfig[ID]){
                if(document.getElementById(ID)){
                    newBoxDiv = document.getElementById(ID);
                }else{
                    newBoxDiv = nodes[ID].createBoxDiv();
                    newBoxDiv.style.opacity = 0;
                    newBoxDiv.style.top = this.boxYOffset + "px";
                    this.targetDiv.append(newBoxDiv);
                }
                this.tl.add({
                    easing: 'easeInOutQuad',
                    targets: newBoxDiv,
                    translateX: nextBoxConfig[ID].boxXY.x,
                    translateY: nextBoxConfig[ID].boxXY.y,
                    opacity: 1,
                    duration:this.animationInterval,
                }`${(this.animationSteps+1) * this.animationInterval+this.delay}`)
            }

            //change
            else{
                let boxDiv = document.getElementById(ID);
                this.tl.add({
                    targets: boxDiv,
                    easing: 'easeInOutQuad',
                    translateX: nextBoxConfig[ID].boxXY.x,
                    translateY: nextBoxConfig[ID].boxXY.y,
                    backgroundColor:nextBoxConfig[ID].boxColor,
                    duration:this.animationInterval
                },`${(this.animationSteps+1) * this.animationInterval+this.delay}`)
            }
        }

        //delete
        for(let ID in prevBoxConfig) {
            if (!nextBoxConfig[ID]){
                let boxDiv = document.getElementById(ID);
                this.tl.add({
                    targets: boxDiv,
                    opacity: 0,
                    duration:this.animationInterval,
                },`${(this.animationSteps+1) * this.animationInterval+this.delay}`)
            }
        }
    }

    refreshArrow() {
        //change
        let prevArrowConfig = this.log[this.log.length-2].arrow;
        let nextArrowConfig = this.log[this.log.length-1].arrow;
        let nodes = this.dataConstructor.getNodes();

        //add
        for(let ID in nextArrowConfig) {
            if (!prevArrowConfig[ID]){
                let setting = {
                    id:ID,
                    color:nextArrowConfig.arrowColor
                }
                let newArrow;
                if(document.getElementById(ID)) {
                    newArrow = document.getElementById(ID);
                }else{
                    newArrow = Tools.createArrowDiv(setting);
                    newArrow.style.opacity = 0;
                    newArrow.style.top = this.boxYOffset + "px";
                    this.targetDiv.append(newArrow);
                }
                this.tl.add({
                    easing: 'easeInOutQuad',
                    targets: newArrow,
                    translateX: nextArrowConfig[ID].boxXY.x,
                    translateY: nextArrowConfig[ID].boxXY.y,
                    opacity: 1,
                    duration:this.animationInterval,
                }`${(this.animationSteps+1) * this.animationInterval+this.delay}`)
            }
            //change
            else{
                let arrowDiv = document.getElementById(ID);
                this.tl.add({
                    targets: arrowDiv,
                    easing: 'easeInOutQuad',
                    translateX: nextArrowConfig[ID].boxXY.x,
                    translateY: nextArrowConfig[ID].boxXY.y,
                    backgroundColor:nextArrowConfig[ID].boxColor,
                    duration:this.animationInterval
                },`${(this.animationSteps+1) * this.animationInterval+this.delay}`)
            }
        }

        //delete
        for(let ID in prevArrowConfig) {
            if (!nextArrowConfig[ID]){
                let arrowDiv = document.getElementById(ID);
                this.tl.add({
                    targets: arrowDiv,
                    opacity: 0,
                    duration:this.animationInterval,
                },`${(this.animationSteps+1) * this.animationInterval+this.delay}`)
            }
        }
    }


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
            node.setBoxXY(boxX, boxY);
            config[node.getID()] = {
                boxXY:{x:boxX, y:boxY},
                boxColor: node.getBoxColor(),
                textColor: node.getTextColor()
            }
        }
        return config;
    }
    setArrowXYConfig() {
        let config = {};
        let nodes = this.dataConstructor.getNodes();

        for(let node of nodes) {
            let arrowTailX = node.getBoxXY().x;
            let arrowTailY = node.getBoxXY().y + node.getBoxSize();
            if(node.left) {
                let arrowHeadX = node.left.getBoxXY().x;
                let arrowHeadY = node.left.getBoxXY().y;
                let arrowColor = node.getArrowColor("left");
                config[node.getID()+"-"+"left"] = {
                    headXY:{x:arrowHeadX,y:arrowHeadY},
                    tailXY:{x:arrowTailX,y:arrowTailY},
                    arrowColor: arrowColor
                }
            }
            if(node.right) {
                let arrowHeadX = node.right.getBoxXY().x;
                let arrowHeadY = node.right.getBoxXY().y;
                let arrowColor = node.getArrowColor("right");
                config[node.getID()+"-"+"right"] = {
                    headXY:{x:arrowHeadX,y:arrowHeadY},
                    tailXY:{x:arrowTailX,y:arrowTailY},
                    arrowColor: arrowColor
                }
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
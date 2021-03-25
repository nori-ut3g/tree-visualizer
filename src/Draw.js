import Tools from "./Tools.js";
import anime from "../animeJS/anime.es.js";

export default class Draw {
    constructor(drawSettings) {
        this.drawSettings = drawSettings;
    }
    initDraw(info) {
        this.targetDiv = document.getElementById(this.drawSettings.target);
        this.targetDiv.innerHTML = "";
        this.targetDiv.style.position = "relative"
        //animation
        this.needsAnimation = this.drawSettings.animation;
        this.animationInterval = this.drawSettings.interval;
        this.animationSteps = 0;
        this.delay = 0;

        //info
        this.needsInfo = this.drawSettings.needsInfo;

        //log
        this.log = [{box:{},arrow:{}}];

        //position
        this.boxXMargin = this.drawSettings.boxXMargin;
        this.boxYMargin = this.drawSettings.boxYMargin;
        //
        // this.boxXOffset = 0;
        this.boxYOffset = 0;
        // if(this.needsAnimation){
        this.tl = anime.timeline({
            easing: 'easeOutExpo',
            // duration: this.animationInterval
        });
        // }
        let infoDiv = document.createElement("div");
        infoDiv.setAttribute("id", this.drawSettings.target + "-" +`info`);
        this.targetDiv.append(infoDiv)
        infoDiv.innerHTML = info


        this.parentDiv = document.createElement("div")
        this.parentDiv.setAttribute("id", this.drawSettings.target+"-parent");
        this.parentDiv.style.marginLeft = "auto";
        this.parentDiv.style.marginRight = "auto";


        this.targetDiv.append(this.parentDiv)



    }
    refresh(dataConstructor,info) {
        this.dataConstructor = dataConstructor;
        this.setParentSize();
        this.setCurrentLog();
        this.refreshBox();
        this.refreshArrow();
        this.refreshInfobox(info);
        this.animationSteps++;
    }


    refreshInfobox(info) {
        let infoDiv = document.getElementById(this.drawSettings.target + "-" + "info")
        this.tl.add({
            update: function (){infoDiv.innerHTML = info},
            duration: this.animationSteps === 0 ? 1 : this.animationInterval,//durationを0にすると、Styleの初期設定が変わるので1に設定する
        },`${(this.animationSteps) * this.animationInterval+this.delay}`)
    }
    setParentSize() {
        let roots = this.dataConstructor.getRootID();
        let height = 0;
        let width = 0;
        for(let rootID of roots) {
            let root = this.dataConstructor.getNodes()[rootID];
            let maxDepth = this.dataConstructor.getMaxDepth(root);
            let rootMaxHeight = this.boxYMargin * (maxDepth);
            let rootMaxWidth = this.boxXMargin * (2 ** (maxDepth - 1) + 1);
            height += rootMaxHeight;
            width = rootMaxWidth > width ? rootMaxWidth : width;
        }
        this.parentDiv.style.height = height + "px";
        this.parentDiv.style.width = width + "px";
    }
    setRootsPosition(){
        let roots = this.dataConstructor.getRootID();
        let tmpRootYPosition = 0;
        let rootsPositionList = {};
        for(let rootID of roots){
            let root = this.dataConstructor.getNodes()[rootID];
            let maxDepth = this.dataConstructor.getMaxDepth(root);
            let drawingAreaWidth = this.boxXMargin * (2 ** (maxDepth-1) + 1);
            let drawingAreaHeight = this.boxYMargin * (maxDepth);
            let rootYPosition = tmpRootYPosition + this.boxYMargin;
            tmpRootYPosition += drawingAreaHeight;

            let rootXPosition = Number(drawingAreaWidth) / 2;
            rootsPositionList[rootID] = {
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

                if(document.getElementById(this.drawSettings.target + "-" + ID)){
                    console.log("test")
                    newBoxDiv = document.getElementById(this.drawSettings.target + "-" + ID);
                }else{
                    newBoxDiv = nodes[ID].createBoxDiv(this.drawSettings.target);
                    newBoxDiv.style.opacity = 0;
                    newBoxDiv.style.top = this.boxYOffset + "px";
                    this.parentDiv.append(newBoxDiv);
                }
                // newBoxDiv.style.opacity = 1;
                console.log("test",newBoxDiv)
                this.tl.add({
                    easing: 'easeInOutQuad',
                    targets: newBoxDiv,
                    translateX: nextBoxConfig[ID].boxXY.x,
                    translateY: nextBoxConfig[ID].boxXY.y,
                    color:nextBoxConfig[ID].textColor,
                    backgroundColor:nextBoxConfig[ID].boxColor,

                    opacity: 1,
                    duration: this.animationSteps === 0 ? 1 : this.animationInterval,//durationを0にすると、Styleの初期設定が変わるので1に設定する
                },`${(this.animationSteps) * this.animationInterval+this.delay}`)
            }

            //change
            else{
                let boxDiv = document.getElementById(this.drawSettings.target + "-" + ID);

                this.tl.add({
                    targets: boxDiv,
                    easing: 'easeInOutQuad',
                    translateX: nextBoxConfig[ID].boxXY.x,
                    translateY: nextBoxConfig[ID].boxXY.y,
                    // opacity: 1,

                    backgroundColor:nextBoxConfig[ID].boxColor,
                    duration: this.animationSteps === 0 ? 1 : this.animationInterval,//durationを0にすると、Styleの初期設定が変わるので1に設定する
                },`${(this.animationSteps) * this.animationInterval+this.delay}`)
            }
        }

        //delete
        for(let ID in prevBoxConfig) {
            if (!nextBoxConfig[ID]){
                let boxDiv = document.getElementById(this.drawSettings.target + "-" + ID);
                this.tl.add({
                    targets: boxDiv,
                    opacity: 0,
                    duration: this.animationSteps === 0 ? 1 : this.animationInterval,//durationを0にすると、Styleの初期設定が変わるので1に設定する
                },`${(this.animationSteps) * this.animationInterval+this.delay}`)
            }
        }
    }

    refreshArrow() {
        //change
        let prevArrowConfig = this.log[this.log.length-2].arrow;
        let nextArrowConfig = this.log[this.log.length-1].arrow;
        //add
        for(let ID in nextArrowConfig) {
            let setting = {
                id:this.drawSettings.target  + "-" + ID,
                arrowColor: this.drawSettings.arrowColor
            }
            let headX = nextArrowConfig[ID].headXY.x;
            let headY = nextArrowConfig[ID].headXY.y;
            let tailX = nextArrowConfig[ID].tailXY.x;
            let tailY = nextArrowConfig[ID].tailXY.y;
            if (!prevArrowConfig[ID]){
                let newArrow;
                if(document.getElementById(this.drawSettings.target  + "-" +ID)) {
                    newArrow = document.getElementById(this.drawSettings.target  + "-" + ID);
                }else{
                    newArrow = Tools.createArrowDiv(setting);
                    this.parentDiv.append(newArrow);
                }
                newArrow.style.opacity = 0;
                newArrow.style.top = this.boxYOffset + "px";
                let lineDiv = document.getElementById(this.drawSettings.target + "-" +ID + "-line");
                lineDiv.style.width = 100*(2**0.5)+"%";
                let lineLength = Tools.calcArrowLength(tailX,headX,tailY,headY);
                let lineDeg = -45 + Tools.calcArrowDeg(tailX,headX,tailY,headY)*180/Math.PI;
                newArrow.style.transformOrigin = "top left";
                lineDiv.style.opacity = 1;
                this.tl.add({
                    easing: 'easeInOutQuad',
                    targets: newArrow,
                    width: lineLength * Math.sqrt(2) / 2+ "px",
                    height: lineLength * Math.sqrt(2) / 2+ "px",
                    translateX: tailX+"px",
                    translateY: tailY+"px",
                    rotate:lineDeg+`deg`,
                    opacity: 1,
                    duration: this.animationSteps === 0 ? 1 : this.animationInterval,//durationを0にすると、Styleの初期設定が変わるので1に設定する
                },`${(this.animationSteps) * this.animationInterval+this.delay}`)
            }
            //change
            else{
                let arrowDiv = document.getElementById(this.drawSettings.target + "-" + ID);
                let lineLength = Tools.calcArrowLength(tailX,headX,tailY,headY);
                let lineDeg = -45 + Tools.calcArrowDeg(tailX,headX,tailY,headY)*180/Math.PI;
                this.tl.add({
                    easing: 'easeInOutQuad',
                    targets: arrowDiv,
                    width: lineLength * Math.sqrt(2) / 2+ "px",
                    height: lineLength * Math.sqrt(2) / 2+ "px",
                    translateX: tailX+"px",
                    translateY: tailY+"px",
                    rotate:lineDeg+`deg`,
                    duration: this.animationSteps === 0 ? 1 : this.animationInterval,//durationを0にすると、Styleの初期設定が変わるので1に設定する
                },`${(this.animationSteps) * this.animationInterval+this.delay}`)
            }
        }

        //delete
        for(let ID in prevArrowConfig) {
            if (!nextArrowConfig[ID]){
                let arrowDiv = document.getElementById(this.drawSettings.target + "-" + ID);
                this.tl.add({
                    targets: arrowDiv,
                    opacity: 0,
                    duration: this.animationSteps === 0 ? 1 : this.animationInterval,//durationを0にすると、Styleの初期設定が変わるので1に設定する
                },`${(this.animationSteps) * this.animationInterval+this.delay}`)
            }
        }
    }


    setCurrentLog() {
        this.log.push({box:{},arrow:{}});
        this.log[this.log.length-1].box = this.setBoxXYConfig();
        this.log[this.log.length-1].arrow = this.setArrowXYConfig();

    }

    setBoxXYConfig() {
        let config = {};
        let nodes = this.dataConstructor.getNodes();
        let rootPositionList = this.setRootsPosition();
        for(let node of Object.values(nodes)) {
            let boxSize = node.getBoxSize();
            let rootID = node.getMyRootID();
            let boxX = (Tools.binToInt(node.getPosition())*2+1) * (rootPositionList[rootID].x * 2)/(2**(node.getPosition().length+1)) - boxSize/2;
            boxX += this.parentDiv.clientWidth/2 - rootPositionList[rootID].x//真ん中へ移動
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

        for(let node of Object.values(nodes)) {
            let arrowTailX = node.getBoxXY().x + node.getBoxSize() / 2;
            let arrowTailY = node.getBoxXY().y + node.getBoxSize();
            if(node.left) {
                let arrowHeadX = node.left.getBoxXY().x + node.getBoxSize() / 2;
                let arrowHeadY = node.left.getBoxXY().y;
                config[node.getID()+"-"+"left"] = {
                    headXY:{x:arrowHeadX,y:arrowHeadY},
                    tailXY:{x:arrowTailX,y:arrowTailY},
                }
            }
            if(node.right) {
                let arrowHeadX = node.right.getBoxXY().x + node.getBoxSize() / 2;
                let arrowHeadY = node.right.getBoxXY().y;

                config[node.getID()+"-"+"right"] = {
                    headXY:{x:arrowHeadX,y:arrowHeadY},
                    tailXY:{x:arrowTailX,y:arrowTailY},
                }
            }
        }
        return config;
    }
}

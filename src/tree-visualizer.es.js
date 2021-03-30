import anime from "../../animejs/lib/anime.es.js"


export default function treeVisualizer(settings) {
    return new TreeVisualizerMain(settings);
}

class TreeVisualizerMain{
    constructor(settings) {
        this.drawSettings = {
            target : settings.target || "target",//表示させるDivID
            boxColor : settings.boxColor || 'rgb(233,203,107)',//Only rgb()
            textColor : settings.textColor || 'rgb(69,54,10)',//Only rgb()
            arrowColor : settings.arrowColor || "rgb(153,103,49)",//Only rgb()
            dataType : settings.dataType || "BinaryTree",
            interval :Number(settings.interval )|| 2000,// ms
            boxSize : Number(settings.boxSize) || 30,// px
            boxXMargin: Number(settings.boxXMargin) || 30,// px
            boxYMargin: Number(settings.boxYMargin) || 45,// px
        }
        this.draw = new Draw(this.drawSettings);
    }

    /*
    nodes:{
        data: string,
        ID: string,
        boxColor: string,
        textColor: string
    }
     */
    createBoxController(nodes) {
        switch (this.drawSettings.dataType) {
            case "BinaryTree":
                this.nodeController = new BinaryTreeController(nodes, this.drawSettings);
        }
    }


    /*
    Animationなしで描写。
    nodes:{
        data: string,
        ID: string,
        boxColor: string,
        textColor: string
    }
    info: string
     */
    drawData(nodes, info) {
        info = info || "";
        this.draw.initDraw(info);
        this.createBoxController(nodes);
        this.draw.refresh(this.nodeController, info);
    }

    /*
    drawData後、差分からAnimationを生成する。
    nodes:{
        data: string,
        ID: string,
        boxColor: string,
        textColor: string
    }
    info: string
     */
    nextStep(nodes, info) {
        info = info || "";
        this.nodeController.refreshNodes(nodes);
        this.draw.refresh(this.nodeController, info);
    }
}

class BinaryTreeController {
    constructor(nodes, drawingSettings) {
        this.defaultSettings = drawingSettings;
        this.refreshNodes(nodes);
    }
    /*
    inputData:{
        data: string,
        ID: string or null,
        boxColor: string or null,
        textColor: string or null
    }
     */
    refreshNodes(inputData) {
        this.nodes = {};
        this.rootIDList = [];
        for(let nodeList of inputData) {
            let dataLength = Tools.convertStringToArray(nodeList.data).length;
            let newNodeList = {
                data: Tools.convertStringToArray(nodeList.data),
                ID: Tools.convertStringToArray(nodeList.ID) || Tools.convertStringToArray(nodeList.data),
                boxColor:Tools.convertStringToRGBArray(nodeList.boxColor)  || Array(dataLength),
                textColor:Tools.convertStringToRGBArray(nodeList.textColor) || Array(dataLength)
            }
            this.deserialize(newNodeList.ID, newNodeList.data);
            this.setAllBoxConfig(newNodeList.ID, newNodeList.boxColor, newNodeList.textColor);
        }
        this.setBoxPosition();
    }

    /*
    nodeIDList: array
    boxColorList: array
    textColorList: array
     */
    setAllBoxConfig(nodeIDList, boxColorList, textColorList) {
        for(let i=0 ;i < boxColorList.length; i++) {
            let ID = nodeIDList[i];
            if(!this.nodes[ID]) continue;
            let boxConfig = {
                boxColor: boxColorList[i] || this.defaultSettings.boxColor,
                textColor: textColorList[i] || this.defaultSettings.textColor,
                boxSize: this.defaultSettings.boxSize
            }
            this.nodes[ID].setBoxConfig(boxConfig);
        }
    }
    setBoxPosition() {
        for(let i in this.rootIDList) {
            let root = this.nodes[this.rootIDList[i]];
            this.setBoxPositionHelper(root,this.rootIDList[i]);
        }
    }
    setBoxPositionHelper(node, rootID) {
        if (node != null){
            this.setBoxPositionHelper(node.setLeftBoxPositionFromRoot(rootID), rootID);
            this.setBoxPositionHelper(node.setRightBoxPositionFromRoot(rootID), rootID);
        }
    }

    /*
    nodeIDList: array
    nodeDataList: array
     */
    deserialize(nodeIDList, nodeDataList) {
        if(nodeDataList.length === 0) return null;
        let root = new BinaryTreeNode(nodeIDList[0], nodeDataList[0], nodeIDList[0]);
        this.nodes[nodeIDList[0]] = root;
        this.rootIDList.push(nodeIDList[0]);
        let queue = [root];
        let l = nodeDataList.length - 1;
        let i = 0;
        while(queue.length > 0){
            let curr = queue.shift();
            if(curr === null) continue;
            if(l >= ++i && nodeDataList[i] !== null){
                curr.left = new BinaryTreeNode(nodeIDList[i],nodeDataList[i], nodeIDList[0]);
                this.nodes[nodeIDList[i]] = curr.left;
                queue.push(curr.left);
            }
            if(l >= ++i && nodeDataList[i] !== null){
                curr.right = new BinaryTreeNode(nodeIDList[i],nodeDataList[i],nodeIDList[0]);
                this.nodes[nodeIDList[i]] = curr.right;
                queue.push(curr.right);
            }
        }
    }

    // -> array
    getRootIDList() {
        return this.rootIDList;
    }

    // -> map
    getNodes() {
        return this.nodes;
    }

    // BinaryTreeNode -> int
    getMaxDepth(root) {
        if(root === null) return 0;
        else return this.maxDepthHelper([root]);
    }
    maxDepthHelper(children) {
        let parents = children.slice();
        children = [];
        while(parents.length !== 0) {
            let node = parents.pop();
            if(node.left != null) children.push(node.left);
            if(node.right != null) children.push(node.right);
        }
        if(children.length) return this.maxDepthHelper(children) + 1;
        else return 1;
    }
}

class BinaryTreeNode {
    constructor(ID, stringData, rootID) {
        this.data = stringData;
        this.left = null;
        this.right = null;
        this.position = [];
        this.ID = ID;
        this.rootID = rootID;
        this.data = stringData;
        this.boxXY = {x:0,y:0};
    }

    // -> string or int
    getID() {
        return this.ID;
    }

    // -> string or int
    getMyRootID() {
        return this.rootID;
    }

    // -> string or int
    getBoxSize() {
        return this.boxConfig.boxSize;
    }

    // -> string or int
    getBoxColor() {
        return this.boxConfig.boxColor;
    }

    // -> string
    getTextColor() {
        return this.boxConfig.textColor;
    }

    /*
    ->
    {
        x: int,
        y: int
    }
     */
    getBoxXY() {
        return this.boxXY;
    }

    /*
    x: int
    y: int
     */
    setBoxXY(x,y) {
        this.boxXY.x = x;
        this.boxXY.y = y;
    }

    /*
    boxConfig {
    boxColor: string
    boxSize: int
    textColor: string
    }
     */
    setBoxConfig(boxConfig) {
        this.boxConfig = boxConfig;
    }

    /*
    parentID -> string(html)
     */
    createBoxDiv(parentDivID) {
        let boxDiv = document.createElement("div");
        boxDiv.setAttribute("id", parentDivID + "-" + `${this.ID}`);
        boxDiv.innerHTML = `<div>${this.data}</div>`;
        boxDiv.style.width = this.boxConfig.boxSize + "px";
        boxDiv.style.height = this.boxConfig.boxSize + "px";
        boxDiv.style.position = "absolute";
        boxDiv.style.display = "flex"
        boxDiv.style.flexDirection = "column";
        boxDiv.style.justifyContent = "center";
        boxDiv.style.alignItems = "center";
        boxDiv.style.borderRadius = 100 + "%";
        return boxDiv;
    }

    /*
    this.positionはルートから自分までのleft(0), right(1)の軌跡
    例：rootからleft,right,right の場合 [0,1,1]
     */
    setLeftBoxPositionFromRoot() {
        if(this.left === null) return null;
        this.left.setLeftPosition(this.getPosition());
        this.left.rootID = this.rootID;
        return this.left;
    }
    setRightBoxPositionFromRoot() {
        if(this.right === null) return null;
        this.right.setRightPosition(this.getPosition());
        this.right.rootID = this.rootID;
        return this.right;
    }
    setLeftPosition(parentPosition) {
        this.position = parentPosition.concat([0]);
    }
    setRightPosition(parentPosition) {
        this.position = parentPosition.concat([1]);
    }

    getPosition() {
        return this.position;
    }

}


/*
<div>  targetDiv
    <div> infoDiv
    </div>
    <div> parentDiv
        <div> boxDiv </div>
        <div> arrowDiv
            <div> arrowHead </div>
            <div> arrowLine </div>
        </div>
     </div>
</div>
 */
class Draw {
    constructor(drawSettings) {
        this.drawSettings = drawSettings;
    }

    initDraw(info) {
        this.targetDiv = document.getElementById(this.drawSettings.target);
        this.targetDiv.innerHTML = "";
        this.targetDiv.style.position = "relative"

        //animation
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

        //for debug
        this.boxXOffset = 0;
        this.boxYOffset = 0;
        this.tl = anime.timeline({
            easing: 'easeOutExpo',
        });

        // info
        let infoDiv = document.createElement("div");
        infoDiv.setAttribute("id", this.drawSettings.target + "-" +`info`);
        this.targetDiv.append(infoDiv);
        infoDiv.innerHTML = info || null;


        this.parentDiv = document.createElement("div")
        this.parentDiv.setAttribute("id", this.drawSettings.target+"-parent");
        this.targetDiv.append(this.parentDiv);
    }

    /*
    dataConstructor: Binary,
    info: string(html)
     */
    refresh(dataConstructor,info) {
        this.dataConstructor = dataConstructor;
        this.setParentSize();
        this.setCurrentLog();
        this.refreshBox();
        this.refreshArrow();
        this.refreshInfobox(info);
        this.animationSteps++;
    }

    /*
    info: string(html)
     */
    refreshInfobox(info) {
        let infoDiv = document.getElementById(this.drawSettings.target + "-" + "info");
        this.tl.add({
            update: function (){infoDiv.innerHTML = info},
            duration: this.animationSteps === 0 ? 1 : this.animationInterval,//durationを0にすると、Styleの初期設定が変わるので1に設定する
        },`${(this.animationSteps) * this.animationInterval+this.delay}`)
    }

    /*
    枠外のボックスをスクロールで表示できるようにParentDivの幅、高さを設定する。
     */
    setParentSize() {
        let roots = this.dataConstructor.getRootIDList();
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
        let parentDiv = document.getElementById(this.drawSettings.target+"-parent");
        if(Number(parentDiv.clientWidth) < width) parentDiv.style.width = width+"px";
        if(Number(parentDiv.clientHeight) < height) parentDiv.style.height = height+"px";
    }

    /*
    rootごとにポジションを計算
     */
    setRootsPosition(){
        let roots = this.dataConstructor.getRootIDList();
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

    /*
    前のLogとの差分をアニメーションにする。
     */
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
                    newBoxDiv = document.getElementById(this.drawSettings.target + "-" + ID);
                }else{
                    newBoxDiv = nodes[ID].createBoxDiv(this.drawSettings.target);
                    newBoxDiv.style.opacity = 0;
                    newBoxDiv.style.top = this.boxYOffset + "px";
                    this.parentDiv.append(newBoxDiv);
                }
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
                    color:nextBoxConfig[ID].textColor,
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

    /*
    前のLogとの差分をアニメーションにする。
     */
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

    /*
    this.log: {
        this.animationStep:{
            boxID: {
                boxXY:{x: int, y: int},
                boxColor: string,
                textColor: string
            },
            arrowID: {
                headXY:{x: int, y: int},
                tailXY:{x: int, y: int}
            }
        }
    }
     */
    setCurrentLog() {
        console.log(this.log)
        this.log.push({box:{},arrow:{}});
        this.log[this.log.length-1].box = this.setBoxXYConfig();
        this.log[this.log.length-1].arrow = this.setArrowXYConfig();
    }

    /*
    boxのポジション、色、文字の色をset
     */
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

    /*
    arrowのポジション、色、文字の色をset
     */
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

class Tools {

    static convertStringToRGBArray(string) {
        let tmpArray = Tools.convertStringToArray(string);
        if(tmpArray === null) return null;
        let flag = false;
        let cache = [];
        let RGBArray = [];

        for(let str of tmpArray){
            if(!flag && str !==  null && str.match(/^rgb\(.*$/) ){
                flag = true;
            }
            if(flag  && str !==  null &&  str.match(/.*\)$/)) {
                flag = false;
                cache.push(str);
                let rgb = cache.join(",");
                RGBArray.push(rgb);
                cache = [];
                continue;
            }

            if(flag){
                cache.push(str);
            }else{
                RGBArray.push(str);
            }
        }
        return RGBArray;

    }
    static convertStringToArray(string) {
        if(string === "[]" || string === "" || string === undefined) return null;
        string = string.slice(1)
        string = string.slice(0,-1)
        return string.split(",").map((val)=>{return val === "null" ? null : val})

    }
    static createArrowDiv(settings) {
        let id = settings.id;
        let thickness = 2;
        let color = settings.arrowColor || "rgb(0,0,0)";
        let headSize = 7;

        let arrowDiv = document.createElement("div");
        arrowDiv.setAttribute("id", id);

        let lineDiv = document.createElement("div");
        lineDiv.setAttribute("id", id + "-line");
        let arrowHeadDiv = document.createElement("div");

        arrowDiv.style.position = 'absolute';
        arrowDiv.style.content = "";

        lineDiv.style.position = "absolute";
        lineDiv.style.top = - thickness/2  + "px";
        lineDiv.style.height = thickness + "px";
        lineDiv.style.background = color;
        lineDiv.style.transform = "rotate(45deg)"
        lineDiv.style.content = "";
        lineDiv.style.transformOrigin = "center left";

        arrowHeadDiv.style.width = headSize + "px";
        arrowHeadDiv.style.height = headSize + "px";
        arrowHeadDiv.style.borderRight = thickness + "px solid";
        arrowHeadDiv.style.borderBottom = thickness + "px solid";
        arrowHeadDiv.style.borderRightColor = color;
        arrowHeadDiv.style.borderBottomColor = color;
        arrowHeadDiv.style.position = "absolute"
        arrowHeadDiv.style.bottom = 0 + "px";
        arrowHeadDiv.style.right = 0 + "px";
        arrowHeadDiv.style.content = "";

        arrowDiv.append(arrowHeadDiv);
        arrowDiv.append(lineDiv);
        return arrowDiv;

    }
    static binToInt(binArray) {
        if(binArray.length === 0) return 0;
        let bin = binArray.join('');
        return parseInt(bin, 2);
    }
    static calcArrowLength(x1,x2,y1,y2){
        return Math.sqrt((x1-x2)**2 + (y1-y2)**2);
    }
    static calcArrowDeg(x1,x2,y1,y2){
        return Math.atan2( y2-y1, x2-x1 );
    }
}
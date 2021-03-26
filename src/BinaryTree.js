import Tools from "./Tools.js";

export default class BinaryTreeController {
    constructor(nodes, drawingSettings) {
        this.defaultSettings = drawingSettings;
        this.refreshNodes(nodes)
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
            let root = this.nodes[this.rootIDList[i]]
            this.setBoxPositionHelper(root,this.rootIDList[i])
        }
    }
    setBoxPositionHelper(node, rootID) {
        if (node != null){
            this.setBoxPositionHelper(node.setLeftBoxPositionFromRoot(rootID), rootID)
            this.setBoxPositionHelper(node.setRightBoxPositionFromRoot(rootID), rootID)
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

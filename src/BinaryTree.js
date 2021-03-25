import Tools from "./Tools.js";

export default class BinaryTreeController {
    constructor(nodes, drawingSettings) {
        this.defaultSettings = drawingSettings;
        this.refreshNodes(nodes)
    }
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
        for(let i in this.rootID) {
            let root = this.nodes[this.rootID[i]]
            this.setBoxPositionHelper(root,this.rootID[i])
        }
    }
    setBoxPositionHelper(node, rootID) {
        if (node != null){
            this.setBoxPositionHelper(node.setLeftBoxPosition(rootID), rootID)
            this.setBoxPositionHelper(node.setRightBoxPosition(rootID), rootID)
        }
    }

    refreshNodes(nodes) {
        this.nodes = {};
        this.rootID = [];
        for(let nodeList of nodes) {
            let newNodeList = {
                data: Tools.convertStringToArray(nodeList.data),
                ID: Tools.convertStringToArray(nodeList.ID) || Tools.convertStringToArray(nodeList.data),
                boxColor:Tools.convertStringToArray(nodeList.boxColor)  || Array(nodeList.data.length),
                textColor:Tools.convertStringToArray( nodeList.textColor) || Array(nodeList.data.length)
            }
            this.deserialize(newNodeList.ID, newNodeList.data);
            this.setAllBoxConfig(newNodeList.ID, newNodeList.boxColor, newNodeList.textColor)

        }

        this.setBoxPosition()
    }
    getRootID() {
        return this.rootID;
    }
    getNodes(){
        return this.nodes;
    }

    getMaxDepth(root) {
        if(root === null) return 0
        else return this.maxDepthHelper([root])
    }
    maxDepthHelper(children) {
        let parents = children.slice();
        children = [];
        while(parents.length !== 0) {
            let node = parents.pop();
            if(node.left != null) children.push(node.left)
            if(node.right != null) children.push(node.right)
        }
        if(children.length) return this.maxDepthHelper(children) + 1
        else return 1
    }

    deserialize(nodeIDList,nodeDataList) {
        if(nodeDataList.length === 0) return null;
        let root = new BinaryTreeNode(nodeIDList[0],nodeDataList[0], nodeIDList[0]);
        this.nodes[nodeIDList[0]] = root;
        this.rootID.push(nodeIDList[0]);
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
    getID (){
        return this.ID;
    }
    getMyRootID() {
        return this.rootID;
    }
    getBoxSize() {
        return this.boxConfig.boxSize;
    }
    getBoxColor() {
        return this.boxConfig.boxColor;
    }
    getTextColor() {
        return this.boxConfig.textColor;
    }

    getBoxXY() {
        return this.boxXY;
    }
    setBoxXY(x,y) {
        this.boxXY.x = x;
        this.boxXY.y = y;
    }
    setBoxConfig(boxConfig) {
        this.boxConfig = boxConfig;
    }

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
        console.log(boxDiv)
        return boxDiv;
    }

    setRootID(ID) {
        this.rootID = ID;
    }
    setLeftPosition(parentPosition) {
        this.position = parentPosition.concat([0]);
    }
    setRightPosition(parentPosition) {
        this.position = parentPosition.concat([1]);
    }


    setLeftBoxPosition() {
        if(this.left === null) return null;
        this.left.setLeftPosition(this.getPosition());
        this.left.setRootID(this.rootID);
        return this.left;
    }
    setRightBoxPosition() {
        if(this.right === null) return null;
        this.right.setRightPosition(this.getPosition());
        this.right.setRootID(this.rootID);
        return this.right;
    }
    getPosition() {
        return this.position;
    }

}

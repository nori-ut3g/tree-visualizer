import Arrow from "./Arrow.js";

class BinaryTreeController {
    constructor() {

    }

    refreshNodes(inputData) {
        this.rootID = [];
        this.nodes = {};
        for(let ID in inputData.nodes){
            this.nodes[ID] = new BinaryTreeNode(ID, inputData.nodes[ID].data, inputData.nodes[ID].boxStyle);
        }

        for(let i in inputData.rootID){
            this.rootID.push(inputData.rootID[i]);
        }

        for(let ID in inputData.nodes){
            let leftNode = inputData.nodes[ID].leftID === null ? null :this.nodes[inputData.nodes[ID].leftID];
            let rightNode = inputData.nodes[ID].rightID === null ? null :this.nodes[inputData.nodes[ID].rightID];
            this.nodes[ID].setChildNode(leftNode, rightNode)
        }

        this.setAllBoxPosition();
        this.setArrow();
    }
    getNodeBoxes() {
        let boxes={};
        for(let ID in this.nodes) {
            boxes[ID] = this.nodes[ID].getBox()
        }
        return {
            "boxes":boxes,
            "rootID":this.rootID,
            "maxDepth":this.rootID.map(ID=>this.maxDepth(this.nodes[ID]))
        }
    }
    setAllBoxPosition() {
        for(let i in this.rootID) {
            let root = this.nodes[this.rootID[i]]
            this.setBoxPosition(root,this.rootID[i])
        }
    }
    setBoxPosition(node, rootID) {
        if (node != null){
            this.setBoxPosition(node.setLeftBoxPosition(rootID), rootID)
            this.setBoxPosition(node.setRightBoxPosition(rootID), rootID)
        }
    }
    setArrow() {
        for(let ID in this.nodes) {
            this.nodes[ID].setArrow();
        }
    }
    maxDepth(root) {
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


}

class BinaryTreeNode {
    constructor(ID, stringData, boxStyle) {
        this.data = stringData;
        this.left = null;
        this.right = null;
        this.box = new BinaryTreeBox(ID, stringData, boxStyle.boxColor, boxStyle.textColor)
    }
    getBox() {
        return this.box;
    }
    setArrow() {
        if(this.left) this.box.setLeftArrow();
        if(this.right) this.box.setRightArrow();
    }
    setChildNode(left, right) {
        this.left = left;
        this.right = right;
    }
    setLeftBoxPosition(rootID) {
        if(this.left === null) return null;

        this.left.getBox().setLeftPosition(this.getBox().getPosition());
        this.left.getBox().setRootID(rootID);
        return this.left;
    }
    setRightBoxPosition(rootID) {
        if(this.right === null) return null;
        this.right.getBox().setRightPosition(this.getBox().getPosition());
        this.right.getBox().setRootID(rootID);
        return this.right;
    }
}


class BinaryTreeBox{
    constructor(ID, stringData, boxColor, textColor) {
        this.size = {"width":30, "height":30};
        this.shape = "round"
        this.position = [];
        this.ID = ID;
        this.color = boxColor;
        this.textColor = textColor;
        this.rootID = ID;
        this.arrows = {"left":new Arrow(this.ID+"-left"), "right": new Arrow(this.ID+"-right")}
        this.hasArrow = {}
        this.data = stringData;

    }
    getArrows() {
        return this.arrows;
    }
    getSize() {
        return this.size;
    }
    getBoxColor() {
        return this.color;
    }
    getTextColor() {
        return this.textColor;
    }
    setLeftArrow() {
        this.hasArrow.left = true;
    }
    setRightArrow() {
        this.hasArrow.right = true;
    }
    getHasArrow() {
        return this.hasArrow;
    }
    getPosition() {
        return this.position;
    }
    setRootID(ID) {
        this.rootID = ID;
    }
    getRootID() {
        return this.rootID;
    }
    setLeftPosition(parentPosition) {
        this.position = parentPosition.concat([0]);
    }
    setRightPosition(parentPosition) {
        this.position = parentPosition.concat([1]);
    }
    createBoxDiv() {
        let boxDiv = document.createElement("div");
        boxDiv.setAttribute("id", `box-${this.ID}`);
        boxDiv.innerHTML = `<div>${this.data}</div>`;
        boxDiv.style.width = this.size.width + "px";
        boxDiv.style.height = this.size.height + "px";
        boxDiv.style.position = "absolute";
        boxDiv.style.display = "flex"
        boxDiv.style.flexDirection = "column";
        boxDiv.style.justifyContent = "center";
        boxDiv.style.alignItems = "center";
        if(this.shape === "round"){
            boxDiv.style.borderRadius = 100 + "%";
        }
        return boxDiv;
    }


}
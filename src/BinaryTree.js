import Arrow from "./Arrow.js";
import Tools from "./Tools.js";

export default class BinaryTreeController {
    constructor(nodes, drawingSettings) {
        this.defaultSettings = drawingSettings;
        this.refreshNodes(nodes)
    }

    // setAllArrowConfig() {
    //     for(let node of this.nodes) {
    //         let arrowConfig = {
    //             leftArrowColor: inputData.arrowColor.left || this.defaultSettings.arrowColor,
    //             rightArrowColor: inputData.arrowColor.right || this.defaultSettings.arrowColor,
    //             leftArrowHeadSize: inputData.arrowHeadSize.left || this.defaultSettings.arrowHeadSize,
    //             rightArrowHeadSize: inputData.arrowHeadSize.right || this.defaultSettings.arrowHeadSize,
    //             leftArrowThickness: inputData.arrowThickness.left || this.defaultSettings.arrowThickness,
    //             rightArrowThickness: inputData.arrowThickness.right || this.defaultSettings.arrowThickness,
    //         }
    //         this.nodes[ID].setArrowConfig(arrowConfig);
    //     }
    // }
    setAllBoxConfig(nodeIDList, boxColorList, textColorList) {
        for(let i=0 ;i < boxColorList.length; i++) {
            let ID = nodeIDList[i];
            if(!this.nodes[ID]) continue;
            let boxConfig = {
                boxColor: boxColorList[i] || this.defaultSettings.boxColor,
                textColor: textColorList[i] || this.defaultSettings.textColor,
                boxSize: this.defaultSettings.boxSize
            }
            console.log(this.nodes)
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
        // for(let ID in inputData.nodes){
        //     this.nodes[ID] = new BinaryTreeNode(ID, inputData.nodes[ID].data);
        //     this.setArrowConfig(inputData);
        //     this.setBoxConfig(inputData);
        // }
        // for(let i in inputData.rootID){
        //     this.roots.push(this.nodes[inputData.rootID[i]]);
        // }
        //
        // this.connectNodes(inputData)
    }
    getRootID() {
        return this.rootID;
    }
    getNodes(){
        return this.nodes;
    }
    // getMaxDepth() {
    //     return this.rootID.map(ID=>this.maxDepth(this.nodes[ID]));
    // }
    getNodeBoxes() {
        // let boxes={};
        // for(let ID in this.nodes) {
        //     boxes[ID] = this.nodes[ID].getBox()
        // }
        // return {
        //     "boxes":boxes,
        //     "rootID":this.rootID,
        //     "maxDepth":this.rootID.map(ID=>this.maxDepth(this.nodes[ID]))
        // }
    }

    setArrow() {
        for(let ID in this.nodes) {
            this.nodes[ID].setArrow();
        }
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
        this.arrowXY = {left:{x:0,y:0}, right:{x:0,y:0}}
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
    setArrowXY(direction, x, y) {
        this.arrowXY[direction].x = x;
        this.arrowXY[direction].y = y;
    }
    setBoxXY(x,y) {
        this.boxXY.x = x;
        this.boxXY.y = y;
    }
    setBoxConfig(boxConfig) {
        this.boxConfig = boxConfig;
    }
    setArrowConfig(arrowConfig) {
        this.arrowConfig = arrowConfig;
    }
    getArrowColor(direction) {
        switch (direction) {
            case "left":
                return this.arrowConfig.leftArrowColor;
            case "right":
                return this.arrowConfig.rightArrowColor;
        }
    }

    createBoxDiv() {
        let boxDiv = document.createElement("div");
        boxDiv.setAttribute("id", `box-${this.ID}`);
        boxDiv.innerHTML = `<div>${this.data}</div>`;
        boxDiv.style.width = this.boxConfig.boxSize + "px";
        boxDiv.style.height = this.boxConfig.boxSize + "px";
        boxDiv.style.position = "absolute";
        boxDiv.style.display = "flex"
        boxDiv.style.flexDirection = "column";
        boxDiv.style.justifyContent = "center";
        boxDiv.style.alignItems = "center";
        // if(this.boxConfig.boxShape === "round"){
            boxDiv.style.borderRadius = 100 + "%";
        // }
        return boxDiv;
    }

    createArrowDiv(direction) {
        let setting = {
            id : this.ID + direction,
            color: direction === "left" ? this.arrowConfig.leftArrowColor : this.arrowConfig.rightArrowColor,
            headSize: direction === "left" ? this.arrowConfig.leftArrowHeadSize: this.arrowConfig.rightArrowHeadSize,
            thickness: direction === "left" ? this.arrowConfig.leftArrowThickness: this.arrowConfig.rightArrowThickness
        }
        return Tools.createArrowDiv(setting);
    }

    setRootID(ID) {
        this.rootID = ID;
    }
    setChildNode(left, right) {
        this.left = left;
        this.right = right;
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


// class BinaryTreeBox{
//     constructor(ID, stringData, boxColor, textColor) {
//         this.size = {"width":30, "height":30};
//         this.shape = "round"
//         this.position = [];
//         this.ID = ID;
//         this.color = boxColor;
//         this.textColor = textColor;
//         this.rootID = ID;
//         this.arrows = {"left":new Arrow(this.ID+"-left"), "right": new Arrow(this.ID+"-right")}
//         this.data = stringData;
//
//     }
//     setBoxConfig(boxConfig) {
//         this.boxConfig = boxConfig;
//         //            let boxConfig = {
//         //                 boxColor: inputData.boxColor || this.defaultSettings.boxColor,
//         //                 textColor: inputData.textColor || this.defaultSettings.textColor,
//         //                 leftArrowColor: inputData.arrowColor.left || this.defaultSettings.arrowColor,
//         //                 rightArrowColor: inputData.arrowColor.right || this.defaultSettings.arrowColor,
//         //                 leftArrowHeadSize: inputData.arrowHeadSize.left || this.defaultSettings.arrowHeadSize,
//         //                 rightArrowHeadSize: inputData.arrowHeadSize.right || this.defaultSettings.arrowHeadSize,
//         //                 leftArrowThickness: inputData.arrowThickness.left || this.defaultSettings.arrowThickness,
//         //                 rightArrowThickness: inputData.arrowThickness.right || this.defaultSettings.arrowThickness,
//         //                 boxShape: inputData.shape || this.defaultSettings.boxShape,
//         //                 boxWidth: inputData.boxSize.width || this.defaultSettings.boxSize,
//         //                 boxHeight: inputData.boxSize.height || this.defaultSettings.boxSize,
//         //
//         //             }
//         //             this.setBoxConfig(boxConfig);
//         //         }
//     }
//     getArrows() {
//         return this.arrows;
//     }
//     getSize() {
//         return this.size;
//     }
//     getBoxColor() {
//         return this.color;
//     }
//     getTextColor() {
//         return this.textColor;
//     }
//     setLeftArrow() {
//         this.hasArrow.left = true;
//     }
//     setRightArrow() {
//         this.hasArrow.right = true;
//     }
//     getHasArrow() {
//         return this.hasArrow;
//     }
//     getPosition() {
//         return this.position;
//     }
//     setRootID(ID) {
//         this.rootID = ID;
//     }
//     getRootID() {
//         return this.rootID;
//     }
//     setLeftPosition(parentPosition) {
//         this.position = parentPosition.concat([0]);
//     }
//     setRightPosition(parentPosition) {
//         this.position = parentPosition.concat([1]);
//     }
//     createBoxDiv() {
//         let boxDiv = document.createElement("div");
//         boxDiv.setAttribute("id", `box-${this.ID}`);
//         boxDiv.innerHTML = `<div>${this.data}</div>`;
//         boxDiv.style.width = this.size.width + "px";
//         boxDiv.style.height = this.size.height + "px";
//         boxDiv.style.position = "absolute";
//         boxDiv.style.display = "flex"
//         boxDiv.style.flexDirection = "column";
//         boxDiv.style.justifyContent = "center";
//         boxDiv.style.alignItems = "center";
//         if(this.shape === "round"){
//             boxDiv.style.borderRadius = 100 + "%";
//         }
//         return boxDiv;
//     }
//
//
// }
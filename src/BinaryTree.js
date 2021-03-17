import Arrow from "./Arrow.js";
import Tools from "./Tools";

export default class BinaryTreeController {
    constructor(inputData, drawingSettings) {
        this.defaultSettings = drawingSettings;
        this.refreshNodes(inputData)
    }

    setArrowConfig(inputData) {
        for(let ID in inputData.nodes) {
            let arrowConfig = {
                leftArrowColor: inputData.arrowColor.left || this.defaultSettings.arrowColor,
                rightArrowColor: inputData.arrowColor.right || this.defaultSettings.arrowColor,
                leftArrowHeadSize: inputData.arrowHeadSize.left || this.defaultSettings.arrowHeadSize,
                rightArrowHeadSize: inputData.arrowHeadSize.right || this.defaultSettings.arrowHeadSize,
                leftArrowThickness: inputData.arrowThickness.left || this.defaultSettings.arrowThickness,
                rightArrowThickness: inputData.arrowThickness.right || this.defaultSettings.arrowThickness,
            }
            this.nodes[ID].setArrowConfig(arrowConfig);
        }
    }
    setBoxConfig(inputData) {
        for(let ID in inputData.nodes) {
            let boxConfig = {
                boxColor: inputData.boxColor || this.defaultSettings.boxColor,
                textColor: inputData.textColor || this.defaultSettings.textColor,
                leftArrowColor: inputData.arrowColor.left || this.defaultSettings.arrowColor,
                boxShape: inputData.shape || this.defaultSettings.boxShape,
                boxWidth: inputData.boxSize.width || this.defaultSettings.boxSize,
                boxHeight: inputData.boxSize.height || this.defaultSettings.boxSize
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
            this.setBoxPosition(node.setLeftBoxPosition(rootID), rootID)
            this.setBoxPosition(node.setRightBoxPosition(rootID), rootID)
        }
    }

    connectNodes(inputData) {
        for(let ID in inputData.nodes){
            let leftNode = inputData.nodes[ID].leftID || this.nodes[inputData.nodes[ID].leftID];
            let rightNode = inputData.nodes[ID].rightID || this.nodes[inputData.nodes[ID].leftID];
            this.nodes[ID].setChildNode(leftNode, rightNode);
        }
    }


    refreshNodes(inputData) {
        this.rootID = [];
        this.nodes = {};

        this.rootID = [];
        for(let i in inputData.rootID){
            this.rootID.push(inputData.rootID[i]);
        }

        this.nodes = {};
        for(let ID in inputData.nodes){
            this.nodes[ID] = new BinaryTreeNode(ID, inputData.nodes[ID].data);
            this.setArrowConfig(inputData);
            this.setBoxConfig(inputData);
        }
        this.connectNodes(inputData)
    }
    getRootIDs() {
        return this.rootID;
    }
    getBoxes(){
        return this.nodes;
    }
    getMaxDepth() {
        return this.rootID.map(ID=>this.maxDepth(this.nodes[ID]));
    }
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
    constructor(ID, stringData) {
        this.data = stringData;
        this.left = null;
        this.right = null;
        this.position = [];
        this.ID = ID;
        this.rootID = ID;
        this.data = stringData;
        this.arrowXY = {left:{x:0,y:0}, right:{x:0,y:0}}
        this.boxXY = {x:0,y:0};
    }
    getBoxWidthSize() {

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

    createBoxDiv() {
        let boxDiv = document.createElement("div");
        boxDiv.setAttribute("id", `box-${this.ID}`);
        boxDiv.innerHTML = `<div>${this.data}</div>`;
        boxDiv.style.width = this.boxConfig.boxWidth + "px";
        boxDiv.style.height = this.boxConfig.boxHeight + "px";
        boxDiv.style.position = "absolute";
        boxDiv.style.display = "flex"
        boxDiv.style.flexDirection = "column";
        boxDiv.style.justifyContent = "center";
        boxDiv.style.alignItems = "center";
        if(this.boxConfig.boxShape === "round"){
            boxDiv.style.borderRadius = 100 + "%";
        }
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
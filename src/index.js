import Draw from "./Draw.js";
import BinaryTreeController from "./BinaryTree";

//
class Pruner {
    constructor(settings) {
        this.drawSettings = {
            target : settings.target || 0,//表示させるDivID
            boxColor : settings.boxColor || 'rgb(255,0,0)',//ボックスのいろ
            textColor : settings.textColor || 'rgb(0,0,0)',//テキストの色
            bgColor : settings.bgColor || 'rgb(255,255,255)',
            arrowColor : settings.arrowColor || 'rgb(0,0,0)',//矢印の色
            arrowThickness: settings.arrowThickness || 2,
            arrowHeadSize: settings.arrowHeadSize || 7,
            dataType : settings.dataType || "BinaryTree",//データの種類
            interval : settings.interval || 500,//アニメーションの間隔
            boxSize : settings.boxSize || "50px",//ボックスのサイズ
            boxShape : settings.boxShape || "round",//ボックスの形
            animation : settings.animation || true,//animationの有無
            needsInfo : settings.info || true //infoBox
        }
        this.createDrawingArea();
    }
    createDrawingArea() {
        this.draw = new Draw(this.drawSettings);
    }

    createBoxController(inputData) {
        switch (this.drawSettings.dataType) {
            case "BinaryTree":
                this.nodeController = new BinaryTreeController(inputData);
        }
    }
    drawData(inputData) {
        let info = inputData.info;
        let nodeData = inputData.nodeData;
        this.createBoxController(nodeData);
        this.draw.initData(this.nodeController, info)
    }
    nextStep(inputData) {

    }
    // nextStep(data) {
    //     this.dataConstructor.refreshNodes();
    //     let boxesData = this.dataConstructor.getNodeBoxes();
    //     this.draw.refreshBoxes()
    // }

}



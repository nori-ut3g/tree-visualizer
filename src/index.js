// document.write('<script type="module" src="../src/Draw.js"></script>');
// document.write('<script type="module" src="../src/BinaryTree.js"></script>');
// document.write('<script type="module" src="../src/Draw.js"></script>');
// document.write('<script type="module" src="../src/Tools.js"></script>');


import Draw from "./Draw.js";
import BinaryTreeController from "./BinaryTree.js";


export default function pruner(settings) {
    return new MainPruner(settings);
}


//
export class MainPruner{
    constructor(settings) {
        this.drawSettings = {
            target : settings.target || "target",//表示させるDivID
            boxColor : settings.boxColor || 'rgb(255,0,0)',//ボックスのいろ
            textColor : settings.textColor || 'rgb(0,0,0)',//テキストの色
            dataType : settings.dataType || "BinaryTree",//データの種類
            interval : settings.interval || 1000,//アニメーションの間隔
            boxSize : settings.boxSize || 50,//ボックスのサイズ
            boxXMargin: settings.boxXMargin || 75,
            boxYMargin: settings.boxYMargin || 75,
            animation : settings.animation || true
        }
        this.createDrawingArea();
    }
    createDrawingArea() {
        this.draw = new Draw(this.drawSettings);
    }

    createBoxController(nodes) {
        switch (this.drawSettings.dataType) {
            case "BinaryTree":
                this.nodeController = new BinaryTreeController(nodes, this.drawSettings);
        }
    }
    drawData(nodes, info) {
        this.createBoxController(nodes);
        // this.draw.initData(this.nodeController, info);
        this.draw.refresh(this.nodeController, info);
    }
    nextStep(nodes, info) {
        // let info = inputData.info;
        // let nodeData = inputData.nodeData;
        this.nodeController.refreshNodes(nodes);
        this.draw.refresh(this.nodeController, info);
    }
    // nextStep(data) {
    //     this.dataConstructor.refreshNodes();
    //     let boxesData = this.dataConstructor.getNodeBoxes();
    //     this.draw.refreshBoxes()
    // }

}



import Draw from "./Draw.js";
import BinaryTreeController from "./BinaryTree.js";


/*
nodes:{
    target: string,
    boxColor: string,
    textColor: string,
    dataType: string
    interval: string or int
    boxSize: string or int
    boxXMargin: string or int
    boxYMargin: string or int
    dataType: string
}
 */
export default function pruner(settings) {
    return new MainPruner(settings);
}

class MainPruner{
    constructor(settings) {
        this.drawSettings = {
            target : settings.target || "target",//表示させるDivID
            boxColor : settings.boxColor || 'rgb(233,203,107)',//ボックスのいろ
            textColor : settings.textColor || 'rgb(69,54,10)',//テキストの色
            arrowColor : settings.arrowColor || "rgb(69,54,10)",
            dataType : settings.dataType || "BinaryTree",//データの種類
            interval :Number(settings.interval )|| 1000,//アニメーションの間隔
            boxSize : Number(settings.boxSize) || 30,//ボックスのサイズ
            boxXMargin: Number(settings.boxXMargin) || 30,
            boxYMargin: Number(settings.boxYMargin) || 45,
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
        this.nodeController.refreshNodes(nodes);
        this.draw.refresh(this.nodeController, info);
    }
}



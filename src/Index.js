import Draw from "./Draw.js";
import BinaryTreeController from "./BinaryTree.js";

export default function pruner(settings) {
    return new MainPruner(settings);
}

/*
アルゴリズム
入力をPruner独自のデータ構造に変換する。
変換後、ノードの位置関係を計算する。
ノードの位置が前の段階と異なっていたら、その差分をanimejsで動かす。
 */




class MainPruner{
    constructor(settings) {
        this.drawSettings = {
            target : settings.target || "target",//表示させるDivID
            boxColor : settings.boxColor || 'rgb(0,255,0)',//ボックスのいろ
            textColor : settings.textColor || 'rgb(0,0,0)',//テキストの色
            arrowColor : settings.arrowColor || "rgb(0,0,0)",
            dataType : settings.dataType || "BinaryTree",//データの種類
            interval :Number(settings.interval )|| 1000,//アニメーションの間隔
            boxSize : Number(settings.boxSize) || 30,//ボックスのサイズ
            boxXMargin: Number(settings.boxXMargin) || 30,
            boxYMargin: Number(settings.boxYMargin) || 45,
            animation : settings.animation || true
        }
        this.draw = new Draw(this.drawSettings);
    }

    /*
    nodes
        data: Tools.convertStringToArray(nodeList.data),
        ID: Tools.convertStringToArray(nodeList.ID) || Tools.convertStringToArray(nodeList.data),
        boxColor:Tools.convertStringToArray(nodeList.boxColor)  || Array(nodeList.data.length),
        textColor:Tools.convertStringToArray( nodeList.textColor) || Array(nodeList.data.length)
     */
    createBoxController(nodes) {
        switch (this.drawSettings.dataType) {
            case "BinaryTree":
                this.nodeController = new BinaryTreeController(nodes, this.drawSettings);
        }
    }

    //Animationなしで描写
    drawData(nodes, info) {
        this.draw.initDraw(info);
        this.createBoxController(nodes);
        this.draw.refresh(this.nodeController, info);
    }
    //drawDataした後、差分をAnimation
    nextStep(nodes, info) {
        this.nodeController.refreshNodes(nodes);
        this.draw.refresh(this.nodeController, info);
    }
}



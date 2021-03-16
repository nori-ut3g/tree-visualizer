export default class Pruner {
    constructor(settings) {
        this.drawSettings = {
            target : settings.target || 0,//表示させるDivID
            boxColor : settings.boxColor || 'rgb(255,0,0)',//ボックスのいろ
            textColor : settings.textColor || 'rgb(0,0,0)',//テキストの色
            bgColor : settings.bgColor || 'rgb(255,255,255)',
            arrowColor : settings.arrowColor || 'rgb(0,0,0)',//矢印の色
            dataType : settings.dataType || "BinaryTree",//データの種類
            interval : settings.interval || 500,//アニメーションの間隔
            boxSize : settings.boxSize || "50px",//ボックスのサイズ
            boxShape : settings.boxShape || "round",//ボックスの形
            animation : settings.animation || true,//animationの有無
            info :
        }
        // this.draw = new Draw(settings);
        // switch (this.dataType) {
        //     case "BinaryTree":
        //         this.data = new BinaryTreeController();
        // }
    }

    dataSet(data) {

        let inputData = {

        }

    }
}



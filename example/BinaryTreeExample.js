
import pruner from "../src";

let drawing = pruner({
    target : "target",//表示させるDivID
    boxColor : 'rgb(255,0,0)',//ボックスのいろ
    textColor :  'rgb(0,0,0)',//テキストの色
    bgColor : 'rgb(255,255,255)',
    dataType : "BinaryTree",//データの種類
    interval : 2000,//アニメーションの間隔
    boxSize : 30,//ボックスのサイズ
    boxXMargin: 30,
    boxYMargin: 45,
    animation : true,//animationの有無
    needsInfo :  true //infoBox

});
drawing.drawData(
    [
        {
            data:"[0,3,1,4,5,6,7]"
        },
        {
            data:"[10,13,11,14,15,16,17]"
        },],
    "[0,3,1,4,5,6,7]"+"[10,13,11,14,15,16,17]"
)
drawing.nextStep(
[{
    data:"[0,3,11,4,5,16,17,9]"
}
    ,{
        data:"[10,13,1,14,15,6,7,19]"
    }
],
    "[0,3,11,4,5,16,17,9]"+"[10,13,1,14,15,6,7,19]"
)
drawing.nextStep(
[{
    data:"[10,13,1,14,15,6,7,19]"
}
    ,{
    data:"[0,3,11,4,5,16,17,9]"
}
],
    "[10,13,1,14,15,6,7,19]"+"[0,3,11,4,5,16,17,9]"
)

// console.log(deserialize("[0,null,1,null,null,3,2]","[0,1,2,3,4,5,6]")) ;
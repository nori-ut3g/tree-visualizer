
import pruner from "../src";

let drawing = pruner({

});
drawing.drawData(
    [{
    data:"[0,3,1,4,5,6,7]",
    // ID:"[0,1,2,3,5,6,7]",
    // boxColor:"[rgb(255,0,0),rgb(255,0,0),rgb(255,0,0),rgb(255,0,0),rgb(255,0,0),rgb(255,0,0),rgb(255,0,0)]",
    // textColor:"[rgb(0,0,0),rgb(0,0,0),rgb(0,0,0),rgb(0,0,0),rgb(0,0,0),rgb(0,0,0),rgb(0,0,0)]",
    }],"[0,null,1,null,3,2,5]"
)
drawing.nextStep(
[{

    data:"[0,3,1,4,5,6,7,9]",
// ID:"[0,1,2,3,5,6,7]",
// boxColor:"[rgb(255,0,0),rgb(255,0,0),rgb(255,0,0),rgb(255,0,0),rgb(255,0,0),rgb(255,0,0),rgb(255,0,0)]",
// textColor:"[rgb(0,0,0),rgb(0,0,0),rgb(0,0,0),rgb(0,0,0),rgb(0,0,0),rgb(0,0,0),rgb(0,0,0)]",
}],"[0,null,1,null,3,2,5]"
)

// console.log(deserialize("[0,null,1,null,null,3,2]","[0,1,2,3,4,5,6]")) ;
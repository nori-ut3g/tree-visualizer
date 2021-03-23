
import pruner from "../src";

let drawing = pruner({

});
drawing.drawData([{
    data:"[0,null,1,null,3,2]",
    ID:"[0,1,2,3,5,6]",
    boxColor:"[rgb(255,0,0),rgb(255,0,0),rgb(255,0,0),rgb(255,0,0),rgb(255,0,0),rgb(255,0,0)]",
    textColor:"[rgb(0,0,0),rgb(0,0,0),rgb(0,0,0),rgb(0,0,0),rgb(0,0,0),rgb(0,0,0)]",
    }],"[0,null,1,null,3,2]"
)

// console.log(deserialize("[0,null,1,null,null,3,2]","[0,1,2,3,4,5,6]")) ;
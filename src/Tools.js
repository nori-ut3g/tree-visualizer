export default class Tools {

    static convertStringToRGBArray(string) {
        let tmpArray = Tools.convertStringToArray(string);

        if(tmpArray === null) return null;
        let flag = false;
        let cache = [];
        let RGBArray = [];

        for(let str of tmpArray){
            if(!flag && str !==  null && str.match(/^rgb\(.*$/) ){
                flag = true;
            }
            if(flag  && str !==  null &&  str.match(/.*\)$/)) {
                flag = false;
                cache.push(str);
                let rgb = cache.join(",")
                RGBArray.push(rgb);
                cache = [];
                continue;
            }

            if(flag){
                cache.push(str);
            }else{
                RGBArray.push(str);
            }

        }
        console.log(RGBArray)
        return RGBArray;

    }
    static convertStringToArray(string) {
        if(string === "[]" || string === "" || string === undefined) return null;
        string = string.slice(1)
        string = string.slice(0,-1)
        console.log(string.split(",").map((val)=>{return val === "null" ? null : val}))
        return string.split(",").map((val)=>{return val === "null" ? null : val})

    }
    static createArrowDiv(settings) {
        let id = settings.id
        let thickness = 2;
        let color = settings.arrowColor || "rgb(0,0,0)";
        let headSize = 7;

        let arrowDiv = document.createElement("div");
        arrowDiv.setAttribute("id", id);

        let lineDiv = document.createElement("div");
        lineDiv.setAttribute("id", id + "-line");
        let arrowHeadDiv = document.createElement("div");

        arrowDiv.style.position = 'absolute';
        arrowDiv.style.content = "";
        // arrowDiv.style.opacity = 0;

        lineDiv.style.position = "absolute";
        lineDiv.style.top = - thickness/2  + "px";
        lineDiv.style.height = thickness + "px";
        lineDiv.style.background = color;
        lineDiv.style.transform = "rotate(45deg)"
        lineDiv.style.content = "";
        lineDiv.style.transformOrigin = "center left";
        //
        // arrowHeadDiv.style.left = - thickness / Math.sqrt(2) + "px";
        // arrowHeadDiv.style.top = - thickness / 2 + "px";
        arrowHeadDiv.style.width = headSize + "px";
        arrowHeadDiv.style.height = headSize + "px";
        arrowHeadDiv.style.borderRight = thickness + "px solid";
        arrowHeadDiv.style.borderBottom = thickness + "px solid";
        arrowHeadDiv.style.borderRightColor = color;
        arrowHeadDiv.style.borderBottomColor = color;
        arrowHeadDiv.style.position = "absolute"
        arrowHeadDiv.style.bottom = 0 + "px";
        arrowHeadDiv.style.right = 0 + "px";

        // arrowHeadDiv.style.position = "absolute";
        arrowHeadDiv.style.content = "";
        //
        arrowDiv.append(arrowHeadDiv);
        arrowDiv.append(lineDiv);
        return arrowDiv;

    }
    static binToInt(binArray) {
        if(binArray.length === 0) return 0;
        let bin = binArray.join('');
        return parseInt(bin, 2);
    }
    static calcArrowLength(x1,x2,y1,y2){
        return Math.sqrt((x1 - x2)**2 + (y1 - y2)**2)
    }
    static calcArrowDeg(x1,x2,y1,y2){
        return Math.atan2( y2 - y1, x2 - x1 )
    }
}
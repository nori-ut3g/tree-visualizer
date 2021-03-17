export default class Tools {
    static createBoxDiv(setting) {

    }
    static createArrowDiv(settings) {
        let id = settings.id
        let thickness = settings.thickness;
        let color = settings.color;
        let headSize = settings.headSize;


        let arrowDiv = document.createElement("div");
        arrowDiv.setAttribute("id", id);
        let lineDiv = document.createElement("div");
        let arrowHeadDiv = document.createElement("div");

        arrowDiv.style.position = 'absolute';
        arrowDiv.style.content = "";

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
        arrowHeadDiv.style.borderRight = thickness + "px solid" + color;
        arrowHeadDiv.style.borderBottom = thickness + "px solid" + color;
        arrowHeadDiv.style.position = "absolute"
        arrowHeadDiv.style.bottom = 0 + "px";
        arrowHeadDiv.style.right = 0 + "px";

        // arrowHeadDiv.style.position = "absolute";
        // arrowHeadDiv.style.content = "";
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
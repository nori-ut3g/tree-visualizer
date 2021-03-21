export default class Arrow {
    constructor(id) {
    }

    createArrowDiv() {
        let length = 100;
        this.arrowDiv = document.createElement("div");
        this.lineDiv = document.createElement("div");
        this.arrowHeadDiv = document.createElement("div");
        this.arrowDiv.setAttribute("id", `arrow-${id}`);
        this.lineDiv.setAttribute("id", `arrowLine-${id}`);
        this.id = id;
        this.thickness = 5;

        this.arrowDiv.style.position = "absolute";
        this.arrowDiv.style.left = 0 + "px";
        this.arrowDiv.style.top = 0 + "px";

        this.arrowDiv.style.content = "";
        let thickness = 2;
        //
        this.lineDiv.style.position = "absolute";
        this.lineDiv.style.top = -thickness/2  + "px";
        this.lineDiv.style.height = thickness + "px";
        this.lineDiv.style.background = 'rgb(0,0,0)'
        this.lineDiv.style.transform = "rotate(45deg)"
        this.lineDiv.style.content = "";
        this.lineDiv.style.transformOrigin = "center left";
        //
        // arrowHeadDiv.style.left = - thickness / Math.sqrt(2) + "px";
        // arrowHeadDiv.style.top = - thickness / 2 + "px";
        this.arrowHeadDiv.style.width = 7 + "px";
        this.arrowHeadDiv.style.height = 7 + "px";
        this.arrowHeadDiv.style.borderRight = thickness + "px solid #000";
        this.arrowHeadDiv.style.borderBottom = thickness + "px solid #000";
        this.arrowHeadDiv.style.position = "absolute"
        this.arrowHeadDiv.style.bottom =  0 + "px";
        this.arrowHeadDiv.style.right =  0 + "px";

        // arrowHeadDiv.style.position = "absolute";
        // arrowHeadDiv.style.content = "";
        //
        this.arrowDiv.append(this.arrowHeadDiv);
        this.arrowDiv.append(this.lineDiv);
        return this.arrowDiv
    }
}
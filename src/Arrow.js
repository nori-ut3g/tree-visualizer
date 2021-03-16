export default class Arrow {
    constructor(id) {
        this.arrowDiv = document.createElement("div");
        this.lineDiv = document.createElement("div");
        this.arrowHeadDiv = document.createElement("div");
        this.arrowDiv.setAttribute("id", `arrow-${id}`);
        this.lineDiv.setAttribute("id", `arrowLine-${id}`);
        // this.createArrowDiv();
        this.id = id;
        this.thickness = 5;
        // this.addDragEventDrawingArea(x,y,btnDiv);
        this._arrowMoving = "notMoving"; //0:notMoving 1:lineMoving 2:headMoving
    }

    createArrowDiv() {
        let length = 100;


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

    addDragEventDrawingArea(x,y,btnDiv){
        const parentDiv = document.getElementById("drawing-area");
        const arrowDiv = this.arrowDiv;
        const lineDiv = this.lineDiv;
        let x1 = x;
        let y1 = y;
        let x2 = 0;
        let y2 = 0;

        // btnDiv.addEventListener("mousedown", e => {
        // if (this._arrowMoving === "notMoving") {

        arrowDiv.style.left = x  + "px";
        arrowDiv.style.top = y + "px";
        arrowDiv.style.width = 0 + "px";
        arrowDiv.style.height = 0 + "px";
        lineDiv.style.width = 0 + "px";
        x1 = x; //- arrowDiv.getBoundingClientRect().left;
        y1 = y; // - arrowDiv.getBoundingClientRect().top;
        this._arrowMoving = "Moving";
        // }else if(this._arrowMoving === "Moving"){
        //
        //     this._arrowMoving = "notMoving";
        // }

        // })

        // window.addEventListener("mousemove", e => {
        //     if (this._arrowMoving === "Moving") {
        //         console.log("tetete")
        //         let thickness = 5;
        //         let length = this.calcArrowLength(x1, e.clientX, y1, e.clientY)
        //         arrowDiv.style.width = length * Math.sqrt(2) / 2+ "px";
        //         arrowDiv.style.height = length * Math.sqrt(2) / 2+ "px";
        //         lineDiv.style.width = length -this.thickness+ "px";
        //         arrowDiv.style.transformOrigin = "top left";
        //         arrowDiv.style.transform = `rotate(${-45 + this.calcArrowDeg(x1, e.clientX, y1, e.clientY)*180/Math.PI}deg)`
        //     }else if(this._arrowMoving === "headMoving") {
        //
        //     }
        // })

    }
}
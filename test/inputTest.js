class TreeNode {
    constructor(data) {
        this.data = data;
        this.right = null;
        this.left = null;
    }

    toString() {
        let results = [];
        let queue = [this];
        while(queue.length > 0){
            let curr = queue.shift();

            if(curr === null){
                results.push(null);
                continue;
            }
            if(curr.left !== null) queue.push(curr.left);
            else queue.push(null);
            if(curr.right !== null) queue.push(curr.right);
            else queue.push(null);

            results.push(curr.data);

        }
        while(results.length > 0 && results[results.length-1] === null) results.pop();

        let serializedResults = results.map((data) => { return data !== null ? data+"" : "null"})
        return serializedResults.join(",");
    }
}

function deserialize(data) {
    if(data === "[]" || data === "") return null;
    data = data.slice(1)
    data = data.slice(0,-1)
    let arr = data.split(",").map((val)=>{return val === "null" ? null : Number(val)})
    if(arr.length === 0) return null;
    let root = new TreeNode(arr[0]);
    let queue = [root];
    let l = arr.length - 1;
    let i = 0;

    while(queue.length > 0){
        let curr = queue.shift();
        if(curr === null) continue;
        console.log(i,arr[i+1])
        if(l >= ++i && arr[i] !== null){
            curr.left = new TreeNode(arr[i]);
            queue.push(curr.left);
        }
        console.log(i,arr[i+1])
        if(l >= ++i && arr[i] !== null){
            curr.right = new TreeNode(arr[i]);
            queue.push(curr.right);
        }
    }

    return root;

}
console.log(deserialize("[0,null,1,null,null,3,2]")) ;

const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;

var server = http.createServer();
server.on('request', doRequest);

// ファイルモジュールを読み込む
var fs = require('fs');

// リクエストの処理
function doRequest(req, res) {
    var url = req.url; //リクエストからURLを取得
    var tmp = url.split('.'); //splitで . で区切られた配列にする
    var ext = tmp[tmp.length - 1]; //tmp配列の最後の要素(外部ファイルの拡張子)を取得
    var path = '.' + url; //リクエストされたURLをサーバの相対パスへ変換する
    switch(ext){
        case 'js': //拡張子がjsならContent-Typeをtext/javascriptにする
            fs.readFile(path,function(err,data){
                res.writeHead(200,{"Content-Type":"text/javascript"});
                res.end(data,'utf-8');
            });
            break;
        case '/': //拡張子が/(index.html)だった場合はindex.htmlを返す
            fs.readFile('./index.html',function(err,data){
                res.writeHead(200,{"Content-Type":"text/html"});
                res.end(data,'utf-8');
            })
            break;
    }
}

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
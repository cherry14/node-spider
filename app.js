//爬虫就像是向服务器发送请求  获取HTML字符串
//从HTML字符串提取有用的信息
const https = require('https');
const cheerio = require('cheerio');
const download = require('download');
//当前页码
let page = 1;
let maxpage = 5;

function getImgsByPage(){
    const options = {
        hostname: 'www.haha.mx',
        port: 443,
        path: '/good/day/'+page,
        method: 'GET'
      };
      
      const req = https.request(options, (res) => {
        console.log('statusCode:', res.statusCode);
        console.log('headers:', res.headers);
          //res.on 接收服务器每一次响应的数据，数据一段一段传过来
          let result = ""
        res.on('data', (d) => {
            //process.stdout.write将d(buffer)对象转换成字符串输出到控制台
          // process.stdout.write(d);
          result += d
        });
      
        res.on("end",()=>{
          
          //cheerio是一个解析HtmL的包，对返回的HTML字符串进行解析
          let imgArr = []
          let $ = cheerio.load(result)
          $('.joke-list-item .joke-main-content img').each((index,item)=>{
              //由于使用了懒加载机制，所以img没有拿到想要的src
              
              let imgURl = "https:"+$(item).data("original")
              //startWith判断字符串是否以参数1开头
              //endsWith判断字符串是否以参数1结尾
              if(imgURl.endsWith(".gif")){
                  imgURl= imgURl.replace("normal","middle")
              }
              imgArr.push(imgURl)
          })
          
          Promise.all(imgArr.map(x=>download(x,'dist'))).then(()=>{
           
            console.log("第"+page+"页下载完毕")
               page++;
              if(page<=maxpage){
                 
                  getImgsByPage()
              }

          })
      
        })
      });
      
      req.on('error', (e) => {
        console.error(e);
      });
      req.end();
}

getImgsByPage()
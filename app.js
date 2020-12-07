const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("constants");
const object = require("./initialarray");
const children = require("child_process")
const masterobject = require("./masterobject.js");
const { allarrays } = require("./masterobject.js");



const PORT = process.env.PORT || 3001
server.listen(PORT, () => console.log("listening on port 3001"));

var timetostart
var timerinterval
if(PORT == 3001){
    timetostart = 5000
}else
    timetostart = 30000

app.get("/", (req,res) => {
    res.send("Server working")
})

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

 // Add this
 if (req.method === 'OPTIONS') {

      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, OPTIONS');
      res.header('Access-Control-Max-Age', 120);
      return res.status(200).json({});
  }

  next();

});


var mistakes = [], count = 0;

var allchild = [];
for(var i=0;i<3;i++){
    allchild.push(children.fork("./child.js"));
    allchild[i].send({type : "initiate", data: object});
    allchild[i].on("message", data => {
        if(data.type === "result"){
            mistakes = mistakes.concat(data.result.mistakes)
            count++
            if(count > 2)
               takecare();
        }

        if(data.type === "oneset"){
            gameplay.to(data.socketid).emit("oneset", {i : data.i , j : data.j , pid : data.pid, oneset : data.oneset})
        }
    })
} //spawn three child processes when the server starts



var i=0
const gameplay = io.of("/gameplay")
gameplay.on("connect", (socket) =>{

    socket.on("roomentered", (name) => {
        if(masterobject.gameon){
            socket.emit("wait");
            socket.join("waiters")
            return
        }
        if(Object.keys(masterobject.allplayers).length == 10){
            socket.emit("wait");
            socket.join("waiters")
            return
        }
        if(!masterobject.timeron){
            masterobject.starttimer = 1
            timerinterval = setInterval(timerfunc, 1000)
            setTimeout(startgame, timetostart);
        }
        var socketid = socket.id
        masterobject.addplayer = {socketid : socketid, name: name}
        socket.join("gameroom")
        socket.emit("accepted")
        for(var i=0;i<3;i++)
            allchild[i].send({type : "addplayer", socketid : socketid , obj : masterobject.allarrays[socketid]}); //tell child processes to create their own copies

    })

    socket.on("cellhighlight", (cellid) => {
        for(var i=0;i<3;i++)
            allchild[i].send({type : "highlightcell", socketid : socket.id , cellid : cellid }); 
    })

    socket.on("inputnum", inputnum => {
        for(var i=0;i<3;i++)
            allchild[i].send({type : "inputnum", socketid : socket.id, inputnum : inputnum, pid : i }); 
    })

    socket.on("check", inputnum => { //separate event to do the check if the input num is correct
        const cellid = findcellid(socket.id)
        if(cellid){
            dochecking(inputnum, cellid)
        }
    })

    socket.on("filledcount", count => {
        masterobject.allplayers[socket.id].filledcount = count
        gameplay.to("gameroom").emit("changedcount", masterobject.allplayers)
    })

    socket.on("gamesolved", () => {
        masterobject.setfinishdetails = socket.id
        gameplay.to("gameroom").emit("changedcount", masterobject.allplayers)
        gameplay.to("gameroom").emit("finishedplayers", masterobject.finishedplayers)
        var playersstillplaying = Object.keys(masterobject.allplayers)    
      if(playersstillplaying.length == 0){
            gameplay.to("waiters").emit("refreshpage")
            gameplay.disconnect()
        }    //notify waiting users if all prev players has finished/left the game
    })


    socket.on("disconnect" , () => {
        var socketid = socket.id
        masterobject.removeplayer = socketid
        for(var i=0;i<3;i++)
            allchild[i].send({type : "removeplayer", socketid }); //tell child processes to remove 
            // their own copies
        var playersstillplaying = Object.keys(masterobject.allplayers)    
        if(playersstillplaying.length == 0){
            gameplay.to("waiters").emit("refreshpage")
        }    //notify waiting users if all prev players has finished/left the game
    })
        
    
});


const online = io.of("/online");
const single = io.of("/single")
const dual = io.of("/dual")

var onlineusers = {}

online.on("connection", socket => {
    socket.emit("onlineusers", onlineusers)
    socket.on("message" , name => {
        socket.send(`Your name is ${name}`)
    })

    socket.on("entername", name => {
        onlineusers = {...onlineusers, [socket.id] : name}
        online.emit("onlineusers", onlineusers)
    })

    socket.on("disconnect", () => {
        onlineusers = {...onlineusers, [socket.id] : null }
        online.emit("onlineusers", onlineusers)
    })

})


single.on("connection", socket => {
    socket.send("this is single player mode");
} )

dual.on("connection", socket => {
    socket.send("this is dual player mode");
})



function findcellid(socketid){
    var cellid = null;
    masterobject.allarrays[socketid].highlightedcell.forEach(e => {
        if(e.clientid == socketid)  
            cellid = e.cellid;
    })
    if(!cellid)
        return null; //no cell was selected
    const i= Math.floor(cellid/10) -1 , j= cellid%10 -1;
    return {i:i, j:j}
        
}

function dochecking(inputnum, cellid){
    for(var k=0;k<3;k++){
        allchild[i].send({
            type : "newnum",
            data : {
                inputnum : inputnum,
                i: cellid.i, 
                j :cellid.j,
                pid : k
            }
        })
    }
}

function takecare(){
    gameplay.emit("mistakes", mistakes);
    mistakes = []
    count = 0;
}

function startgame(){
    masterobject.startgame = 1
    clearInterval(timerinterval)
    timerem = timetostart/1000
    const allplayers = Object.keys(masterobject.allarrays)
    allplayers.forEach(oneplayer => {
        var oneboard = masterobject.allarrays[oneplayer]
        oneboard = {...oneboard, clientid : oneplayer}
        var otherplayers = masterobject.allplayers
        gameplay.to(oneplayer).emit("gamestarted", oneboard, otherplayers)
    })
}

var timerem = timetostart/1000
function timerfunc(){
    timerem--
    gameplay.to("gameroom").emit("timerem", timerem)
    if(timerem == 1)
        setTimeout( () => {
            gameplay.to("gameroom").emit("timerem", 0)
        } , 1000)
}



function nullify(cellid, socketid){
    var all = Object.keys(masterobject.allplayers)
    all = all.filter((e) => {
        return e != socketid
    })

    all.forEach(one => {
        masterobject.allarrays[one].initialarray[cellid.i][cellid.j][2] = 0
    })
}




const masterobject = require("./masterobject")

var object;
var allmistakes = []

process.on("message", e => {
    if(e.type === "initiate"){
        console.log(`Child process with id ${process.pid} created`);
        object = e.data;
    }
    if(e.type === "adplayer"){
        masterobject.allarrays[e.socketid] = e.obj
    }
    if(e.type === "removplayer"){
        masterobject.removeplayer = e.socketid
    }

    if(e.type === "highlightcell"){
        masterobject.allarrays[e.socketid].highlightedcell = [e.cellid]
    }
    if(e.type === "inputnum"){
        var ref = masterobject.allarrays[e.socketid]
        var hcellid = ref.highlightedcell
        if( hcellid.length != 0){
            var i = Math.floor(hcellid[0] /10) - 1 , j = hcellid[0]%10 - 1
            ref.initialarray[i][j][2] = e.inputnum
            var oneset = check(e.socketid, i,j, e.pid)
            process.send({type : "oneset", socketid : e.socketid, oneset : oneset, i : i, j : j, pid : e.pid})
        }
    }

})

function check(socketid, i,j,pid){
    var reference = masterobject.allarrays[socketid].initialarray
    if(pid == 0){ //check the corresponding row 
        var mistakes = []
        for(var k=0;k<9;k++){
            const ref = reference[i][k][2];
            var count = 0;
            for(var l=0;l<9;l++){
                if(reference[i][l][2] == ref && ref != 0)
                    count++;
            }
            if(count > 1)
                mistakes.push((i+1)*10 + (k+1))
        }
        var isfull = 1, isclear = 0;
        for(var k=0;k<9;k++)
            if(reference[i][k][2] == 0)
                isfull = 0;
        return mistakes
    }

    if(pid == 1){ //check the corresponding column 
         var mistakes = []
        for(var k=0;k<9;k++){
            const ref = reference[k][j][2];
            var count = 0;
            for(var l=0;l<9;l++){
                if(reference[l][j][2] == ref && ref != 0)
                    count++;
            }
            if(count > 1)
                mistakes.push((k+1)*10 + (j+1))
        }
        var isfull = 1, isclear = 0;
        for(var k=0;k<9;k++)
            if(reference[k][j][2] == 0)
                isfull = 0;
        return mistakes

    }
    if(pid == 2){
        var mistakes = []
        var r= i - ((i+3)%3), c = j - ((j+3)%3)
        var isfull = 1;
        for(var k=r;k<r+3;k++)
           for(var l=c;l<c+3;l++){
               const ref = reference[k][l][2];
               if(ref == 0)
                  isfull = 0;
               var count = 0
               for(var m=r;m<r+3;m++)
                   for(var n=c;n<c+3;n++){
                       if(reference[m][n][2] == ref && ref != 0)
                          count++;
                   }

                if(count > 1)
                    mistakes.push((k+1)*10 + l+1)
           }
        return mistakes
        

    }
}

function review(i, onecollection, pid){
    if(pid == 0){
        allmistakes = allmistakes.filter(e=>{
            return Math.floor(e/10) != i+1
        })
    }
    if(pid == 1){
        allmistakes = allmistakes.filter(e=>{
            return e%10 != i+1
        })
    }
    allmistakes = allmistakes.concat(onecollection)

}

function specialreview(k,l,onecollection){
    allmistakes = allmistakes.filter(e => {
        var quo = Math.floor(e/10), mod = e%10
        return (quo < k-3 && quo > k+1) && (mod < l-3 && mod > l+1)
    })
    console.log(onecollection,2)
    allmistakes = allmistakes.concat(onecollection)

}

function findsquare(k,l){
    k--; l--;
    var index;
    if(k==l){
        if(k==2)
           index = 0;
        else if (k==5)
           index = 4;
        else if(k==8)
            index = 8;
    }
    else if(k>l){
        if(k==5)
           index = 3;
        else if (l==2)
           index = 6;
        else if (l==5)
            index = 7;

    }
    else if(k<l){
        if(k==5)
           index = 5;
        else if (l==5)
           index = 1;
        else if(l==8)
           index = 2
    }
    return index
}
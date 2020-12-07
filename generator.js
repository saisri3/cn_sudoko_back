
var mat
initiatenew()
var N = 9; // number of columns/rows. 
var SRN = 3; // square root of N 
var K = 45 ;

module.exports = function Generate(){
    this.initialarray = mapper(),
    this.highlightedcell = [], 
    this.inputnum = {inputnum : null, inputterid : null},
    this.correctcount = 0,
    this.filledcount = 0,
    this.requiredcorrect = 81 - totalones,
    this.issolved = 0
}

var totalones
function mapper(){
    var numbers = fillValues()
    totalones = 0
    numbers = numbers.map( e => {
        return e.map(f => {
            var bool = Math.floor(Math.random() * 10) % 2 
            if(bool)
                totalones++
            return [f,bool,0,0]
        })

    })

    return numbers
}

function initiatenew(){
    var array = [0,0,0,0,0,0,0,0,0]
    array = array.map(e => {
    var arr = new Array(9)
    return arr
})
    mat = array
}


function fillValues(){
    fillDiagonal(); 
    fillRemaining(0, SRN); 
    var newnums = mat
    initiatenew()
    return newnums
    // removeKDigits(K); 
}

function fillDiagonal() { 
    for (var i = 0; i<N; i=i+SRN) 
		fillBox(i, i); 
} 

function fillBox(row,col) 
	{ 
		var num; 
		for (var i=0; i<SRN; i++) 
		{ 
			for (var j=0; j<SRN; j++) 
			{ 
				do
				{ 
					num = randomGenerator(N); 
				} 
				while (!unUsedInBox(row, col, num)); 

				mat[row+i][col+j] = num; 
			} 
		} 
    } 
    
function unUsedInBox( rowStart,  colStart,  num) 
	{ 
		for (var i = 0; i<SRN; i++) 
			for (var j = 0; j<SRN; j++){
                if (mat[rowStart+i][colStart+j]==num) 
					return false; 

            }
				
		return true; 
	} 

function randomGenerator( num) 
	{ 
		return Math.floor((Math.random()*num+1)); 
    } 
    
function CheckIfSafe( i, j, num) 
	{ 
		return (unUsedInRow(i, num) && 
				unUsedInCol(j, num) && 
				unUsedInBox(i-i%SRN, j-j%SRN, num)); 
    } 
    
function unUsedInRow( i, num) 
	{ 
		for (var j = 0; j<N; j++) 
		if (mat[i][j] == num) 
				return false; 
		return true; 
	} 

	function unUsedInCol(j, num) 
	{ 
		for (var i = 0; i<N; i++) 
			if (mat[i][j] == num) 
				return false; 
		return true; 
	} 


	function fillRemaining( i, j) 
	{ 
		// System.out.prvarln(i+" "+j); 
		if (j>=N && i<N-1) 
		{ 
			i = i + 1; 
			j = 0; 
		} 
		if (i>=N && j>=N) 
			return true; 

		if (i < SRN) 
		{ 
			if (j < SRN) 
				j = SRN; 
		} 
		else if (i < N-SRN) 
		{ 
			if (j==Math.floor((i/SRN))*SRN) 
				j = j + SRN; 
		} 
		else
		{ 
			if (j == N-SRN) 
			{ 
				i = i + 1; 
				j = 0; 
				if (i>=N) 
					return true; 
			} 
		} 

		for (var num = 1; num<=N; num++) 
		{ 
			if (CheckIfSafe(i, j, num)) 
			{ 
				mat[i][j] = num; 
				if (fillRemaining(i, j+1)) 
					return true; 

				mat[i][j] = 0; 
			} 
		} 
		return false; 
    } 
    
function removeKDigits() 
	{ 
		var count = K; 
		while (count != 0) 
		{ 
			var cellId = randomGenerator(N*N); 

			// System.out.prvarln(cellId); 
			// extract coordinates i and j 
			var i = (cellId/N); 
			var j = cellId%9; 
			if (j != 0) 
				j = j - 1; 

			// System.out.prvarln(i+" "+j); 
			if (mat[i][j] != 0) 
			{ 
				count--; 
				mat[i][j] = 0; 
			} 
		} 
	} 







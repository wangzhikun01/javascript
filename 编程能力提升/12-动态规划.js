/**
 * 
 */

let rows = [
    5,
    [7],
    [3,8],
    [8,1,0],
    [2,7,4,4],
    [4,5,2,6,5]
]

function path_sum(row,col){ // row = 行，col=列，代表开始计算的节点
    col = col-1; // 减一，对应到数组下标
    if(row >= rows[0]){
        return rows[row][col-1];
    }else if(row<1 || col<1){
        return 0;
    }else{
        return Max(path_sum(row+1,col+1),path_sum(row+1,col-1))
    }
}

function Max(path1,path2){
    return (path1>=path2)?path1:path2;
}

console.log(path_sum(1,1));
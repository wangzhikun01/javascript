// 斐波那契数列，使用 动态规划算法

// 使用递归，实现斐波那契
function rec_fib(n){
    if(n<3){
        return 1;
    }else{
        return rec_fib(n-1)+rec_fib(n-2);
    }
}

console.log(rec_fib(6));
// 使用动态规划
function dp_fib(n){
    n = n-1; // 数组序列从0开始
    // 相当于从1，一直求到n，正序推到，拼接为数组，然后返回数组最后一个，和循环的方式很相似
    let arr = [];
    arr[0] = arr[1] = 1;
    for(let i=2;i<=n;i++){
        arr[i] = arr[i-1]+arr[i-2];
    }
    return arr[n];
}

console.log(dp_fib(6));
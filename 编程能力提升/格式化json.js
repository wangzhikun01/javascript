let obj = {
    names: "user_name",
    age: 10,
    children: [
        { path: '/' },
        { path: '/a' },
        { path: '/b' }
    ],
    work: {
        title: "web",
        addr: "china",
        tell: 121212,
        mate: [
            { names: 'a' },
            { names: 'b' },
            { names: 'c' }
        ]
    }
}

// let str = JSON.stringify(obj);
// 12.3 - 2.3 - 1.5 = 8.5,-1.5 = 7
let test = JSON.parse('{"names":"user_name","age":10,"children":[{"path":"/"},{"path":"/a"},{"path":"/b"}],"work":{"title":"web","addr":"china","tell":121212,"mate":[{"names":"a"},{"names":"b"},{"names":"c"}]}}');
console.log(test);
function create_div(test,key) {
    if ((typeof test == 'string') || (typeof test == 'number') || (typeof test == 'boolean')) {
        let div = document.createElement('div');
        // div.innerHTML = `<div>{</div>${test.toString()}<div>}</div>`;
        div.innerHTML = key+':'+test.toString();
        return div;
    } else {
        let div = document.createElement("div");
        let d = document.createElement('div');
        d.innerHTML = '<div>{</div>'
        div.appendChild(d);
        for (let key in test) {
            div.appendChild(create_div(test[key],key));
        }
        d.innerHTML = '<div>}</div>';
        div.appendChild(d);

        return div;
    }
}
document.body.appendChild(create_div(test));


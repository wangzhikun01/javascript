/**
 * 单向链表
 *  插入、删除、查找、修改
 */

 // 节点类
class Node{
    constructor(data){
        this.data = data || 'head';  // 节点存储的数据
        this.next = null;  // 节点的下一位
        this.pre = null;  // 节点的上一位
    }
}

// 链表对象
class Link{
    constructor(){
        this.length = 0; // 链表长度
        let n = new Node(); // 默认的节点，头结点
        this.pos = n; // 链表指针
        this.head = n;// 链表的头结点        
    }
    show(){ // 测试方法，展示链表的数据
        console.log(this);
    };
    insert(value){ // 末尾插入
        let n = new Node(value);
        n.pre = this.pos;
        this.pos.next = n;
        this.pos = n;
        this.length ++ ;
    };
    search(value){ // 查找,从头结点进行遍历，找到就返回结点，没找到返回false
        let n;
        let node = this.head;
        while(node){
            if(node.data === value){
                return node;
            }else{
                node = node.next
            }
        }
        return false;
    };
    delete(value){ // 删除指定的结点
        let node = this.search(value);
        node.pre.next = node.next;
    };
    update(value,data){ // value是要修改的结点，data是新值
        let node = this.search(value);
        node.data = data;
    };
    beforeInsert(value,data){ // 在value结点前面，插入结点，结点数据是data
        let old = this.search(value);
        let node = new Node(data);
        old.pre.next = node;
        node.pre = old.pre;
        node.next = old;
    };
}

// let l = new Link();
// l.insert(1);
// l.insert(2);
// l.insert(3);
// l.update(2,4);
// l.beforeInsert(4,5);
// l.delete(1);
// l.show(); // 链表的顺序为：head - 5 - 4 - 3 - null

class circle extends Link{
    constructor(){
        super();
        let n = new Node();
        this.foot = n;
        this.foot.next = this.head;
        this.head.pre = this.foot;
    };
    insert(value){ // 末尾插入
        let n = new Node(value);
        n.next = this.head;
        n.pre = this.foot;
        this.foot.next = n;
        this.head.pre = n;
        this.length ++ ;
    };
    set(value){ // 设置链表的指针为指定的值
        let node = this.search(value);
        if(node) this.pos = node;
    }
}
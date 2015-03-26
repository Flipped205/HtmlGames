 // 这个worker 处理负责aStar 类的实例
onmessage = function(e){  
    var a = new aStar(e.data.tileMap, e.data.grid.width, e.data.grid.height,  
    e.data.start, e.data.stop);  
    postMessage(a);  
}  
// 基于非连续索引的tileMap 调整后的A* 路径查找类  
/** 
* @param tileMap: A 2-dimensional matrix with noncontiguous indexes 
* @param gridW: Grid width measured in rows 
* @param gridH: Grid height measured in columns 
* @param src: Source point, an object containing X and Y 
* coordinates representing row/column 
* @param dest: Destination point, an object containing 
* X and Y coordinates representing row/column 
* @param createPositions: [OPTIONAL] A boolean indicating whether 
* traversing through the tileMap should 
* create new indexes (default TRUE) 
*/  
var aStar = function(tileMap, gridW, gridH, src, dest, createPositions) {  
    this.openList = new NodeList(true, 'F');  
    this.closedList = new NodeList();  
    this.path = new NodeList();  
    this.src = src;  
    this.dest = dest;  
    this.createPositions = (createPositions === undefined) ? true :  
    createPositions;  
    this.currentNode = null;  
    var grid = {  
        rows: gridW,  
        cols: gridH  
    }  
    this.openList.add(new Node(null, this.src));  
    while (!this.openList.isEmpty()) {  
        this.currentNode = this.openList.get(0);  
        this.currentNode.visited = true;  
        if (this.checkDifference(this.currentNode, this.dest)) {  
            // 到达目的地 :)  
            break;  
        }
        this.closedList.add(this.currentNode);  
        this.openList.remove(0);  
        // 检查与当前节点相近的8 个元素  
        var nstart = {  
            //HTML5声音及处理优化 ｜ 219  
            x: (((this.currentNode.x - 1) >= 0) ? this.currentNode.x - 1 : 0),  
            y: (((this.currentNode.y - 1) >= 0) ? this.currentNode.y - 1 : 0),  
        }  
        var nstop = {  
            x: (((this.currentNode.x + 1) <= grid.rows) ? this.currentNode.  
            x + 1 : grid.rows),  
            y: (((this.currentNode.y + 1) <= grid.cols) ? this.currentNode.  
            y + 1 : grid.cols),  
        }  
        for (var row = nstart.x; row <= nstop.x; row++) {  
            for (var col = nstart.y; col <= nstop.y; col++) {  
                // 在原始的tileMap 中还没有行，还继续吗？  
                if (tileMap[row] === undefined) {  
                    if (!this.createPositions) {  
                        continue;  
                    }  
                }  
                // 检查建筑物或其他障碍物  
                if (tileMap[row] !== undefined && tileMap[row][col] === 1) {  
                    continue;  
                }  
                var element = this.closedList.getByXY(row, col);  
                if (element !== null) {  
                    // 这个元素已经在closedList 中了  
                    continue;  
                } else {  
                    element = this.openList.getByXY(row, col);  
                    if (element !== null) {  
                        // 这个元素已经在closedList 中了  
                        continue;  
                    }  
                }  
                // 还不在任何列表中，继续  
                var n = new Node(this.currentNode, {x: row, y: col});  
                n.G = this.currentNode.G + 1;  
                n.H = this.getDistance(this.currentNode, n);  
                n.F = n.G + n.H;  
                this.openList.add(n);  
            }  
        }  
    }  
    while (this.currentNode.parentNode !== null) {  
        this.path.add(this.currentNode);  
        this.currentNode = this.currentNode.parentNode;  
    }  
}  
aStar.prototype.checkDifference = function(src, dest) {  
    return (src.x === dest.x && src.y === dest.y);  
}  
aStar.prototype.getDistance = function(src, dest) {  
    return Math.abs(src.x - dest.x) + Math.abs(src.y - dest.y);  
}  
function Node(parentNode, src) {  
    this.parentNode = parentNode;  
    this.x = src.x;  
    this.y = src.y;  
    this.F = 0;  
    this.G = 0;  
    this.H = 0;  
}  
var NodeList = function(sorted, sortParam) {  
    this.sort = (sorted === undefined) ? false : sorted;  
    this.sortParam = (sortParam === undefined) ? 'F' : sortParam;  
    this.list = [];  
    this.coordMatrix = [];  
}  
NodeList.prototype.add = function(element) {  
    this.list.push(element);  
    if (this.coordMatrix[element.x] === undefined) {  
        this.coordMatrix[element.x] = [];  
    }  
    this.coordMatrix[element.x][element.y] = element;  
    if (this.sort) {  
        var sortBy = this.sortParam;  
        this.list.sort(function(o1, o2) { return o1[sortBy] - o2[sortBy]; });  
    }  
}  
NodeList.prototype.remove = function(pos) {  
    this.list.splice(pos, 1);  
}  
NodeList.prototype.get = function(pos) {  
    return this.list[pos];  
}  
NodeList.prototype.size = function() {  
    return this.list.length;  
}  
NodeList.prototype.isEmpty = function() {  
    return (this.list.length == 0);  
}  
NodeList.prototype.getByXY = function(x, y) {  
    if (this.coordMatrix[x] === undefined) {  
        return null;  
    } else {  
        var obj = this.coordMatrix[x][y];  
        if (obj == undefined) {  
            return null;  
        } else {  
            return obj;  
        }  
    }  
}  
NodeList.prototype.print = function() {  
    for (var i = 0, len = this.list.length; i < len; i++) {  
        console.log(this.list[i].x + ' ' + this.list[i].y);  
    }  
}  
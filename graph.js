/* Implementation of undirected, unweighted graph*/
function ConstructGraph(){
    this._nodes = new Set();
    this._edges = {}
    this.addNode = (node) => {
        this._nodes.add(node);
    }
    this.hasNode = (node) => this._nodes.has(node)
    this.hasEdge = (node1, node2) => {
        const [key1, key2] = sorted([node1, node2]);
        return !!(this._edges[key1] && this._edges[key1][key2]);
    }
    this.addEdge = (node1, node2) => {
        [node1, node2].forEach( (node) => {
            if(!this.hasNode(node)) { this.addNode(node)}
        })
        const [key1, key2] = sorted([node1, node2]);
        if(!this._edges[key1]){
            this._edges[key1] = {};
        }
        this._edges[key1][key2] = 1
    }
    this.nodes = () => sorted([...this._nodes]);
    this.edges = () => {
        return Object.keys(this._edges).reduce((acc, node1) => {
            const edgeTuples =  Object.keys(this._edges[node1]).reduce((acc, node2)=> {
                    return acc.concat([[node1, node2]])
            }, [])
            return acc.concat(edgeTuples);
        }, []);
    }
}

function sorted(list){
    return list.slice().sort();
}

function Graph(){
    return new ConstructGraph();
}


module.exports = {
    Graph: Graph
}

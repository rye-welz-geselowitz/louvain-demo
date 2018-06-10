/* Implementation of undirected, weighted graph*/
function ConstructGraph(){
    //Instantiate empty nodes & edges
    this._nodes = new Set();
    this._edges = {}
    //Add nodes and edges
    this.addNode = (node) => {
        this._nodes.add(node);
    }
    this.addEdge = (node1, node2, weight = 1) => {
        [node1, node2].forEach( (node) => {
            if(!this.hasNode(node)) { this.addNode(node)}
        })
        if(!(node1 in this._edges)){
            this._edges[node1] = {};
        }
        this._edges[node1][node2] = weight;
        if(!(node2 in this._edges)){
            this._edges[node2] = {};
        }
        this._edges[node2][node1] = weight;
    }
    // Remove nodes & edges
    this.removeEdge = (node1, node2) => {
        if(this.hasEdge(node1, node2)){
            delete this._edges[node1][node2];
            delete this._edges[node2][node1];
        }
    }
    this.removeNode = (node) => {
        this.neighbors(node).forEach( (neighbor)=> {
            this.removeEdge(node, neighbor);
        })
        this._nodes.delete(node);
    }
    //Query nodes & edges
    this.hasNode = (node) => this._nodes.has(node)
    this.hasEdge = (node1, node2) => {
        return node1 in this._edges && node2 in this._edges[node1];
    }
    this.nodes = () => sorted([...this._nodes]);
    this.edges = () => {
        const alreadyAddedEdges = {};
        return Object.keys(this._edges).reduce((acc, node1) => {
            const edgeTuples =  Object.keys(this._edges[node1]).reduce((acc, node2)=> {
                    const [key1, key2] = sorted([node1, node2])
                    if(alreadyAddedEdges[key1] && alreadyAddedEdges[key1][key2]){
                        return acc;
                    }
                    if(!alreadyAddedEdges[key1]){
                        alreadyAddedEdges[key1] = {};
                    }
                    alreadyAddedEdges[key1][key2] = true;
                    return acc.concat([[key1, key2]])
            }, [])
            return acc.concat(edgeTuples);
        }, []);
    }
    this.weight = (node1, node2) => {
        return this.hasEdge(node1, node2)? this._edges[node1][node2] : 0;
    }
    this.neighbors = (node) => {
        return Object.keys(this._edges[node] || []);
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

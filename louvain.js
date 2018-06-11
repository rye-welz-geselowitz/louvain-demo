const Graph = require('./graph');

function modularity(graph, partition){
    const m = graph.weight();
    if(m===0){ return 0;}
    const intraCommunityWeight =
        graph.nodes().reduce( (weight, i) => {
            return (
                accumulateIntraCommunityWeight(weight,
                    i, graph, m, partition))},
            0);
    return intraCommunityWeight / (2 * m);
}

function accumulateIntraCommunityWeight(intraCommunityWeightForNetwork, i, graph, m, partition){
    return (intraCommunityWeightForNetwork
    + graph.nodes().reduce( (intraCommunityWeightForNode, j) => {
        return (
            accumulateIntraCommunityWeightForNode(intraCommunityWeightForNode,
                i, j, graph, m, partition));
    }, 0));
}

function accumulateIntraCommunityWeightForNode(intraCommunityWeightForNode, i, j, graph, m, partition){
    if(i!==j && partition[i] === partition[j]){
        const A_ij = graph.edgeWeight(i,j);
        const k_i = graph.degree(i);
        const k_j = graph.degree(j);
        const P_ij =  k_i * k_j /  m;
        const nodePairContribution = A_ij - P_ij;
        return intraCommunityWeightForNode + nodePairContribution;
    }
    return intraCommunityWeightForNode;
}

function partition(graph){
    let currentGraph = graph;
    let {partition, modularity} = findBestPartition(currentGraph);
    let currentPartition = partition;
    let bestModularity = modularity;
    while(true){
        console.log('\n\n\n\n')
        console.log(currentGraph.nodes())
        console.log(currentPartition)
        console.log(bestModularity)
        let {partition, modularity} = findBestPartition(currentGraph);
        if(modularity > bestModularity){
            currentPartition = partition;
            bestModularity = modularity;
            currentGraph = reconstituteNetwork(currentGraph, currentPartition);
        }
        else{
            break;
        }
    }
    //TODO: map between iterations of algorithm!
    return {partition: reindex(currentPartition), modularity: bestModularity};
}

function reindex(partition){
    const lookup = {};
    const reindexedPartition = {};
    Object.keys(partition).forEach( (node) => {
        const assignedCommunity = partition[node];
        if(!(assignedCommunity in lookup)){
            lookup[assignedCommunity] = Object.keys(lookup).length;
        }
        reindexedPartition[node] = lookup[assignedCommunity];
    })
    return reindexedPartition;
}

// The second phase of the algorithm consists in building a new network whose nodes
// are now the communities found during the first phase. To do so, the weights of the links
// between the new nodes are given by the sum of the weight of the links between nodes in
// the corresponding two communities
function reconstituteNetwork(originalNetwork, partition){
    const network = Graph.Graph();
    const newNodes = new Set();
    const communityToNodesLookup = groupByCommunity(partition);
    Object.keys(partition).forEach( (key) => {
        network.addNode(partition[key]);
    })
    network.nodes().forEach( (i) => {
        network.nodes().forEach( (j) => {
            if(i<=j){
                const weight = calculateIntraCommunityEdgeWeight(originalNetwork, communityToNodesLookup,  i, j)
                network.addEdge(i, j, weight)
            }

        })
    })
    return network;
}

function groupByCommunity(partition){
    const lookup = {};
    Object.keys(partition).forEach( (node) => {
        if(!(partition[node] in lookup)){
            lookup[partition[node]] = [];
        }
        lookup[partition[node]].push(node)
    })
    return lookup;
}

function calculateIntraCommunityEdgeWeight(network, communityToNodeLookup, community1, community2){
    //Weight of all edges between nodes in i and nodes in j
    let sum = 0;
    communityToNodeLookup[community1].forEach( (c1Node) => {
        communityToNodeLookup[community2].forEach( (c2Node) => {
            sum+=network.edgeWeight(c1Node, c2Node);

        })
    })
    return community1 === community2 ? sum/2 : sum; //Prevent double counting in same community
}


function findBestPartition(graph){
    const partition = initialPartition(graph);
    let bestModularity = modularity(graph, partition);
    while(true){
        graph.nodes().forEach( (node) => {
            let bestNeighborCommunity = partition[node];
            let bestModularityGain = 0;
            graph.neighbors(node).forEach( (neighbor)=>{
                const proposedPartition =
                    Object.assign({}, partition);
                proposedPartition[node] = partition[neighbor];
                const modularityGain =
                    modularity(graph, proposedPartition) - modularity(graph, partition);
                if(modularityGain > bestModularityGain){
                    bestModularityGain = modularityGain;
                    bestNeighborCommunity = partition[neighbor];
                }
            })
            partition[node] = bestNeighborCommunity;
        })
        const newModularity = modularity(graph, partition);
        if(newModularity > bestModularity){
            bestModularity = newModularity;
        }
        else{
            break;
        }
    }
    return {partition: partition, modularity: bestModularity};
}


function initialPartition(graph){
    const partition = {};
    graph.nodes().forEach( (node, idx)=> {
        partition[node] = idx.toString();
    });
    return partition;
}
module.exports = {
    partition: partition,
    //The below functions are exposed for testing purposes.
    modularity: modularity,
    reindex: reindex,
    groupByCommunity: groupByCommunity,
    calculateIntraCommunityEdgeWeight: calculateIntraCommunityEdgeWeight,
    reconstituteNetwork: reconstituteNetwork
}

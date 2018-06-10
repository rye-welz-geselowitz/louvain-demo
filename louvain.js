function modularity(graph, partition){
    const m = graph.edges().length;
    if(m===0){
        return 0;
    }
    const nodes = graph.nodes();
    const intraCommunityWeight =
        nodes.reduce( (weight, i) => {
            return accumulateIntraCommunityWeight(weight, i, graph, m, nodes, partition)},
            0);
    return intraCommunityWeight / (2 *  m);
}

function accumulateIntraCommunityWeight(intraCommunityWeightForNetwork, i, graph, m, nodes, partition){
    return (intraCommunityWeightForNetwork
    + nodes.reduce( (intraCommunityWeightForNode, j) => {
        return accumulateIntraCommunityWeightForNode(intraCommunityWeightForNode, i, j, graph, m, nodes, partition);
    }, 0));
}

function accumulateIntraCommunityWeightForNode(intraCommunityWeightForNode, i, j, graph, m, nodes, partition){
    if(i !== j && partition[i] === partition[j]){
        const A_ij = graph.hasEdge(i,j)? 1 : 0;
        const k_i = graph.neighbors(i).length;
        const k_j = graph.neighbors(j).length;
        const P_ij =  (k_i / m )  * (k_j / m);
        const nodePairContribution = A_ij - P_ij;
        return intraCommunityWeightForNode + nodePairContribution;
    }
    return intraCommunityWeightForNode;
}

function partition(graph, iter = 3){
    const bestPartition = findBestPartition(graph);
    return reindex(bestPartition);
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
    return partition;
}


function initialPartition(graph){
    const partition = {};
    graph.nodes().forEach( (node, idx)=> {
        partition[node] = idx;
    });
    return partition;
}
module.exports = {
    partition: partition,
    //The below functions are exposed for testing purposes.
    modularity: modularity,
    reindex: reindex,
}

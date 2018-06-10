function modularity(graph, partition){
    const m = graph.edges().length;
    if(m===0){
        return 0;
    }
    const nodes = graph.nodes();
    const intraCommunityWeight =
        nodes.reduce( (intraCommunityWeightForNetwork, i) => {
            return (intraCommunityWeightForNetwork
            + nodes.reduce( (intraCommunityWeightForNode, j) => {
                if(i !== j && partition[i] === partition[j]){
                    const A_ij = graph.hasEdge(i,j)? 1 : 0;
                    const k_i = graph.neighbors(i).length;
                    const k_j = graph.neighbors(j).length;
                    const P_ij =  (k_i / m )  * (k_j / m);
                    const nodePairContribution = A_ij - P_ij;
                    return intraCommunityWeightForNode + nodePairContribution;
                }
                return intraCommunityWeightForNode;
            }, 0));
    }, 0);
    return intraCommunityWeight / (2 *  m);
}

module.exports = {
    modularity: modularity
}

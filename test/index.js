const Graph = require('../graph');
const louvain = require('../louvain')
const assert = require('assert');

describe('Graph data structure', () => {
    it('instantiate a graph without nodes or edges',
    () => {
        const g = Graph.Graph();
        assert.deepEqual(g.nodes(), []);
        assert.deepEqual(g.edges(), []);
    });
    it('add nodes',
    () => {
        const g = Graph.Graph();
        g.addNode('C');
        g.addNode('B');
        g.addNode('A');
        assert.deepEqual(g.nodes(), ['A', 'B', 'C']);
        assert.deepEqual(g.edges(), []);
    });
    it('add edges between existing nodes',
    () => {
        const g = Graph.Graph();
        g.addNode('A');
        g.addNode('B');
        g.addEdge('B', 'A');
        assert.deepEqual(g.nodes(), ['A', 'B']);
        assert.deepEqual(g.edges(), [ ['A', 'B'] ]);
    });
    it('add edges between new nodes',
    () => {
        const g = Graph.Graph();
        g.addEdge('B', 'A');
        assert.deepEqual(g.nodes(), ['A', 'B']);
        assert.deepEqual(g.edges(), [ ['A', 'B'] ]);
    });
    it('add edges between new and existing nodes',
    () => {
        const g = Graph.Graph();
        g.addNode('A');
        g.addEdge('B', 'A');
        assert.deepEqual(g.nodes(), ['A', 'B']);
        assert.deepEqual(g.edges(), [ ['A', 'B'] ]);
    });
    it('remove an edge',
    () => {
        const g = Graph.Graph();
        g.addEdge('B', 'A');
        assert.deepEqual(g.nodes(), ['A', 'B']);
        assert.deepEqual(g.edges(), [ ['A', 'B'] ]);
        g.removeEdge('B', 'A');
        assert.deepEqual(g.nodes(), ['A', 'B']);
        assert.deepEqual(g.edges(), []);
    });
    it('removing a non-existent edge leaves graph intact',
    () => {
        const g = Graph.Graph();
        g.addEdge('C', 'D');
        g.addNode('A')
        assert.deepEqual(g.nodes(), ['A', 'C', 'D']);
        assert.deepEqual(g.edges(), [ ['C', 'D'] ]);
        g.removeEdge('B', 'A');
        assert.deepEqual(g.nodes(), ['A', 'C', 'D']);
        assert.deepEqual(g.edges(), [ ['C', 'D'] ]);
    });
    it('determine that graph contains a node',
    () => {
        const g = Graph.Graph();
        g.addNode('A');
        assert.equal(g.hasNode('A'), true);
    });
    it('determine that graph does not contain a node',
    () => {
        const g = Graph.Graph();
        g.addNode('A');
        assert.equal(g.hasNode('B'), false);
    });
    it('determine that graph contains an edge',
    () => {
        const g = Graph.Graph();
        g.addEdge('A','B');
        assert.equal(g.hasEdge('A','B'), true);
    });
    it('determine that graph contains an edge, agnostic of the node order',
    () => {
        const g = Graph.Graph();
        g.addEdge('A','B');
        assert.equal(g.hasEdge('B','A'), true);
    });
    it('find the neighbors of a node',
    () => {
        const g = Graph.Graph();
        g.addEdge('A','B');
        g.addEdge('B','C');
        g.addEdge('A','F');
        assert.deepEqual(g.neighbors('A'), ['B', 'F']);
    });
    it('find no neighbors of a node with no neighbors',
    () => {
        const g = Graph.Graph();
        g.addNode('A');
        g.addEdge('B','C');
        assert.deepEqual(g.neighbors('A'), []);
    });
});

describe('Modularity evaluation', () => {
    it('modularity of a partition of an empty graph is 0',
    () => {
        const g = Graph.Graph();
        assert.equal(louvain.modularity(g, {}), 0);
    });
    it('modularity of a partition of an graph with nodes but no edges is 0',
    () => {
        const g = Graph.Graph();
        g.addNode('A');
        g.addNode('B');
        assert.equal(louvain.modularity(g, {}), 0);
    });
    it('modularity of a partition of a graph with edges and with all nodes in same community is 0',
    () => {
        const g = Graph.Graph();
        g.addNode('a');
        g.addEdge('b', 'c')
        const community1 = 'C1';
        const partition = { 'a': community1, 'b': community1, 'c': community1}
        assert.equal(louvain.modularity(g, partition), 0);
    });
    it('modularity of a partition with multiple communities, where all edges are intra-community, approaches 1',
    () => {
        const g = Graph.Graph();
        const partition = {};
        for(var i=0; i<100;i++){
            g.addEdge(i+'a', i+'b');
            partition[i+'a'] = i;
            partition[i+'b'] = i;

        }
        const modularity = louvain.modularity(g, partition);
        assert.ok( modularity > 0.99 && modularity <= 1);
    });
    it('modularity of a partition with multiple communities, where half of edges are intra-community, approaches 0.5',
    () => {
        const g = Graph.Graph();
        const partition = {};
        for(var i=0; i<100;i++){
            g.addEdge(i+'a', i+'b');
            partition[i+'a'] = i;
            partition[i+'b'] = i%2? i : i - 1;
        }
        const modularity = louvain.modularity(g, partition);
        assert.ok( modularity > 0.49 && modularity <= 0.5);
    });
    it('modularity of a partition with multiple communities, edges, and no intra-community edges is less than 0',
    () => {
        const g = Graph.Graph();
        g.addEdge('a','b');
        g.addEdge('a','c');
        g.addEdge('c','b');
        g.addEdge('a','d');
        g.addEdge('a','e');

        g.addEdge('A','B');
        g.addEdge('A','C');
        g.addEdge('C','B');
        g.addEdge('A','D');
        g.addEdge('A','E');


        const partition = { 'a': 0, 'b': 1, 'c': 2, 'd': 1, 'e': 1,
            'A': 0, 'B':1, 'C': 2, 'D': 1, 'E': 1}
        const modularity = louvain.modularity(g, partition);
        assert.ok( modularity < 0 );
    });
});

describe('Lovain method', () => {
    it('for an empty graph produces an empty partition',
    () => {
        const g = Graph.Graph();
        assert.deepEqual(louvain.partition(g), {});
    });
    it('for a graph with no edges, places each node in own community',
    () => {
        const g = Graph.Graph();
        g.addNode('A');
        g.addNode('B');
        g.addNode('C');
        g.addNode('D');
        assert.deepEqual(louvain.partition(g), {'A': 0, 'B': 1, 'C': 2, 'D': 3});
    });
    // it('for a graph with one edges, places nodes in same community',
    // () => {
    //     const g = Graph.Graph();
    //     g.addEdge('Aa', 'Bb');
    //     g.addEdge('Cc', 'Db')
    //     assert.deepEqual(louvain.partition(g), {'Aa': 0, 'Bb': 0, 'Cc': 1, 'Dd': 1});
    // });
});

describe('Utilities', () => {
    it('reindex takes a partition and removes gaps in community indices', () => {
        const partition = {'a': 0, 'b': 2, 'c': 2, 'd': 0, 'e': 60};
        assert.deepEqual(louvain.reindex(partition), {'a': 0, 'b': 1, 'c': 1, 'd': 0, 'e': 2});
    })
});

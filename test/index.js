const Graph = require('../graph')
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
});

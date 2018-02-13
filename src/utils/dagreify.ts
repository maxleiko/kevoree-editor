import * as dagre from 'dagre';
import * as _ from 'lodash';

function distributeGraph(model: any) {
  let nodes = mapElements(model);
  let edges = mapEdges(model);
  let graph = new dagre.graphlib.Graph();
  graph.setGraph({});
  graph.setDefaultEdgeLabel(function() {
    return {};
  });
  // add elements to dagre graph
  nodes.forEach((node: any) => {
    graph.setNode(node.id, node.metadata);
  });
  edges.forEach((edge: any) => {
    if (edge.from && edge.to) {
      graph.setEdge(edge.from, edge.to);
    }
  });
  // auto-distribute
  dagre.layout(graph);
  return graph.nodes().map((node) => graph.node(node));
}

function mapElements(model: any) {
  // dagre compatible format
  return model.nodes.map((node: any) => ({
    id: node.id,
    metadata: {
      id: node.id,
      width: node.width || 60,
      height: node.height || 60
    }
  }));
}

function mapEdges(model: any) {
  // returns links which connects nodes
  // we check that they are both "from" and "to" nodes in the model because sometimes links can be detached
  return model.links
    .map((link: any) => ({
      from: link.source,
      to: link.target
    }))
    .filter((item: any) => {
      return (
        model.nodes.find((node: any) => node.id === item.from) &&
        model.nodes.find((node: any) => node.id === item.to)
      );
    });
}

export function distributeElements(model: any) {
  let clonedModel = _.cloneDeep(model);
  let nodes = distributeGraph(clonedModel);
  nodes.forEach((node) => {
    let modelNode = clonedModel.nodes.find((item: any) => item.id === node.id);
    modelNode.x = node.x;
    modelNode.y = node.y;
  });
  return clonedModel;
}

import * as dagre from 'dagre';

import { DiagramModel } from '@leiko/react-diagrams';

export function distributeElements(model: DiagramModel) {
  const graph = new dagre.graphlib.Graph();
  graph.setGraph({});
  graph.setDefaultEdgeLabel(() => ({}));

  // convert model elements to degre format
  const nodes = mapElements(model);
  const edges = mapEdges(model);

  // add elements to dagre graph
  nodes.forEach(node => {
    graph.setNode(node.id, node.metadata);
  });
  edges.forEach(edge => {
    if (edge.from && edge.to) {
      graph.setEdge(edge.from, edge.to);
    }
  });

  // auto-distribute
  dagre.layout(graph);

  // update model
  graph.nodes().forEach(id => {
    const { x, y } = graph.node(id);
    let mNode;
    mNode = model.nodesMap.get(id);
    if (mNode) {
      // mNode is an AbstractModel
      mNode.setPosition(x, y);
      return;
    }
  });
}

function mapElements(model: DiagramModel) {
  // dagre compatible format
  return model.nodes.map(node => ({
    id: node.id,
    metadata: {
      id: node.id,
      width: node.width || 60,
      height: node.height || 60
    }
  }));
}

function mapEdges(model: DiagramModel) {
  // returns links which connects nodes
  // we check that they are both "from" and "to" nodes in the model because sometimes links can be detached
  return model.links
    .map(link => ({
      from: link.sourcePort
        ? link.sourcePort.parent
          ? link.sourcePort.parent.id
          : null
        : null,
      to: link.targetPort
        ? link.targetPort.parent
          ? link.targetPort.parent.id
          : null
        : null
    }))
    .filter(
      item =>
        model.nodes.find(node => node.id === item.from) &&
        model.nodes.find(node => node.id === item.to)
    );
}

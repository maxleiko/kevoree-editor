import * as React from 'react';
import * as kevoree from 'kevoree-library';
import { DiagramModel } from 'storm-react-diagrams';

import { AppState } from './AppState';
import { Sidebar, SidebarItem } from './components/sidebar';
import { Diagram } from './components/diagram';

import './App.css';
import { KevoreeNodeFactory } from './widgets/node';
import { KevoreeComponentFactory } from './widgets/component';
import { KevoreeChannelFactory } from './widgets/channel';
import { KevoreeGroupFactory } from './widgets/group';

interface AppProps {}

export default class App extends React.Component<AppProps, AppState> {

  constructor(props: AppProps) {
    super(props);
    this.state = new AppState();
  }

  componentWillMount() {
    this.state.diagramEngine.registerNodeFactory(new KevoreeComponentFactory());
    this.state.diagramEngine.registerNodeFactory(new KevoreeNodeFactory(this.state.kevoreeEngine));
    this.state.diagramEngine.registerNodeFactory(new KevoreeChannelFactory(this.state.kevoreeEngine));
    this.state.diagramEngine.registerNodeFactory(new KevoreeGroupFactory(this.state.kevoreeEngine));
    this.state.diagramEngine.installDefaultFactories();
    this.state.diagramEngine.setDiagramModel(new DiagramModel());
  }

  createInstance(tdef: kevoree.TypeDefinition | string, point: { x: number, y: number} = { x: 100, y: 100 }) {
    const model = this.state.diagramEngine.getDiagramModel();
    if (typeof tdef === 'string') {
      tdef = this.state.kevoreeEngine.getModel().findByPath<kevoree.TypeDefinition>(tdef as string);
    }
    // TODO handle component insertion in nodes?!?
    const node = this.state.kevoreeEngine.createInstance(tdef as kevoree.TypeDefinition)!;
    node.x = point.x;
    node.y = point.y;
    model.addNode(node);
    this.state.diagramEngine.repaintCanvas();
  }

  render() {
    const types = this.state.kevoreeEngine.getModel()
      .select<kevoree.TypeDefinition>('/packages[*]/typeDefinitions[*]').array;

    return (
      <div className="App">
        <Sidebar>
          {types.map((tdef, i) => (
            <SidebarItem key={i} tdef={tdef} onDblClick={() => this.createInstance(tdef)} />
          ))}
        </Sidebar>
        <Diagram
          diagramEngine={this.state.diagramEngine}
          kevoreeEngine={this.state.kevoreeEngine}
          onDrop={(tdefPath, point) => this.createInstance(tdefPath, point)}
        />
    </div>
    );
  }
}
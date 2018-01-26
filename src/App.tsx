import * as React from 'react';
import { DiagramEngine, DiagramModel } from 'storm-react-diagrams';

import { Sidebar, SidebarItem } from './components/sidebar';
import { Diagram } from './components/diagram';
import { TypeDefinition } from './types/kevoree.d';
import { Kevoree2DiagramFactory } from './Kevoree2DiagramFactory';

import './App.css';

interface AppProps {}
interface AppState {
  engine: DiagramEngine;
  types: TypeDefinition[];
}

class App extends React.Component<AppProps, AppState> {

  constructor(props: AppProps) {
    super(props);
    this.state = {
      engine: new DiagramEngine(),
      types: [
        { type: 'component', name: 'Ticker', outputs: ['out'] },
        { type: 'component', name: 'ConsolePrinter', inputs: ['input'] },
        { type: 'component', name: 'Twitter', inputs: ['json', 'msg'] },
      ],
    };
  }

  componentWillMount() {
    const model = new DiagramModel();
    this.state.engine.installDefaultFactories();
    this.state.engine.setDiagramModel(model);
  }

  render() {
    return (
      <div className="App">
        <Sidebar>
          {this.state.types.map((tdef, i) => (
            <SidebarItem key={i} tdef={tdef} onDblClick={() => this.createNode(tdef)}/>
          ))}
        </Sidebar>
        <Diagram engine={this.state.engine} />
      </div>
    );
  }

  private createNode(tdef: TypeDefinition) {
    const model = this.state.engine.getDiagramModel();
    const nodesCount = Object.keys(model.getNodes()).length;
    const node = Kevoree2DiagramFactory.create(tdef, nodesCount);
    node.x = 100;
    node.y = 100;
    model.addNode(node);
    this.state.engine.repaintCanvas();
  }
}

export default App;

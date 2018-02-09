import * as React from 'react';
import { DiagramEngine, DiagramModel } from 'storm-react-diagrams';

import { Sidebar, SidebarItem } from './components/sidebar';
import { Diagram } from './components/diagram';
import { TypeDefinition } from './types/kevoree.d';
import { KevoreeEngine } from './KevoreeEngine';

import './App.css';
import { KevoreeNodeFactory, KevoreeNodeModel } from './widgets/node';
import { KevoreeComponentFactory, KevoreeComponentModel } from './widgets/component';

interface AppProps {}
interface AppState {
  kevoreeEngine: KevoreeEngine;
  diagramEngine: DiagramEngine;
}

class App extends React.Component<AppProps, AppState> {

  constructor(props: AppProps) {
    super(props);
    this.state = {
      diagramEngine: new DiagramEngine(),
      kevoreeEngine: new KevoreeEngine(),
    };

    this.state.kevoreeEngine.addTypes([
      { type: 'node', name: 'JavaNode' },
      { type: 'node', name: 'JavascriptNode' },
      { type: 'component', name: 'Ticker', outputs: ['out'] },
      { type: 'component', name: 'ConsolePrinter', inputs: ['input'] },
      { type: 'component', name: 'Twitter', inputs: ['json', 'msg'] },
    ]);
  }

  componentWillMount() {
    const model = new DiagramModel();
    // this.state.diagramEngine.installDefaultFactories();
    this.state.diagramEngine.registerNodeFactory(new KevoreeComponentFactory());
    this.state.diagramEngine.registerNodeFactory(new KevoreeNodeFactory(this.state.kevoreeEngine));
    this.state.diagramEngine.setDiagramModel(model);
  }

  render() {
    return (
      <div className="App">
        <Sidebar>
          {this.state.kevoreeEngine.getTypes().map((tdef, i) => (
            <SidebarItem key={i} tdef={tdef} onDblClick={() => this.createInstance(tdef)}/>
          ))}
        </Sidebar>
        <Diagram
          diagramEngine={this.state.diagramEngine}
          kevoreeEngine={this.state.kevoreeEngine}
        />
      </div>
    );
  }

  createInstance(tdef: TypeDefinition) {
    const model = this.state.diagramEngine.getDiagramModel();

    if (tdef.type !== 'component') {
      const node = this.state.kevoreeEngine.createInstance(tdef);
      node.x = 100;
      node.y = 100;
      model.addNode(node);
      this.state.diagramEngine.repaintCanvas();
    } else {
      model.getSelectedItems().forEach((item) => {
        if (item instanceof KevoreeNodeModel) {
          const comp = this.state.kevoreeEngine.createInstance(tdef);
          if (comp instanceof KevoreeComponentModel) {
            (item as KevoreeNodeModel).addComponent(comp);
            this.state.diagramEngine.repaintCanvas();
          }
        }
      });
    }
  }
}

export default App;

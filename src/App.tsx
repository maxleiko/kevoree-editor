import * as React from 'react';
import { DiagramEngine, DiagramModel } from 'storm-react-diagrams';

import { Sidebar, SidebarItem } from './components/sidebar';
import { Diagram } from './components/diagram';
import { KevoreeEngine } from './KevoreeEngine';

import './App.css';
import { KevoreeNodeFactory } from './widgets/node';
import { KevoreeComponentFactory } from './widgets/component';

interface AppProps {}
interface AppState {
  kevoreeEngine: KevoreeEngine;
  diagramEngine: DiagramEngine;
}

export default class App extends React.Component<AppProps, AppState> {

  constructor(props: AppProps) {
    super(props);
    this.state = {
      diagramEngine: new DiagramEngine(),
      kevoreeEngine: new KevoreeEngine(),
    };
  }

  componentWillMount() {
    const model = new DiagramModel();
    this.state.diagramEngine.registerNodeFactory(new KevoreeComponentFactory());
    this.state.diagramEngine.registerNodeFactory(new KevoreeNodeFactory(this.state.kevoreeEngine));
    this.state.diagramEngine.installDefaultFactories();
    this.state.diagramEngine.setDiagramModel(model);
  }

  createInstance(tdef: k.TypeDefinition, point: { x: number, y: number} = { x: 100, y: 100 }) {
    const model = this.state.diagramEngine.getDiagramModel();

    // if (tdef.type === 'component') {
    //   model.getSelectedItems().forEach((item: any) => {
    //     if (item instanceof KevoreeNodeModel) {
    //       const comp = this.state.kevoreeEngine.createInstance(tdef);
    //       if (comp instanceof KevoreeComponentModel) {
    //         item.addChild(comp);
    //         this.state.diagramEngine.repaintCanvas();
    //       }
    //     }
    //   });
    // } else {
    //   const node = this.state.kevoreeEngine.createInstance(tdef);
    //   node.x = point.x;
    //   node.y = point.y;
    //   model.addNode(node);
    //   this.state.diagramEngine.repaintCanvas();
    // }

    const node = this.state.kevoreeEngine.createInstance(tdef)!;
    node.x = point.x;
    node.y = point.y;
    model.addNode(node);
    this.state.diagramEngine.repaintCanvas();
  }

  render() {
    const types = this.state.kevoreeEngine.getModel().select<k.TypeDefinition>('**/typeDefinition[]').array;

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
          onDrop={(tdef, point) => this.createInstance(tdef, point)}
        />
    </div>
    );
  }
}
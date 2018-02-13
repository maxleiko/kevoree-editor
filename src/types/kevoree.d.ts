declare namespace k {
  export interface Klass {
    class: string;
    select<T = Klass>(query: string): KArray<T>;
    [s: string]: any; // don't bother with the structure right now
  }
  
  export interface Named extends Klass {
    name: string;
  }
  
  export interface Instance extends Named {
    started: boolean;
    typeDefinition: TypeDefinition;
    dictionary: Dictionary;
    fragmentDictionary: FragmentDictionary[];
    metaData: Value[];
  }
  
  export interface Component extends Instance {
    provided: Port[];
    required: Port[];
  }
  
  export interface Port extends Named {
    bindings: Binding[];
    portTypeRef: PortTypeRef;
  }
  
  export interface Binding {
    port: Port;
    hub: Channel;
  }
  
  export interface Channel extends Instance {
    bindings: Binding[];
  }
  
  export interface Node extends Instance {
    components: Component[];
    hosts: Node[];
    host: Node;
    groups: Group[];
    networkInformation: NetworkInfo[];
  }
  
  export interface Group extends Instance {
    subNodes: Node[];
  }
  
  export interface NetworkInfo extends Named {
    values: Value[];
  }
  
  export interface Dictionary {
    values: Value[];
  }
  
  export interface FragmentDictionary extends Dictionary, Named {}
  
  export interface TypeDefinition extends Named {
    version: number;
    abstract: boolean;
    deployUnits: DeployUnit[];
    dictionaryType: DictionaryType;
    metaData: Value[];
  }
  
  export interface PortTypeRef extends Named {
    optional: boolean;
    noDependency: boolean;
    ref: PortType;
  }
  
  export interface PortType extends TypeDefinition {
    synchrone: boolean;
  }
  
  export interface NodeType extends TypeDefinition {}
  
  export interface ComponentType extends TypeDefinition {
    provided: PortTypeRef[];
    required: PortTypeRef[];
  }
  
  export interface ChannelType extends TypeDefinition {}
  export interface GroupType extends TypeDefinition {}
  
  export interface DeployUnit {
    version: string;
    hashcode: string;
    url: string;
    filters: Value[];
    requiredLibs: DeployUnit[];
  }
  
  export interface DictionaryType {
    attributes: DictionaryAttribute[];
  }
  
  export interface DictionaryAttribute extends Named {
    optional: boolean;
    state: boolean;
    datatype: DataType;
    fragmentDependant: boolean;
    defaultValue: string;
  }
  
  export interface Value extends Named {
    value: string;
  }
  
  export enum DataType {
    Byte = 'Byte',
    Short = 'Short',
    Int = 'Int',
    Long = 'Long',
    Float = 'Float',
    Double = 'Double',
    Boolean = 'Boolean',
    Char = 'Char',
    String = 'String'
  }
  
  export interface RTypeDefinition {
    id: number;
    name: string;
    model: string;
    version: number;
    namespace: string;
    createdBy: string;
    createdDate: string;
    deployUnits: number[];
    lastModifiedBy: string;
    lastModifiedDate: string;
  }

  export interface KevoreeFactory {
    createJSONLoader(): KevoreeLoader;
    createJSONSerializer(): KevoreeSerializer;
    createModelCompare(): KevoreeModelCompare;
    createModelCloner(): KevoreeModelCloner;

    createContainerRoot(): Model;
    createComponentInstance(): Component;
    createContainerNode(): Node;
    createGroup(): Group;
    createChannel(): Channel;

    root(model: Model): void;
    [s: string]: any; // don't bother with the structure right now
  }

  export interface KevoreeLoader {
    loadModelFromString<T = Klass>(str: string): KList<T>;
  }

  export interface Model extends Klass {
    nodes: Node[];
    groups: Group[];
    hubs: Channel[];
    mBindings: Binding[];
    withGenerated_KMF_ID(s: string | number): Model;
    [s: string]: any; // don't bother with the structure right now
  }

  export interface KevoreeSerializer {
    [s: string]: any; // don't bother with the structure right now
  }

  export interface KevoreeModelCompare {
    [s: string]: any; // don't bother with the structure right now
  }

  export interface KevoreeModelCloner {
    [s: string]: any; // don't bother with the structure right now
  }

  interface KList<T> {
    get(i: number): T;
  }

  interface KArray<T> {
    array: T[];
  }
}
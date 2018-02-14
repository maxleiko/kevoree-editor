/**
 * Kevoree Model declaration file
 * 
 * This declaration file contains some liberty I took to rename
 * some legacy (weird) names like MBinding (to Binding) or
 * Package (to Namespace).
 */
declare module 'kevoree-library' {
  export namespace factory {
    export class DefaultKevoreeFactory implements KevoreeFactory {
      createJSONLoader(): KevoreeLoader;
      createJSONSerializer(): KevoreeSerializer;
      createModelCompare(): KevoreeModelCompare;
      createModelCloner(): KevoreeModelCloner;
  
      createContainerRoot(): Model;
      createComponentInstance(): Component;
      createContainerNode(): Node;
      createGroup(): Group;
      createChannel(): Channel;
      createPackage(): Namespace;
  
      root(model: Model): void;
      [s: string]: any; // don't bother with the structure right now
    }
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
    createPackage(): Namespace;

    root(model: Model): void;
    [s: string]: any; // don't bother with the structure right now
  }

  export interface KevoreeLoader {
    loadModelFromString<T>(str: string): KList<T>;
  }

  export interface Model extends Klass<Model> {
    nodes: KList<Node>;
    groups: KList<Group>;
    hubs: KList<Channel>;
    mBindings: KList<Binding>;
    packages: KList<Namespace>;
    withGenerated_KMF_ID(s: string | number): Model;
    findPackagesByID(id: string): Namespace;
    findByPath<T>(path: string): T;
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
    array: T[];
    get(i: number): T;
    size(): number;
    // there is more here, but who cares, just use the .array
  }

  export interface Klass<T, P = null> {
    metaClassName(): string;
    select<T>(query: string): KList<T>;
    eContainer(): P;
    [s: string]: any; // don't bother with the structure right now
  }
  
  export interface Named<T, P> extends Klass<T, P> {
    name: string;
    withName(name: string): T;
  }
  
  export interface Instance<T, P> extends Named<T, P> {
    started: boolean;
    typeDefinition: TypeDefinition;
    dictionary: Dictionary;
    fragmentDictionary: KList<FragmentDictionary<T, P>>;
    metaData: KList<Value<Instance<T, P>>>;
  }
  
  export interface Component extends Instance<Component, Node> {
    provided: KList<Port>;
    required: KList<Port>;
  }
  
  export interface Port extends Named<Port, Component> {
    bindings: KList<Binding>;
    portTypeRef: PortTypeRef;
  }
  
  export interface Binding {
    port: Port;
    hub: Channel;
  }
  
  export interface Channel extends Instance<Channel, Model> {
    bindings: KList<Binding>;
  }
  
  export interface Node extends Instance<Channel, Model | Node> {
    components: KList<Component>;
    hosts: KList<Node>;
    host: Node;
    groups: KList<Group>;
    networkInformation: KList<NetworkInfo>;
  }
  
  export interface Group extends Instance<Group, Model> {
    subNodes: KList<Node>;
  }
  
  export interface NetworkInfo extends Named<NetworkInfo, Node> {
    values: KList<Value<NetworkInfo>>;
  }
  
  export interface Dictionary {
    values: KList<Value<Dictionary>>;
  }
  
  export interface FragmentDictionary<T, P> extends Dictionary, Named<T, Instance<T, P>> {}
  
  export interface TypeDefinition<T = PortType | NodeType | ChannelType | GroupType | ComponentType, P = Namespace> extends Named<T, P> {
    version: number;
    abstract: boolean;
    deployUnits: KList<DeployUnit>;
    dictionaryType: DictionaryType;
    metaData: KList<Value<TypeDefinition>>;
  }
  
  export interface PortTypeRef extends Named<PortTypeRef, ComponentType> {
    optional: boolean;
    noDependency: boolean;
    ref: PortType;
  }
  
  export interface PortType extends TypeDefinition<PortType, ComponentType> {
    synchrone: boolean;
  }
  
  export interface NodeType extends TypeDefinition<NodeType> {}
  
  export interface ComponentType extends TypeDefinition<ComponentType> {
    provided: KList<PortTypeRef>;
    required: KList<PortTypeRef>;
  }
  
  export interface ChannelType extends TypeDefinition<ChannelType> {}
  export interface GroupType extends TypeDefinition<GroupType> {}
  
  export interface DeployUnit {
    version: string;
    hashcode: string;
    url: string;
    filters: KList<Value<DeployUnit>>;
    requiredLibs: KList<DeployUnit>;
  }
  
  export interface DictionaryType {
    attributes: KList<DictionaryAttribute>;
  }
  
  export interface DictionaryAttribute extends Named<DictionaryAttribute, DictionaryType> {
    optional: boolean;
    state: boolean;
    datatype: DataType;
    fragmentDependant: boolean;
    defaultValue: string;
  }
  
  export interface Value<P> extends Named<Value<P>, P> {
    value: string;
  }

  export interface Namespace extends Named<Namespace, Model | Namespace> {
    packages: KList<Namespace>;
    typeDefinitions: KList<TypeDefinition>;
    deployUnits: KList<DeployUnit>;
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
}
/**
 * Kevoree Model declaration file
 * 
 * This file is opinionated has I took the liberty to rename
 * some legacy (weird) names like MBinding (to Binding) or
 * Package (to Namespace).
 */
declare module 'kevoree-library' {
  export namespace factory {
    export class DefaultKevoreeFactory implements KevoreeFactory {
      root(model: Model): void;

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
  
      getVersion(): String
  
      createComponentInstance(): Component;
      createInstance<P>(): Instance<P>;
      createPort(): Port;
      createComponentType(): ComponentType;
      createTypeDefinition(): TypeDefinition;
      createChannelType(): ChannelType;
      createGroupType(): GroupType;
      createNodeType(): NodeType;
      createPortTypeRef(): PortTypeRef;
      createContainerNode(): Node;
      createGroup(): Group;
      createNetworkInfo(): NetworkInfo;
      createContainerRoot(): Model;
      createRepository(): Repository;
      createChannel(): Channel;
      createMBinding(): Binding;
      createPackage(): Namespace;
      createNamedElement<P>(): Named<P>;
      createDeployUnit(): DeployUnit;
      createPortType(): PortType;
      createDictionary(): Dictionary;
      createValue<P>(): Value<P>;
      createFragmentDictionary(): FragmentDictionary;
      createDictionaryType(): DictionaryType;
      createDictionaryAttribute(): DictionaryAttribute;
      createTypedElement(): any; // this is no longer used (so any for now)
      createPortTypeMapping(): any; // this is no longer used (so any for now)
      createServicePortType(): any; // this is no longer used (so any for now)
      createOperation(): any; // this is no longer used (so any for now)
      createParameter(): any; // this is no longer used (so any for now)
      createMessagePortType(): any; // this is no longer used (so any for now)
    }
  }

  export interface KevoreeFactory {
    root(model: Model): void;

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

    getVersion(): String

    createComponentInstance(): Component;
    createInstance<P>(): Instance<P>;
    createPort(): Port;
    createComponentType(): ComponentType;
    createTypeDefinition(): TypeDefinition;
    createChannelType(): ChannelType;
    createGroupType(): GroupType;
    createNodeType(): NodeType;
    createPortTypeRef(): PortTypeRef;
    createContainerNode(): Node;
    createGroup(): Group;
    createNetworkInfo(): NetworkInfo;
    createContainerRoot(): Model;
    createRepository(): Repository;
    createChannel(): Channel;
    createMBinding(): Binding;
    createPackage(): Namespace;
    createNamedElement<P>(): Named<P>;
    createDeployUnit(): DeployUnit;
    createPortType(): PortType;
    createDictionary(): Dictionary;
    createValue<P>(): Value<P>;
    createFragmentDictionary(): FragmentDictionary;
    createDictionaryType(): DictionaryType;
    createDictionaryAttribute(): DictionaryAttribute;
    createTypedElement(): any; // this is no longer used (so any for now)
    createPortTypeMapping(): any; // this is no longer used (so any for now)
    createServicePortType(): any; // this is no longer used (so any for now)
    createOperation(): any; // this is no longer used (so any for now)
    createParameter(): any; // this is no longer used (so any for now)
    createMessagePortType(): any; // this is no longer used (so any for now)
  }

  export interface KevoreeLoader {
    loadModelFromString<T>(str: string): KList<T>;
  }

  const m: Model;

  export interface Model extends Klass {
    nodes: KList<Node>;
    groups: KList<Group>;
    hubs: KList<Channel>;
    mBindings: KList<Binding>;
    packages: KList<Namespace>;
    
    addNodes(node: Node): void;
    addGroups(grp: Group): void;
    addHubs(channel: Channel): void;
    addMBindings(binding: Binding): void;
    addPackages(pkg: Namespace): void;
    addAllPackages(pkgs: any): void;

    findPackagesByID(id: string): Namespace;
    findByPath<T = Klass<any>>(path: string): T | null;
    findMBindingsByID(id: string): Binding | null;

    withGenerated_KMF_ID(s: string | number): Model;
  }

  export interface KevoreeSerializer {
    serialize(elem: Klass<any>): string;
  }

  export interface KevoreeModelCompare {
    // TODO
  }

  export interface KevoreeModelCloner {
    // TODO
  }

  export interface KevoreeModelListener {
    elementChanged: (event: ModelEvent) => void;
  }

  export interface ModelEvent {
    etype: ActionType
    elementAttributeType: ElementAttributeType
    elementAttributeName: string
    value?: any
    previous_value?: any
    source?: Klass<any>
    previousPath?: string
  }

  export interface ActionType {
    code: string;
    name$: 'ADD' | 'REMOVE' | 'SET' | 'REMOVE_ALL' | 'ADD_ALL' | 'RENEW_INDEX';
  }

  export interface ElementAttributeType {
    name$: string;
  }

  interface KList<T> {
    readonly array: T[];
    get(i: number): T;
    size(): number;
  }

  export interface Klass<P = null> {
    path(): string;
    metaClassName(): string;
    select<T = Klass<any>>(query: string): KList<T>;
    eContainer(): P;
    addModelElementListener(listener: KevoreeModelListener): void;
    removeModelElementListener(listener: KevoreeModelListener): void;
    removeAllModelElementListeners(): void;
    addModelTreeListener(listener: KevoreeModelListener): void;
    removeModelTreeListener(listener: KevoreeModelListener): void;
    removeAllModelTreeListeners(): void;
    getModelElementListeners(): KList<KevoreeModelListener>;
    getRefInParent(): string | null;
    delete(): void;
  }
  
  export interface Named<P> extends Klass<P> {
    name: string;
    withName(name: string): this;
  }

  export interface Instance<P = Model | Node> extends Named<P> {
    started: boolean;
    typeDefinition?: TypeDefinition;
    dictionary: Dictionary;
    fragmentDictionary: KList<FragmentDictionary>;
    metaData: KList<Value<Instance<P>>>;
    findFragmentDictionaryByID(name: string): FragmentDictionary;
    addFragmentDictionary(dic: FragmentDictionary): void;
    findMetaDataByID(id: string): Value<Instance<P>> | null;
    addMetaData(metaData: Value<Instance<P>>): void;
  }
  
  export interface Component extends Instance<Node> {
    provided: KList<Port>;
    required: KList<Port>;
    typeDefinition?: ComponentType;

    addProvided(port: Port): void;
    addRequired(port: Port): void;
  }
  
  export interface Port extends Named<Component> {
    bindings: KList<Binding>;
    portTypeRef: PortTypeRef;
  }
  
  export interface Binding extends Klass<Binding> {
    port?: Port;
    hub?: Channel;
    withGenerated_KMF_ID(s: string | number): Binding;
  }
  
  export interface Channel extends Instance<Model> {
    bindings: KList<Binding>;
    typeDefinition?: ChannelType;
  }
  
  export interface Node extends Instance<Model | Node> {
    components: KList<Component>;
    typeDefinition?: NodeType;
    hosts: KList<Node>;
    host: Node;
    groups: KList<Group>;
    networkInformation: KList<NetworkInfo>;

    addComponents(comp: Component): void;
    addGroups(comp: Group): void;
  }
  
  export interface Group extends Instance<Model> {
    subNodes: KList<Node>;
    typeDefinition?: GroupType;
  }
  
  export interface NetworkInfo extends Named<Node> {
    values: KList<Value<NetworkInfo>>;
  }
  
  export interface Dictionary extends Klass<Instance> {
    values: KList<Value<Dictionary>>;
    withGenerated_KMF_ID(id: string): Dictionary;
    findValuesByID(name: string): Value<Dictionary>;
    addValues(val: Value<Dictionary>): void;
  }
  
  export interface FragmentDictionary extends Dictionary, Named<Instance> {}
  
  export interface TypeDefinition<P = Namespace> extends Named<P> {
    version: number;
    abstract: boolean;
    deployUnits: KList<DeployUnit>;
    dictionaryType: DictionaryType;
    metaData: KList<Value<TypeDefinition>>;

    findMetaDataByID(id: string): Value<TypeDefinition> | null;
  }
  
  export interface PortTypeRef extends Named<ComponentType> {
    optional: boolean;
    noDependency: boolean;
    ref: PortType;
  }
  
  export interface PortType extends TypeDefinition {
    synchrone: boolean;
  }
  
  export interface NodeType extends TypeDefinition {}
  
  export interface ComponentType extends TypeDefinition {
    provided: KList<PortTypeRef>;
    required: KList<PortTypeRef>;
  }
  
  export interface ChannelType extends TypeDefinition {}
  export interface GroupType extends TypeDefinition {}
  
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

  export interface Repository extends Klass<Model> {
    url: string;
  }
  
  export interface DictionaryAttribute extends Named<DictionaryType> {
    optional: boolean;
    state: boolean;
    datatype: DataType;
    fragmentDependant: boolean;
    defaultValue: string;
  }
  
  export interface Value<P> extends Named<P> {
    value: string;
  }

  export interface Namespace extends Named<Model | Namespace> {
    packages: KList<Namespace>;
    typeDefinitions: KList<TypeDefinition>;
    deployUnits: KList<DeployUnit>;

    addTypeDefinitions(tdef: TypeDefinition): void;
    addAllTypeDefinitions(tdefs: any): void;
    addDeployUnits(du: DeployUnit): void;
    addAllDeployUnits(dus: any): void;
  }
  
  export class DataType {
    name$: 'BYTE' | 'SHORT' | 'INT' | 'LONG' | 'FLOAT' | 'DOUBLE' | 'BOOLEAN' | 'CHAR' | 'STRING';
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
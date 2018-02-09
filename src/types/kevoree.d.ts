interface Named {
  name: string;
}

export interface NodeType extends Named {
  type: 'node';
}

export interface ComponentType extends Named {
  type: 'component';
  inputs?: string[];
  outputs?: string[];
}

export type TypeDefinition = NodeType | ComponentType;
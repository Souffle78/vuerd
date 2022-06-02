import {
  OptionRelationship,
  OptionRelationshipKey,
  Relationship,
  RelationshipType,
  StartRelationshipType,
} from '../store/relationship.state';

export interface AddRelationshipPoint {
  tableId: string;
  columnIds: string[];
}

export interface AddRelationship {
  id: string;
  relationshipType: RelationshipType;
  start: AddRelationshipPoint;
  end: AddRelationshipPoint;
  constraintName: string;
  option: OptionRelationship;
}

export interface RemoveRelationship {
  relationshipIds: string[];
}

export interface ChangeRelationshipType {
  relationshipId: string;
  relationshipType: RelationshipType;
}

export interface ChangeStartRelationshipType {
  relationshipId: string;
  startRelationshipType: StartRelationshipType;
}

export interface ChangeIdentification {
  relationshipId: string;
  identification: boolean;
}

export interface ChangeOptionRelationship {
  relationshipId: string;
  optionRelationshipKey: OptionRelationshipKey;
  value: boolean;
}

export interface HideRelationship {
  relationshipId: string;
}

export interface ShowRelationship {
  relationshipId: string;
}

export interface RelationshipCommandMap {
  'relationship.add': AddRelationship;
  'relationship.remove': RemoveRelationship;
  'relationship.changeRelationshipType': ChangeRelationshipType;
  'relationship.changeStartRelationshipType': ChangeStartRelationshipType;
  'relationship.changeIdentification': ChangeIdentification;
  'relationship.changeOptionRelationship': ChangeOptionRelationship;
  'relationship.load': Relationship;
  'relationship.hide': HideRelationship;
  'relationship.show': ShowRelationship;
}

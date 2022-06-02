import { uuid } from '@/core/helper';
import {
  OptionRelationshipKey,
  Relationship,
  RelationshipType,
  StartRelationshipType,
} from '@@types/engine/store/relationship.state';
import { Table } from '@@types/engine/store/table.state';

import { createCommand } from './helper';

export function addRelationship(
  relationshipType: RelationshipType,
  startTable: Table,
  endTableId: string,
  constraintName: string
) {
  const columnIds = startTable.columns
    .filter(column => column.option.primaryKey)
    .map(column => column.id);

  return createCommand('relationship.add', {
    id: uuid(),
    relationshipType,
    start: {
      tableId: startTable.id,
      columnIds,
    },
    end: {
      tableId: endTableId,
      columnIds: columnIds.map(() => uuid()),
    },
    constraintName,
    option: {
      cascadeDelete: false,
      cascadeUpdate: false,
    },
  });
}

export const removeRelationship = (relationshipIds: string[]) =>
  createCommand('relationship.remove', { relationshipIds });

export const changeRelationshipType = (
  relationshipId: string,
  relationshipType: RelationshipType
) =>
  createCommand('relationship.changeRelationshipType', {
    relationshipId,
    relationshipType,
  });

export const changeStartRelationshipType = (
  relationshipId: string,
  startRelationshipType: StartRelationshipType
) =>
  createCommand('relationship.changeStartRelationshipType', {
    relationshipId,
    startRelationshipType,
  });

export const changeIdentification = (
  relationshipId: string,
  identification: boolean
) =>
  createCommand('relationship.changeIdentification', {
    relationshipId,
    identification,
  });

export const changeOptionRelationship = (
  relationshipId: string,
  optionRelationshipKey: OptionRelationshipKey,
  value: boolean
) =>
  createCommand('relationship.changeOptionRelationship', {
    relationshipId,
    optionRelationshipKey,
    value,
  });

export const loadRelationship = (relationship: Relationship) =>
  createCommand('relationship.load', relationship);

export const hideRelationship = (relationshipId: string) =>
  createCommand('relationship.hide', { relationshipId });

export const showRelationship = (relationshipId: string) =>
  createCommand('relationship.show', { relationshipId });

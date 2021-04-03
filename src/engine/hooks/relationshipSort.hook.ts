import { CommandKey } from '@@types/engine/command';
import { State } from '@@types/engine/store';
import { relationshipSort } from '@/engine/store/helper/relationship.helper';

const hookKeys: CommandKey[] = [
  'canvas.changeShow',
  'relationship.add',
  'memo.move',
  'table.move',
  'table.changeName',
  'table.changeComment',
  'table.sort',
  'column.add',
  'column.addCustom',
  'column.remove',
  'column.changeName',
  'column.changeComment',
  'column.changeDataType',
  'column.changeDefault',
  'column.move',
  'editor.loadJson',
];

export function useRelationshipSort(
  { tableState: { tables }, relationshipState: { relationships } }: State,
  commandName: CommandKey
) {
  if (!hookKeys.includes(commandName)) return;

  relationshipSort(tables, relationships);
}

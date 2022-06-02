import {
  changeOptionRelationship,
  removeRelationship,
} from '@/engine/command/relationship.cmd.helper';
import { Menu, MenuOptions } from '@@types/core/contextmenu';
import { ERDEditorContext } from '@@types/core/ERDEditorContext';
import { Relationship } from '@@types/engine/store/relationship.state';

import { createSingleRelationship } from './singleRelationship.menu';

const defaultOptions: MenuOptions = {
  nameWidth: 110,
  keymapWidth: 0,
};

export function createRelationshipMenus(
  context: ERDEditorContext,
  relationship: Relationship
): Menu[] {
  const { store } = context;
  return [
    {
      icon: {
        prefix: 'mdi',
        name: 'vector-line',
        size: 18,
      },
      name: 'Relationship Type',
      children: createSingleRelationship(context, relationship),
    },
    {
      name: 'Cascade',
      children: [
        {
          icon: relationship?.option?.cascadeDelete
            ? {
                prefix: 'fas',
                name: 'check',
                size: 18,
              }
            : undefined,
          name: 'On Delete',
          execute: () =>
            store.dispatch(
              changeOptionRelationship(
                relationship.id,
                'cascadeDelete',
                !relationship?.option?.cascadeDelete
              )
            ),
        },
        {
          icon: relationship?.option?.cascadeUpdate
            ? {
                prefix: 'fas',
                name: 'check',
                size: 18,
              }
            : undefined,
          name: 'On Update',
          execute: () =>
            store.dispatch(
              changeOptionRelationship(
                relationship.id,
                'cascadeUpdate',
                !relationship?.option?.cascadeUpdate
              )
            ),
        },
      ],
    },
    {
      name: 'Delete',
      execute: () => store.dispatch(removeRelationship([relationship.id])),
    },
  ].map(menu => ({ ...menu, options: { ...defaultOptions } }));
}

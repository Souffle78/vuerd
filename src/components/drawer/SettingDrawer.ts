import { ColumnType } from '@@types/engine/store/canvas.state';
import {
  defineComponent,
  html,
  FunctionalComponent,
  observable,
  queryAll,
  updated,
} from '@dineug/lit-observable';
import { classMap } from 'lit-html/directives/class-map';
import { repeat } from 'lit-html/directives/repeat';
import { useContext } from '@/core/hooks/context.hook';
import { fromShadowDraggable } from '@/core/observable/fromShadowDraggable';
import { FlipAnimation } from '@/core/flipAnimation';
import {
  moveColumnOrder,
  changeRelationshipDataTypeSync,
} from '@/engine/command/canvas.cmd.helper';
import {
  commentWidthBalanceRange,
  widthBalanceRange,
} from '@/engine/store/helper/column.helper';

declare global {
  interface HTMLElementTagNameMap {
    'vuerd-setting-drawer': SettingDrawerElement;
  }
}

export interface SettingDrawerProps {
  width: number;
  visible: boolean;
}

export interface SettingDrawerElement extends SettingDrawerProps, HTMLElement {}

interface SettingDrawerState {
  currentColumnType: ColumnType | null;
}

const SettingDrawer: FunctionalComponent<
  SettingDrawerProps,
  SettingDrawerElement
> = (props, ctx) => {
  const contextRef = useContext(ctx);
  const state = observable<SettingDrawerState>({
    currentColumnType: null,
  });
  const columnsOrderRef = queryAll<Array<HTMLElement>>('.vuerd-column-order');
  const flipAnimation = new FlipAnimation(
    ctx.shadowRoot ? ctx.shadowRoot : ctx,
    '.vuerd-column-order',
    'vuerd-column-order-move'
  );

  const onClose = () => ctx.dispatchEvent(new CustomEvent('close'));

  const onChangeRelationshipDataTypeSync = (event: Event) => {
    const checkbox = event.target as HTMLInputElement;
    const { store } = contextRef.value;
    store.dispatch(changeRelationshipDataTypeSync(checkbox.checked));
  };

  const onMoveColumnOrder = (
    currentColumnType: ColumnType,
    targetColumnType: ColumnType
  ) => {
    const { store } = contextRef.value;

    if (currentColumnType && currentColumnType !== targetColumnType) {
      flipAnimation.snapshot();
      store.dispatch(moveColumnOrder(currentColumnType, targetColumnType));
    }
  };

  const onDragstartColumnOrder = (currentColumnType: ColumnType) => {
    state.currentColumnType = currentColumnType;

    columnsOrderRef.value.forEach(el => el.classList.add('none-hover'));

    fromShadowDraggable(columnsOrderRef.value).subscribe({
      next: id => onMoveColumnOrder(currentColumnType, id as ColumnType),
      complete: () => {
        state.currentColumnType = null;
        columnsOrderRef.value.forEach(el => el.classList.remove('none-hover'));
      },
    });
  };

  const onSyncTableWidth = () => {
    const {
      store: {
        tableState: { tables },
      },
      helper,
    } = contextRef.value;

    tables.forEach(table => {
      table.ui.widthName = widthBalanceRange(helper.getTextWidth(table.name));
      table.ui.widthComment = commentWidthBalanceRange(
        helper.getTextWidth(table.comment)
      );

      table.columns.forEach(column => {
        column.ui.widthName = widthBalanceRange(
          helper.getTextWidth(column.name)
        );
        column.ui.widthDataType = widthBalanceRange(
          helper.getTextWidth(column.dataType)
        );
        column.ui.widthDefault = widthBalanceRange(
          helper.getTextWidth(column.default)
        );
        column.ui.widthComment = commentWidthBalanceRange(
          helper.getTextWidth(column.comment)
        );
      });
    });
  };

  updated(() => flipAnimation.play());

  return () => {
    const {
      canvasState: { setting },
      editorState: { readonly },
    } = contextRef.value.store;

    return html`
      <vuerd-drawer
        name="Setting"
        .width=${props.width}
        .visible=${props.visible}
        @close=${onClose}
      >
        <table class="vuerd-setting-drawer">
          <colgroup>
            <col width="190px" />
          </colgroup>
          <tbody>
            <tr>
              <td>Relationship DataType Sync</td>
              <td>
                <input
                  type="checkbox"
                  ?checked=${setting.relationshipDataTypeSync}
                  ?disabled=${readonly}
                  @change=${onChangeRelationshipDataTypeSync}
                />
              </td>
            </tr>
            <tr>
              <td>ColumnType Order</td>
              <td>
                ${repeat(
                  setting.columnOrder,
                  columnType => columnType,
                  columnType =>
                    html`
                      <div
                        class=${classMap({
                          'vuerd-column-order': true,
                          draggable: state.currentColumnType === columnType,
                        })}
                        data-id=${columnType}
                        draggable="true"
                        @dragstart=${() => onDragstartColumnOrder(columnType)}
                      >
                        ${columnType}
                      </div>
                    `
                )}
              </td>
            </tr>
            <tr>
              <td>Recalculating table width</td>
              <td>
                <div
                  class="vuerd-recalculating-table-width-button"
                  @click=${onSyncTableWidth}
                >
                  <span>Sync</span>
                  <vuerd-icon name="sync-alt" size="12"></vuerd-icon>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </vuerd-drawer>
    `;
  };
};

defineComponent('vuerd-setting-drawer', {
  observedProps: ['width', 'visible'],
  shadow: false,
  render: SettingDrawer,
});

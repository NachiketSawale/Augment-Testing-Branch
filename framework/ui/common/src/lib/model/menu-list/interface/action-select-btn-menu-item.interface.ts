/*
 * Copyright(c) RIB Software GmbH
 */

import { ItemType } from '../enum/menulist-item-type.enum';
import { IParentMenuItem } from './parent-menu-item.interface';

export interface IActionSelectBtnMenuItem<TContext = void> extends IParentMenuItem<TContext> {

    type: ItemType.ActionSelectBtn
}

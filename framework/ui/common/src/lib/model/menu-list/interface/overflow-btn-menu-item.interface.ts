/*
 * Copyright(c) RIB Software GmbH
 */

import { ItemType } from '../enum/menulist-item-type.enum';
import {
	IParentMenuItem
} from './index';

/**
 * Represents an overflow button.
 * CAUTION: This item type is not meant to be used in user code.
 *
 * @group Menu List
 */
export interface IOverflowBtnMenuItem<TContext = void> extends IParentMenuItem<TContext> {

	type: ItemType.OverflowBtn;
}

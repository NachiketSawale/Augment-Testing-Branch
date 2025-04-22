/*
 * Copyright(c) RIB Software GmbH
 */

import { IReadOnlyPropertyAccessor } from '@libs/platform/common';
import { ConcreteMenuItem } from '../../menu-list/interface';
import { FieldDataMode } from '../field-data-mode.enum';

/**
 * Defines special options for action fields.
 *
 * @group Fields API
 */
export interface IAdditionalActionOptions<T extends object> {

	/**
	 * The actions offered in the field.
	 */
	actions?: ConcreteMenuItem<T>[];

	/**
	 * Defines the order of precedence for determining which actions to show in the field.
	 * The default value is {@link FieldDataMode.FieldDefElseModel}.
	 */
	actionsSource?: FieldDataMode;

	/**
	 * Supplies an optional info text displayed next to the action items.
	 */
	displayText?: IReadOnlyPropertyAccessor<T>;
}

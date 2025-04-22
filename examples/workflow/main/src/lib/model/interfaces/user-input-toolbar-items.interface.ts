/*
 * Copyright(c) RIB Software GmbH
 */

import { IUserInputEditorOptions } from './user-input-editor-options.interface';

/**
 * IUserInputToolbarItems: For storing the dropdown options in user-input-editor toolbar
 */
export interface IUserInputToolbarItems {
	/**
	 *Name of each dropdown option
	 */
	Caption: string,
	/**
	 * Icon for each dropdown option
	 */
	Icons: string,
	/**
	 * each item in dropdown option
	 */
	Items: IUserInputEditorOptions[]
}

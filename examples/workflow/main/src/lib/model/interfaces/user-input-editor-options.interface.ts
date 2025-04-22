/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType } from '@libs/ui/common';

/**
 * IUserInputEditorOptions: For storing the objects or items inside dropdown options of
 * user-input-action editor toolbar */

export interface IUserInputEditorOptions {

	Description: string,
	/**
	 * The field type of each item in the dropdown
	 */
	ItemType: FieldType,
}

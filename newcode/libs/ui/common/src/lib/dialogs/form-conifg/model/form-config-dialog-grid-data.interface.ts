/*
 * Copyright(c) RIB Software GmbH
 */
import { GridItemId } from '../../../grid';
import { IFormConfigDialogData } from './form-config-dialog-data.interface';

/**
 * Additional properties for dialog grid.
 */
export interface IFormConfigDialogGridDataAdditionalProperties {
	/**
	 * Unique id of entity.
	 */
	id: GridItemId;

	/**
	 * Parent property of entity.
	 */
	parent?: string | number;

	/**
	 * Image class for entity.
	 */
	image: string;
}

/**
 * Dialog grid data.
 */
export type IFormConfigDialogGridData<T extends IFormConfigDialogData = IFormConfigDialogData> = T & IFormConfigDialogGridDataAdditionalProperties;

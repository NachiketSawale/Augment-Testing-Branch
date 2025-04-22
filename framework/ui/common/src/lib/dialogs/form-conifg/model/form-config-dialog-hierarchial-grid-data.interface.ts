/*
 * Copyright(c) RIB Software GmbH
 */
import { IFormConfigDialogData } from './form-config-dialog-data.interface';
import { IFormConfigDialogGridData } from './form-config-dialog-grid-data.interface';

/**
 * Hierarchial grid data.
 */
export interface IFormConfigDialogHierarchialGridData<T extends IFormConfigDialogData = IFormConfigDialogData> extends IFormConfigDialogGridData {
	/**
	 * Child items for entity.
	 */
	childItems: IFormConfigDialogHierarchialGridData<T>[];
}

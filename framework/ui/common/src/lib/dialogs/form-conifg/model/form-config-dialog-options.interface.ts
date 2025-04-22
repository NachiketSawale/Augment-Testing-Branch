/*
 * Copyright(c) RIB Software GmbH
 */
import { ColumnDef } from '../../../grid';
import { IDialogOptions } from '../../base';
import { IFormConfigDialog } from './form-config-dialog.interface';
import { IFormConfigDialogData } from './form-config-dialog-data.interface';
import { IFormConfigDialogState } from './form-config-dialog-state.interface';

/**
 * Dialog options.
 */
export interface IFormConfigDialogOptions<T extends IFormConfigDialogData> extends IDialogOptions<IFormConfigDialog<T>>, IFormConfigDialogState<T> {
	/**
	 * Additional grid columns if exist(like UOM, Fraction....)
	 */
	additionalSelectedGridColumns?: ColumnDef<T>[];
}

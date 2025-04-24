/*
 * Copyright(c) RIB Software GmbH
 */
import { IDialog } from '../../base';
import { IFormConfigDialogData } from './form-config-dialog-data.interface';
import { IFormConfigDialogState } from './form-config-dialog-state.interface';

export interface IFormConfigDialog<T extends IFormConfigDialogData> extends IDialog, IFormConfigDialogState<T> {}

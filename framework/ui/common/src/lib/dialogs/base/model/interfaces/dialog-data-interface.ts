/*
 * Copyright(c) RIB Software GmbH
 */

import { ModalDialogModel } from '../classes/modal-dialog-model.class';

/**
 * Injectable dialog data interface.
 *
 * @group Dialog Framework
 */
export interface IDialogData<TValue, TBody, TDetailsBody = void> {
	/**
	 * Base class instance.
	 */
	dialog: ModalDialogModel<TValue, TBody, TDetailsBody>;
}

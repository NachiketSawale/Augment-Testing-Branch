/*
 * Copyright(c) RIB Software GmbH
 */

import {
	Component,
	inject,
} from '@angular/core';

import { Translatable } from '@libs/platform/common';

import {
	getCustomDialogDataToken,
	IDialog, IDialogDetails, StandardDialogButtonId
} from '../../../base';
import { getMessageBoxOptionsToken } from '../../model/message-box-options.interface';

/**
 * Component renders the message dialog body.
 */
@Component({
	selector: 'ui-common-message-box',
	templateUrl: './message-box.component.html',
	styleUrls: ['./message-box.component.scss'],
})
export class MessageBoxComponent<TDetailsBody = void> {

	public constructor() {
		this.dialogInfo = (function createWrapper(owner: MessageBoxComponent<TDetailsBody>) {
			return {
				get details(): IDialogDetails<TDetailsBody> {
					if (!owner.dialogWrapper.details) {
						throw new Error('No details wrapper available.');
					}

					return owner.dialogWrapper.details;
				},
				close(closingButtonId?: StandardDialogButtonId | string) {
					owner.dialogWrapper.close(closingButtonId);
				}
			};
		})(this);
	}

	public readonly messageBoxOptions = inject(getMessageBoxOptionsToken<TDetailsBody>());

	private readonly dialogWrapper = inject(getCustomDialogDataToken<void, MessageBoxComponent, TDetailsBody>());

	public readonly dialogInfo: IDialog<TDetailsBody>;

	public get bodyText(): Translatable {
		return this.messageBoxOptions.bodyText ?? '';
	}
}

/*
 * Copyright(c) RIB Software GmbH
 */

import { Translatable } from '@libs/platform/common';

import {
	ICustomDialog,
	IDialog,
	IDialogButtonBase,
	IDialogButtonEventInfo,
	DialogButtonSettingFunc,
	DialogButtonEventHandlerFunc, IClosingDialogButtonEventInfo
} from '../..';

export class DialogButtonAdapter<TValue, TBody, TSrcDialog extends IDialog<TDetailsBody>, TDetailsBody = void> implements IDialogButtonBase<ICustomDialog<TValue, TBody, TDetailsBody>, TDetailsBody> {

	public constructor(
		private readonly src: IDialogButtonBase<TSrcDialog, TDetailsBody>,
		private readonly getSrcDialogFunc: (customDlg: ICustomDialog<TValue, TBody, TDetailsBody>) => TSrcDialog
	) {
	}

	public get autoClose(): boolean | undefined {
		return this.src.autoClose;
	}

	public get cssClass(): string | undefined {
		return this.src.cssClass;
	}

	public get iconClass(): string | undefined {
		return this.src.iconClass;
	}

	public get id(): string {
		return this.src.id;
	}

	public get fn(): DialogButtonEventHandlerFunc<ICustomDialog<TValue, TBody, TDetailsBody>, TDetailsBody> | undefined {
		if (!this.src.fn) {
			return undefined;
		}

		return this.callFn;
	}

	private callFn(event: MouseEvent, info: IClosingDialogButtonEventInfo<ICustomDialog<TValue, TBody, TDetailsBody>, TDetailsBody>): Promise<void> | void {
		if (!this.src.fn) {
			return undefined;
		}

		return this.src.fn(event, {
			dialog: this.getSrcDialogFunc(info.dialog),
			get cancel(): boolean {
				return info.cancel;
			},
			set cancel(value: boolean) {
				info.cancel = value;
			},
			button: info.button
		});
	}

	public get isDisabled(): DialogButtonSettingFunc<ICustomDialog<TValue, TBody, TDetailsBody>, boolean, TDetailsBody> | boolean | undefined {
		switch (typeof this.src.isDisabled) {
			case 'boolean':
				return this.src.isDisabled;
			case 'function':
				return this.callIsDisabled;
			default:
				return undefined;
		}
	}

	private callIsDisabled(info: IDialogButtonEventInfo<ICustomDialog<TValue, TBody, TDetailsBody>, TDetailsBody>): boolean {
		if (typeof this.src.isDisabled !== 'function') {
			return this.src.isDisabled || false;
		}

		return this.src.isDisabled({
			dialog: this.getSrcDialogFunc(info.dialog),
			button: info.button
		});
	}

	public get isVisible(): DialogButtonSettingFunc<ICustomDialog<TValue, TBody, TDetailsBody>, boolean, TDetailsBody> | boolean | undefined {
		switch (typeof this.src.isVisible) {
			case 'boolean':
				return this.src.isVisible;
			case 'function':
				return this.callIsVisible;
			default:
				return undefined;
		}
	}

	private callIsVisible(info: IDialogButtonEventInfo<ICustomDialog<TValue, TBody, TDetailsBody>, TDetailsBody>): boolean {
		if (typeof this.src.isVisible !== 'function') {
			return this.src.isVisible === undefined ? true : this.src.isVisible;
		}

		return this.src.isVisible({
			dialog: this.getSrcDialogFunc(info.dialog),
			button: info.button
		});
	}

	public get caption(): DialogButtonSettingFunc<ICustomDialog<TValue, TBody, TDetailsBody>, Translatable, TDetailsBody> | Translatable | undefined {
		switch (typeof this.src.caption) {
			case 'string':
			case 'object':
				return this.src.caption;
			case 'function':
				return this.callCaption;
			default:
				return undefined;
		}
	}

	private callCaption(info: IDialogButtonEventInfo<ICustomDialog<TValue, TBody, TDetailsBody>, TDetailsBody>): Translatable {
		if (typeof this.src.caption !== 'function') {
			return this.src.caption ?? '';
		}

		return this.src.caption({
			dialog: this.getSrcDialogFunc(info.dialog),
			button: info.button
		});
	}

	public get tooltip(): DialogButtonSettingFunc<ICustomDialog<TValue, TBody, TDetailsBody>, string, TDetailsBody> | string | undefined {
		switch (typeof this.src.tooltip) {
			case 'string':
				return this.src.tooltip;
			case 'function':
				return this.callTooltip;
			default:
				return undefined;
		}
	}

	private callTooltip(info: IDialogButtonEventInfo<ICustomDialog<TValue, TBody, TDetailsBody>, TDetailsBody>): string {
		if (typeof this.src.tooltip !== 'function') {
			return this.src.tooltip ?? '';
		}

		return this.src.tooltip({
			dialog: this.getSrcDialogFunc(info.dialog),
			button: info.button
		});
	}
}
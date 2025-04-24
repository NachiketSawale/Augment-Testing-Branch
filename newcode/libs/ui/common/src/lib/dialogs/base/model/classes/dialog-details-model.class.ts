/*
 * Copyright(c) RIB Software GmbH
 */

import {
	ConcreteDialogDetailOptions,
	DialogDetailsType,
	IDialogDetails,
	isDialogCustomDetailOptions,
	isDialogTextDetailOptions
} from '../..';
import { StaticProvider, Type } from '@angular/core';

export class DialogDetailsModel<TDetailsBody> {

	public constructor(
		private readonly details?: ConcreteDialogDetailOptions<TDetailsBody>
	) {
		this.visible = Boolean(details?.show);

		this.detailsWrapper = (function createDetailsWrapper(owner: DialogDetailsModel<TDetailsBody>): IDialogDetails<TDetailsBody> {
			return {
				type: owner.details?.type ?? DialogDetailsType.LongText,
				get isVisible(): boolean {
					return owner.visible;
				},
				set isVisible(value: boolean) {
					owner.visible = value;
				},
				get customDetails(): TDetailsBody | undefined {
					return owner.detailsBody;
				}
			};
		})(this);
	}

	public readonly detailsWrapper: IDialogDetails<TDetailsBody>;

	public detailsBody?: TDetailsBody;

	public get hasDetails(): boolean {
		return Boolean(this.details);
	}

	private visible: boolean;

	public get isDetailsVisible(): boolean {
		return this.hasDetails && this.visible;
	}

	public get type(): DialogDetailsType {
		if (!this.details) {
			throw new Error('Value unavailable.');
		}

		return this.details.type;
	}

	public get cssClasses(): string {
		let result = '';

		if (this.details) {
			result += this.details.type;
			if (this.details.cssClass) {
				result += ` ${this.details.cssClass}`;
			}
		}

		return result;
	}

	public get textValue(): string {
		if (isDialogTextDetailOptions(this.details)) {
			return this.details.value;
		}

		return '';
	}

	public get body(): Type<TDetailsBody> | null {
		if (isDialogCustomDetailOptions(this.details)) {
			return this.details.bodyComponent;
		}

		return null;
	}

	public get bodyProviders(): StaticProvider[] | undefined {
		if (isDialogCustomDetailOptions(this.details)) {
			return this.details.bodyProviders;
		}

		return undefined;
	}
}
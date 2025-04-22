/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {IUiCommonLookupBtn} from './interfaces/lookup-btn.interface';

export class UiCommonLookupBtn<TItem extends object, TEntity extends object> implements IUiCommonLookupBtn<TItem, TEntity> {
	public order = 0;
	public disabled = false;
	public hidden = false;

	public caption?: string;
	public image?: string;
	public css?: {
		class?: string;
		style?: string;
	};
	public shownOnReadonly?: boolean;

	public constructor(public id: string, public content: string, public execute: () => void, public canExecute?: () => boolean) {

	}

	public isDisabled(): boolean {
		return this.disabled || (!!this.canExecute && !this.canExecute());
	}
}

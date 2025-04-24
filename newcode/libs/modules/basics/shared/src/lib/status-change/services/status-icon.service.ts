/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILookupContext, ILookupImageSelector, LookupImageIconType } from '@libs/ui/common';
import { IStatusIcon } from '../model/interfaces/status-icon.interface';

/**
 * The replacement of platformStatusIconService in angularjs which used to show status icon in the lookup
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsSharedStatusIconService<TItem extends IStatusIcon, TEntity extends object> implements ILookupImageSelector<TItem, TEntity> {
	// Currently there are so many pictures.
	private readonly totalIcon = 196;
	private readonly icons: string[] = [];

	public constructor() {
		this.generateIcons();
	}

	private generateIcons() {
		for (let i = 1; i <= this.totalIcon; i++) {
			// format number to have two digits
			this.icons[i] = `status-icons ico-status${i.toString().padStart(2, '0')}`;
		}
	}

	public getIconType() {
		return LookupImageIconType.Css;
	}

	public select(item: TItem, context: ILookupContext<TItem, TEntity>): string {
		if (item.Icon < 1 || item.Icon > this.totalIcon) {
			throw new Error(`Status icon ${item.Icon} is not defined!`);
		}

		return this.icons[item.Icon];
	}
}

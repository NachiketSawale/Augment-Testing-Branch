/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, ElementRef, inject } from '@angular/core';

import { IFormConfig } from '../../../../form';
import { EntityRuntimeData } from '@libs/platform/data-access';
import { StandardDialogButtonId, getCustomDialogDataToken } from '../../../base';
import { Translatable } from '@libs/platform/common';
import { getScopedConfigDialogDataToken } from '../../model/scoped-config-dialog-data.interface';

/**
 * Tabs data information.
 */
interface IScopedConfigDialogTabsData<T extends object> {
	title: Translatable;
	formConfig: IFormConfig<Partial<T>>;
	entity: Partial<T>;
	runTimeData: EntityRuntimeData<T>;
}

/**
 * Component renders the scoped config dialog body and implements the basic functionality.
 */
@Component({
	selector: 'ui-common-scoped-config-dialog',
	templateUrl: './scoped-config-dialog.component.html',
	styleUrls: ['./scoped-config-dialog.component.scss'],
})
export class ScopedConfigDialogComponent<T extends object> {
	/**
	 * Tab index to be shown.
	 */
	public selectedIndex!: number;

	/**
	 * Tabs Data.
	 */
	public tabs: IScopedConfigDialogTabsData<T>[] = [];

	/**
	 * A reference to the dialog box supplied to calling code.
	 */
	public readonly dialogInfo;

	/**
	 * A wrapper around a native element inside of a View.
	 */
	private readonly elRef = inject(ElementRef);

	/**
	 * Dialog body specific data.
	 */
	private readonly dialogData = inject(getScopedConfigDialogDataToken<T>());

	/**
	 * Dialog reference data.
	 */
	private readonly dialogWrapper = inject(getCustomDialogDataToken<T, ScopedConfigDialogComponent<T>>());

	public constructor() {
		this.dialogInfo = (function createDialogInfo(owner: ScopedConfigDialogComponent<T>) {
			return {
				close(closingButtonId?: StandardDialogButtonId | string) {
					owner.dialogWrapper.close(closingButtonId);
				},
			};
		})(this);

		this.setTabsData();
		this.selectedIndex = this.tabs.length - 1;
	}

	/**
	 * Creates tabs data.
	 */
	private setTabsData(): void {
		this.tabs = this.dialogData.items
			.sort((obj1, obj2) => obj1.priority - obj2.priority)
			.map((item) => {
				const result = {
					title: item.title,
					formConfig: this.dialogData.byName[item.id].formConfiguration as IFormConfig<Partial<T>>,
					entity: this.dialogData.byName[item.id].settings.entity,
					runTimeData: this.dialogData.byName[item.id].settings.runTimeData,
				};
				return result;
			});
	}
}

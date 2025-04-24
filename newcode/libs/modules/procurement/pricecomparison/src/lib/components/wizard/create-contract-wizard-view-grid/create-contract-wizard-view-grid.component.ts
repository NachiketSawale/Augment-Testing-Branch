/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, InjectionToken, inject } from '@angular/core';
import { CellChangeEvent, IGridApi, IGridConfiguration, IMenuItemsList } from '@libs/ui/common';

export const CREATE_CONTRACT_WIZARD_GRID_MENU_TOKEN = new InjectionToken('create_contract_wizard_grid_menu');
export const CREATE_CONTRACT_WIZARD_GRID_OPTIONS_TOKEN = new InjectionToken('create_contract_wizard_grid_options');
export const CREATE_CONTRACT_WIZARD_GRID_CONFIG_TOKEN = new InjectionToken('create_contract_wizard_grid_config');

export type WizardViewGridOptions<T extends object> = {
	onSelectChanged?: (items: T[]) => Promise<void> | void;
	onCellChanged?: (evt: CellChangeEvent<T>) => Promise<void> | void;
	onItemsChanged?: (evt: { items: T[], grid: IGridApi<T> }) => void;
};

@Component({
	selector: 'procurement-pricecomparison-create-contract-wizard-view-grid',
	templateUrl: './create-contract-wizard-view-grid.component.html',
	styleUrls: ['./create-contract-wizard-view-grid.component.scss'],
})
export class ProcurementPricecomparisonCreateContractWizardViewGridComponent<T extends object = object> {
	public menu?: IMenuItemsList = inject<IMenuItemsList>(CREATE_CONTRACT_WIZARD_GRID_MENU_TOKEN, {
		optional: true
	}) ?? undefined;

	public viewGridOptions?: WizardViewGridOptions<T> = inject<WizardViewGridOptions<T>>(CREATE_CONTRACT_WIZARD_GRID_OPTIONS_TOKEN, {
		optional: true
	}) ?? undefined;

	public config: IGridConfiguration<T> = inject<IGridConfiguration<T>>(CREATE_CONTRACT_WIZARD_GRID_CONFIG_TOKEN);

	public onSelectChanged(items: T[]) {
		if (this.viewGridOptions?.onSelectChanged) {
			this.viewGridOptions.onSelectChanged(items);
		}
	}

	public onCellChanged(evt: CellChangeEvent<T>) {
		if (this.viewGridOptions?.onCellChanged) {
			this.viewGridOptions?.onCellChanged(evt);
		}
	}

	public onItemsChanged(evt: { items: T[], grid: IGridApi<T> }) {
		if (this.viewGridOptions?.onItemsChanged) {
			this.viewGridOptions?.onItemsChanged(evt);
		}
	}
}
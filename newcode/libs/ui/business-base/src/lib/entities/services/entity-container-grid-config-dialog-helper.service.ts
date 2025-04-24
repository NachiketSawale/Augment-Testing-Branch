/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { cloneDeep, findIndex, has, sortBy, unset } from 'lodash';

import { IGridContainerLink } from '../model/grid-container-link.interface';
import { PlatformTranslateService, Translatable } from '@libs/platform/common';

import { ColumnDef, IGridConfigDialogOptions, StandardDialogButtonId, UiCommonGridConfigDialogService } from '@libs/ui/common';
import { IEntityContainerGridColumnConfigData } from '../model/entity-container-grid-column-config-data.interface';
import { EntityContainerGridConfigDialogState, IEntityContainerGridDialogStateData } from '../model/entity-container-grid-config-dialog-state.class';

/**
 * Provides support functionality to implement grid config dialog in grid containers.
 */
@Injectable({
	providedIn: 'root',
})
export class UiBusinessBaseEntityContainerGridConfigDialogHelperService {
	/**
	 * This service displays grid config modal dialog.
	 */
	private readonly gridConfigDialogSvc = inject(UiCommonGridConfigDialogService);

	/**
	 * This service is useful for language translation.
	 */
	private readonly translateService = inject(PlatformTranslateService);

	/**
	 * Method opens the dialog.
	 *
	 * @param containerLink Reference to the standard equipment inside a grid container.
	 */
	public async openConfigDialog<T extends object>(containerLink: IGridContainerLink<T>) {
		const gridDialogState = new EntityContainerGridConfigDialogState<T>(containerLink.grid);
		this.loadViewConfig<T>(gridDialogState);

		const visibleColumnsConfig = gridDialogState.propertyConfig.filter((config) => !config.hidden);
		const hiddenColumnConfig = sortBy(
			gridDialogState.propertyConfig.filter((config) => config.hidden),
			['name'],
		);
		const allItems = visibleColumnsConfig.concat(hiddenColumnConfig);

		const options: IGridConfigDialogOptions<IEntityContainerGridColumnConfigData> = {
			width: '80%',
			headerText: 'Grid Layout',
			idProperty: 'Id',
			allItems: cloneDeep(allItems),
			value: cloneDeep(visibleColumnsConfig),
		};

		const result = await this.gridConfigDialogSvc.show(options);

		if (result?.closingButtonId === StandardDialogButtonId.Ok && result.value) {
			this.applyConfiguration(result.value, gridDialogState);
			this.saveConfiguration(gridDialogState);
		}
	}

	/**
	 * Load the data for dialog.
	 *
	 * @param dialogState Config dialog state api.
	 */
	private loadViewConfig<T extends object>(dialogState: IEntityContainerGridDialogStateData<T>): void {
		if (!dialogState.columns.length) {
			throw new Error('No columns present');
		}

		const enableModuleConfig = dialogState.enableModuleConfig;

		//TODO: Below implementation is mocked using session storage
		//Replace mock implementation when there is provision to save/get config data.
		const data = enableModuleConfig ? sessionStorage.getItem('Property_Config_Module') : sessionStorage.getItem('Property_Config_View');
		let config;
		if (data) {
			config = JSON.parse(data);
		}

		if (config) {
			dialogState.propertyConfig = config;
		} else {
			//Default properties to be generated when no default(previously saved) properties available.
			this.generatePropertyConfig(dialogState);
		}
	}

	/**
	 * Method generates the default columns data when there is no previous saved data.
	 *
	 * @param dialogState Config dialog state api.
	 */
	private generatePropertyConfig<T extends object>(dialogState: IEntityContainerGridDialogStateData<T>): void {
		const data: IEntityContainerGridColumnConfigData[] = [];
		for (let i = 0; i < dialogState.columns.length; i++) {
			data.push(this.makeConfigFromColumn(dialogState.columns[i]));
		}

		dialogState.propertyConfig = data;
	}

	/**
	 * This method prepares the default column entity data.
	 *
	 * @param col Column definition.
	 * @returns Grid config dialog column data.
	 */
	private makeConfigFromColumn<T extends object>(col: ColumnDef<T>): IEntityContainerGridColumnConfigData {
		const kb = col.keyboard ? col.keyboard : { enter: true, tab: true };
		const name = this.translateService.instant(col.label as Translatable);

		//TODO: Provision for additional columns if any like Uom, fraction,aggegrates etc...

		return {
			Id: col.id,
			hidden: !col.visible,
			name: name.text,
			//TODO: Assign label code when provision for it is available.
			//TODO: For now given empty string as default value.
			labelCode: '',
			//TODO: Assign userLabelName when provision for it is available.
			//TODO: For now given empty string as default value.
			userLabelName: '',
			enter: kb.enter,
			width: col.width || 100,
			pinned: col.pinned || false,
		};
	}

	/**
	 * Method applies the configuration using dialog result.
	 *
	 * @param result Result from dialog.
	 * @param dialogState Config dialog state api.
	 */
	private applyConfiguration<T extends object>(
		result: IEntityContainerGridColumnConfigData[], 
		dialogState: IEntityContainerGridDialogStateData<T>
	): void {
		const hiddenCols = dialogState.propertyConfig.filter((config) => !result.some((res) => res.Id === config.Id));
		hiddenCols.forEach((col) => (col.hidden = true));
		result.forEach((res) => (res.hidden = false));

		this.setColumnProperties(result.concat(hiddenCols), dialogState);
	}

	/**
	 * Saves the configuration data.
	 *
	 * @param dialogState Config dialog state api.
	 */
	private saveConfiguration<T extends object>(dialogState: IEntityContainerGridDialogStateData<T>): void {
		const enableModuleConfig = dialogState.enableModuleConfig;

		if (enableModuleConfig) {
			//TODO: Save module config.
			//TODO: For now implementation is mocked using session storage.
			sessionStorage.setItem('Property_Config_Module', JSON.stringify(dialogState.propertyConfig));
		} else {
			//TODO: Save view config.
			//TODO: For now implementation is mocked using session storage.
			sessionStorage.setItem('Property_Config_View', JSON.stringify(dialogState.propertyConfig));
		}
	}

	/**
	 * Method sets the column properties retreived from the dialog.
	 *
	 * @param config Result from dialog.
	 * @param dialogState Config dialog state api.
	 */
	private setColumnProperties<T extends object>(
		config: IEntityContainerGridColumnConfigData[], 
		dialogState: IEntityContainerGridDialogStateData<T>
	): void {
		dialogState.propertyConfig = cloneDeep(config);
		config.forEach((property, index) => {
			const idx = findIndex(dialogState.columns, { id: property.Id });

			if (has(property, 'name')) {
				unset(property, 'name');
			}

			if (property.labelCode || property.userLabelName) {
				//TODO: Implementation for translate and apply label. Implementation to be completed
				//TODO: When provision for labelCode and userLabelName available.
				unset(property, 'labelCode');
				unset(property, 'userLabelName');
			}

			if (dialogState.columns[idx]) {
				dialogState.columns[idx] = Object.assign({}, dialogState.columns[idx], property);
				dialogState.columns[idx].width = property.width;
				dialogState.columns[idx].visible = !property.hidden;
				dialogState.columns[idx].keyboard = { enter: property.enter, tab: dialogState.columns[idx].keyboard?.tab ?? true };
			}

			//TODO: provision for additional fields like Uom,fraction, aggregates .....

			this.move(idx, index, dialogState);
		});

		dialogState.columns = [...dialogState.columns];
	}

	/**
	 * This method shifts the columns.
	 *
	 * @param fromIndex Current index.
	 * @param toIndex Index where column to be shifted.
	 * @param dialogState Config dialog state api.
	 */
	private move<T extends object>(
		fromIndex: number, 
		toIndex: number, 
		dialogState: IEntityContainerGridDialogStateData<T>
	): void {
		const item = dialogState.columns.splice(fromIndex, 1)[0];
		dialogState.columns.splice(toIndex, 0, item);
	}
}

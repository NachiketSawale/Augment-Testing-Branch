/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, Injector, inject } from '@angular/core';
import { ColumnDef, ConcreteMenuItem, FieldType, GridApiService, IMenuItemsList, ItemType } from '@libs/ui/common';
import { COMPARE_SETTING_DATA_TOKEN } from '../compare-setting-dialog-body/compare-setting-dialog-body.component';
import { ICompositeBaseEntity } from '../../../model/entities/composite-base-entity.interface';
import { ICompareSettingBase } from '../../../model/entities/compare-setting-base.interface';
import { ICompareRowEntity } from '../../../model/entities/compare-row-entity.interface';


@Component({
	template: ''
})
export class ProcurementPricecomparisonCompareSettingBaseComponent<
	T extends ICompositeBaseEntity<T>,
	ST extends ICompareSettingBase<T>
> {
	protected readonly injector = inject(Injector);
	protected readonly gridApiSvc = inject(GridApiService);
	protected readonly settings = inject<ST>(COMPARE_SETTING_DATA_TOKEN);
	public readonly fieldType = FieldType;

	protected createMenuItem(id: string, caption: string, iconClass: string, sort: number, fn: () => void, disabled?: () => boolean): ConcreteMenuItem {
		return {
			id: id,
			sort: sort,
			caption: caption,
			type: ItemType.Item,
			iconClass: iconClass,
			fn: fn ? fn.bind(this) : fn,
			disabled: disabled ? disabled.bind(this) : disabled
		};
	}

	protected createMenuItemsList(customItems?: ConcreteMenuItem[]): IMenuItemsList {
		return {
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: [
				this.createMenuItem('t-moveUp', 'cloud.common.toolbarMoveUp', 'tlb-icons ico-grid-row-up', 10, () => {
					// TODO-DRIZZLE:To be checked.
				}),
				this.createMenuItem('t-moveDown', 'cloud.common.toolbarMoveDown', 'tlb-icons ico-grid-row-down', 11, () => {
					// TODO-DRIZZLE:To be checked.
				}),
				this.createMenuItem('t-moveTop', 'cloud.common.toolbarMoveTop', 'tlb-icons ico-grid-row-start', 12, () => {
					// TODO-DRIZZLE:To be checked.
				}),
				this.createMenuItem('t-moveBottom', 'cloud.common.toolbarMoveBottom', 'tlb-icons ico-grid-row-end', 13, () => {
					// TODO-DRIZZLE:To be checked.
				}),
				this.createMenuItem('t-print', 'cloud.common.print', ' tlb-icons ico-print-preview', 14, () => {
					// TODO-DRIZZLE:To be checked.
				}),
				this.createMenuItem('t-settings', 'cloud.common.gridSettings', 'dropdown-toggle dropdown-caret tlb-icons ico-settings', 15, () => {
					// TODO-DRIZZLE:To be checked.
				})
			].concat(customItems ? customItems : []).sort((a, b) => a.sort && b.sort ? a.sort - b.sort : 0)
		};
	}

	protected createCompareColumns(additionColumns?: ColumnDef<ICompareRowEntity>[]): ColumnDef<ICompareRowEntity>[] {
		const basicsColumns: ColumnDef<ICompareRowEntity>[] = [{
			id: 'fieldName',
			model: 'FieldName',
			label: {
				text: 'Field Name',
				key: 'procurement.pricecomparison.compareConfigFieldsFieldName'
			},
			type: FieldType.Description,
			sortable: true,
			readonly: true,
			width: 120
		}, {
			id: 'Description',
			model: 'UserLabelName',
			label: {
				text: 'User label name',
				key: 'cloud.desktop.formConfigCustomerLabelName'
			},
			type: FieldType.Description,
			sortable: true,
			width: 150
		}, {
			id: 'Visible',
			model: 'Visible',
			label: {
				text: 'Visible',
				key: 'procurement.pricecomparison.compareConfigColumnsVisible'
			},
			type: FieldType.Boolean,
			width: 150,
			sortable: true,
			headerChkbox: true
		}];

		return basicsColumns.concat(additionColumns ?? []);
	}
}

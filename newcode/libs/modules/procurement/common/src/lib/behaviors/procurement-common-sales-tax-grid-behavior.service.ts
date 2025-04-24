/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { Injectable } from '@angular/core';
import { ItemType } from '@libs/ui/common';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { ProcurementCommonSalesTaxDataService } from '../services/procurement-common-sales-tax-data.service';
import { IProcurementCommonSalesTaxEntity } from '../model/entities/procurement-common-sales-tax-entity.interface';

@Injectable({
	providedIn: 'root',
})
export class ProcurementCommonSalesTaxGridBehavior<T extends IProcurementCommonSalesTaxEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> implements IEntityContainerBehavior<IGridContainerLink<T>, T> {

	/**
	 * The constructor
	 * @param dataService
	 */
	public constructor(public dataService: ProcurementCommonSalesTaxDataService<T, PT, PU>) {}

	private addToolbars(containerLink: IGridContainerLink<T>) {
		containerLink.uiAddOns.toolbar.addItems([{
			id: 'reset',
			caption: {
				text: 'Reset',
				key: 'procurement.common.wizard.generateDeliverySchedule.reset'
			},
			type: ItemType.Item,
			hideItem: false,
			sort: 99,
			iconClass: 'tlb-icons ico-reset',
			fn: () => {
				this.dataService.recalculate(true);
			},
			disabled: this.dataService.disabled()
		}, {
			id: 'recalculate',
			caption: {
				text: 'Recalculate',
				key: 'procurement.common.total.dirtyRecalculate'
			},
			type: ItemType.Item,
			hideItem: false,
			sort: 99,
			iconClass: 'control-icons ico-recalculate',
			fn: () => {
				this.dataService.recalculate(false);
			},
			disabled: this.dataService.disabled()
		}]);
	}

	public onCreate(containerLink: IGridContainerLink<T>): void {
		containerLink.uiAddOns.toolbar.deleteItems([EntityContainerCommand.CreateRecord, EntityContainerCommand.DeleteRecord]);
		this.addToolbars(containerLink);
	}
}
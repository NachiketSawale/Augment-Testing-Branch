/*
 * Copyright(c) RIB Software GmbH
 */


import { Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IPrcCommonAccrualEntity } from '../model/entities/prc-common-accrual-entity.interface';

@Injectable({
	providedIn: 'root'
})


/**
 * Procurement Common Accrual Grid Behaviour Service.
 */
export class ProcurementCommonAccrualGridBehavior implements IEntityContainerBehavior<IGridContainerLink<IPrcCommonAccrualEntity>, IPrcCommonAccrualEntity> {

	/**
	 * On container creation callback
	 * @param containerLink
	 */
	public onCreate(containerLink: IGridContainerLink<IPrcCommonAccrualEntity>) {
		this.addItemsToToolbar(containerLink);
	}

	private addItemsToToolbar(containerLink: IGridContainerLink<IPrcCommonAccrualEntity>) {
		containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete', ]);
	}
}
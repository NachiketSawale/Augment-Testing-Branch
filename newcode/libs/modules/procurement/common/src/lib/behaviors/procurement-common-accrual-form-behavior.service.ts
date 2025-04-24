/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntityContainerBehavior, IFormContainerLink, } from '@libs/ui/business-base';
import { IPrcCommonAccrualEntity } from '../model/entities/prc-common-accrual-entity.interface';

@Injectable({
	providedIn: 'root'
})


/**
 * Procurement Common Accrual Form Behaviour Service.
 */
export class ProcurementCommonAccrualFormBehavior implements IEntityContainerBehavior<IFormContainerLink<IPrcCommonAccrualEntity>, IPrcCommonAccrualEntity> {

	/**
	 * On container creation callback
	 * @param containerLink
	 */
	public onCreate(containerLink: IFormContainerLink<IPrcCommonAccrualEntity>) {
		this.addItemsToToolbar(containerLink);
	}

	private addItemsToToolbar(containerLink: IFormContainerLink<IPrcCommonAccrualEntity>) {
		containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete', ]);
	}
}

/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { LookupSimpleEntity, UiCommonLookupItemsDataService } from '@libs/ui/common';
import { PlatformTranslateService } from '@libs/platform/common';
import { ProcurementPurchaseOrderType } from '@libs/procurement/common';

/**
 * Lookup for Dashboard Parameter SysContext
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementConHeaderPurchaseOrdersLookupService<TEntity extends object> extends UiCommonLookupItemsDataService<LookupSimpleEntity, TEntity> {
	/**
	 * The constructor
	 */
	public constructor(private translateService: PlatformTranslateService) {
		const items: LookupSimpleEntity[] = [
			new LookupSimpleEntity(ProcurementPurchaseOrderType.PurchaseOrder, translateService.instant('procurement.contract.purchaseOrders.purchaseOrder').text),
			new LookupSimpleEntity(ProcurementPurchaseOrderType.CallOff, translateService.instant('procurement.contract.purchaseOrders.callOff').text),
			new LookupSimpleEntity(ProcurementPurchaseOrderType.ChangeOrder, translateService.instant('procurement.contract.purchaseOrders.changeOrder').text),
			new LookupSimpleEntity(ProcurementPurchaseOrderType.FrameworkContract, translateService.instant('procurement.contract.purchaseOrders.frameworkContract').text),
			new LookupSimpleEntity(ProcurementPurchaseOrderType.FrameworkContractCallOff, translateService.instant('procurement.contract.purchaseOrders.frameworkContractCallOff').text),
		];
		super(items, { uuid: 'fdcbb9b80feb4b33b0b4b576f7249f2f', displayMember: 'description', valueMember: 'id' });
	}
}

/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { IPesItemEntity } from '../model/entities';
import { BasicsSharedPriceConditionDataService, IPriceConditionContext } from '@libs/basics/shared';
import { ProcurementPesItemDataService } from './procurement-pes-item-data.service';
import { IDataServiceChildRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { IPesItemPriceConditionEntity } from '../model/entities/pes-item-price-condition-entity.interface';
import { IIdentificationData } from '@libs/platform/common';
import { PesItemComplete } from '../model/complete-class/pes-item-complete.class';

export const PROCUREMENT_PES_PRICE_CONDITION_DATA_TOKEN = new InjectionToken<ProcurementPesPriceConditionDataService>('procurementPesPriceConditionDataService');

/**
 * The Pes Item PriceCondition service in pes
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementPesPriceConditionDataService extends BasicsSharedPriceConditionDataService<IPesItemPriceConditionEntity, IPesItemEntity, PesItemComplete> {
	protected internalModuleName = 'procurement.pes';

	/**
	 * The constructor
	 */
	public constructor(protected pesItemService: ProcurementPesItemDataService) {
		super(pesItemService, {
			apiUrl: 'procurement/pes/item/pricecondition',
			readInfo: {
				endPoint: 'list',
			},
			createInfo: {
				endPoint: 'createnew',
				usePost: true,
				prepareParam: (ident: IIdentificationData) => {
					return {
						MainItemId: ident.pKey1!,
						existedTypes: this.getList().map((entity) => {
							return entity.PrcPriceConditionTypeFk;
						}),
					};
				},
			},
			roleInfo: <IDataServiceChildRoleOptions<IPesItemPriceConditionEntity, IPesItemEntity, PesItemComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'PesItemPriceCondition',
				parent: pesItemService,
			},
		});
	}

	public override isParentFn(parentKey: IPesItemEntity, entity: IPesItemPriceConditionEntity): boolean {
		return entity.PesItemFk === parentKey.Id;
	}

	public onCalculateDone(total: number, totalOc: number): void {
		const parentItem = this.pesItemService.getSelectedEntity();
		if (parentItem) {
			parentItem.PriceExtra = total;
			parentItem.PriceExtraOc = totalOc;
		}
	}

	public getContextFromParent(): IPriceConditionContext {
		//todo cause the backend projectId is not empty, it will be set to -1 first and then changed to null
		const parentItem = this.pesItemService.getSelectedEntity()!;
		const pesHeader = this.pesItemService.parentService.getSelectedEntity()!;
		return {
			PrcPriceConditionId: parentItem.PrcPriceConditionFk ?? null,
			HeaderId: pesHeader.Id,
			HeaderName: this.internalModuleName,
			ProjectFk: pesHeader.ProjectFk ? pesHeader.ProjectFk : -1,
			ExchangeRate: pesHeader.ExchangeRate,
		};
	}
}

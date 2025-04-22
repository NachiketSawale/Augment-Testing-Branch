/*
 * Copyright(c) RIB Software GmbH
 */

import {PrcCommonItemComplete} from '../model/procurement-common-item-complete.class';
import {IPrcItemPriceConditionEntity, IPrcItemEntity} from '../model/entities';
import {BasicsSharedPriceConditionDataService} from '@libs/basics/shared';
import {
    IDataServiceChildRoleOptions,
    IDataServiceOptions,
    ServiceRole
} from '@libs/platform/data-access';
import {IIdentificationData} from '@libs/platform/common';
import {IBasicsPriceConditionHeaderService} from '@libs/basics/interfaces';

/**
 * The PrcItem PriceCondition service
 * todo - we should use common price condition component
 */
export abstract class ProcurementCommonPriceConditionDataService<PT extends IPrcItemEntity, PU extends PrcCommonItemComplete>
    extends BasicsSharedPriceConditionDataService<IPrcItemPriceConditionEntity , PT, PU> {

	protected constructor(protected parentService: IBasicsPriceConditionHeaderService<PT, PU>) {

		const options: IDataServiceOptions<IPrcItemPriceConditionEntity> = {
			apiUrl: 'procurement/common/pricecondition',
			readInfo: {
				endPoint: 'list',
				usePost: false
			},
			createInfo: {
				endPoint: 'create',
				usePost: true,
				prepareParam: (ident: IIdentificationData) => {
					return {
						MainItemId: ident.pKey1!,
						existedTypes: this.getList().map((entity) => {
							return entity.PrcPriceConditionTypeFk;
						})
					};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IPrcItemPriceConditionEntity, PT, PU>>{
				role: ServiceRole.Leaf,
				itemName: 'PriceCondition',
				parent: parentService
			}
		};

		super(parentService, options);
	}

	public onCalculateDone(total: number, totalOc: number): void {
		const parentItem = this.parentService.getSelectedEntity();
		if (parentItem) {
			parentItem.PriceExtra = total;
			parentItem.PriceExtraOc = totalOc;
		}
	}

	public override isParentFn(parentKey: PT, entity: IPrcItemPriceConditionEntity): boolean {
		return entity.PrcItemFk === parentKey.Id;
	}
}
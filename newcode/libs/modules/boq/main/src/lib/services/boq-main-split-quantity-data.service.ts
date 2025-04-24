/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, Injector } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceChildRoleOptions } from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { BoqItemDataServiceBase } from './boq-main-boq-item-data.service';
import { IBoqItemEntity, IBoqSplitQuantityEntity } from '@libs/boq/interfaces';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';

@Injectable()
export class BoqSplitQuantityDataService extends DataServiceFlatLeaf<IBoqSplitQuantityEntity, IBoqItemEntity, IBoqItemEntity> {

	public constructor(parentService: BoqItemDataServiceBase) {
		const options: IDataServiceOptions<IBoqSplitQuantityEntity> = {
			apiUrl: 'boq/main/splitquantity',
			roleInfo: <IDataServiceChildRoleOptions<IBoqSplitQuantityEntity, IBoqItemEntity, IBoqItemEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'BoqSplitQuantity',
				parent: parentService
			},
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'getcompositelist',
				usePost: true
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create',
				usePost: true,
				prepareParam: () => {
					const currentBoqItem = (parentService as BoqItemDataServiceBase).getSelectedEntity();
					if (currentBoqItem) {
						return {BoqHeaderFk: currentBoqItem.BoqHeaderFk, BoqItemFk: currentBoqItem.Id};
					} else {
						return;
					}
				}
			}
		};

		super(options);
	}

	protected override provideLoadPayload(): object {
		const currentBoqItem = this.getSelectedParent();
		if (currentBoqItem) {
			return {BoqHeaderFk: currentBoqItem.BoqHeaderFk, BoqItemFk: currentBoqItem.Id};
		} else {
			return {};
		}
	}

	protected override provideCreatePayload(): object {
		const currentBoqItem = this.getSelectedParent();
		if (currentBoqItem) {
			return {BoqHeaderFk: currentBoqItem.BoqHeaderFk, BoqItemFk: currentBoqItem.Id};
		} else {
			return {};
		}
	}

	protected override onLoadSucceeded(loaded: object): IBoqSplitQuantityEntity[] {
		const loadedSplitQuantities = (loaded as { dtos: IBoqSplitQuantityEntity[] }).dtos;

		return loadedSplitQuantities;
	}

	public override isParentFn(): boolean {
		return false;
	}
}

/*
 * Copyright(c) RIB Software GmbH
 */
export class BoqSplitQuantityBehaviorService implements IEntityContainerBehavior<IGridContainerLink<IBoqSplitQuantityEntity>, IBoqSplitQuantityEntity> {

	public constructor(private boqSplitQuantityDataService: BoqSplitQuantityDataService, injector: Injector) {
		this.boqSplitQuantityDataService = boqSplitQuantityDataService;
	}

	public onCreate(containerLink: IGridContainerLink<IBoqSplitQuantityEntity>): void {
		containerLink.uiAddOns.toolbar.addItems([]);
	}
}

/*
 * Copyright(c) RIB Software GmbH
 */
export class BoqSplitQuantityConfigService {

	public constructor(private boqSplitQuantityDataService: BoqSplitQuantityDataService, injector: Injector) {
		this.boqSplitQuantityDataService = boqSplitQuantityDataService;
	}

	public getLayoutConfiguration(): ILayoutConfiguration<IBoqSplitQuantityEntity> {
		return {
			groups: [
				{  gid: 'default-group',
					attributes:
					[  'Quantity',
						'QuantityAdj',
						'PrjLocationFk',
						'PrcStructureFk',
						'MdcControllingUnitFk',
						'DeliveryDate',
						'CommentText',
						'BoqBillToFk'
					]
				},
			],
			overloads: {},
			labels: prefixAllTranslationKeys('boq.main', {
				Quantity: 'Quantity',
				QuantityAdj: 'QuantityAdj',
				PrjLocationFk: 'PrjLocationFk',
				PrcStructureFk : 'PrcStructureFk',
				MdcControllingUnitFk: 'MdcControllingUnitFk',
				DeliveryDate: 'DeliveryDate',
				CommentText : 'CommentText',
				BoqBillToFk : 'BoqBillToFk'
			})
		};
	}
}
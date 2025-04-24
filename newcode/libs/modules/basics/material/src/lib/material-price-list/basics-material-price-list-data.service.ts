/*
 * Copyright(c) RIB Software GmbH
 */
import {BasicsMaterialRecordDataService} from '../material/basics-material-record-data.service';
import {Injectable} from '@angular/core';
import {
	DataServiceFlatNode,
	IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions,
	IDataServiceOptions, ServiceRole
} from '@libs/platform/data-access';
import {IMaterialEntity, IBasicsPriceConditionHeaderService} from '@libs/basics/interfaces';
import { Subject } from 'rxjs';
import {MainDataDto} from '@libs/basics/shared';
import { IMaterialPriceListEntity } from '../model/entities/material-price-list-entity.interface';
import { MaterialPriceListComplete } from '../model/complete-class/material-price-list-complete.class';

/**
 * Material Price List data service
 */

@Injectable({
	providedIn: 'root'
})

export class BasicsMaterialPriceListDataService extends DataServiceFlatNode<IMaterialPriceListEntity,MaterialPriceListComplete,IMaterialEntity,MaterialPriceListComplete> implements IBasicsPriceConditionHeaderService<IMaterialPriceListEntity,MaterialPriceListComplete> {
	/**
	 * Emitter for priceCondition change
	 */
	public priceConditionChanged$ = new Subject<number | null>();

	public constructor(private basicsMaterialRecordDataService: BasicsMaterialRecordDataService) {
		const options: IDataServiceOptions<IMaterialPriceListEntity> = {
			apiUrl: 'basics/material/pricelist',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false
			},
			createInfo: {
				prepareParam: ident => {
					return {mainItemId: ident.pKey1!};
				}
			},
			updateInfo: <IDataServiceEndPointOptions>{
				endPoint: 'update'
			},
			roleInfo: <IDataServiceChildRoleOptions<IMaterialPriceListEntity, IMaterialEntity, MaterialPriceListComplete>>{
				role: ServiceRole.Node,
				itemName: 'MaterialPriceList',
				parent: basicsMaterialRecordDataService
			}
		};

		super(options);
	}

	public override createUpdateEntity(modified: IMaterialPriceListEntity | null): MaterialPriceListComplete {
		const complete = new MaterialPriceListComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.MaterialPriceList = modified;
			complete.MaterialPriceLists = [modified];
		}
		return complete;
	}

	protected override provideLoadPayload() {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				MainItemId: parentSelection.Id
			};
		}
		return {
			MainItemId: -1
		};
	}

	protected override onLoadSucceeded(loaded: object): IMaterialPriceListEntity[] {
		const dto = new MainDataDto<IMaterialPriceListEntity>(loaded);
		return dto.Main;
	}

	protected override provideCreatePayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				mainItemId: parentSelection.Id
			};
		}
		throw new Error('please select a material record first');
	}

	protected override onCreateSucceeded(created: object): IMaterialPriceListEntity {
		return created as unknown as IMaterialPriceListEntity;
	}

	public calculateCost(entity: IMaterialPriceListEntity) {
		const cost = (entity.ListPrice * (100 - entity.Discount)) / 100 + entity.Charges + entity.PriceExtras;
		entity.Cost = cost;
		entity.EstimatePrice = entity.Cost;
		entity.DayworkRate = entity.Cost;
		this.setModified([entity]);
	}

	public override isParentFn(parentKey: IMaterialEntity, entity: IMaterialPriceListEntity): boolean {
		return entity.MaterialFk === parentKey.Id;
	}
}

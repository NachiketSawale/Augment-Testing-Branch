/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { DataServiceFlatLeaf, ServiceRole, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, EntityArrayProcessor, IReadOnlyField } from '@libs/platform/data-access';
import { BasicsPriceConditionDataService } from '../price-condition/basics-price-condition-data.service';
import { IPriceConditionDetailEntity } from '../model/entities/price-condition-detail-entity.interface';
import { IPriceConditionEntity } from '../model/entities/price-condition-entity.interface';
import { PriceConditionComplete } from '../model/complete-class/price-condition-complete.class';
import { BasicsSharedPriceConditionTypeLookupService, MainDataDto } from '@libs/basics/shared';
import { IBasicsCustomizePriceConditionTypeEntity } from '@libs/basics/interfaces';

/**
 * The Basics Price Condition Detail data service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsPriceConditionDetailDataService extends DataServiceFlatLeaf<IPriceConditionDetailEntity, IPriceConditionEntity, PriceConditionComplete> {
	private priceConditionTypeLookupService = inject(BasicsSharedPriceConditionTypeLookupService<IBasicsCustomizePriceConditionTypeEntity>);

	public constructor(private parentService: BasicsPriceConditionDataService) {
		const options: IDataServiceOptions<IPriceConditionDetailEntity> = {
			apiUrl: 'basics/priceconditiondetail',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: (ident) => {
					return {MainItemId: ident.pKey1};
				},
			},
			createInfo: {endPoint: 'create', usePost: true},
			roleInfo: <IDataServiceChildRoleOptions<IPriceConditionDetailEntity, IPriceConditionEntity, PriceConditionComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'PriceConditionDetailDto',
				parent: parentService,
			},
			processors: [new EntityArrayProcessor<IPriceConditionDetailEntity>(['Value'])]
		};

		super(options);
	}

	protected override provideLoadPayload(): object {
		const parent = this.getSelectedParent();
		if (parent) {
			return {
				mainItemId: parent.Id,
			};
		} else {
			throw new Error('There should be a selected parent Price Condition to load the Detail data');
		}
	}

	protected override onLoadSucceeded(loaded: object): IPriceConditionDetailEntity[] {
		const dto = new MainDataDto<IPriceConditionDetailEntity>(loaded);
		this.setValuesReadOnly(dto.Main, false);
		return dto.Main;
	}

	protected override onCreateSucceeded(loaded: object): IPriceConditionDetailEntity {
		const parent = this.getSelectedParent();
		const entity = loaded as IPriceConditionDetailEntity;
		if (entity && parent) {
			entity.PriceConditionFk = parent.Id;
		}
		this.setValuesReadOnly([entity], false);
		return entity;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: PriceConditionComplete, modified: IPriceConditionDetailEntity[], deleted: IPriceConditionDetailEntity[]): void {
		if (modified && modified.some(() => true)) {
			parentUpdate.PriceConditionDetailToSave = modified;
		}
		if (deleted && deleted.some(() => true)) {
			parentUpdate.PriceConditionDetailToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: PriceConditionComplete): IPriceConditionDetailEntity[] {
		if (complete && complete.PriceConditionDetailToSave) {
			return complete.PriceConditionDetailToSave;
		}
		return [];
	}

	public override isParentFn(parentKey: IPriceConditionEntity, entity: IPriceConditionDetailEntity): boolean {
		return entity.PriceConditionFk === parentKey.Id;
	}

	public setValuesReadOnly(entities: IPriceConditionDetailEntity[], isSetValue: boolean) {
		entities.forEach((entity: IPriceConditionDetailEntity) => {
			const typeItem = this.priceConditionTypeLookupService.cache.getItem({id: entity.PriceConditionTypeFk});
			const hasValue = (typeItem && typeItem.HasValue) as boolean;
			if (isSetValue && typeItem) {
				entity.Value = hasValue ? typeItem.Value : 0;
			}
			const readonlyFields: IReadOnlyField<IPriceConditionDetailEntity>[] = [{field: 'Value', readOnly: hasValue}];
			this.setEntityReadOnlyFields(entity, readonlyFields);
		});
	}
}

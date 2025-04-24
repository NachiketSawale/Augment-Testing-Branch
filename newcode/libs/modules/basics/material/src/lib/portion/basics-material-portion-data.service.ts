/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import {
	DataServiceFlatLeaf, ServiceRole,
	IDataServiceChildRoleOptions, IDataServiceEndPointOptions,
	IDataServiceOptions
} from '@libs/platform/data-access';
import { BasicsMaterialRecordDataService } from '../material/basics-material-record-data.service';
import { IMaterialEntity } from '@libs/basics/interfaces';
import { PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { IMaterialPortionEntity } from '../model/entities/material-portion-entity.interface';
import { MaterialComplete } from '../model/complete-class/material-complete.class';
import { BasicsMaterialPortionValidationService } from './basics-material-portion-validation.service';
import { BasicsSharedNewEntityValidationProcessorFactory, BasicsSharedRoundingFactoryService, BasicsSharedRoundingModule as roundingModule } from '@libs/basics/shared';
import { BasicsMaterialPriceConditionDataService } from '../price-condition/basics-material-price-condition-data.service';
import { get } from 'lodash';

/**
 * The Basics Material Portion data service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialPortionDataService extends DataServiceFlatLeaf<IMaterialPortionEntity, IMaterialEntity, MaterialComplete> {
	private readonly http = inject(PlatformHttpService);
	private readonly translate = inject(PlatformTranslateService);
	private readonly basicsRoundingService = BasicsSharedRoundingFactoryService.getService(roundingModule.basicsMaterial);
	private readonly validationProcessor = inject(BasicsSharedNewEntityValidationProcessorFactory);
	//TODO a temporary object, remove it after rounding function ready
	private roundType = {
		DayworkRate: 3,
		EstimatePrice: 3,
		Cost: 3
	};

	public constructor(public parentService: BasicsMaterialRecordDataService, public priceConditionService: BasicsMaterialPriceConditionDataService) {
		const options: IDataServiceOptions<IMaterialPortionEntity> = {
			apiUrl: 'basics/material/portion',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false
			},
			createInfo: {
				endPoint: 'create',
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<IMaterialPortionEntity, IMaterialEntity, MaterialComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'MaterialPortion',
				parent: parentService
			}
		};

		super(options);
		this.processor.addProcessor(this.provideNewEntityValidationProcessor());
		this.calculateMaterialPortionChange();
	}

	private calculateMaterialPortionChange() {
		this.parentService.materialPortionChanged.asObservable().subscribe(e => {
			const estimatePrice = e.entity.Cost + this.getEstimatePrice();
			const dayWorkRate = e.entity.Cost + this.getDayWorkRate();
			switch (e.model) {
				case 'IsEstimatePrice':
					e.entity.EstimatePrice = estimatePrice;
					e.entity.PriceExtraEstPrice = this.getPriceExtraEstPrice();
					break;
				case 'IsDayworkRate':
					e.entity.DayworkRate = dayWorkRate;
					e.entity.PriceExtraDwRate = this.getPriceExtraDWRate();
					break;
				//case 'all': TODO check if "model ==='all'" is needed or make it more readable after materialPortion ready
				case 'PrcPriceConditionFk':
					e.entity.EstimatePrice = estimatePrice;
					e.entity.DayworkRate = dayWorkRate;
					e.entity.PriceExtraDwRate = this.getPriceExtraDWRate();
					e.entity.PriceExtraEstPrice = this.getPriceExtraEstPrice();
					break;
				default:
					e.entity.EstimatePrice = estimatePrice;
					e.entity.DayworkRate = dayWorkRate;
					break;
			}
		});
	}

	protected override provideLoadPayload(): object {
		const parent = this.getSelectedParent();
		if (parent) {
			return {
				mainItemId: parent.Id
			};
		} else {
			throw new Error('There should be a selected parent Material record to load the MaterialPortion data');
		}
	}

	protected override onLoadSucceeded(loaded: object): IMaterialPortionEntity[] {
		return loaded as IMaterialPortionEntity[];
	}

	protected override provideCreatePayload(): object {
		const parent = this.getSelectedParent();
		if (parent) {
			return {
				mainItemId: parent.Id
			};
		}
		throw new Error('please select a material record first');
	}

	protected override onCreateSucceeded(loaded: object): IMaterialPortionEntity {
		const parent = this.getSelectedParent();
		const entity = loaded as IMaterialPortionEntity;
		if (entity && parent) {
			entity.MdcMaterialFk = parent.Id;
			entity.CostPerUnit = entity.CostPerUnit === -1 ? 0 : entity.CostPerUnit;
		}
		return entity;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override delete(entities: IMaterialPortionEntity[] | IMaterialPortionEntity) {
		const selectItems = this.getSelection();
		const ids = selectItems.map(m => m.Id);
		const postParam = {
			MasterMaterialPortionIds: ids
		};
		this.http.post('project/materialPortion/canDeleteMaterialPortion', postParam).then(res => {
			if (res) {
				const errorMsg = 'basics.material.cannotDeleteMaterialPortions';
				const translated = this.translate.instant(errorMsg);
				throw new Error(translated.text);
			} else {
				super.delete(entities);
			}
		});
	}

	public override registerModificationsToParentUpdate(parentUpdate: MaterialComplete, modified: IMaterialPortionEntity[], deleted: IMaterialPortionEntity[]): void {
		if (modified && modified.some(() => true)) {
			parentUpdate.MaterialPortionToSave = modified;
		}
		if (deleted && deleted.some(() => true)) {
			parentUpdate.MaterialPortionToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: MaterialComplete): IMaterialPortionEntity[] {
		return (complete && complete.MaterialPortionToSave) ? complete.MaterialPortionToSave : [];
	}

	public override takeOverUpdated(updated: MaterialComplete): void {
		if (updated && updated.MaterialPortionToSave?.some(() => true)) {
			this.updateEntities(updated.MaterialPortionToSave);
		}
		if (updated && updated.MaterialPortionToDelete && updated.MaterialPortionToDelete.some(() => true)) {
			const isEstimates = updated.MaterialPortionToDelete.filter(item => this.getBoolValue(item, 'IsEstimatePrice') === true);
			const isDayWorkRates = updated.MaterialPortionToDelete.filter(item => this.getBoolValue(item, 'IsDayworkRate') === true);
			if (isEstimates && isEstimates.length > 0) {
				const entity = isEstimates[0];
				this.fieldChanged('IsEstimatePrice', entity);
			} else if (isDayWorkRates && isDayWorkRates.length > 0) {
				const entity = isDayWorkRates[0];
				this.fieldChanged('IsDayworkRate', entity);
			} else {
				const entity = updated.MaterialPortionToDelete[0];
				this.fieldChanged('all', entity);
			}
		}
	}

	public getEstimatePrice(): number {
		return this.calculateRecord('IsEstimatePrice', 'EstimatePrice');
	}

	public getDayWorkRate(): number {
		return this.calculateRecord('IsDayworkRate', 'DayworkRate');
	}

	public getPriceExtraDWRate(): number {
		return this.calculateRecord('IsDayworkRate', '');
	}

	public getPriceExtraEstPrice(): number {
		return this.calculateRecord('IsEstimatePrice', '');
	}

	private calculateRecord(filterField: string, roundField: string): number {
		let result = 0;
		const list = this.getList();
		const roundingItem = roundField.length > 0 ? get(this.roundType, roundField) : 0;
		const isEstimatePriceList = list.filter(item => this.getBoolValue(item, filterField) === true);
		isEstimatePriceList.forEach(item => {
			if (roundField.length > 0) {
				result = result + (this.basicsRoundingService.doRounding(roundingItem, (item.Quantity ?? 0) * item.CostPerUnit) + item.PriceExtra);
			} else {
				result = result + item.PriceExtra;
			}
		});
		return result;
	}

	private getBoolValue(entity: IMaterialPortionEntity, field: string): boolean {
		switch (field) {
			case 'IsEstimatePrice':
				return entity.IsEstimatePrice;
			case 'IsDayworkRate':
				return entity.IsDayworkRate;
			default:
				return false;
		}
	}

	public fieldChanged(field: string, currentItem: IMaterialPortionEntity): void {
		const fieldItems = ['CostPerUnit', 'MdcCostCodeFk', 'Quantity'];
		if (fieldItems.includes(field)) {
			field = '';
			if (currentItem.IsEstimatePrice && !currentItem.IsDayworkRate) {
				field = 'IsEstimatePrice';
			} else if (!currentItem.IsEstimatePrice && currentItem.IsDayworkRate) {
				field = 'IsDayworkRate';
			}
		}
		this.priceConditionService.handleRecalculateDone({
			IsSuccess: true,
			PriceConditions: this.priceConditionService.getList(),
			VatPercent: 0,
			Field: field
		});
	}

	public override isParentFn(parentKey: IMaterialEntity, entity: IMaterialPortionEntity): boolean {
		return entity.MdcMaterialFk === parentKey.Id;
	}

	private provideNewEntityValidationProcessor() {
		return this.validationProcessor.createProcessor(BasicsMaterialPortionValidationService, {
			moduleSubModule: 'Basics.Material',
			typeName: 'MaterialPortionDto',
		});
	}
}

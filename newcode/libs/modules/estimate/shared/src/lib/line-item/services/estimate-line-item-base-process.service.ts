/*
 * Copyright(c) RIB Software GmbH
 */

import { inject } from '@angular/core';
import { IEntityRuntimeDataRegistry } from '@libs/platform/data-access';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { EntityReadonlyProcessorBase, ReadonlyFunctions } from '@libs/basics/shared';
import { EstimateMainContextService } from '../../common/services/estimate-main-context.service';
import { PlatformTranslateService, PropertyPath } from '@libs/platform/common';

/**
 *
 */
export class EstimateLineItemBaseProcessService<T extends IEstLineItemEntity> extends EntityReadonlyProcessorBase<T> {

	protected readonly translateService = inject(PlatformTranslateService);
	protected readonly estimateMainContextService = inject(EstimateMainContextService);

	/**
	 *
	 * @param dataService
	 */
	public constructor(protected dataService: IEntityRuntimeDataRegistry<T>) {
		super(dataService);
	}

	public override process(toProcess: T){
		if(this.estimateMainContextService.isLineItemStatusReadonly(toProcess) || !!toProcess.EstRuleSourceFk){
			this.dataService.setEntityReadOnly(toProcess, true);
			//TODO: need to Rule And Param editable
			//this.setRuleReadonly(toProcess, false);
			toProcess.IsReadonlyStatus = !!toProcess.EstRuleSourceFk;
		}else{
			super.process(toProcess);
			this.generateCode(toProcess);
			this.setWQuantityByBasUomFk(toProcess);
		}
	}

	public setPropertiesReadonly(toProcess: T, propertyNames: PropertyPath<T>[], readonly: boolean){
		this.dataService.setEntityReadOnlyFields(toProcess,propertyNames.map(e => {
			return {
				field: e,
				readOnly: readonly
			};
		}));
	}

	/**
	 * set Rule and Param property readonly
	 * @param toProcess
	 * @param readonly
	 */
	public setRuleReadonly(toProcess: T, readonly: boolean){
		this.setPropertiesReadonly(toProcess, ['Rule', 'Param'], readonly);
	}

	private setWQ(toProcess: T, readonly: boolean){
		this.setPropertiesReadonly(toProcess, ['WqQuantityTarget', 'WqQuantityTargetDetail'], readonly);
	}

	private setWQReadonly(toProcess: T){
		this.setWQ(toProcess, this.estimateMainContextService.IsWQReadOnly);
	}

	private setWQuantityByBasUomFk(toProcess: T){
		//TODO: need to consider BasUomFk and may not have async request here
		// $injector.get('estimateMainCommonService').isLumpsumUom(item.BasUomFk)
		// 	.then(function (isLumpsumUom) {
		// 		if (isLumpsumUom) {
		// 			setWQ(item, true);
		// 		} else {
		// 			setWQReadonly(item);
		// 		}
		// 	});
	}

	/**
	 * set default code to LineItem which version is zero
	 * @param toProcess
	 * @private
	 */
	private generateCode(toProcess: T){
		if(toProcess.Version === 0){
			this.dataService.setEntityReadOnlyFields(toProcess, [{
				field: 'Code',
				readOnly: true
			}]);

			toProcess.Code = this.translateService.instant('cloud.common.isGenerated').text;
			toProcess.IsGenerated = true;
		}
	}

	/**
	 * Is whole entity readonly?
	 * @param item
	 * @protected
	 */
	public override readonlyEntity(item: T):boolean{
		return false;
	}

	/**
	 * Generate Readonly Functions
	 */
	public generateReadonlyFunctions(): ReadonlyFunctions<T> {
		return {
			Revenue: {
				shared: ['RevenueUnit'],
				readonly: () => true
			},
			AssemblyType: e => !!e.item.EstAssemblyFk || !!e.item.EstLineItemFk,
			IsFixedBudget:{
				shared:['IsFixedBudgetUnit'],
				readonly: () => !this.estimateMainContextService.IsBudgetEditable,
			},
			EstAssemblyFk:{
				shared:[],
				readonly: e => !!e.item.EstLineItemFk
			},
			Budget:e => !(e.item.IsFixedBudget && this.estimateMainContextService.IsBudgetEditable),
			BudgetUnit: e => !(e.item.IsFixedBudgetUnit && this.estimateMainContextService.IsBudgetEditable),
			QuantityTotal: () => this.estimateMainContextService.enableInputLineItemTotalQuantity(),
			BoqSplitQuantityFk: (e) => !this.estimateMainContextService.doCalculateSplitQuantity(e.item.BoqHeaderFk, e.item.BoqItemFk),
			QuantityTarget:{
				shared:['QuantityTargetDetail','WqQuantityTarget','WqQuantityTargetDetail'],
				readonly: e => !!e.item.HasSplitQuantities
			},
			AdvancedAllUnit:{
				shared:['AdvancedAll', 'AdvancedAllUnitItem'],
				readonly: e => (e.item.IsNoMarkup || e.item.IsOptional || e.item.IsGc)
			},
			ManualMarkupUnit:{
				shared:['ManualMarkupUnitItem', 'ManualMarkup'],
				readonly: e => (e.item.IsNoMarkup || e.item.IsFixedPrice || e.item.IsGc)
			},
			IsOptional:{
				shared:['IsFixedPrice'],
				readonly: e => e.item.IsGc,
			},
			IsOptionalIT: e => !e.item.IsOptional,
			GrandCostUnitTarget: e => !e.item.IsFixedPrice,
			AdvancedAll:{
				shared:['AdvancedAllUnitItem', 'AdvancedAllUnit'],
				readonly: (e) => !this.estimateMainContextService.AllowanceEntity && e.item.AdvancedAllowance !== 0
			}
		};
	}

	public setAdvanceAllowanceReadonly(toProcess: T, readonly: boolean) {
		this.setPropertiesReadonly(toProcess, ['AdvancedAllUnit', 'AdvancedAllUnitItem', 'AdvancedAll'], readonly);
	}

	public setManualMarReadonly(toProcess: T, readonly: boolean) {
		this.setPropertiesReadonly(toProcess, ['ManualMarkupUnit', 'ManualMarkupUnitItem', 'ManualMarkup'], readonly);
	}

	public setReadonlyWithIsOptionalChange(toProcess: T, readonly: boolean){
		this.setPropertiesReadonly(toProcess, ['IsOptionalIT'], !readonly);
		this.setAdvanceAllowanceReadonly(toProcess, readonly);
	}

	public setReadonlyWithIsNoMarkupChange(toProcess: T, readonly: boolean){
		if (readonly) {
			this.setAdvanceAllowanceReadonly(toProcess, readonly);
			this.setManualMarReadonly(toProcess, readonly);
		} else if (!toProcess.IsGc) {
			this.setManualMarReadonly(toProcess, toProcess.IsFixedPrice);
			this.setAdvanceAllowanceReadonly(toProcess, toProcess.IsOptional);
		}
	}

	public setReadonlyWithIsFixedPriceChange(toProcess: T, readonly: boolean){
		if (readonly) {
			this.setPropertiesReadonly(toProcess, ['GrandCostUnitTarget', 'ManualMarkupUnit', 'ManualMarkupUnitItem', 'ManualMarkup'], readonly);
		} else if (!toProcess.IsGc && !toProcess.IsNoMarkup) {
			this.setManualMarReadonly(toProcess, readonly);
		}
	}

	public setReadonlyWithIsGcChange(toProcess: T, readonly: boolean){
		if (readonly) {
			this.setAdvanceAllowanceReadonly(toProcess, readonly);
			this.setManualMarReadonly(toProcess, readonly);
		} else if (!toProcess.IsNoMarkup) {
			this.setManualMarReadonly(toProcess, toProcess.IsFixedPrice);
			this.setAdvanceAllowanceReadonly(toProcess, toProcess.IsOptional);
		}
	}

	//TODO: dynamic column(column estimate, characteristic...)
}

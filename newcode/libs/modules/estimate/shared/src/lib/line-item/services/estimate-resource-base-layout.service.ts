/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { LazyInjectable, prefixAllTranslationKeys } from '@libs/platform/common';
import { IEstResourceEntity } from '@libs/estimate/interfaces';
import { ESTIMATE_MAIN_RESOURCE_LAYOUT_TOKEN, IResourceBaseLayoutService } from '../model/interfaces/estimate-resource-base-layout.service.interface';
import {
	BasicsSharedCustomizeLookupOverloadProvider,
	BasicsSharedProcurementStructureLookupService
} from '@libs/basics/shared';
/**
 * resource layout service
 */
@LazyInjectable({
	token: ESTIMATE_MAIN_RESOURCE_LAYOUT_TOKEN,
	useAngularInjection: true
})
@Injectable({
	providedIn: 'root'
})
export class EstimateResourceBaseLayoutService<T extends IEstResourceEntity> implements IResourceBaseLayoutService<T> {

	/**
	 * Generate layout configuration
	 */
	public async generateLayout(): Promise<ILayoutConfiguration<T>> {
		return this.commonLayout() as ILayoutConfiguration<T>;
	}

	/**
	 * Common layout configuration for resource base entities
	 * @protected
	 */
	protected commonLayout(): ILayoutConfiguration<IEstResourceEntity> {
		return {
			'groups': [
				{
					'gid': 'basicData',
					'title': {
						'key': 'cloud.common.entityProperties',
						'text': 'Basic Data'
					},
					'attributes': [
						'EstResourceTypeShortKey',
						'Code',
						'DescriptionInfo',
						'BasUomFk',
						'BasCurrencyFk',
						'Sorting',
						'EstResourceFlagFk',
						'EstCostTypeFk',
						'Budget',
						'BudgetUnit',
						'LgmJobFk',
						'BudgetDifference',
						'DescriptionInfo1',
						'EscResourceCostUnit',
						'EscResourceCostTotal',
						//'RequisitionFk',
						//'WorkOperationTypeFk',
						//'PlantAssemblyTypeFk',
						'ItemInfo'
					]
				},
				{
					'gid': 'ruleInfo',
					'title': {
						'key': 'estimate.main.ruleInfo',
						'text': 'Rule Informationen'
					},
					'attributes': [
						'RuleType',
						'EvalSequenceFk',
						'ElementCode',
						'ElementDescription',
						'RuleCode',
						'RuleDescription'
					]
				},
				{
					'gid': 'quantiyAndFactors',
					'title': {
						'key': 'estimate.main.quantityAndFactors',
						'text': 'Quantity/Factors'
					},
					'attributes': [
						'QuantityDetail',
						'Quantity',
						'QuantityFactorDetail1',
						'QuantityFactor1',
						'QuantityFactorDetail2',
						'QuantityFactor2',
						'QuantityFactor3',
						'QuantityFactor4',
						'ProductivityFactorDetail',
						'ProductivityFactor',
						'EfficiencyFactorDetail1',
						'EfficiencyFactor1',
						'EfficiencyFactorDetail2',
						'EfficiencyFactor2',
						'QuantityFactorCc',
						'QuantityReal',
						'QuantityInternal',
						'QuantityUnitTarget',
						'QuantityTotal',
						'QuantityOriginal',
						'Co2Source',
						'Co2SourceTotal',
						'Co2Project',
						'Co2ProjectTotal'
					]
				},
				{
					'gid': 'costFactors',
					'title': {
						'key': 'estimate.main.costFactors',
						'text': 'Cost Factors'
					},
					'attributes': [
						'CostFactorDetail1',
						'CostFactor1',
						'CostFactorDetail2',
						'CostFactor2',
						'CostFactorCc'
					]
				},
				{
					'gid': 'costAndHours',
					'title': {
						'key': 'estimate.main.costAndHours',
						'text': 'Cost/Hours'
					},
					'attributes': [
						'CostUnit',
						'CostUnitSubItem',
						'CostUnitLineItem',
						'CostUnitTarget',
						'CostTotal',
						'HoursUnit',
						'HoursUnitSubItem',
						'HoursUnitLineItem',
						'HoursUnitTarget',
						'HoursTotal',
						'HourFactor',
						'CostUnitOriginal',
						'CostTotalCurrency',
						'RiskCostUnit',
						'RiskCostTotal',
						'CostTotalOc',
						'BaseCostUnit',
						'BaseCostTotal',
						'DayWorkRateUnit',
						'DayWorkRateTotal',
						'CostUom'
					]
				},
				{
					'gid': 'flags',
					'title': {
						'key': 'estimate.main.flags',
						'text': 'Flags'
					},
					'attributes': [
						'IsLumpsum',
						'IsDisabled',
						'IsIndirectCost',
						'IsDisabledPrc',
						'IsGeneratedPrc',
						'IsFixedBudget',
						'IsCost',
						'IsBudget',
						'IsEstimateCostCode',
						'IsRuleMarkupCostCode',
						'IsFixedBudgetUnit',
						'IsManual'
					]
				},
				{
					'gid': 'package',
					'title': {
						'key': 'cloud.common.entityPackage',
						'text': 'Package'
					},
					'attributes': [
						'PackageAssignments',
						'PrcStructureFk'
					]
				},
				{
					'gid': 'comment',
					'title': {
						'key': 'estimate.main.comment',
						'text': 'Comment'
					},
					'attributes': [
						'CommentText',
						'BusinessPartner'
					]
				},
				{
					'gid': 'Allowance',
					'title': {
						'key': 'estimate.main.allowance',
						'text': 'Allowance'
					},
					'attributes': [
						'Gc',
						'Ga',
						'Am',
						'Rp'
					]
				}
			],
			'labels': {
				...prefixAllTranslationKeys('cloud.common.', {
					'PackageAssignments': {
						'key': 'entityPackage',
						'text': 'Package'
					},
					'Code': {
						'key': 'entityCode',
						'text': 'Code'
					},
					'DescriptionInfo': {
						'key': 'entityDescription',
						'text': 'Description'
					},
					'Quantity': {
						'key': 'entityQuantity',
						'text': 'Quantity'
					},
					'BasUomFk': {
						'key': 'entityUoM',
						'text': 'UoM'
					},
					'BasCurrencyFk': {
						'key': 'entityCurrency',
						'text': 'Currency'
					},
					'Sorting': {
						'key': 'entitySorting',
						'text': 'Sorting'
					}
				}),
				...prefixAllTranslationKeys('estimate.main.', {
					'RuleType': {
						'key': 'type',
						'text': 'Type'
					},
					'ElementCode': {
						'key': 'elemCode',
						'text': 'Element Code'
					},
					'ElementDescription': {
						'key': 'elemDesc',
						'text': 'Element Description'
					},
					'RuleCode': {
						'key': 'ruleCode',
						'text': 'Rule Code'
					},
					'RuleDescription': {
						'key': 'ruleDesc',
						'text': 'Rule Description'
					},
					'PrcStructureFk': {
						'key': 'prcStructureFk',
						'text': 'Procurement Structure'
					},
					'EstResourceTypeShortKey': {
						'key': 'estResourceTypeFk',
						'text': 'Short Key'
					},
					'Gc': {
						'key': 'gc',
						'text': 'GC'
					},
					'Ga': {
						'key': 'ga',
						'text': 'G&A'
					},
					'Am': {
						'key': 'am',
						'text': 'AM'
					},
					'Rp': {
						'key': 'rp',
						'text': 'R&P'
					},
					'QuantityDetail': {
						'key': 'quantityDetail',
						'text': 'Quantity Details'
					},
					'QuantityFactorDetail1': {
						'key': 'quantityFactorDetail1',
						'text': 'QuantityFactorDetail1'
					},
					'QuantityFactor1': {
						'key': 'quantityFactor1',
						'text': 'Quantity Factor 1'
					},
					'QuantityFactorDetail2': {
						'key': 'quantityFactorDetail2',
						'text': 'QuantityFactorDetail2'
					},
					'QuantityFactor2': {
						'key': 'quantityFactor2',
						'text': 'Quantity Factor 2'
					},
					'QuantityFactor3': {
						'key': 'quantityFactor3',
						'text': 'QuantityFactor3'
					},
					'QuantityFactor4': {
						'key': 'quantityFactor4',
						'text': 'Quantity Factor 4'
					},
					'ProductivityFactorDetail': {
						'key': 'productivityFactorDetail',
						'text': 'ProductivityFactorDetail'
					},
					'ProductivityFactor': {
						'key': 'productivityFactor',
						'text': 'ProductivityFactor'
					},
					'EfficiencyFactorDetail1': {
						'key': 'efficiencyFactorDetail1',
						'text': 'Efficiency-Factor Details 1'
					},
					'EfficiencyFactor1': {
						'key': 'efficiencyFactor1',
						'text': 'Efficiency-Factor 1'
					},
					'EfficiencyFactorDetail2': {
						'key': 'efficiencyFactorDetail2',
						'text': 'Efficiency-Factor Details 2'
					},
					'EfficiencyFactor2': {
						'key': 'efficiencyFactor2',
						'text': 'Efficiency-Factor 2'
					},
					'QuantityFactorCc': {
						'key': 'quantityFactorCc',
						'text': 'QuantityFactorCc'
					},
					'QuantityReal': {
						'key': 'quantityReal',
						'text': 'Quantity Real'
					},
					'QuantityInternal': {
						'key': 'quantityInternal',
						'text': 'Quantity Internal'
					},
					'QuantityUnitTarget': {
						'key': 'quantityUnitTarget',
						'text': 'QuantityUnitTarget'
					},
					'QuantityTotal': {
						'key': 'quantityTotal',
						'text': 'Quantity Total'
					},
					'CostUnit': {
						'key': 'costUnit',
						'text': 'Cost/Unit'
					},
					'CostFactorDetail1': {
						'key': 'costFactorDetail1',
						'text': 'Cost Factor Details 1'
					},
					'CostFactor1': {
						'key': 'costFactor1',
						'text': 'Cost Factor 1'
					},
					'CostFactorDetail2': {
						'key': 'costFactorDetail2',
						'text': 'Cost Factor Details 2'
					},
					'CostFactor2': {
						'key': 'costFactor2',
						'text': 'Cost Factor 2'
					},
					'CostFactorCc': {
						'key': 'costFactorCc',
						'text': 'Cost-Factor CC'
					},
					'CostUnitSubItem': {
						'key': 'costUnitSubItem',
						'text': 'Cost/Unit Sub-Item'
					},
					'CostUnitLineItem': {
						'key': 'costUnitLineItem',
						'text': 'Cost/Unit Line Item'
					},
					'CostUnitTarget': {
						'key': 'costUnitTarget',
						'text': 'Cost/Unit Item'
					},
					'CostTotal': {
						'key': 'costTotal',
						'text': 'Cost Total'
					},
					'HoursUnit': {
						'key': 'hoursUnit',
						'text': 'Hours/Unit'
					},
					'HoursUnitSubItem': {
						'key': 'hoursUnitSubItem',
						'text': 'Hours/Unit Sub-Item'
					},
					'HoursUnitLineItem': {
						'key': 'hoursUnitLineItem',
						'text': 'Hours/Unit Line Item'
					},
					'HoursUnitTarget': {
						'key': 'hoursUnitTarget',
						'text': 'Hours/Unit Item'
					},
					'HoursTotal': {
						'key': 'hoursTotal',
						'text': 'Hours Total'
					},
					'IsLumpsum': {
						'key': 'isLumpSum',
						'text': 'Lump Sum'
					},
					'IsDisabled': {
						'key': 'isDisabled',
						'text': 'Disabled'
					},
					'CommentText': {
						'key': 'comment',
						'text': 'Comment'
					},
					'IsIndirectCost': {
						'key': 'isIndirectCost',
						'text': 'Indirect Cost'
					},
					'EstResourceFlagFk': {
						'key': 'resourceFlag',
						'text': 'Resource Flag'
					},
					'Budget': {
						'key': 'budget',
						'text': 'Budget'
					},
					'IsDisabledPrc': {
						'key': 'isDisabledPrc',
						'text': 'Disabled Prc'
					},
					'IsGeneratedPrc': {
						'key': 'isGeneratedPrc',
						'text': 'Generated Prc'
					},
					'BudgetUnit': {
						'key': 'budgetUnit',
						'text': 'Budget/Unit'
					},
					'IsFixedBudget': {
						'key': 'isFixedBudget',
						'text': 'Fix Budget'
					},
					'HourFactor': {
						'key': 'hourFactor',
						'text': 'Hour Factor'
					},
					'BudgetDifference': {
						'key': 'budgetDiff',
						'text': 'Budget Difference'
					},
					'QuantityOriginal': {
						'key': 'quantityOriginal',
						'text': 'Quantity Original'
					},
					'CostUnitOriginal': {
						'key': 'costUnitOriginal',
						'text': 'Cost/Unit Original'
					},
					'DescriptionInfo1': {
						'key': 'descriptionInfo1',
						'text': 'Additional Description'
					},
					'CostTotalCurrency': {
						'key': 'costTotalCurrency',
						'text': 'Cost Total(Currency)'
					},
					'IsCost': {
						'key': 'isCost',
						'text': 'Is Cost'
					},
					'IsBudget': {
						'key': 'isBudget',
						'text': 'Is Budget'
					},
					'IsEstimateCostCode': {
						'key': 'isEstimateCostcode',
						'text': 'Is Estimate Costcode'
					},
					'IsRuleMarkupCostCode': {
						'key': 'isRuleMarkupCostcode',
						'text': 'Is Rule Markup Costcode'
					},
					'RiskCostUnit': {
						'key': 'costRiskUnit',
						'text': 'Risk Cost/Unit'
					},
					'RiskCostTotal': {
						'key': 'costRiskTotal',
						'text': 'Risk Cost Total'
					},
					'CostTotalOc': {
						'key': 'costTotalOc',
						'text': 'Cost Total Oc'
					},
					'BaseCostUnit': {
						'key': 'baseCostUnit',
						'text': 'Base Cost/Unit'
					},
					'BaseCostTotal': {
						'key': 'baseCostTotal',
						'text': 'Base Cost Total'
					},
					'DayWorkRateUnit': {
						'key': 'dayWorkRateUnit',
						'text': 'DW/T+M Rate'
					},
					'DayWorkRateTotal': {
						'key': 'dayWorkRateTotal',
						'text': 'DW/T+M Rate Total'
					},
					'EscResourceCostUnit': {
						'key': 'escResourceCostUnit',
						'text': 'Escalation Cost/Unit'
					},
					'EscResourceCostTotal': {
						'key': 'escResourceCostTotal',
						'text': 'Escalation Cost Total'
					},
					'RequisitionFk': {
						'key': 'requisitionFk',
						'text': 'Requisition'
					},
					'IsFixedBudgetUnit': {
						'key': 'isFixedBudgetUnit',
						'text': 'Fix Budget/Unit'
					},
					'CostUom': {
						'key': 'effectiveCostUnit',
						'text': 'Effective Cost/Unit'
					},
					'IsManual': {
						'key': 'isManual',
						'text': 'Is Manual'
					},
					'BusinessPartner': {
						'key': 'createMaterialPackageWizard.businessPartner',
						'text': 'Business Partner'
					}
				}),
				...prefixAllTranslationKeys('estimate.rule.', {
					'EvalSequenceFk': {
						'key': 'evaluationSequence',
						'text': 'Evaluation Sequence'
					}
				}),
				...prefixAllTranslationKeys('basics.costcodes.', {
					'EstCostTypeFk': {
						'key': 'costType',
						'text': 'Cost Type'
					}
				}),
				...prefixAllTranslationKeys('estimate.project.', {
					'LgmJobFk': {
						'key': 'lgmJobFk',
						'text': 'Job'
					}
				}),
				...prefixAllTranslationKeys('basics.common.', {
					'Co2Source': {
						'key': 'sustainabilty.entityCo2Source',
						'text': 'CO2/kg (Source)'
					},
					'Co2SourceTotal': {
						'key': 'sustainabilty.entityCo2SourceTotal',
						'text': 'CO2 (Source) Total'
					},
					'Co2Project': {
						'key': 'sustainabilty.entityCo2Project',
						'text': 'CO2/kg (Project)'
					},
					'Co2ProjectTotal': {
						'key': 'sustainabilty.entityCo2ProjectTotal',
						'text': 'CO2 (Project) Total'
					}
				}),
				...prefixAllTranslationKeys('basics.customize.', {
					'WorkOperationTypeFk': {
						'key': 'entityWorkOperationTypeFk',
						'text': 'Work Operation Type'
					},
					'PlantAssemblyTypeFk': {
						'key': 'plantassemblytype',
						'text': 'Plant Assembly Type'
					}
				}),
				...prefixAllTranslationKeys('boq.main.', {
					'ItemInfo': {
						'key': 'ItemInfo',
						'text': 'Item Info'
					}
				})
			},
			'overloads': {
				'PackageAssignments': {
					'readonly': true
				},
				'RuleType': {
					'readonly': true
				},
				'EvalSequenceFk': {
					'readonly': true
				},
				'ElementCode': {
					'readonly': true
				},
				'ElementDescription': {
					'readonly': true
				},
				'RuleCode': {
					'readonly': true
				},
				'RuleDescription': {
					'readonly': true
				},
				'Gc': {
					'readonly': true
				},
				'Ga': {
					'readonly': true
				},
				'Am': {
					'readonly': true
				},
				'Rp': {
					'readonly': true
				},
				'QuantityFactorCc': {
					'readonly': true
				},
				'QuantityReal': {
					'readonly': true
				},
				'QuantityInternal': {
					'readonly': true
				},
				'QuantityUnitTarget': {
					'readonly': true
				},
				'QuantityTotal': {
					'readonly': true
				},
				'CostFactorCc': {
					'readonly': true
				},
				'CostUnitSubItem': {
					'readonly': true
				},
				'CostUnitTarget': {
					'readonly': true
				},
				'CostTotal': {
					'readonly': true
				},
				'HoursUnit': {
					'readonly': true
				},
				'HoursUnitSubItem': {
					'readonly': true
				},
				'HoursUnitLineItem': {
					'readonly': true
				},
				'HoursUnitTarget': {
					'readonly': true
				},
				'HoursTotal': {
					'readonly': true
				},
				'IsGeneratedPrc': {
					'readonly': true
				},
				'HourFactor': {
					'readonly': true
				},
				'BudgetDifference': {
					'readonly': true
				},
				'QuantityOriginal': {
					'readonly': true
				},
				'CostUnitOriginal': {
					'readonly': true
				},
				'CostTotalCurrency': {
					'readonly': true
				},
				'RiskCostUnit': {
					'readonly': true
				},
				'RiskCostTotal': {
					'readonly': true
				},
				'CostTotalOc': {
					'readonly': true
				},
				'BaseCostUnit': {
					'readonly': true
				},
				'BaseCostTotal': {
					'readonly': true
				},
				'DayWorkRateTotal': {
					'readonly': true
				},
				'EscResourceCostUnit': {
					'readonly': true
				},
				'EscResourceCostTotal': {
					'readonly': true
				},
				'Co2Source': {
					'readonly': true
				},
				'Co2SourceTotal': {
					'readonly': true
				},
				'Co2ProjectTotal': {
					'readonly': true
				},
				'IsManual': {
					'readonly': true
				},
				'PlantAssemblyTypeFk': {
					'readonly': true
				},
				'BusinessPartner': {
					'readonly': true
				},
				'ItemInfo': {
					'readonly': true
				},
				EstCostTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideCostTypeLookupOverload(true),
				EstResourceFlagFk: BasicsSharedCustomizeLookupOverloadProvider.provideResourceFlagLookupOverload(true),
				PrcStructureFk: {
					type: FieldType.Lookup,
					readonly: true,
					lookupOptions: createLookup({
						showDescription: true,
						descriptionMember: 'DescriptionInfo.Translated',
						dataServiceToken: BasicsSharedProcurementStructureLookupService,
						showClearButton: true,
					})
				}
			}
		};
	}
}
/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { ESTIMATE_MAIN_LINE_ITEM_LAYOUT_TOKEN, ILineItemBaseLayoutService } from '../model/interfaces/estimate-line-item-base-layout.service.interface';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { LazyInjectable, PlatformConfigurationService, PlatformLazyInjectorService, prefixAllTranslationKeys } from '@libs/platform/common';
import {
	BasicsShareControllingUnitLookupService,
	BasicsSharedCurrencyLookupService,
	BasicsSharedCustomizeLookupOverloadProvider,
	BasicsSharedProcurementStructureLookupService,
	BasicsSharedUomLookupService,
	BasicsSharedCostRiskLookupService,
	BasicsSharedProjectChangeStatusLookupService,
	BasicsSharedAssetMasterLookupService,
	BasicUserFormLookupService, BasicsSharedMdcWorkCategoryLookupService
} from '@libs/basics/shared';
import { EstimateMainContextService } from '../../common/services/estimate-main-context.service';
import { keyBy, merge, values } from 'lodash';
import { EstimateMainAssemblyTemplateLookupService } from '../../lookups/assembly-template/estimate-main-assembly-template-lookup.service';
import { ProjectSharedLookupOverloadProvider } from '@libs/project/shared';
import { EstimateSortCode01LookupDataService } from '../../lookups/sortcodes/estimate-sortcode01-lookup-data.service';
import { EstimateSortCode02LookupDataService } from '../../lookups/sortcodes/estimate-sortcode02-lookup-data.service';
import { EstimateSortCode03LookupDataService } from '../../lookups/sortcodes/estimate-sortcode03-lookup-data.service';
import { EstimateSortCode04LookupDataService } from '../../lookups/sortcodes/estimate-sortcode04-lookup-data.service';
import { EstimateSortCode05LookupDataService } from '../../lookups/sortcodes/estimate-sortcode05-lookup-data.service';
import { EstimateSortCode06LookupDataService } from '../../lookups/sortcodes/estimate-sortcode06-lookup-data.service';
import { EstimateSortCode07LookupDataService } from '../../lookups/sortcodes/estimate-sortcode07-lookup-data.service';
import { EstimateSortCode08LookupDataService } from '../../lookups/sortcodes/estimate-sortcode08-lookup-data.service';
import { EstimateSortCode09LookupDataService } from '../../lookups/sortcodes/estimate-sortcode09-lookup-data.service';
import { EstimateSortCode10LookupDataService } from '../../lookups/sortcodes/estimate-sortcode10-lookup-data.service';

import { ACTIVITY_LOOKUP_PROVIDER_TOKEN } from '@libs/scheduling/interfaces';

import { ESTIMATE_LINE_ITEM_LOOKUP_PROVIDER_TOKEN,ESTIMATE_BOQ_ITEM_LOOKUP_PROVIDER_TOKEN } from '@libs/basics/interfaces';
/**
 * line item layout service
 */
@LazyInjectable({
	token: ESTIMATE_MAIN_LINE_ITEM_LAYOUT_TOKEN,
	useAngularInjection: true
})
@Injectable({
	providedIn: 'root',
})
export class EstimateLineItemBaseLayoutService<T extends IEstLineItemEntity> implements ILineItemBaseLayoutService<T> {
	private contextService = inject(PlatformConfigurationService);
	private estimateMainContextService = inject(EstimateMainContextService);
    private readonly lazyInjector=inject(PlatformLazyInjectorService);

	/**
	 * Common layout configuration for resource base entities
	 * @protected
	 */
       protected async commonLayout(): Promise<ILayoutConfiguration<IEstLineItemEntity>> {
		const estimateLineItemLookupProvider = await this.lazyInjector.inject(ESTIMATE_LINE_ITEM_LOOKUP_PROVIDER_TOKEN);
		const activityLookupProvider = await this.lazyInjector.inject(ACTIVITY_LOOKUP_PROVIDER_TOKEN);
		const estBoqLookupProvider = await this.lazyInjector.inject(ESTIMATE_BOQ_ITEM_LOOKUP_PROVIDER_TOKEN);
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: [
						'ProjectNo',
						'ProjectName',
						'EstimationCode',
						'EstimationDescription',
						'OrderChangeFk',
						'EstAssemblyFk',
						'Code',
						'DescriptionInfo',
						'BasUomTargetFk',
						'BasUomFk',
						'PrjChangeFk',
						'Budget',
						'BudgetUnit',
						'BudgetDifference',
						'Revenue',
						'EstLineItemStatusFk',
						'RevenueUnit',
						'Margin1',
						'Margin2',
						'AssemblyType',
						'EstAssemblyDescriptionInfo',
						'ExternalCode',
						'Info',
						'ItemInfo',
						'PrjChangeStatusFk',
					],
				},
				{
					gid: 'references',
					title: {
						key: 'estimate.main.references',
						text: 'References',
					},
					attributes: ['EstLineItemFk', 'EstCostRiskFk'],
				},
				{
					gid: 'ruleAndParam',
					title: {
						key: 'estimate.main.ruleAndParam',
						text: 'Rule/Parameter',
					},
					attributes: ['Rule', 'Param'],
				},
				{
					gid: 'itemQuantity',
					title: {
						key: 'estimate.main.itemQuantity',
						text: 'Item Quantity',
					},
					attributes: ['QuantityTarget', 'QuantityTargetDetail', 'WqQuantityTarget', 'WqQuantityTargetDetail'],
				},
				{
					gid: 'quantityRelation',
					title: {
						key: 'estimate.main.quantityRelation',
						text: 'Quantity Relation',
					},
					attributes: ['EstQtyRelBoqFk', 'EstQtyRelActFk', 'EstQtyRelGtuFk', 'EstQtyTelAotFk'],
				},
				{
					gid: 'quantiyAndFactors',
					title: {
						key: 'estimate.main.quantityAndFactors',
						text: 'Quantiy/Factors',
					},
					attributes: [
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
						'QuantityUnitTarget',
						'QuantityTotal',
						'Co2SourceTotal',
						'Co2ProjectTotal',
						'Co2TotalVariance',
					],
				},
				{
					gid: 'costFactors',
					title: {
						key: 'estimate.main.costFactors',
						text: 'Cost Factors',
					},
					attributes: ['CostFactorDetail1', 'CostFactor1', 'CostFactorDetail2', 'CostFactor2'],
				},
				{
					gid: 'costAndHours',
					title: {
						key: 'estimate.main.costAndHours',
						text: 'Cost/Hours',
					},
					attributes: ['CostUnit', 'CostUnitTarget', 'CostTotal', 'HoursUnit', 'HoursUnitTarget', 'HoursTotal', 'BaseCostUnit', 'BaseCostTotal'],
				},
				{
					gid: 'directIndCost',
					title: {
						key: 'estimate.main.directIndCost',
						text: 'Direct/Indirect Cost',
					},
					attributes: [
						'EntCostUnit',
						'DruCostUnit',
						'DirCostUnit',
						'IndCostUnit',
						'EntCostUnitTarget',
						'DruCostUnitTarget',
						'DirCostUnitTarget',
						'IndCostUnitTarget',
						'EntCostTotal',
						'DruCostTotal',
						'DirCostTotal',
						'IndCostTotal',
						'EntHoursUnit',
						'DruHoursUnit',
						'DirHoursUnit',
						'IndHoursUnit',
						'EntHoursUnitTarget',
						'DruHoursUnitTarget',
						'DirHoursUnitTarget',
						'IndHoursUnitTarget',
						'EntHoursTotal',
						'DruHoursTotal',
						'DirHoursTotal',
						'IndHoursTotal',
						'MarkupCostUnit',
						'MarkupCostUnitTarget',
						'MarkupCostTotal',
						'GrandTotal',
						'RiskCostUnit',
						'RiskCostTotal',
						'EscalationCostUnit',
						'EscalationCostTotal',
						'GrandCostUnit',
						'GrandCostUnitTarget',
						'DayWorkRateTotal',
						'DayWorkRateUnit',
					],
				},
				{
					gid: 'flags',
					title: {
						key: 'estimate.main.flags',
						text: 'Flags',
					},
					attributes: ['IsLumpsum', 'IsDisabled', 'IsGc', 'IsNoMarkup', 'IsFixedBudget', 'IsOptional', 'IsNoEscalation', 'IsIncluded', 'NoLeadQuantity', 'IsFixedPrice', 'IsOptionalIT', 'IsFixedBudgetUnit'],
				},
				{
					gid: 'assignments',
					title: {
						key: 'estimate.main.assignments',
						text: 'Assignments',
					},
					attributes: [
						'MdcControllingUnitFk',
						'BoqItemFk',
						'PsdActivityFk',
						'MdcWorkCategoryFk',
						'MdcAssetMasterFk',
						'PrjLocationFk',
						'LgmJobFk',
						'WicBoqItemFk',
						'WicBoqItemFk',
						'BoqWicCatFk',
						'BoqSplitQuantityFk',
						'BoqHeaderFk',
						'PsdActivityFk',
					],
				},
				{
					gid: 'sortCodes',
					title: {
						key: 'estimate.main.sortCodes',
						text: 'Sort Codes',
					},
					attributes: [
						'SortDesc01Fk',
						'SortDesc02Fk',
						'SortDesc03Fk',
						'SortDesc04Fk',
						'SortDesc05Fk',
						'SortDesc06Fk',
						'SortDesc07Fk',
						'SortDesc08Fk',
						'SortDesc09Fk',
						'SortDesc10Fk',
						'SortCode01Fk',
						'SortCode02Fk',
						'SortCode03Fk',
						'SortCode04Fk',
						'SortCode05Fk',
						'SortCode06Fk',
						'SortCode07Fk',
						'SortCode08Fk',
						'SortCode09Fk',
						'SortCode10Fk',
					],
				},
				{
					gid: 'packageAndCos',
					title: {
						key: 'estimate.main.packageAndCos',
						text: 'Package/COS',
					},
					attributes: ['PackageAssignments', 'CosInstanceCode', 'CosInstanceDescription', 'CosMasterHeaderCode', 'CosMasterHeaderDescription', 'PrcStructureFk'],
				},
				{
					gid: 'duration',
					title: {
						key: 'estimate.main.duration',
						text: 'Duration',
					},
					attributes: ['FromDate', 'ToDate'],
				},
				{
					gid: 'userDefText',
					title: {
						key: 'cloud.common.UserdefTexts',
						text: 'User-Defined Texts',
					},
					attributes: ['UserDefined1', 'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5', 'CommentText', 'Hint', 'CosMatchText'],
				},
				{
					gid: 'currencies',
					title: {
						key: 'estimate.main.currencies',
						text: 'Currencies',
					},
					attributes: ['CostExchangeRate1', 'CostExchangeRate2', 'ForeignBudget1', 'ForeignBudget2', 'Currency1Fk', 'Currency2Fk'],
				},
				{
					gid: 'FormFk',
					title: {
						key: 'estimate.main.formFk',
						text: 'User Form',
					},
					attributes: ['FormFk'],
				},
				{
					gid: 'Allowance',
					title: {
						key: 'estimate.main.allowance',
						text: 'Allowance',
					},
					attributes: [
						'ManualMarkupUnitItem',
						'ManualMarkupUnit',
						'ManualMarkup',
						'AdvancedAllUnitItem',
						'AdvancedAllUnit',
						'AdvancedAll',
						'GcUnitItem',
						'GcUnit',
						'Gc',
						'GaUnitItem',
						'GaUnit',
						'Ga',
						'AmUnitItem',
						'AmUnit',
						'Am',
						'RpUnitItem',
						'RpUnit',
						'Rp',
						'AllowanceUnitItem',
						'AllowanceUnit',
						'Allowance',
						'Fm',
						'URDUnitItem',
						'URD',
					],
				},
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					PackageAssignments: {
						key: 'entityPackage',
						text: 'Package',
					},
					Code: {
						key: 'entityCode',
						text: 'Code',
					},
					DescriptionInfo: {
						key: 'entityDescription',
						text: 'Description',
					},
					Quantity: {
						key: 'entityQuantity',
						text: 'Quantity',
					},
					BasUomFk: {
						key: 'entityUoM',
						text: 'UoM',
					},
					UserDefined1: {
						key: 'entityUserDefined',
						text: 'User-Defined 1',
						params: { p_0: '1' },
					},
					UserDefined2: {
						key: 'entityUserDefined',
						text: 'User-Defined 2',
						params: { p_0: '2' },
					},
					UserDefined3: {
						key: 'entityUserDefined',
						text: 'User-Defined 3',
						params: { p_0: '3' },
					},
					UserDefined4: {
						key: 'entityUserDefined',
						text: 'User-Defined 4',
						params: { p_0: '4' },
					},
					UserDefined5: {
						key: 'entityUserDefined',
						text: 'User-Defined 5',
						params: { p_0: '5' },
					},
					EstLineItemStatusFk: {
						key: 'entityStatus',
						text: 'Status',
					},
				}),
				...prefixAllTranslationKeys('estimate.main.', {
					ProjectNo: {
						key: 'projectNo',
						text: 'Project-Number',
					},
					ProjectName: {
						key: 'projectName',
						text: 'Project-Name',
					},
					EstimationCode: {
						key: 'entityEstimationHeader',
						text: 'Estimate Code',
					},
					EstimationDescription: {
						key: 'entityEstimationDesc',
						text: 'Estimate Desc.',
					},
					CosInstanceCode: {
						key: 'cosInstanceCode',
						text: 'COS Instance C',
					},
					CosInstanceDescription: {
						key: 'cosInstanceDescription',
						text: 'COS Instance Desc',
					},
					OrderChangeFk: {
						key: 'ordHeaderFk',
						text: 'Change Order',
					},
					EstLineItemFk: {
						key: 'estLineItemFk',
						text: 'Line Item Ref.',
					},
					EstAssemblyFk: {
						key: 'estAssemblyFk',
						text: 'Assembly Template',
					},
					QuantityTarget: {
						key: 'aqQuantityTarget',
						text: 'AQ Quantity Item',
					},
					QuantityTargetDetail: {
						key: 'aqQuantityTargetDetail',
						text: 'AQ Quantity Target Detail',
					},
					BasUomTargetFk: {
						key: 'basUomTargetFk',
						text: 'UoM Target',
					},
					QuantityDetail: {
						key: 'quantityDetail',
						text: 'Quantity Detail',
					},
					QuantityFactorDetail1: {
						key: 'quantityFactorDetail1',
						text: 'QuantityFactorDetail1',
					},
					QuantityFactor1: {
						key: 'quantityFactor1',
						text: 'QuantityFactor1',
					},
					QuantityFactorDetail2: {
						key: 'quantityFactorDetail2',
						text: 'QuantityFactorDetail2',
					},
					QuantityFactor2: {
						key: 'quantityFactor2',
						text: 'QuantityFactor2',
					},
					QuantityFactor3: {
						key: 'quantityFactor3',
						text: 'QuantityFactor3',
					},
					QuantityFactor4: {
						key: 'quantityFactor4',
						text: 'QuantityFactor4',
					},
					ProductivityFactorDetail: {
						key: 'productivityFactorDetail',
						text: 'ProductivityFactorDetail',
					},
					ProductivityFactor: {
						key: 'productivityFactor',
						text: 'ProductivityFactor',
					},
					QuantityUnitTarget: {
						key: 'quantityUnitTarget',
						text: 'QuantityUnitTarget',
					},
					QuantityTotal: {
						key: 'quantityTotal',
						text: 'QuantityTotal',
					},
					CostUnit: {
						key: 'costUnit',
						text: 'CostUnit',
					},
					EntCostUnit: {
						key: 'entCostUnit',
						text: 'Ent CostUnit',
					},
					DruCostUnit: {
						key: 'druCostUnit',
						text: 'Dru CostUnit',
					},
					DirCostUnit: {
						key: 'dirCostUnit',
						text: 'Dir CostUnit',
					},
					IndCostUnit: {
						key: 'indCostUnit',
						text: 'Ind CostUnit',
					},
					CostFactorDetail1: {
						key: 'costFactorDetail1',
						text: 'CostFactorDetail1',
					},
					CostFactor1: {
						key: 'costFactor1',
						text: 'CostFactor1',
					},
					CostFactorDetail2: {
						key: 'costFactorDetail2',
						text: 'CostFactorDetail2',
					},
					CostFactor2: {
						key: 'costFactor2',
						text: 'CostFactor2',
					},
					CostUnitTarget: {
						key: 'costUnitTarget',
						text: 'CostUnitTarget',
					},
					EntCostUnitTarget: {
						key: 'entCostUnitTarget',
						text: 'Ent CostUnitTarget',
					},
					DruCostUnitTarget: {
						key: 'druCostUnitTarget',
						text: 'Dru CostUnitTarget',
					},
					DirCostUnitTarget: {
						key: 'dirCostUnitTarget',
						text: 'Dir CostUnitTarget',
					},
					IndCostUnitTarget: {
						key: 'indCostUnitTarget',
						text: 'Ind CostUnitTarget',
					},
					CostTotal: {
						key: 'costTotal',
						text: 'CostTotal',
					},
					EntCostTotal: {
						key: 'entCostTotal',
						text: 'Ent CostTotal',
					},
					DruCostTotal: {
						key: 'druCostTotal',
						text: 'Dru CostTotal',
					},
					DirCostTotal: {
						key: 'dirCostTotal',
						text: 'Dir CostTotal',
					},
					IndCostTotal: {
						key: 'indCostTotal',
						text: 'Ind CostTotal',
					},
					EstQtyRelBoqFk: {
						key: 'estQtyRelBoq',
						text: 'Boq Qty Relation',
					},
					EntHoursUnit: {
						key: 'entHoursUnit',
						text: 'Ent HoursUnit',
					},
					DruHoursUnit: {
						key: 'druHoursUnit',
						text: 'Dru HoursUnit',
					},
					DirHoursUnit: {
						key: 'dirHoursUnit',
						text: 'Dir HoursUnit',
					},
					IndHoursUnit: {
						key: 'indHoursUnit',
						text: 'Ind HoursUnit',
					},
					EstQtyRelActFk: {
						key: 'estQtyRelAct',
						text: 'Act Qty Relation',
					},
					EntHoursUnitTarget: {
						key: 'entHoursUnitTarget',
						text: 'EntHoursUnitTarget',
					},
					DruHoursUnitTarget: {
						key: 'druHoursUnitTarget',
						text: 'DruHoursUnitTarget',
					},
					DirHoursUnitTarget: {
						key: 'dirHoursUnitTarget',
						text: 'DirHoursUnitTarget',
					},
					IndHoursUnitTarget: {
						key: 'indHoursUnitTarget',
						text: 'IndHoursUnitTarget',
					},
					EstQtyRelGtuFk: {
						key: 'estQtyRelGtu',
						text: 'Ctu Qty Relation',
					},
					EntHoursTotal: {
						key: 'entHoursTotal',
						text: 'EntHoursTotal',
					},
					DruHoursTotal: {
						key: 'druHoursTotal',
						text: 'DruHoursTotal',
					},
					DirHoursTotal: {
						key: 'dirHoursTotal',
						text: 'DirHoursTotal',
					},
					IndHoursTotal: {
						key: 'indHoursTotal',
						text: 'IndHoursTotal',
					},
					EstQtyTelAotFk: {
						key: 'estQtyRelAot',
						text: 'Aot Qty Relation',
					},
					HoursUnit: {
						key: 'hoursUnit',
						text: 'HoursUnit',
					},
					HoursUnitTarget: {
						key: 'hoursUnitTarget',
						text: 'HoursUnitTarget',
					},
					HoursTotal: {
						key: 'hoursTotal',
						text: 'HoursTotal',
					},
					MdcControllingUnitFk: {
						key: 'mdcControllingUnitFk',
						text: 'Controlling Unit',
					},
					EstCostRiskFk: {
						key: 'estCostRiskFk',
						text: 'estCostRisk',
					},
					BoqItemFk: {
						key: 'boqItemFk',
						text: 'BoqItem',
					},
					PsdActivityFk: {
						key: 'psdActivityFk',
						text: 'PsdActivity',
					},
					MdcWorkCategoryFk: {
						key: 'mdcWorkCategoryFk',
						text: 'MdcWorkCategory',
					},
					MdcAssetMasterFk: {
						key: 'mdcAssetMasterFk',
						text: 'MdcAssetMaster',
					},
					PrjLocationFk: {
						key: 'prjLocationFk',
						text: 'PrjLocation',
					},
					IsLumpsum: {
						key: 'isLumpSum',
						text: 'IsLumpSum',
					},
					IsDisabled: {
						key: 'isDisabled',
						text: 'IsDisabled',
					},
					CommentText: {
						key: 'comment',
						text: 'Comment',
					},
					IsGc: {
						key: 'isGc',
						text: 'General Cost',
					},
					PrcStructureFk: {
						key: 'prcStructureFk',
						text: 'PrcStructure',
					},
					PrjChangeFk: {
						key: 'prjChange',
						text: 'Project Change',
					},
					FromDate: {
						key: 'fromDate',
						text: 'From Date',
					},
					ToDate: {
						key: 'toDate',
						text: 'To Date',
					},
					Hint: {
						key: 'hint',
						text: 'Copy Source',
					},
					Budget: {
						key: 'budget',
						text: 'Budget',
					},
					IsNoMarkup: {
						key: 'isNoMarkup',
						text: 'No Markup',
					},
					BudgetUnit: {
						key: 'budgetUnit',
						text: 'Budget/Unit',
					},
					IsFixedBudget: {
						key: 'isFixedBudget',
						text: 'Fix Budget',
					},
					IsOptional: {
						key: 'estIsOptional',
						text: 'Optional',
					},
					CosMatchText: {
						key: 'cosMatchText',
						text: 'COS Match Text',
					},
					WicBoqItemFk: {
						key: 'wicBoqItemFk',
						text: 'WIC BoQ -Item Ref.No',
					},
					BoqWicCatFk: {
						key: 'boqWicCatFk',
						text: 'WIC Group Ref.No',
					},
					BudgetDifference: {
						key: 'budgetDiff',
						text: 'Budget Difference',
					},
					Revenue: {
						key: 'revenue',
						text: 'Revenue',
					},
					FormFk: {
						key: 'formFk',
						text: 'User Form',
					},
					CostExchangeRate1: {
						key: 'costExchangeRate1',
						text: 'Cost Foreign Total 1',
					},
					CostExchangeRate2: {
						key: 'costExchangeRate2',
						text: 'Cost Foreign Total 2',
					},
					WqQuantityTarget: {
						key: 'wqQuantityTarget',
						text: ' Wq Quantity Item',
					},
					RevenueUnit: {
						key: 'revenueUnit',
						text: 'Revenue/Unit',
					},
					Margin1: {
						key: 'margin1',
						text: 'Margin1(Revenue-CostTotal)',
					},
					Margin2: {
						key: 'margin2',
						text: 'Margin2(Revenue-GrandTotal)',
					},
					MarkupCostUnit: {
						key: 'markupCostUnit',
						text: 'Markup Cost/Unit',
					},
					MarkupCostUnitTarget: {
						key: 'markupCostUnitTarget',
						text: 'Markup Cost/Unit Item',
					},
					MarkupCostTotal: {
						key: 'markupCostTotal',
						text: 'Markup Cost Total',
					},
					GrandTotal: {
						key: 'grandTotal',
						text: 'Grand Total',
					},
					WqQuantityTargetDetail: {
						key: 'wqQuantityTargetDetail',
						text: 'Wq Quantity Target Detail',
					},
					RiskCostUnit: {
						key: 'costRiskUnit',
						text: 'Risk Cost/Unit',
					},
					RiskCostTotal: {
						key: 'costRiskTotal',
						text: 'Risk Cost Total',
					},
					BoqSplitQuantityFk: {
						key: 'boqSplitQuantity',
						text: 'Boq Split Quantity',
					},
					EscalationCostUnit: {
						key: 'escalationCostUnit',
						text: 'Escalation Cost/Unit',
					},
					IsNoEscalation: {
						key: 'isNoEscalation',
						text: 'No Escalation',
					},
					EscalationCostTotal: {
						key: 'escalationCostTotal',
						text: 'Escalation Cost Total',
					},
					ForeignBudget1: {
						key: 'foreignBudget1',
						text: 'Foreign Budget 1',
					},
					ForeignBudget2: {
						key: 'foreignBudget2',
						text: 'Foreign Budget 2',
					},
					IsIncluded: {
						key: 'isIncluded',
						text: 'Included',
					},
					BaseCostUnit: {
						key: 'baseCostUnit',
						text: 'Base Cost/Unit',
					},
					BaseCostTotal: {
						key: 'baseCostTotal',
						text: 'Base Cost Total',
					},
					NoLeadQuantity: {
						key: 'noLeadQuantity',
						text: 'No Lead Quantity',
					},
					GrandCostUnit: {
						key: 'grandCostUnit',
						text: 'Grand Cost/Unit',
					},
					GrandCostUnitTarget: {
						key: 'grandCostUnitTarget',
						text: 'Grand Cost/Unit Item',
					},
					DayWorkRateTotal: {
						key: 'dayWorkRateTotal',
						text: 'DW/T+M Rate Total',
					},
					DayWorkRateUnit: {
						key: 'dayWorkRateUnit',
						text: 'DW/T+M Rate/Unit',
					},
					AssemblyType: {
						key: 'assemblyType',
						text: 'Assembly Type',
					},
					ManualMarkupUnitItem: {
						key: 'manualMarkupUnitItem',
						text: 'Manual Markup/Unit Item',
					},
					ManualMarkupUnit: {
						key: 'manualMarkupUnit',
						text: 'Manual Markup/Unit',
					},
					ManualMarkup: {
						key: 'manualMarkup',
						text: 'Manual Markup',
					},
					AdvancedAllUnitItem: {
						key: 'advancedAllUnitItem',
						text: 'Adv. Allowance/Unit Item',
					},
					AdvancedAllUnit: {
						key: 'advancedAllUnit',
						text: 'Adv. Allowance/Unit',
					},
					AdvancedAll: {
						key: 'advancedAll',
						text: 'Adv. Allowance',
					},
					GcUnitItem: {
						key: 'gcUnitItem',
						text: 'GC/Unit Item',
					},
					GcUnit: {
						key: 'gcUnit',
						text: 'GC/Unit',
					},
					Gc: {
						key: 'gc',
						text: 'GC',
					},
					GaUnitItem: {
						key: 'gaUnitItem',
						text: 'G&A/Unit Item',
					},
					GaUnit: {
						key: 'gaUnit',
						text: 'G&A/Unit',
					},
					Ga: {
						key: 'ga',
						text: 'G&A',
					},
					AmUnitItem: {
						key: 'amUnitItem',
						text: 'AM/Unit Item',
					},
					AmUnit: {
						key: 'amUnit',
						text: 'AM/Unit',
					},
					Am: {
						key: 'am',
						text: 'AM',
					},
					RpUnitItem: {
						key: 'rpUnitItem',
						text: 'R&P/Unit Item',
					},
					RpUnit: {
						key: 'rpUnit',
						text: 'R&P/Unit',
					},
					Rp: {
						key: 'rp',
						text: 'R&P',
					},
					AllowanceUnitItem: {
						key: 'allowanceUnitItem',
						text: 'Allowance/Unit Item',
					},
					AllowanceUnit: {
						key: 'allowanceUnit',
						text: 'Allowance/Unit',
					},
					Allowance: {
						key: 'allowance',
						text: 'Allowance',
					},
					Fm: {
						key: 'fm',
						text: 'FM',
					},
					URDUnitItem: {
						key: 'urdunititem',
						text: 'URD/Unit item',
					},
					URD: {
						key: 'urd',
						text: 'URD',
					},
					IsOptionalIT: {
						key: 'isoptionalit',
						text: 'Is Optional IT',
					},
					IsFixedBudgetUnit: {
						key: 'isFixedBudgetUnit',
						text: 'Fix Budget/Unit',
					},
					EstAssemblyDescriptionInfo: {
						key: 'estAssemblyDescriptionInfo',
						text: 'Assembly Description',
					},
					Info: {
						key: 'info',
						text: 'Info',
					},
					BoqHeaderFk: {
						key: 'boqRootRef',
						text: 'BoQ Root Item Ref. No',
					},
					Currency1Fk: {
						key: 'currency1Fk',
						text: 'Foreign Currency 1',
					},
					Currency2Fk: {
						key: 'currency2Fk',
						text: 'Foreign Currency 2',
					},
					PrjChangeStatusFk: {
						key: 'prjChangeStatus',
						text: 'Project Change Status',
					},
				}),
				...prefixAllTranslationKeys('constructionsystem.main.', {
					CosMasterHeaderCode: {
						key: 'masterHeaderCode',
						text: 'Master Header Code',
					},
					CosMasterHeaderDescription: {
						key: 'masterHeaderDescription',
						text: 'Master Header Description',
					},
				}),
				...prefixAllTranslationKeys('project.structures.', {
					SortDesc01Fk: {
						key: 'sortDesc01',
						text: 'Sort Description 1',
					},
					SortDesc02Fk: {
						key: 'sortDesc02',
						text: 'Sort Description 2',
					},
					SortDesc03Fk: {
						key: 'sortDesc03',
						text: 'Sort Description 3',
					},
					SortDesc04Fk: {
						key: 'sortDesc04',
						text: 'Sort Description 4',
					},
					SortDesc05Fk: {
						key: 'sortDesc05',
						text: 'Sort Description 5',
					},
					SortDesc06Fk: {
						key: 'sortDesc06',
						text: 'Sort Description 6',
					},
					SortDesc07Fk: {
						key: 'sortDesc07',
						text: 'Sort Description 7',
					},
					SortDesc08Fk: {
						key: 'sortDesc08',
						text: 'Sort Description 8',
					},
					SortDesc09Fk: {
						key: 'sortDesc09',
						text: 'Sort Description 9',
					},
					SortDesc10Fk: {
						key: 'sortDesc10',
						text: 'Sort Description 10',
					},
					SortCode01Fk: {
						key: 'sortCode01',
						text: 'Sort Code 1',
					},
					SortCode02Fk: {
						key: 'sortCode02',
						text: 'Sort Code 2',
					},
					SortCode03Fk: {
						key: 'sortCode03',
						text: 'Sort Code 3',
					},
					SortCode04Fk: {
						key: 'sortCode04',
						text: 'Sort Code 4',
					},
					SortCode05Fk: {
						key: 'sortCode05',
						text: 'Sort Code 5',
					},
					SortCode06Fk: {
						key: 'sortCode06',
						text: 'Sort Code 6',
					},
					SortCode07Fk: {
						key: 'sortCode07',
						text: 'Sort Code 7',
					},
					SortCode08Fk: {
						key: 'sortCode08',
						text: 'Sort Code 8',
					},
					SortCode09Fk: {
						key: 'sortCode09',
						text: 'Sort Code 9',
					},
					SortCode10Fk: {
						key: 'sortCode10',
						text: 'Sort Code 10',
					},
				}),
				...prefixAllTranslationKeys('estimate.project.', {
					LgmJobFk: {
						key: 'lgmJobFk',
						text: 'Job',
					},
				}),
				...prefixAllTranslationKeys('boq.main.', {
					IsFixedPrice: {
						key: 'IsFixedPrice',
						text: 'Fixed Price',
					},
					ExternalCode: {
						key: 'ExternalCode',
						text: 'External Code',
					},
					ItemInfo: {
						key: 'ItemInfo',
						text: 'Item Info',
					},
				}),
				...prefixAllTranslationKeys('basics.common.', {
					Co2SourceTotal: {
						key: 'sustainabilty.entityCo2SourceTotal',
						text: 'CO2 (Source) Total',
					},
					Co2ProjectTotal: {
						key: 'sustainabilty.entityCo2ProjectTotal',
						text: 'CO2 (Project) Total',
					},
					Co2TotalVariance: {
						key: 'sustainabilty.entityCo2TotalVariance',
						text: 'CO2 Total Variance',
					},
				}),
				...prefixAllTranslationKeys('estimate.rule.', {
					Rule: {
						key: 'rules',
						text: 'Rules',
					},
				}),
				...prefixAllTranslationKeys('estimate.parameter.', {
					Param: {
						key: 'params',
						text: 'Params',
					},
				}),
			},
			overloads: {
				DescriptionInfo: {
					maxLength: 255,
					type: FieldType.Description,
				},
				PackageAssignments: {
					readonly: true,
				},
				ProjectNo: {
					readonly: false,
				},
				ProjectName: {
					readonly: true,
				},
				EstimationCode: {
					readonly: true,
				},
				EstimationDescription: {
					readonly: true,
				},
				CosInstanceCode: {
					readonly: true,
				},
				CosInstanceDescription: {
					readonly: true,
				},
				CosMasterHeaderCode: {
					readonly: true,
				},
				CosMasterHeaderDescription: {
					readonly: true,
				},
				OrderChangeFk: {
					readonly: true,
					// TODO - depends on project-change-dialog
				},
				QuantityUnitTarget: {
					readonly: true,
				},
				CostUnit: {
					readonly: true,
				},
				EntCostUnit: {
					readonly: true,
				},
				DruCostUnit: {
					readonly: true,
				},
				DirCostUnit: {
					readonly: true,
				},
				IndCostUnit: {
					readonly: true,
				},
				CostUnitTarget: {
					readonly: true,
				},
				EntCostUnitTarget: {
					readonly: true,
				},
				DruCostUnitTarget: {
					readonly: true,
				},
				DirCostUnitTarget: {
					readonly: true,
				},
				IndCostUnitTarget: {
					readonly: true,
				},
				CostTotal: {
					readonly: true,
				},
				EntCostTotal: {
					readonly: true,
				},
				DruCostTotal: {
					readonly: true,
				},
				DirCostTotal: {
					readonly: true,
				},
				IndCostTotal: {
					readonly: true,
				},
				EntHoursUnit: {
					readonly: true,
				},
				DruHoursUnit: {
					readonly: true,
				},
				DirHoursUnit: {
					readonly: true,
				},
				IndHoursUnit: {
					readonly: true,
				},
				EntHoursUnitTarget: {
					readonly: true,
				},
				DruHoursUnitTarget: {
					readonly: true,
				},
				DirHoursUnitTarget: {
					readonly: true,
				},
				IndHoursUnitTarget: {
					readonly: true,
				},
				EntHoursTotal: {
					readonly: true,
				},
				DruHoursTotal: {
					readonly: true,
				},
				DirHoursTotal: {
					readonly: true,
				},
				IndHoursTotal: {
					readonly: true,
				},
				HoursUnit: {
					readonly: true,
				},
				HoursUnitTarget: {
					readonly: true,
				},
				HoursTotal: {
					readonly: true,
				},
				UserDefined1: {
					maxLength: 252,
				},
				UserDefined2: {
					maxLength: 252,
				},
				UserDefined3: {
					maxLength: 252,
				},
				UserDefined4: {
					maxLength: 252,
				},
				UserDefined5: {
					maxLength: 252,
				},
				Hint: {
					readonly: true,
				},
				CosMatchText: {
					readonly: true,
				},
				WicBoqItemFk: {
					readonly: true,
					//TODO: waiting for estimate-main-wic-item-lookup
				},
				BoqWicCatFk: {
					readonly: true,
					//TODO: waiting for estimate-wic-group-lookup
				},
				BudgetDifference: {
					readonly: true,
				},
				Revenue: {
					readonly: true,
				},
				CostExchangeRate1: {
					readonly: true,
				},
				CostExchangeRate2: {
					readonly: true,
				},
				RevenueUnit: {
					readonly: true,
				},
				Margin1: {
					readonly: true,
				},
				Margin2: {
					readonly: true,
				},
				MarkupCostUnit: {
					readonly: true,
				},
				MarkupCostUnitTarget: {
					readonly: true,
				},
				MarkupCostTotal: {
					readonly: true,
				},
				GrandTotal: {
					readonly: true,
				},
				RiskCostUnit: {
					readonly: true,
				},
				RiskCostTotal: {
					readonly: true,
				},
				EscalationCostUnit: {
					readonly: true,
				},
				EscalationCostTotal: {
					readonly: true,
				},
				ForeignBudget1: {
					readonly: true,
				},
				ForeignBudget2: {
					readonly: true,
				},
				BaseCostUnit: {
					readonly: true,
				},
				BaseCostTotal: {
					readonly: true,
				},
				GrandCostUnit: {
					readonly: true,
				},
				DayWorkRateTotal: {
					readonly: true,
				},
				DayWorkRateUnit: {
					readonly: true,
				},
				GcUnitItem: {
					readonly: true,
				},
				GcUnit: {
					readonly: true,
				},
				Gc: {
					readonly: true,
				},
				GaUnitItem: {
					readonly: true,
				},
				GaUnit: {
					readonly: true,
				},
				Ga: {
					readonly: true,
				},
				AmUnitItem: {
					readonly: true,
				},
				AmUnit: {
					readonly: true,
				},
				Am: {
					readonly: true,
				},
				RpUnitItem: {
					readonly: true,
				},
				RpUnit: {
					readonly: true,
				},
				Rp: {
					readonly: true,
				},
				AllowanceUnitItem: {
					readonly: true,
				},
				AllowanceUnit: {
					readonly: true,
				},
				Allowance: {
					readonly: true,
				},
				EstQtyRelBoqFk: BasicsSharedCustomizeLookupOverloadProvider.provideEstQuantityRelLookupOverload(true), // TODO : need to check with frank team
				EstQtyRelActFk: BasicsSharedCustomizeLookupOverloadProvider.provideEstQuantityRelLookupOverload(true),
				EstQtyRelGtuFk: BasicsSharedCustomizeLookupOverloadProvider.provideEstQuantityRelLookupOverload(true),
				EstQtyTelAotFk: BasicsSharedCustomizeLookupOverloadProvider.provideEstQuantityRelLookupOverload(true),

				Fm: {
					readonly: true,
				},
				URDUnitItem: {
					readonly: true,
				},
				URD: {
					readonly: true,
				},
				EstAssemblyDescriptionInfo: {
					readonly: true,
					maxLength: 255,
				},
				Co2SourceTotal: {
					readonly: true,
				},
				Co2ProjectTotal: {
					readonly: true,
				},
				Co2TotalVariance: {
					readonly: true,
				},
				Info: {
					readonly: true,
				},
				ItemInfo: {
					readonly: true,
					type: FieldType.Text,
					valueAccessor: {
						getValue(entity: T) {
							//TODO: waiting for estimateMainCommonService
							entity.ItemInfo = 'ItemInfo'; //$injector.get('estimateMainCommonService').buildLineItemInfo(entity);
							return entity.ItemInfo;
						},
					},
				},
				BoqHeaderFk: {
					readonly: true,
				},
				BoqItemFk:estBoqLookupProvider.GenerateEstimateBoQItemLookup(),
                PsdActivityFk:activityLookupProvider.generateActivityLookup(),
				Currency1Fk: {
					readonly: true,
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedCurrencyLookupService,
						showDescription: true,
						descriptionMember: 'Currency',
					}),
				},
				Currency2Fk: {
					readonly: true,
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedCurrencyLookupService,
						showDescription: true,
						descriptionMember: 'Currency',
					}),
				},
				PrjChangeStatusFk: {
					readonly: true,
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedProjectChangeStatusLookupService,
					}),
				},
				EstLineItemStatusFk: BasicsSharedCustomizeLookupOverloadProvider.provideEstLineItemStatusLookupOverload(false),
				EstLineItemFk: estimateLineItemLookupProvider.GenerateEstimateLineItemLookup(),
				EstAssemblyFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: EstimateMainAssemblyTemplateLookupService
					})
				},
				BasUomFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedUomLookupService
					})
				},
				EstCostRiskFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedCostRiskLookupService,
						gridConfig: {
							columns: [
								{
									id: 'DescriptionInfo',
									model: 'DescriptionInfo',
									type: FieldType.Translation,
									label: { text: 'DescriptionInfo' },
									sortable: true,
									visible: true,
									readonly: true
								}
							]
						}
					})
				},
				MdcControllingUnitFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsShareControllingUnitLookupService,
						showClearButton: true,
						showDescription: true,
						descriptionMember: 'DescriptionInfo.Translated',
						serverSideFilter: {
							key: 'estimate-prj-controlling-unit-filter',
							execute: (context) => {
								return {
									ByStructure: true,
									ExtraFilter: false,
									PrjProjectFk: this.estimateMainContextService.getSelectedProjectId(),
									CompanyFk: this.contextService.getContext().clientId,
									FilterKey: 'controlling.structure.estimate.prjcontrollingunit.filterkey',
									IsProjectReadonly: true,
									IsCompanyReadonly: true
								};
							}
						},
						selectableCallback: (e) => {
							return true;
						}
					})
				},
				PrjLocationFk: ProjectSharedLookupOverloadProvider.provideProjectLocationLookupOverload(true),
				MdcWorkCategoryFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedMdcWorkCategoryLookupService,
					}),
				},
				MdcAssetMasterFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedAssetMasterLookupService,
						showDescription: true,
						descriptionMember: 'DescriptionInfo.Translated'
					})
				},
				PrcStructureFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						showDescription: true,
						descriptionMember: 'DescriptionInfo.Translated',
						dataServiceToken: BasicsSharedProcurementStructureLookupService,
						showClearButton: true,
					}),
				},
				LgmJobFk: {
					//TODO: waiting for estimateMainJobLookupByProjectDataService
				},
				PrjChangeFk: {
					//TODO: waiting for project-change-dialog
				},
				FormFk: {
					readonly: false,
					type: FieldType.Lookup,
					lookupOptions:createLookup({
						dataServiceToken: BasicUserFormLookupService,
						serverSideFilter: {
							key: '',
							execute() {
								return 'rubricId=78';
							}
						}
					})
				},
				BoqSplitQuantityFk: {    // TODO : BoqMainSplitQuantityLookupDataService  is availble properly
					// type: FieldType.Lookup,
					// lookupOptions: createLookup({
					// 	dataServiceToken: BoqMainSplitQuantityLookupDataService,
					// 	valueMember: 'Id',
					// 	displayMember: 'SplitNo',
					// 	clientSideFilter: {
					// 		execute(item: IBoqSplitQuantityEntity,context): boolean {
					// 			return item && item.BoqItemFk && item.BoqHeaderFk ? true : false;
					// 		}
					// 	},

					// 	events: [
					// 		{
					// 			name: 'onSelectedItemChanged',
					// 			handler: (e) => {
					// 				if (e && e.context.entity) {
					// 					const selectedItem = (e as LookupEvent<IBoqSplitQuantityEntity, T>).selectedItem as IBoqSplitQuantityEntity;
					// 					if (selectedItem) {
					// 						e.context.entity.BoqSplitQuantityFk = selectedItem.Id;
					// 					}
					// 				}
					// 			}
					// 		}
					// 	]
					// })
				},
				IsFixedPrice: {
					readonly: true
				},
				SortCode01Fk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: EstimateSortCode01LookupDataService,
						showDescription: true,
						descriptionMember: 'Description',
						showClearButton: true,
						displayMember: 'Code'
					})
				},
				SortDesc01Fk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: EstimateSortCode01LookupDataService,
						showDescription: true,
						descriptionMember: 'Code',
						showClearButton: true,
						displayMember: 'Description'
					})
				},
				SortCode02Fk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: EstimateSortCode02LookupDataService,
						showDescription: true,
						descriptionMember: 'Description',
						showClearButton: true,
						displayMember: 'Code'
					})
				},
				SortDesc02Fk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: EstimateSortCode02LookupDataService,
						showDescription: true,
						descriptionMember: 'Code',
						showClearButton: true,
						displayMember: 'Description'
					})
				},
				SortCode03Fk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: EstimateSortCode03LookupDataService,
						showDescription: true,
						descriptionMember: 'Description',
						showClearButton: true,
						displayMember: 'Code'
					})
				},
				SortDesc03Fk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: EstimateSortCode03LookupDataService,
						showDescription: true,
						descriptionMember: 'Code',
						showClearButton: true,
						displayMember: 'Description'
					})
				},
				SortCode04Fk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: EstimateSortCode04LookupDataService,
						showDescription: true,
						descriptionMember: 'Description',
						showClearButton: true,
						displayMember: 'Code'
					})
				},
				SortDesc04Fk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: EstimateSortCode04LookupDataService,
						showDescription: true,
						descriptionMember: 'Code',
						showClearButton: true,
						displayMember: 'Description'
					})
				},
				SortCode05Fk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: EstimateSortCode05LookupDataService,
						showDescription: true,
						descriptionMember: 'Description',
						showClearButton: true,
						displayMember: 'Code'
					})
				},
				SortDesc05Fk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: EstimateSortCode05LookupDataService,
						showDescription: true,
						descriptionMember: 'Code',
						showClearButton: true,
						displayMember: 'Description'
					})
				},
				SortCode06Fk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: EstimateSortCode06LookupDataService,
						showDescription: true,
						descriptionMember: 'Description',
						showClearButton: true,
						displayMember: 'Code'
					})
				},
				SortDesc06Fk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: EstimateSortCode06LookupDataService,
						showDescription: true,
						descriptionMember: 'Code',
						showClearButton: true,
						displayMember: 'Description'
					})
				},
				SortCode07Fk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: EstimateSortCode07LookupDataService,
						showDescription: true,
						descriptionMember: 'Description',
						showClearButton: true,
						displayMember: 'Code'
					})
				},
				SortDesc07Fk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: EstimateSortCode07LookupDataService,
						showDescription: true,
						descriptionMember: 'Code',
						showClearButton: true,
						displayMember: 'Description'
					})
				},
				SortCode08Fk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: EstimateSortCode08LookupDataService,
						showDescription: true,
						descriptionMember: 'Description',
						showClearButton: true,
						displayMember: 'Code'
					})
				},
				SortDesc08Fk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: EstimateSortCode08LookupDataService,
						showDescription: true,
						descriptionMember: 'Code',
						showClearButton: true,
						displayMember: 'Description'
					})
				},
				SortCode09Fk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: EstimateSortCode09LookupDataService,
						showDescription: true,
						descriptionMember: 'Description',
						showClearButton: true,
						displayMember: 'Code'
					})
				},
				SortDesc09Fk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: EstimateSortCode09LookupDataService,
						showDescription: true,
						descriptionMember: 'Code',
						showClearButton: true,
						displayMember: 'Description'
					})
				},
				SortCode10Fk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: EstimateSortCode10LookupDataService,
						showDescription: true,
						descriptionMember: 'Description',
						showClearButton: true,
						displayMember: 'Code'
					})
				},
				SortDesc10Fk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: EstimateSortCode10LookupDataService,
						showDescription: true,
						descriptionMember: 'Code',
						showClearButton: true,
						displayMember: 'Description'
					})
				}
			},
			suppressHistoryGroup: true
		};
	}

	/**
	 * Generate layout configuration
	 */
	public async generateLayout(customizeConfig?: ILayoutConfiguration<T>): Promise<ILayoutConfiguration<T>> {
		const commonLayout = this.commonLayout();
		if (!customizeConfig) {
			return commonLayout as ILayoutConfiguration<T>;
		}
		const customizeLayout = customizeConfig as ILayoutConfiguration<T>;

		let mergeAttrs = (await commonLayout).groups;

		if (customizeLayout.groups && customizeLayout.groups.length > 0) {
			const mergeAttrObj = merge(keyBy((await commonLayout).groups, 'gid'), keyBy(customizeLayout.groups, 'gid'));
			mergeAttrs = values(mergeAttrObj);
		}

		const mergedObject = merge(commonLayout, customizeLayout);

		mergedObject.groups = mergeAttrs;

		return mergedObject as ILayoutConfiguration<T> ;
	}
}

/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { ILineItemBaseLayoutService } from '../../line-item/model/interfaces/estimate-line-item-base-layout.service.interface';
import {
	BasicsSharedAssetMasterLookupService, BasicsSharedCostCodeLookupService,
	BasicsSharedCostRiskLookupService, BasicsSharedMaterialLookupService, BasicsSharedMdcWorkCategoryLookupService, BasicsSharedProcurementStructureLookupService,
	BasicsSharedUomLookupService, IMaterialSearchEntity
} from '@libs/basics/shared';

/**
 * Assembly layout service
 */
@Injectable({
	providedIn: 'root',
})
export class EstimateAssembliesBaseLayoutService<T extends IEstLineItemEntity> implements ILineItemBaseLayoutService<T> {

	protected commonLayout(): ILayoutConfiguration<IEstLineItemEntity> {
		return {
			'groups': [
				{
					'gid': 'basicData',
					'title': {
						'key': 'cloud.common.entityProperties',
						'text': 'Basic Data'
					},
					'attributes': [
						'EstAssemblyCatFk',
						'Code',
						'DescriptionInfo',
						'QuantityDetail',
						'Quantity',
						'BasUomFk',
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
						'CostUnit',
						'CostFactorDetail1',
						'CostFactor1',
						'CostFactorDetail2',
						'CostFactor2',
						'CostUnitTarget',
						'CostTotal',
						'HoursUnit',
						'HoursUnitTarget',
						'HoursTotal',
						'EstCostRiskFk',
						'MdcAssetMasterFk',
						'IsLumpsum',
						'IsDisabled',
						'IsGc',
						'MdcWorkCategoryFk',
						'CommentText',
						'PrcStructureFk',
						'MdcCostCodeFk',
						'MdcMaterialFk',
						'MarkupCostUnit',
						'MarkupCostUnitTarget',
						'MarkupCostTotal',
						'GrandTotal',
						'DirCostUnit',
						'IndCostUnit',
						'DirCostUnitTarget',
						'IndCostUnitTarget',
						'DirCostTotal',
						'IndCostTotal',
						'NoLeadQuantity',
						'DayWorkRateTotal',
						'DayWorkRateUnit',
						'IsDissolvable',
						'Co2SourceTotal',
						'Co2ProjectTotal',
						'Co2TotalVariance',
						'Rule',
						'Param'
					]
				},
				{
					'gid': 'userDefText',
					'title': {
						'key': 'cloud.common.UserdefTexts',
						'text': 'User-Defined Texts'
					},
					'attributes': [
						'UserDefined1',
						'UserDefined2',
						'UserDefined3',
						'UserDefined4',
						'UserDefined5'
					]
				}
			],
			'labels': {
				...prefixAllTranslationKeys('estimate.assemblies.', {
					'EstAssemblyCatFk': {
						'key': 'estAssemblyCat',
						'text': 'Assembly Category'
					},
					'IsDissolvable': {
						'key': 'IsDissolvable',
						'text': 'Dissolvable'
					}
				}),
				...prefixAllTranslationKeys('cloud.common.', {
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
					'UserDefined1': {
						'key': 'entityUserDefined',
						'text': 'User-Defined 1',
						'params': {'p_0': '1'}
					},
					'UserDefined2': {
						'key': 'entityUserDefined',
						'text': 'User-Defined 2',
						'params': {'p_0': '2'}
					},
					'UserDefined3': {
						'key': 'entityUserDefined',
						'text': 'User-Defined 3',
						'params': {'p_0': '3'}
					},
					'UserDefined4': {
						'key': 'entityUserDefined',
						'text': 'User-Defined 4',
						'params': {'p_0': '4'}
					},
					'UserDefined5': {
						'key': 'entityUserDefined',
						'text': 'User-Defined 5',
						'params': {'p_0': '5'}
					}
				}),
				...prefixAllTranslationKeys('estimate.main.', {
					'QuantityDetail': {
						'key': 'quantityDetail',
						'text': 'Quantity Detail'
					},
					'QuantityFactorDetail1': {
						'key': 'quantityFactorDetail1',
						'text': 'Quantity Factor Detail 1'
					},
					'QuantityFactor1': {
						'key': 'quantityFactor1',
						'text': 'QuantityFactor1'
					},
					'QuantityFactorDetail2': {
						'key': 'quantityFactorDetail2',
						'text': 'Quantity Factor Detail 2'
					},
					'QuantityFactor2': {
						'key': 'quantityFactor2',
						'text': 'Quantity Factor 2'
					},
					'QuantityFactor3': {
						'key': 'quantityFactor3',
						'text': 'Quantity Factor 3'
					},
					'QuantityFactor4': {
						'key': 'quantityFactor4',
						'text': 'Quantity Factor 4'
					},
					'ProductivityFactorDetail': {
						'key': 'productivityFactorDetail',
						'text': 'Productivity Factor Detail'
					},
					'ProductivityFactor': {
						'key': 'productivityFactor',
						'text': 'Productivity Factor'
					},
					'QuantityUnitTarget': {
						'key': 'quantityUnitTarget',
						'text': 'Quantity Unit Target'
					},
					'QuantityTotal': {
						'key': 'quantityTotal',
						'text': 'Quantity Total'
					},
					'CostUnit': {
						'key': 'costUnit',
						'text': 'Cost Unit'
					},
					'CostFactorDetail1': {
						'key': 'costFactorDetail1',
						'text': 'Cost Factor Detail 1'
					},
					'CostFactor1': {
						'key': 'costFactor1',
						'text': 'Cost Factor 1'
					},
					'CostFactorDetail2': {
						'key': 'costFactorDetail2',
						'text': 'Cost Factor Detail 2'
					},
					'CostFactor2': {
						'key': 'costFactor2',
						'text': 'Cost Factor 2'
					},
					'CostUnitTarget': {
						'key': 'costUnitTarget',
						'text': 'Cost Unit Target'
					},
					'CostTotal': {
						'key': 'costTotal',
						'text': 'Cost Total'
					},
					'HoursUnit': {
						'key': 'hoursUnit',
						'text': 'Hours Unit'
					},
					'HoursUnitTarget': {
						'key': 'hoursUnitTarget',
						'text': 'Hours Unit Target'
					},
					'HoursTotal': {
						'key': 'hoursTotal',
						'text': 'Hours Total'
					},
					'EstCostRiskFk': {
						'key': 'estCostRiskFk',
						'text': 'Cost Risk'
					},
					'MdcAssetMasterFk': {
						'key': 'mdcAssetMasterFk',
						'text': 'Asset Master'
					},
					'IsLumpsum': {
						'key': 'isLumpSum',
						'text': 'Is LumpSum'
					},
					'IsDisabled': {
						'key': 'isDisabled',
						'text': 'Is Disabled'
					},
					'IsGc': {
						'key': 'isGc',
						'text': 'General Cost'
					},
					'MdcWorkCategoryFk': {
						'key': 'mdcWorkCategoryFk',
						'text': 'Work Category'
					},
					'CommentText': {
						'key': 'comment',
						'text': 'Comment'
					},
					'PrcStructureFk': {
						'key': 'prcStructureFk',
						'text': 'Procurement Structure'
					},
					'MdcCostCodeFk': {
						'key': 'mdcCostCodeFk',
						'text': 'CostCode'
					},
					'MdcMaterialFk': {
						'key': 'mdcMaterialFk',
						'text': 'Material'
					},
					'MarkupCostUnit': {
						'key': 'markupCostUnit',
						'text': 'Markup Cost/Unit'
					},
					'MarkupCostUnitTarget': {
						'key': 'markupCostUnitTarget',
						'text': 'Markup Cost/Unit Item'
					},
					'MarkupCostTotal': {
						'key': 'MarkupCostTotal',
						'text': 'Markup Cost Total'
					},
					'GrandTotal': {
						'key': 'grandTotal',
						'text': 'Grand Total'
					},
					'DirCostUnit': {
						'key': 'dirCostUnit',
						'text': 'Dir CostUnit'
					},
					'IndCostUnit': {
						'key': 'indCostUnit',
						'text': 'Ind CostUnit'
					},
					'DirCostUnitTarget': {
						'key': 'dirCostUnitTarget',
						'text': 'Dir CostUnitTarget'
					},
					'IndCostUnitTarget': {
						'key': 'indCostUnitTarget',
						'text': 'Ind CostUnitTarget'
					},
					'DirCostTotal': {
						'key': 'dirCostTotal',
						'text': 'Dir CostTotal'
					},
					'IndCostTotal': {
						'key': 'indCostTotal',
						'text': 'Ind CostTotal'
					},
					'NoLeadQuantity': {
						'key': 'noLeadQuantity',
						'text': 'No Lead Quantity'
					},
					'DayWorkRateTotal': {
						'key': 'dayWorkRateTotal',
						'text': 'DW/T+M Rate Total'
					},
					'DayWorkRateUnit': {
						'key': 'dayWorkRateUnit',
						'text': 'DW/T+M Rate'
					}
				}),
				...prefixAllTranslationKeys('basics.common.', {
					'Co2SourceTotal': {
						'key': 'sustainabilty.entityCo2SourceTotal',
						'text': 'CO2 (Source) Total'
					},
					'Co2ProjectTotal': {
						'key': 'sustainabilty.entityCo2ProjectTotal',
						'text': 'CO2 (Project) Total'
					},
					'Co2TotalVariance': {
						'key': 'sustainabilty.entityCo2TotalVariance',
						'text': 'CO2 Total Variance'
					}
				}),
				...prefixAllTranslationKeys('estimate.rule.', {
					'Rule': {
						'key': 'rules',
						'text': 'Rules'
					}
				}),
				...prefixAllTranslationKeys('estimate.parameter.', {
					'Param': {
						'key': 'params',
						'text': 'Params'
					}
				})
			},
			'overloads': {
				BasUomFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedUomLookupService,
					}),
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
									label: {text: 'DescriptionInfo'},
									sortable: true,
									visible: true,
									readonly: true
								}
							]
						}
					})
				},
				MdcAssetMasterFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedAssetMasterLookupService,
						showDescription: true,
						descriptionMember: 'DescriptionInfo.Translated'
					})},
				MdcWorkCategoryFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedMdcWorkCategoryLookupService,
					}),
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
				MdcCostCodeFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedCostCodeLookupService,
						showClearButton: true
					})
				},
				MdcMaterialFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup<IEstLineItemEntity, IMaterialSearchEntity>({
						dataServiceToken: BasicsSharedMaterialLookupService,
						showClearButton: true
					})
				},
				'QuantityUnitTarget': {
					'readonly': false
				},
				'CostUnit': {
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
				'HoursUnitTarget': {
					'readonly': true
				},
				'HoursTotal': {
					'readonly': true
				},
				'MarkupCostUnit': {
					'readonly': true
				},
				'MarkupCostUnitTarget': {
					'readonly': true
				},
				'MarkupCostTotal': {
					'readonly': true
				},
				'GrandTotal': {
					'readonly': true
				},
				'DirCostUnit': {
					'readonly': true
				},
				'IndCostUnit': {
					'readonly': true
				},
				'DirCostUnitTarget': {
					'readonly': true
				},
				'IndCostUnitTarget': {
					'readonly': true
				},
				'DirCostTotal': {
					'readonly': true
				},
				'IndCostTotal': {
					'readonly': true
				},
				'DayWorkRateTotal': {
					'readonly': true
				},
				'DayWorkRateUnit': {
					'readonly': true
				},
				'Co2SourceTotal': {
					'readonly': true
				},
				'Co2ProjectTotal': {
					'readonly': true
				},
				'Co2TotalVariance': {
					'readonly': true
				},
				'Quantity':{
					readonly: false
				}
			}
		};
	}

	/**
	 * Generate layout
	 */
	public async generateLayout(): Promise<ILayoutConfiguration<T>> {
		return this.commonLayout() as ILayoutConfiguration<T>;
	}
}
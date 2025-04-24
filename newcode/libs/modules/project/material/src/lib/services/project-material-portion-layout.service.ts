/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { IProjectMaterialPortionEntity } from '../model/entities/prj-material-portion-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedMaterialPortionTypeLookupService, BasicsSharedPriceConditionLookupService } from '@libs/basics/shared';
import { ProjectCostCodeLookupDataService } from './project-costcode-lookup-data.service';

/**
 * Basics Material Portion layout service
 */
@Injectable({
	providedIn: 'root',
})
export class ProjectMaterialPortionLayoutService {
	/**
	 * Generate layout config
	 */
	public async generateLayout(): Promise<ILayoutConfiguration<IProjectMaterialPortionEntity>> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties',
					},
					attributes: ['Project2MdcCostCodeFk', 'CostPerUnit', 'IsEstimatePrice', 'IsDayWorkRate', 'PriceExtra', 'Quantity', 'PriceConditionFk', 'MdcMaterialPortionTypeFk', 'Code', 'Description', 'MdcCostPerUnit'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					Project2MdcCostCodeFk: {
						key: 'CostCode',
						text: 'Cost Code',
					},
					Code: {
						key: 'entityCode',
						text: 'Code',
					},
					Description: {
						key: 'entityDescription',
						text: 'Description',
					},
				}),
				...prefixAllTranslationKeys('project.material.', {
					CostPerUnit: {
						key: 'CostPerUnit',
						text: 'Cost Per Unit(Project)',
					},
					IsEstimatePrice: {
						key: 'IsEstimatePrice',
						text: 'Is Estimate Price(Project)',
					},
					IsDayWorkRate: {
						key: 'IsDayWorkRate',
						text: 'Is Daywork Rate(Project)',
					},
					PriceExtra: {
						key: 'prjPriceExtra',
						text: 'PriceExtra(Project)',
					},
					Quantity: {
						key: 'Quantity',
						text: 'Quantity',
					},
					PriceConditionFk: {
						key: 'PriceConditionFk',
						text: 'Prc Price Condition',
					},
					MdcMaterialPortionTypeFk: {
						key: 'MdcMaterialPortionTypeFk',
						text: 'Material Portion Type(project)',
					},
				}),
				...prefixAllTranslationKeys('basics.material.', {
					MdcCostPerUnit: {
						key: 'portion.costPerUnit',
						text: 'Cost Per Unit',
					},
					MaterialPortionTypeFk: {
						key: 'portion.materialPortionType',
						text: 'Material Portion Type',
					},
				}),
			},
			overloads: {
				Code: { readonly: false },
				PriceExtra: { readonly: false },
				CostPerUnit: { readonly: false },
				PriceConditionFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedPriceConditionLookupService,
						showClearButton: true,
					}),
				},
				Project2MdcCostCodeFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ProjectCostCodeLookupDataService,
						displayMember: 'Code',
						valueMember: 'OriginalId',
						showClearButton: true,
					}),
				},
				MdcMaterialPortionTypeFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({ dataServiceToken: BasicsSharedMaterialPortionTypeLookupService }),
				},
			},
		};
	}
}

/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IBasicsCommonHistoricalPriceForItemEntity } from '../models/basics-common-historical-price-for-item-entity.interface';
import { BasicsSharedMaterialPriceListLookupService, BasicsSharedUomLookupService } from '@libs/basics/shared';
import { BusinessPartnerLookupService } from '@libs/businesspartner/shared';
import { ProjectSharedProjectLookupProviderService } from '@libs/project/shared';
/**
 * Historical layout service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsCommonHistoricalPriceForItemLayoutService {
	private readonly projectLookupProvider = inject(ProjectSharedProjectLookupProviderService);

	public async generateConfig<T extends IBasicsCommonHistoricalPriceForItemEntity>(): Promise<ILayoutConfiguration<T>> {
		return <ILayoutConfiguration<T>>{
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties'
					},
					attributes: [
						'SourceType',
						'SourceCodeAndDesc',
						'MaterialPriceListId',
						'ConvertedUnitRate',
						'VarianceFormatter',
						'UomId',
						'PriceUnit',
						'Weighting',
						'ProjectId',
						'BusinessPartnerId',
						'Co2Project',
						'Co2Source',
						'UpdateDate'
					]
				}
			],
			labels: {
				...prefixAllTranslationKeys('procurement.common.wizard.', {
					ItemCodeAndDesc: {key: 'updateItemPrice.itemCodeAndDesc', text: 'Item Code / Description'},
					SourceType: {key: 'updateItemPrice.type', text: 'Type'},
					SourceCodeAndDesc: {key: 'updateItemPrice.sourceCodeAndDesc', text: 'Source Code / Description'},
					MaterialPriceListId: {key: 'updateItemPrice.unitRate', text: 'Unit Rate'},
					ConvertedUnitRate: {key: 'updateItemPrice.convertedUnitRate', text: 'Converted Unit Rate'},
					VarianceFormatter: {key: 'replaceNeutralMaterial.variance', text: 'Variance'},
					UomId: {key: 'replaceNeutralMaterial.matchingMaterialUoM', text: 'Uom'},
					PriceUnit: {key: 'updateItemPrice.priceUnit', text: 'Price Unit'},
					Weighting: {key: 'updateItemPrice.type', text: 'Weighting'}
				}),
				...prefixAllTranslationKeys('procurement.common.', {
					Co2Project: {key: 'entityCo2Project', text: 'CO2/kg (Project)'},
					Co2Source: {key: 'entityCo2Source', text: 'CO2/kg (Source)'},
					UpdateDate: {key: 'UpdateDate', text: 'Update Date'},

				}),
				...prefixAllTranslationKeys('project.main.', {
					ProjectId: {key: 'sourceProject', text: 'Project'}
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					BusinessPartnerId: {key: 'businessPartner', text: 'Business Partner'},
				})
			},
			overloads: {
				MaterialPriceListId:{
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedMaterialPriceListLookupService
					})
				},
				UomId: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedUomLookupService
					})
				},
				ProjectId:this.projectLookupProvider.generateProjectLookup(),
				BusinessPartnerId:{
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BusinessPartnerLookupService
					})
				}
			}
		};
	}
}
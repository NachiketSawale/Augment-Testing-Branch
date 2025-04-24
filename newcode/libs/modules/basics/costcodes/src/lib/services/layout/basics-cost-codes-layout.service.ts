/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { FieldType, ILayoutConfiguration, ILookupEvent, createLookup } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import {
	BasicsCostCodesControllingLookup,
	BasicsSharedCustomizeLookupOverloadProvider,
	BasicsSharedLookupOverloadProvider
} from '@libs/basics/shared';
import { ICostCodeEntity } from '../../model/entities/cost-code-entity.interface';
import { BasicsCostCodesDataService } from '../data-service/basics-cost-codes-data.service';
import { IControllingCostCodes } from '@libs/basics/interfaces';

/**
 * Basics Cost Codes layout service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsCostCodesLayoutService {
	private dataService= inject(BasicsCostCodesDataService);

	public async generateConfig(): Promise<ILayoutConfiguration<ICostCodeEntity>> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties'
					},
					attributes: [
						'CostCodeTypeFk',
						'CostCodePortionsFk',
						'CostGroupPortionsFk',
						'ContrCostCodeFk',
						'AbcClassificationFk',
						'EfbType221Fk',
						'EfbType222Fk',
						'PrcStructureFk',
						'Code',
						'UomFk',
						'CurrencyFk',
						'EstCostTypeFk',
						'DescriptionInfo',
						'FactorCosts',
						'DayWorkRate',
						'FactorHour',
						'FactorQuantity',
						'Rate',
						'RealFactorCosts',
						'RealFactorQuantity',
						'IsLabour',
						'IsEditable',
						'IsBudget',
						'IsCost'
					]
				}
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					Code: { key: 'entityCode' },
					DescriptionInfo: { key: 'entityDescription' },
					UomFk: { key: 'entityUoM' }
				}),
				...prefixAllTranslationKeys('basics.costcodes.', {
					AbcClassificationFk: { key: 'abcClassification' },
					FactorCosts: { key: 'factorCosts' },
					DayWorkRate: { key: 'dayWorkRate' },
					FactorHour: { key: 'factorHour' },
					FactorQuantity: { key: 'factorQuantity' },
					Rate: { key: 'rate' },
					RealFactorCosts: { key: 'realFactorCosts' },
					RealFactorQuantity: { key: 'realFactorQuantity' },
					IsLabour: { key: 'isLabour' },
					IsEditable: { key: 'isEditable' },
					IsBudget: { key: 'isBudget' },
					IsCost: { key: 'isCost' },
					ContrCostCodeFk: { key: '', text: 'Controlling Cost Codes' },
					CostCodeTypeFk: { key: 'entityType' },
					EstCostTypeFk: { key: 'costType' },
					CurrencyFk: { key: 'currency' },
					CostCodePortionsFk: { key: 'costCodePortions' },
					CostGroupPortionsFk: { key: 'costGroupPortions' },
					PrcStructureFk: { key: 'prcStructure' },
					EfbType221Fk: { key: 'efbType221' },
					EfbType222Fk: { key: 'efbType222' }

				})
			},
			overloads: {
				ContrCostCodeFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsCostCodesControllingLookup,
						showClearButton: true,
						showDescription: true,
						descriptionMember: 'Description',
						readonly: false,
						events :[
							{
                               name:'onSelectedItemChanged',
							   handler: (e: ILookupEvent<IControllingCostCodes, ICostCodeEntity>) => {
								const selectedItem = e.context.entity;
								if (selectedItem) {
									this.dataService.fieldChanged(selectedItem,'ContrCostCodeFk');
								}
							}
							}
						]

					}),

					width: 145

				},

				CostCodeTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideCostCodeTypeLookupOverload(true),

				EstCostTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideCostTypeLookupOverload(true),

				UomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),

				CurrencyFk: BasicsSharedLookupOverloadProvider.provideCurrencyLookupOverload(true),

				CostCodePortionsFk: BasicsSharedCustomizeLookupOverloadProvider.provideCostCodePortionLookupOverload(true),

				CostGroupPortionsFk: BasicsSharedCustomizeLookupOverloadProvider.provideCostGroupPortionLookupOverload(true),

				AbcClassificationFk: BasicsSharedCustomizeLookupOverloadProvider.provideAbcClassificationLookupOverload(true),

				PrcStructureFk: BasicsSharedLookupOverloadProvider.providerBasicsProcurementStructureLookupOverload(true),

				EfbType221Fk: BasicsSharedCustomizeLookupOverloadProvider.provideEfbTypeLookupOverload(true),

				EfbType222Fk: BasicsSharedCustomizeLookupOverloadProvider.provideEfbTypeLookupOverload(true)


			}
		};
	}
}

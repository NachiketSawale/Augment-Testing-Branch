/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { prefixAllTranslationKeys } from '@libs/platform/common';
import { PlantGroupTaxCodeDataService } from '../services/plant-group-tax-code-data.service';
import { PlantGroupTaxCodeValidationService } from '../services/plant-group-tax-code-validation.service';
import { IEntityInfo, EntityInfo } from '@libs/ui/business-base';
import { IPlantGroupTaxCodeEntity } from '@libs/resource/interfaces';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';

export const resourceEquipmentGroupPlantGroupTaxCodeModuleInfo: EntityInfo = EntityInfo.create({
	grid: {
		title: {
			text: '',
			key: 'resource.equipmentgroup.taxCodeList'
		}
	},
	form: {
		title: {
			text: '',
			key: 'resource.equipmentgroup.taxCodeDetail'
		},
		containerUuid: '3bf917481bfe4b0aaa3dd4a39e03508a'
	},
	dataService: (ctx) => ctx.injector.get(PlantGroupTaxCodeDataService),
	validationService: (ctx) => ctx.injector.get(PlantGroupTaxCodeValidationService),
	dtoSchemeId: {
		moduleSubModule: 'Resource.EquipmentGroup',
		typeName: 'PlantGroupTaxCodeDto'
	},
	permissionUuid: '0d881efb6e4249718bb5a7a84dad8eb1',
	layoutConfiguration: {
		groups: [
			{
				gid: 'default',
				attributes: [
					'LedgerContextFk',
					'TaxCodeFk',
				]
			},
		],
		overloads: {
			LedgerContextFk: BasicsSharedLookupOverloadProvider.provideLedgerContextReadonlyLookupOverload(),
			TaxCodeFk: BasicsSharedLookupOverloadProvider.provideTaxCodeListLookupOverload(true)
		},
		labels: {
			...prefixAllTranslationKeys('resource.equipmentgroup.', {
				PlantGroupFk: { key: 'entityPlantGroup' },
				TaxCodeFk: { key: 'entityTaxCode' }
			}),
			...prefixAllTranslationKeys('basics.customize.', {
				LedgerContextFk: { key: 'ledgercontext' }
			}),
		}
	}
} as IEntityInfo<IPlantGroupTaxCodeEntity>);
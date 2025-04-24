/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { prefixAllTranslationKeys } from '@libs/platform/common';
import { PlantGroupAccountDataService } from '../services/plant-group-account-data.service';
import { PlantGroupAccountValidationService } from '../services/plant-group-account-validation.service';
import { IEntityInfo, EntityInfo } from '@libs/ui/business-base';
import { IPlantGroupAccountEntity } from '@libs/resource/interfaces';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { ResourceSharedLookupOverloadProvider } from '@libs/resource/shared';

export const resourceEquipmentGroupPlantGroupAccountModuleInfo: EntityInfo = EntityInfo.create({
	grid: {
		title: {
			text: '',
			key: 'resource.equipmentgroup.equipmentGroupAccountListTitle'
		}
	},
	form: {
		title: {
			text: '',
			key: 'resource.equipmentgroup.equipmentGroupAccountDetailTitle'
		},
		containerUuid: 'e3cb4d24a11f4cdfbebd9e9c77ba9978'
	},
	dataService: (ctx) => ctx.injector.get(PlantGroupAccountDataService),
	validationService: (ctx) => ctx.injector.get(PlantGroupAccountValidationService),
	dtoSchemeId: {
		moduleSubModule: 'Resource.EquipmentGroup',
		typeName: 'PlantGroupAccountDto'
	},
	permissionUuid: '73f7e2eea2a842dca95262d9e8832108',
	layoutConfiguration: {
		groups: [
			{
				gid: 'default',
				attributes: [
					'LedgerContextFk',
					'ValidFrom',
					'ValidTo',
					'WorkOperationTypeFk',
					'AccountTypeFk',
					'Account01Fk',
					'Account02Fk',
					'Account03Fk',
					'Account04Fk',
					'Account05Fk',
					'Account06Fk',
					'CommentText',
					'NominalDimension0101',
					'NominalDimension0102',
					'NominalDimension0103',
					'NominalDimension0201',
					'NominalDimension0202',
					'NominalDimension0203',
					'NominalDimension0301',
					'NominalDimension0302',
					'NominalDimension0303',
					'NominalDimension0401',
					'NominalDimension0402',
					'NominalDimension0403',
					'NominalDimension0501',
					'NominalDimension0502',
					'NominalDimension0503',
					'NominalDimension0601',
					'NominalDimension0602',
					'NominalDimension0603'
				]
			},
		],
		overloads: {
			LedgerContextFk: BasicsSharedLookupOverloadProvider.provideLedgerContextReadonlyLookupOverload(),
			AccountTypeFk: BasicsSharedLookupOverloadProvider.provideAccountTypeLookupOverload(true),
			// ToDo: Add 'resource-equipment-group-account-filter' to the next six lines
			Account01Fk: BasicsSharedLookupOverloadProvider.provideAccountingLookupOverload(true),
			Account02Fk: BasicsSharedLookupOverloadProvider.provideAccountingLookupOverload(true),
			Account03Fk: BasicsSharedLookupOverloadProvider.provideAccountingLookupOverload(true),
			Account04Fk: BasicsSharedLookupOverloadProvider.provideAccountingLookupOverload(true),
			Account05Fk: BasicsSharedLookupOverloadProvider.provideAccountingLookupOverload(true),
			Account06Fk: BasicsSharedLookupOverloadProvider.provideAccountingLookupOverload(true),
			WorkOperationTypeFk: ResourceSharedLookupOverloadProvider.provideWorkOperationTypeLookupOverload(true)
		},
		labels: {
			...prefixAllTranslationKeys('resource.equipmentgroup.', {
				PlantGroupFk: { key: 'entityPlantGroup' },
				ValidFrom: { key: 'entityValidFrom' },
				ValidTo: { key: 'entityValidTo' },
				WorkOperationTypeFk: { key: 'entityWorkOperationTypeFk' },
				Account01Fk: { key: 'entityAccount' },
				Account02Fk: { key: 'entityAccount' },
				Account03Fk: { key: 'entityAccount' },
				Account04Fk: { key: 'entityAccount' },
				Account05Fk: { key: 'entityAccount' },
				Account06Fk: { key: 'entityAccount' },
				NominalDimension0101: { key: 'entityNominalDimension0101' },
				NominalDimension0102: { key: 'entityNominalDimension0102' },
				NominalDimension0103: { key: 'entityNominalDimension0103' },
				Controllinggrpdetail0101Fk: { key: 'entityControllinggrpdetail0101' },
				Controllinggrpdetail0102Fk: { key: 'entityControllinggrpdetail0102' },
				Controllinggrpdetail0103Fk: { key: 'entityControllinggrpdetail0103' },
				NominalDimension0201: { key: 'entityNominalDimension0201' },
				NominalDimension0202: { key: 'entityNominalDimension0202' },
				NominalDimension0203: { key: 'entityNominalDimension0203' },
				Controllinggrpdetail0201Fk: { key: 'entityControllinggrpdetail0201' },
				Controllinggrpdetail0202Fk: { key: 'entityControllinggrpdetail0202' },
				Controllinggrpdetail0203Fk: { key: 'entityControllinggrpdetail0203' },
				NominalDimension0301: { key: 'entityNominalDimension0301' },
				NominalDimension0302: { key: 'entityNominalDimension0302' },
				NominalDimension0303: { key: 'entityNominalDimension0303' },
				Controllinggrpdetail0301Fk: { key: 'entityControllinggrpdetail0301' },
				Controllinggrpdetail0302Fk: { key: 'entityControllinggrpdetail0302' },
				Controllinggrpdetail0303Fk: { key: 'entityControllinggrpdetail0303' },
				NominalDimension0401: { key: 'entityNominalDimension0401' },
				NominalDimension0402: { key: 'entityNominalDimension0402' },
				NominalDimension0403: { key: 'entityNominalDimension0403' },
				Controllinggrpdetail0401Fk: { key: 'entityControllinggrpdetail0401' },
				Controllinggrpdetail0402Fk: { key: 'entityControllinggrpdetail0402' },
				Controllinggrpdetail0403Fk: { key: 'entityControllinggrpdetail0403' },
				NominalDimension0501: { key: 'entityNominalDimension0501' },
				NominalDimension0502: { key: 'entityNominalDimension0502' },
				NominalDimension0503: { key: 'entityNominalDimension0503' },
				Controllinggrpdetail0501Fk: { key: 'entityControllinggrpdetail0501' },
				Controllinggrpdetail0502Fk: { key: 'entityControllinggrpdetail0502' },
				Controllinggrpdetail0503Fk: { key: 'entityControllinggrpdetail0503' },
				NominalDimension0601: { key: 'entityNominalDimension0601' },
				NominalDimension0602: { key: 'entityNominalDimension0602' },
				NominalDimension0603: { key: 'entityNominalDimension0603' },
				Controllinggrpdetail0601Fk: { key: 'entityControllinggrpdetail0601' },
				Controllinggrpdetail0602Fk: { key: 'entityControllinggrpdetail0602' },
				Controllinggrpdetail0603Fk: { key: 'entityControllinggrpdetail0603' }
			}),
			...prefixAllTranslationKeys('basics.customize.', {
				LedgerContextFk: { key: 'ledgercontext' },
				AccountTypeFk: { key: 'accountingtype' }
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				CommentText: { key: 'entityComment' }
			}),
		}
	}
} as IEntityInfo<IPlantGroupAccountEntity>);
/*
 * Copyright(c) RIB Software GmbH
 */

import {  prefixAllTranslationKeys } from '@libs/platform/common';
import { EntityInfo } from '@libs/ui/business-base';
import { ResourceWotWorkOperationTypeDataService } from '../../services/resource-wot-work-operation-type-data.service';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { IResourceWorkOperationTypeEntity } from '@libs/resource/interfaces';
import { ResourceWotWorkOperationTypeValidationService } from '../../services/resource-wot-work-operation-type-validation.service';


export const resourceWotWorkOperationTypeEntityInfo = EntityInfo.create<IResourceWorkOperationTypeEntity>({
	grid: {
		title: {
			text: 'Work Operation Types',
			key: 'resource.wot.workOperationTypeListTitle'
		}
	},
	form: {
		title: {
			text: 'Work Operation Type Details',
			key: 'resource.wot.workOperationTypeDetailTitle'
		},
		containerUuid: '8c9b09fc5ce34a468e28cfaa40ece637'
	},
	dataService: (ctx) => ctx.injector.get(ResourceWotWorkOperationTypeDataService),
	validationService: (ctx) => ctx.injector.get(ResourceWotWorkOperationTypeValidationService),
	dtoSchemeId: {
		moduleSubModule: 'Resource.Wot',
		typeName: 'WorkOperationTypeDto'
	},
	permissionUuid: '5c10bdee259d4d9d87fd84a396183093',
	layoutConfiguration: {
		groups: [
			{
				gid: 'basicData',
				attributes: [
					'Code', 'DescriptionInfo', 'IsHire', 'IsLive', 'Sorting',
					'IsDefault', 'UomFk', 'ReservationstatusStartFk', 'IsMinorEquipment',
					'HasLoadingCosts', 'IsEstimate'
				]
			},
		],
		overloads: {
			UomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
			ReservationstatusStartFk: BasicsSharedLookupOverloadProvider.provideResReservationStatusLookupOverload(true),
		},
		labels: {
			...prefixAllTranslationKeys('resource.wot.', {
				IsHire: { key: 'isHire'},
				ReservationstatusStartFk: { key: 'entityReservationstatusStartFk'},
				IsMinorEquipment: { key: 'isMinorEquipment'},
				HasLoadingCosts: { key: 'hasLoadingCosts'},
				IsEstimate: { key: 'isEstimate'},
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				basicData: {key: 'entityProperties'},
				Code: {key: 'entityCode'},
				DescriptionInfo: {key: 'entityDescription'},
				Sorting: { key: 'entitySorting'},
				IsDefault: { key: 'entityIsDefault'},
				UomFk: { key: 'entityUoM'}
			})
		}
	}
});


/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { LogisticJobPlantAllocationDataService } from '../services/logistic-job-plant-allocation-data.service';
import { IJobPlantAllocationEntity } from '@libs/logistic/interfaces';
import { ResourceSharedLookupOverloadProvider } from '@libs/resource/shared';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';


export const LOGISTIC_JOB_PLANT_ALLOCATION_ENTITY_INFO: EntityInfo = EntityInfo.create<IJobPlantAllocationEntity>({
	grid: {
		title: {key: 'logistic.job' + '.plantAllocationListTitle'},
	},
	form: {
		title: {key: 'logistic.job' + '.plantAllocationDetailTitle'},
		containerUuid: 'f683b9900aa54c5db4eb359a1ab85115',
	},
	dataService: ctx => ctx.injector.get(LogisticJobPlantAllocationDataService),
	dtoSchemeId: {moduleSubModule: 'Logistic.Job', typeName: 'JobPlantAllocationDto'},
	permissionUuid: '432068179c654b419d3d42d7153d10f8',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: [/*'PlantFk',*/ 'WorkOperationTypeFk', 'AllocatedFrom', 'AllocatedTo', 'LastSettlementDate', 'IsSettled', 'Quantity', 'CommentText', 'ReleaseDate'/*, 'DispatchHeaderInFk',*/
				/*	'CompanyInFk', 'DispatchHeaderOutFk', 'CompanyOutFk'*/, 'UomFk'/*, 'ControllingUnitFk', 'ReservationFk', 'PesItemFk', 'PlantComponentFk',
					'DispatchRecordInFk', 'DispatchRecordOutFk'*/],
			},
		],
		overloads: {
			//TODO:PlantFk
			//TODO:DispatchHeaderInFk
			//TODO:CompanyInFk
			//TODO:DispatchHeaderOutFk
			//TODO:CompanyOutFk
			//TODO:PlantComponentFk
			//TODO:DispatchRecordInFk
			//TODO:DispatchRecordOutFk
			//TODO:PesItemFk
			WorkOperationTypeFk: ResourceSharedLookupOverloadProvider.provideWorkOperationTypeReadonlyLookupOverload(),
			UomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true)

		},
		labels: {
			...prefixAllTranslationKeys('logistic.job', {
				PlantFk: {key: 'plant'},
				WorkOperationTypeFk: {key: 'workOperationType'},
				AllocatedFrom: {key: 'allocatedFrom'},
				AllocatedTo: {key: 'allocatedTo'},
				LastSettlementDate: {key: 'lastSettlementDate'},
				IsSettled: {key: 'entityIsSettled'},
				ReleaseDate: {key: 'releaseDate'},
				DispatchHeaderInFk: {key: 'dispatchHeaderIn'},
				CompanyInCode: {key: 'companyIn'},
				DispatchHeaderOutCode: {key: 'dispatchHeaderOut'},
				CompanyOutCode: {key: 'companyOut'},
				PesItemFk: {key: 'entityPesItemFk'},
				DispatchRecordInFk: {key: 'entityDispatchRecordIn'},
				DispatchRecordOutFk: {key: 'entityDispatchRecordOut'},
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				UomFk: {key: 'entityUoM'},
				Quantity: {key: 'entityQuantity'},
				CommentText: {key: 'entityCommentText'},
				ControllingUnitFk: {key: 'entityControllingUnit'},
			}),
			...prefixAllTranslationKeys('resource.reservation.', {
				ReservationFk: {key: 'entityReservation'},
			}),
			...prefixAllTranslationKeys('resource.equipment.', {
				PlantComponentFk: {key: 'entitySerialNumber'},
			}),

		},
	}
});
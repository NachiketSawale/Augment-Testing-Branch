/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { LogisticCardRecordDataService } from '../services/logistic-card-record-data.service';
import { ILogisticCardRecordEntity } from '@libs/logistic/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { LogisticCardRecordValidationService } from '../services/logistic-card-record-validation.service';
import { createLookup, FieldType } from '@libs/ui/common';
import { TimekeepingEmployeeLookupService } from '@libs/timekeeping/shared';
import { ResourceSharedLookupOverloadProvider } from '@libs/resource/shared';


export const LOGISTIC_CARD_RECORD_ENTITY_INFO: EntityInfo = EntityInfo.create<ILogisticCardRecordEntity>({
	grid: {
		title: {key: 'logistic.card.cardRecordListTitle'},
	},
	form: {
		title: {key: 'logistic.card.cardRecordDetailTitle'},
		containerUuid: '35eb529cbbc04fbaac20073663522425',
	},
	dataService: ctx => ctx.injector.get(LogisticCardRecordDataService),
	validationService: ctx => ctx.injector.get(LogisticCardRecordValidationService),
	dtoSchemeId: {moduleSubModule: 'Logistic.Card', typeName: 'JobCardRecordDto'},
	permissionUuid: '1e6832ec58314f4bb772e0986f110d33',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['RecordNo', 'Description', 'JobCardRecordTypeFk'/*, 'CardRecordFk'*/, 'CardRecordDescription'/*, 'UomFk'*/, /*'DispatchRecordFk', */'WorkOperationTypeFk', 'Quantity',
				'DeliveredQuantity', 'AcceptedQuantity', 'EmployeeFk', /*'ProcurementStructureFk', */'ReservationId'],
			}
		],
		// TODO: some lookups missing
		overloads: {
			//UoMFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
			EmployeeFk:{
				type:FieldType.Lookup,
				lookupOptions:createLookup({
					dataServiceToken:TimekeepingEmployeeLookupService}
				)},
			JobCardRecordTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideJobCardRecordTypeLookupOverload(true),
			WorkOperationTypeFk: ResourceSharedLookupOverloadProvider.provideResourceWotFilterByPlantLookupOverload(true, 'PlantFk', ''),
		},
		labels: {
			...prefixAllTranslationKeys('cloud.common.', {
				DescriptionInfo: {key: 'entityDescription'},
				UomFk: {key: 'entityUoM'},
			}),
			...prefixAllTranslationKeys('basics.customize.', {
				JobCardRecordTypeFk: { key: 'jobcardrecordtype'}
			}),
			...prefixAllTranslationKeys('logistic.card.', {
				CardRecordFk: { key: 'cardRecord'},
				CardRecordDescription: { key: 'cardRecordDescription'},
				DispatchRecordFk: { key: 'dispatchRecord'},
				Quantity: { key: 'entityQuantity'},
				RecordNo: { key: 'recordNo'},
				ReservationId: { key: 'ReservationId'},
				AcceptedQuantity: { key: 'entityAcceptedQuantity'},
				DeliveredQuantity: { key: 'entityDeliveredQuantity'},
				WorkOperationTypeFk: { key: 'workOperationTypeFk'},
				EmployeeFk: { key: 'entityEmployee'},
			}),
		}
	},
} as IEntityInfo<ILogisticCardRecordEntity>);
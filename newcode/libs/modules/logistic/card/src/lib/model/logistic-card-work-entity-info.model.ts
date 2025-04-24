/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { LogisticCardWorkDataService } from '../services/logistic-card-work-data.service';
import { ILogisticCardWorkEntity } from '@libs/logistic/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { LogisticCardWorkValidationService } from '../services/logistic-card-work-validation.service';
import { createLookup, FieldType } from '@libs/ui/common';
import { TimekeepingEmployeeLookupService } from '@libs/timekeeping/shared';


export const LOGISTIC_CARD_WORK_ENTITY_INFO: EntityInfo = EntityInfo.create<ILogisticCardWorkEntity>({
	grid: {
		title: {key: 'logistic.card.cardWorkListTitle'},
	},
	form: {
		title: {key: 'logistic.card.cardWorkDetailTitle'},
		containerUuid: '2b6ca1c9b58d48d397d1ae04d3725bb5',
	},
	dataService: (ctx) => {
		return ctx.injector.get(LogisticCardWorkDataService);
	},
	validationService: ctx => ctx.injector.get(LogisticCardWorkValidationService),
	dtoSchemeId: {moduleSubModule: 'Logistic.Card', typeName: 'JobCardWorkDto'},
	permissionUuid: 'fc5cb34f5ec74473bdd9de8083d61037',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				// TODO: needs to be rechecked regarding the time domain in the new client. Seems the conversion is not working properly.
				attributes: ['EmployeeFk'/*, 'WorkStart', 'WorkEnd'*/, 'WorkDay', 'WorkBreak', 'WorkingMinutes', 'TotalTime'/*, 'SundryServiceFk'*/],
			}
		],
		// TODO: some lookups missing
		overloads: {
		//	SundryServiceFk:
			EmployeeFk:{
				type:FieldType.Lookup,
				lookupOptions:createLookup({
					dataServiceToken:TimekeepingEmployeeLookupService}
				)},
		},
		labels: {
			...prefixAllTranslationKeys('logistic.card.', {
				SundryServiceFk: { key: 'entitySundryServiceFk'},
				WorkStart: { key: 'entityWorkStart'},
				WorkEnd: { key: 'entityWorkEnd'},
				WorkDay: { key: 'entityWorkDay'},
				WorkBreak: { key: 'entityWorkBreak'},
				WorkingMinutes: { key: 'entityWorkingMinutes'},
				TotalTime: { key: 'entityTotalTime'},
				EmployeeFk: { key: 'entityEmployee'},
			}),
		}
	},
} as IEntityInfo<ILogisticCardWorkEntity>);
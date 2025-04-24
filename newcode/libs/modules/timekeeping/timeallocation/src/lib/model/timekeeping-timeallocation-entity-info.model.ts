/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { addUserDefinedDateTranslation, addUserDefinedNumberTranslation, addUserDefinedTextTranslation, prefixAllTranslationKeys } from '@libs/platform/common';
import { ITimeAllocationEntity } from './entities/time-allocation-entity.interface';
import { TimekeepingTimeallocationItemDataService } from '../services/timekeeping-timeallocation-item-data.service';
import { TimekeepingTimeallocationItemValidationService } from '../services/validations/timekeeping-timeallocation-item-validation.service';


export const TIMEKEEPING_TIMEALLOCATION_ENTITY_INFO: EntityInfo = EntityInfo.create<ITimeAllocationEntity> ({
	grid: {
		title: {key: 'timekeeping.timeallocation.timeallocationItemListTitle'},
		containerUuid: 'a3b5c55c64f74de89c84f8265b8cef42',
	},
	form: {

		title: { key: 'timekeeping.timeallocation.timeallocationItemDetailTitle' },
		containerUuid: 'd9ef33f2b9c04d63b5218ce7aa7236d2',
	},
	dataService: ctx => ctx.injector.get(TimekeepingTimeallocationItemDataService),
	validationService: ctx => ctx.injector.get(TimekeepingTimeallocationItemValidationService),
	dtoSchemeId: {moduleSubModule: 'Timekeeping.TimeAllocation', typeName: 'TimeAllocationDto'},
	permissionUuid: 'a3b5c55c64f74de89c84f8265b8cef42',
	layoutConfiguration: {
		groups: [
			{
				gid: 'default-group',
				attributes: ['RecordType','RecordFk','RecordDescription','RecordingFk','Rate','TotalProductiveHours','DistributedHoursTotal','DistributedHoursCurrentHeader', 'DistributedHoursOtherHeaders','ToDistribute','Comment','IsGenerated']
			},
			{
				gid: 'userDefTexts',
				attributes: ['UserDefinedText01','UserDefinedText02','UserDefinedText03','UserDefinedText04','UserDefinedText05','UserDefinedText06','UserDefinedText07','UserDefinedText08','UserDefinedText09','UserDefinedText10']
			},{
				gid: 'userDefNumbers',
				attributes: ['UserDefinedNumber01','UserDefinedNumber02','UserDefinedNumber03','UserDefinedNumber04','UserDefinedNumber05','UserDefinedNumber06','UserDefinedNumber07','UserDefinedNumber08','UserDefinedNumber09','UserDefinedNumber10']
			},{
				gid: 'userDefDates',
				attributes: ['UserDefinedDate01','UserDefinedDate02','UserDefinedDate03','UserDefinedDate04','UserDefinedDate05','UserDefinedDate06','UserDefinedDate07','UserDefinedDate08','UserDefinedDate09','UserDefinedDate10']
			}
		],
		overloads: {
			RecordType:{readonly:true},
			RecordFk:{readonly:true},
			RecordingFk:{readonly:true},
			TotalProductiveHours:{readonly:true},
			DistributedHoursTotal:{readonly:true},
			DistributedHoursCurrentHeader:{readonly:true},
			DistributedHoursOtherHeaders:{readonly:true},
			ToDistribute:{readonly:true},
			IsGenerated:{readonly:true}
		},
		labels: {
			...prefixAllTranslationKeys('timekeeping.timeallocation.', {
				RecordType: {key:'entityRecordType'},
				RecordFk: {key:'entityRecordFk'},
				RecordDescription:{key:'entityRecordDescription'},
				RecordingFk:{key:'entityRecordingFk'},
				TotalProductiveHours:{key:'entityTotalProductiveHours'},
				DistributedHoursTotal:{key:'entityDistributedHours'},
				DistributedHoursCurrentHeader:{key:'entityDistributedHoursCurrentHeader'},
				DistributedHoursOtherHeaders:{key:'entityDistributedHoursOtherHeaders'},
				ToDistribute:{key:'entityToDistribute'},
				Comment:{key:'comment'},
				IsGenerated:{key:'isgenerated'},
			}),
			...addUserDefinedTextTranslation({ UserDefinedText: {key: 'entityUserDefinedText',params: { 'p_0': 1 }} }, 10, 'UserDefinedText', '', 'userDefTextGroup'),
			...addUserDefinedNumberTranslation({ UserDefinedNumber: {key: 'entityUserDefinedNumber',params: { 'p_0': 1 }} }, 10, 'UserDefinedNumber', '', 'userDefNumberGroup'),
			...addUserDefinedDateTranslation({ UserDefinedDate: {key: 'entityUserDefDate',params: { 'p_0': 1 }} }, 10, 'UserDefinedDate', '', 'userDefDateGroup'),
			...prefixAllTranslationKeys('cloud.common.', {
				Rate:{key:'entityRate'},
			})
		}
	}
});
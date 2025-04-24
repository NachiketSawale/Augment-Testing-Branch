/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys, addUserDefinedTextTranslation, addUserDefinedNumberTranslation, addUserDefinedDateTranslation } from '@libs/platform/common';
import { ITimeAllocationHeaderEntity } from './entities/time-allocation-header-entity.interface';
import { TimekeepingTimeallocationHeaderDataService } from '../services/timekeeping-timeallocation-header-data.service';
import { BasicsCompanyLookupService, BasicsSharedTimeAllocationStatusLookupService } from '@libs/basics/shared';
import { createLookup, FieldType } from '@libs/ui/common';
import { ProjectSharedLookupService } from '@libs/project/shared';
import { TimekeepingRecordingLookupService } from '@libs/timekeeping/shared';
import { TimekeepingTimeallocationHeaderValidationService } from '../services/validations/timekeeping-timeallocation-header-validation.service';

export const TIMEKEEPING_TIMEALLOCATION_HEADER_ENTITY_INFO: EntityInfo = EntityInfo.create<ITimeAllocationHeaderEntity> ({
	grid: {
		title: {key: 'timekeeping.timeallocation.timeallocationHeaderListTitle'},
		containerUuid: 'ff09ff1314074aaf909b3e86c2d07c8c',
	},
	form: {
		title: { key: 'timekeeping.timeallocation.timeallocationHeaderDetailTitle' },
		containerUuid: '6ee25aa6370247a3bf908a58eeaa5e1d',
	},
	dataService: ctx => ctx.injector.get(TimekeepingTimeallocationHeaderDataService),
	validationService: ctx => ctx.injector.get(TimekeepingTimeallocationHeaderValidationService),
	dtoSchemeId: {moduleSubModule: 'Timekeeping.TimeAllocation', typeName: 'TimeAllocationHeaderDto'},
	permissionUuid: 'ff09ff1314074aaf909b3e86c2d07c8c',
	layoutConfiguration: {
		groups: [
			{
				gid: 'default-group',
				attributes: ['ProjectFk','JobFk','RecordingFk','AllocationDate','TimeAllocationStatusFk','CompanyFk','Allocationenddate',/*'DispatchHeaderFk', */'Comment']
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
			CompanyFk:{
				readonly:true,
				type:FieldType.Lookup,
				lookupOptions:createLookup({
					dataServiceToken:BasicsCompanyLookupService,
					displayMember:'Code',
					valueMember:'Id'}
				)},
			ProjectFk:{
				type: FieldType.Lookup,
				lookupOptions:  createLookup({
					dataServiceToken: ProjectSharedLookupService,
					showDescription: true,
					descriptionMember: 'ProjectNo',
				})
			},
			RecordingFk:{
				type: FieldType.Lookup,
				visible: true,
				lookupOptions:  createLookup({
					dataServiceToken: TimekeepingRecordingLookupService,
					showDescription: true,
					descriptionMember: 'Code',
				})
			},
			TimeAllocationStatusFk:{
				type: FieldType.Lookup,
				readonly:true,
				lookupOptions:  createLookup({
					dataServiceToken: BasicsSharedTimeAllocationStatusLookupService,
					showDescription: true,
					descriptionMember: 'Code',
				})
			},
		},
		labels: {
			...prefixAllTranslationKeys('timekeeping.timeallocation.', {
				ProjectFk: {key:'entityProjectFk'},
				JobFk: {key:'entityJobFk'},
				RecordingFk:{key:'entityRecordingFk'},
				AllocationDate:{key:'entityAllocationDate'},
				TimeAllocationStatusFk:{key:'timekeepingallocstatus'},
				Allocationenddate:{key:'entityAllocationenddate'},
				DispatchHeaderFk:{key:'entityDispatchHeaderFk'},
				Comment:{key:'comment'}
			}),
			...addUserDefinedTextTranslation({ UserDefinedText: {key: 'entityUserDefinedText',params: { 'p_0': 1 }} }, 10, 'UserDefinedText', '', 'userDefTextGroup'),
			...addUserDefinedNumberTranslation({ UserDefinedNumber: {key: 'entityUserDefinedNumber',params: { 'p_0': 1 }} }, 10, 'UserDefinedNumber', '', 'userDefNumberGroup'),
			...addUserDefinedDateTranslation({ UserDefinedDate: {key: 'entityUserDefDate',params: { 'p_0': 1 }} }, 10, 'UserDefinedDate', '', 'userDefDateGroup'),
			...prefixAllTranslationKeys('cloud.common.', {
				CompanyFk:{key:'entityCompany'},
			}),

		}
	}
});
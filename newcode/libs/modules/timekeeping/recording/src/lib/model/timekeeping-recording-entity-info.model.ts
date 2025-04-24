/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { TimekeepingRecordingDataService } from '../services/timekeeping-recording-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IRecordingEntity } from '@libs/timekeeping/interfaces';
import { createLookup, FieldType } from '@libs/ui/common';
import { BasicsCompanyLookupService } from '@libs/basics/shared';
import { TimekeepingEmployeeLookupService, TimekeepingPeriodLookupService, TimekeepingShiftLookupService } from '@libs/timekeeping/shared';
import { TimekeepingRecordingValidationService } from '../services/timekeeping-recording-validation.service';


 export const TIMEKEEPING_RECORDING_ENTITY_INFO: EntityInfo = EntityInfo.create<IRecordingEntity> ({
                grid: {
                    title: {key: 'timekeeping.recording' + '.recordingListTitle'},
                },
                form: {
			    title: { key: 'timekeeping.recording' + '.recordingDetailTitle' },
			    containerUuid: 'e252166b26c249da88abd3165e45e651',
		        },
                dataService: ctx => ctx.injector.get(TimekeepingRecordingDataService),
	             validationService: ctx => ctx.injector.get(TimekeepingRecordingValidationService),
                dtoSchemeId: {moduleSubModule: 'Timekeeping.Recording', typeName: 'RecordingDto'},
                permissionUuid: '1682021f88cb489c9edb67fd77ba0500',
					 layoutConfiguration: {
						 groups: [
							 {
							    gid: 'default-group',
								 attributes: ['Code','RubricCategoryFk','TimekeepingPeriodFk',/*'PlantFk',*/'CommentText','CompanyFk','Description','EmployeeFk','IsLive','PayrollYear','ShiftFk']
							 },
							 {
								 gid: 'userDefTexts',
								 attributes: ['UserDefinedText01','UserDefinedText02','UserDefinedText03','UserDefinedText04','UserDefinedText05']
							 },{
								 gid: 'userDefNumbers',
								 attributes: ['UserDefinedNumber01','UserDefinedNumber02','UserDefinedNumber03','UserDefinedNumber04','UserDefinedNumber05']
							 },{
								 gid: 'userDefDates',
								 attributes: ['UserDefinedDate01','UserDefinedDate02','UserDefinedDate03','UserDefinedDate04','UserDefinedDate05']
							 }
						 ],
						 overloads: {
							 CompanyFk:{
								 type:FieldType.Lookup,
								 lookupOptions:createLookup({
									 dataServiceToken:BasicsCompanyLookupService,
									 displayMember:'Code',
									 valueMember:'Id'}
								 )},
							 EmployeeFk:{
								 type:FieldType.Lookup,
								 lookupOptions:createLookup({
									 dataServiceToken:TimekeepingEmployeeLookupService,
									 displayMember:'Code',
									 valueMember:'Id'}
								 )},
							 ShiftFk:{
								 type:FieldType.Lookup,
								 lookupOptions:createLookup({
									 dataServiceToken:TimekeepingShiftLookupService,
									 displayMember:'Description',
									 valueMember:'Id'}
								 )},
							 RubricCategoryFk:{},
							 TimekeepingPeriodFk:{
								 type: FieldType.Lookup,
								 lookupOptions: createLookup({
									 dataServiceToken: TimekeepingPeriodLookupService,
								 })},
						 },
						 labels: {
							 ...prefixAllTranslationKeys('timekeeping.recording.', {
								 IsLive: {key:'entityIsLive'},
								 BreakDuration: {key:'breakduration'},
								 PayrollYear:{key:'payrollYear'},
								 SearchPattern:{key:''}
							 }),
							 ...prefixAllTranslationKeys('cloud.common.', {
								 Code: { key: 'entityCode' },
								 CommentText: { key: 'entityCommentText'},
								 Description:{key:'entityDescription'},
								 userDefTexts: {key: 'UserdefTexts'},
								 userDefNumbers: {key: 'UserdefNumbers'},
								 userDefDates: {key: 'UserdefDates'},
							 })
						 }
					 }
            });
/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType } from '@libs/ui/common';
import { TimekeepingEmployeePaymentGroupLookupService, TimeKeepingGroupLookupService, TimekeepingShiftLookupService } from '@libs/timekeeping/shared';
import { ICrewMemberEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingCrewMemberDataService } from '../services';
import { BasicsCompanyLookupService } from '@libs/basics/shared';


export const TimekeepingEmployeeCrewMemberModelEntityInfoModel: EntityInfo = EntityInfo.create<ICrewMemberEntity> ({
	grid: {
		title: {key: 'timekeeping.employee.crewMemberListTitle'},
	},
	form: {
		title: { key: 'timekeeping.employee.crewMemberDetailTitle' },
		containerUuid: '7edfbf3ed45849e5acc2d49cbd2eddb6',
	},
	dataService: ctx => ctx.injector.get(TimekeepingCrewMemberDataService),
	dtoSchemeId: {moduleSubModule: 'Timekeeping.Employee', typeName: 'CrewMemberDto'},
	permissionUuid: '41653191a89a4f279710b2b6bafd8a5b',

	layoutConfiguration: {
		groups: [
			{
				gid: 'default-group',
				attributes: ['Code','FirstName','FamilyName','Initials']
			},
			{
				gid: 'assignment',
				attributes: ['FromDateTime','ToDateTime','Comment']
			},
			{
				gid: 'company',
				attributes: ['CompanyFk', 'CompanyOperatingFk', 'ShiftFk', 'TimekeepingGroupFk', 'PaymentGroupFk']
			}
		],
		labels: {
			...prefixAllTranslationKeys('timekeeping.employee.', {
				FromDateTime: { key: 'entityFromDateTime'},
				ToDateTime: {key: 'entityToDateTime'},
				CompanyOperatingFk:{key:'entityOperatingCompany'},
				ShiftFk:{key:'entityShift'},
				FirstName: {key:'entityFirstName'},
				FamilyName: {key: 'entityFamilyName'},
				Initials: {key: 'entityInitials'},
				TimekeepingGroupFk: {key: 'entityTimekeepingGroup'},
				PaymentGroupFk: {key: 'entityPaymentGroupFk'}
			}),
			...prefixAllTranslationKeys('cloud.common.',{
				CompanyFk: {key: 'entityCompany'}
			})
		},
		overloads: {
			CompanyFk:{
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsCompanyLookupService,
				}),
				readonly: true
			},
			ShiftFk:{
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: TimekeepingShiftLookupService,
				}),
				readonly: true
				//TODO additional field
			},
			TimekeepingGroupFk:{
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: TimeKeepingGroupLookupService
				}),
				additionalFields:[
					{
						displayMember: 'DescriptionInfo',
						label: {
							key: 'timekeeping.employee.entityTimekeepingGroupDescription',
						},
						column: true,
						singleRow: true

					}
				],
				readonly: true
			},
			PaymentGroupFk:{
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: TimekeepingEmployeePaymentGroupLookupService,
				}),
				readonly: true
			},
			CompanyOperatingFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsCompanyLookupService
				}),
				readonly: true
			},
			Code: {readonly: true},
			FirstName: {readonly: true},
			FamilyName: {readonly: true},
			Initials: {readonly: true},
			FromDateTime: {readonly: true},
			ToDateTime: {readonly: true},
			Comment: {readonly: true}
		}
	}

});
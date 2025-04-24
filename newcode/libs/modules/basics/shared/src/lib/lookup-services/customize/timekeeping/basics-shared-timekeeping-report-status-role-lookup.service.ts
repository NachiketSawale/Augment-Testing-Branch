/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTimekeepingReportStatusRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTimekeepingReportStatusRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTimekeepingReportStatusRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTimekeepingReportStatusRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/timekeepingreportstatusrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'f2ef9de5d5c14bb19df4684cef6cca58',
			valueMember: 'Id',
			displayMember: 'ReportStatusRuleFk',
			gridConfig: {
				columns: [
					{
						id: 'ReportStatusRuleFk',
						model: 'ReportStatusRuleFk',
						type: FieldType.Quantity,
						label: { text: 'ReportStatusRuleFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ClerkRoleFk',
						model: 'ClerkRoleFk',
						type: FieldType.Quantity,
						label: { text: 'ClerkRoleFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}

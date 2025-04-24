/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupSimpleEntity, UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root',
})

/**
 * Lookup Service for InventoryProjectStockDowntimeLookupService
 */
export class InventoryProjectStockDowntimeLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<LookupSimpleEntity, TEntity> {
	public constructor() {
		super('ProjectStockDownTime', {
            valueMember: 'Id',
            displayMember: 'Description',
            uuid:'7175eefd68d440419b3b73ea2ea70ec2',
            gridConfig: {
                columns: [
                    {
                        id: 'desc',
                        model: 'Description',
                        type: FieldType.Text,
                        label: {
                            text:'Description',
                            key:'cloud.common.entityDescription'
                        },
                        sortable: true
                    },
                    {
                        id: 'startDate',
                        type: FieldType.Date,
                        label: {
                            text:'Start Date',
                         key:'basics.customize.startdate'
                        },
                        sortable: true
                    },
                    {
                        id: 'endDate',
                        type: FieldType.Date,
                        label: {
                            text:'Start Date',
                            key:'basics.customize.enddate'
                        },
                        sortable: true
                    },
                    {
                        id: 'clerkFk',
                        model: 'BasClerkFk',
                        type: FieldType.Code,
                        label: {
                            text:'Clerk',
                            key:'cloud.common.entityClerk'
                        },
                         sortable: true
                    }
                ],
            }
        });
	}
}

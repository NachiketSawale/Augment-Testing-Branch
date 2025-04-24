/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { ITelephoneNumberEntityGenerated } from '../../model/schema/models';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class BasicsSiteClerkLookupService<IEntity extends object > extends UiCommonLookupEndpointDataService <ITelephoneNumberEntityGenerated, IEntity >{
 public constructor(){
    super({httpRead: { route: 'basics/lookupdata/masternew/', endPointRead: 'getitembykey?lookup=clerk' }}, {
		idProperty: 'Id',
		valueMember: 'Id',
		displayMember: 'Description',
        showDialog: true,
		showGrid: true,
		gridConfig:{
			columns: [
				{
					id: 'Description',
					type: FieldType.Description,
					label: {text: 'Description', key:'cloud.common.entityDescription'},
					visible: true,
					readonly: true,
					sortable: true
				},
                {
                    id: 'Code',
                    type: FieldType.Code,
                    label: {text: 'Code',key: 'cloud.common.entityCode'},
                    visible: true,
					readonly: true,
					sortable: true
                },
                {
                    id: 'Title',
                    type: FieldType.Description,
                    label: {text: 'Title',key: 'basics.clerk.entityTitle'},
                    visible: true,
					readonly: true,
					sortable: true
                },
                {
                    id: 'FirstName',
                    type: FieldType.Description,
                    label: {text: 'First Name',key: 'cloud.common.contactFirstName'},
                    visible: true,
					readonly: true,
					sortable: true
                },
                {
                    id: 'FamilyName',
                    type: FieldType.Description,
                    label: {text: 'Family Name',key: 'cloud.common.contactFamilyName'},
                    visible: true,
					readonly: true,
					sortable: true
                },
                {
                    id: 'Email',
                    type: FieldType.Email,
                    label: {text: 'Email',key:  'cloud.common.email'},
                    visible: true,
					readonly: true,
					sortable: true
                },
                {
                    id: 'TelephoneNumber',
                    type: FieldType.Code,
                    label: {text: 'Telephone Number',key: 'cloud.common.telephoneNumber'},
                    visible: true,
					readonly: true,
					sortable: true
                },
                {
                    id: 'TelephoneMobil',
                    type: FieldType.Code,
                    label: {text: 'Telephone Mobil',key: 'cloud.common.mobile'},
                    visible: true,
					readonly: true,
					sortable: true
                },
                {
                    id: 'Department',
                    type: FieldType.Description,
                    label: {text: 'Department',key:'cloud.common.entityDepartment'},
                    visible: true,
					readonly: true,
					sortable: true
                },
                {
                    id: 'Company',
                    type: FieldType.Description,
                    label: {text:'Company',key: 'cloud.common.entityCompany'},
                    visible: true,
					readonly: true,
					sortable: true
                },
                {
                    id: 'Address',
                    type: FieldType.Description,
                    label: {text:'Address',key: 'cloud.common.address'},
                    visible: true,
					readonly: true,
					sortable: true
                },
                {
                    id: 'Signature',
                    type: FieldType.Description,
                    label: {text:'Signature',key:'basics.clerk.entitySignature'},
                    visible: true,
					readonly: true,
					sortable: true
                },
                {
                    id: 'Remark',
                    type: FieldType.Description,
                    label: {text:'Remark',key:'cloud.common.DocumentBackup_Remark'},
                    visible: true,
					readonly: true,
					sortable: true
                }
			]
		},
		uuid: '6df7ca744ab64644b2f791b1ee3dc831',
	});
}
}


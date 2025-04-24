/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IAddressEntityGenerated } from '../../model/schema/models';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class BasicsSiteAddressLookupService<IEntity extends object > extends UiCommonLookupEndpointDataService <IAddressEntityGenerated, IEntity >{
 public constructor(){
    super({httpRead: { route: 'basics/common/address/', endPointRead: 'create' }}, {
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Address',
			showGrid: true,
            showDialog : true,
            gridConfig:{
                columns: [
                    {
                        id: 'Street',
                        type: FieldType.Description,
                        label: {text: 'Street', key:'cloud.common.AddressDialogStreet'},
                        visible: true,
                        readonly: true,
                        sortable: true,
                        width: 100
        
                    },
                    {
                        id: 'Zip Code',
                        type: FieldType.Integer,
                        label: {text: 'ZipCode', key:'cloud.common.AddressDialogZipCode'},
                        visible: true,
                        readonly: true,
                        sortable: true,
                        width: 100
        
                    },
                    {
                        id: 'City',
                        type: FieldType.Description,
                        label: {text: 'City', key:'cloud.common.AddressDialogCity'},
                        visible: true,
                        readonly: true,
                        sortable: true,
                        width: 100
        
                    },
                    {
                        id: 'Country',
                        type: FieldType.Description,
                        label: {text: 'Country', key:'cloud.common.AddressDialogCountry'},
                        visible: true,
                        readonly: true,
                        sortable: true,
                        width: 100
        
                    },
                    {
                        id: 'Language',
                        type: FieldType.Code,
                        label: {text: 'Language', key:'cloud.common.entitylanguagefk'},
                        visible: true,
                        readonly: true,
                        sortable: true,
                        width: 100
        
                    },
                    {
                        id: 'Latitude',
                        type: FieldType.Description,
                        label: {text: 'Latitude', key:'cloud.common.AddressDialogLatitude'},
                        visible: true,
                        readonly: true,
                        sortable: true,
                        width: 100
        
                    },
                    {
                        id: 'Longitude',
                        type: FieldType.Description,
                        label: {text: 'Longitude', key:'cloud.common.AddressDialogLongitude'},
                        visible: true,
                        readonly: true,
                        sortable: true,
                        width: 100
        
                    },
                    {
                        id: 'Address Supplement',
                        type: FieldType.Code,
                        label: {text: 'Supplement', key:'cloud.common.entityAddressSupplement'},
                        visible: true,
                        readonly: true,
                        sortable: true,
                        width: 100
        
                    },
                    {
                        id: 'Manual Input',
                        type: FieldType.Code,
                        label: {text: 'AddressModified', key:'cloud.common.AddressDialogManualInput'},
                        visible: true,
                        readonly: true,
                        sortable: true,
                        width: 100
        
                    },
                    {
                        id: 'Address',
                        type: FieldType.Code,
                        label: {text: 'AddresAddresssModified', key:'cloud.common.AddressDialogAddress'},
                        visible: true,
                        readonly: true,
                        sortable: true,
                        width: 100
        
                    },
                ]
            },
            uuid: '0B02B050BEEE4BF1B368A471B401E79B',
		});
    }
}
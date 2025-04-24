/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {UiCommonLookupTypeDataService} from '../services/lookup-type-data.service';
import {SupplierEntity} from './entities/supplier-entity';
import {FieldType} from '../../model/fields';
import {LookupAlertTheme} from '../model/interfaces/lookup-alert.interface';


/**
 * Supplier lookup service
 */
@Injectable({
    providedIn: 'root'
})
export class UiCommonSupplierLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<SupplierEntity, TEntity> {
    public constructor() {
        super('supplier', {
            uuid: '1633a99dcc624899959bb6e5df7456e3',
            idProperty: 'Id',
            valueMember: 'Id',
            displayMember: 'Code',
            gridConfig: {
                uuid: '1633a99dcc624899959bb6e5df7456e3',
                columns: [
                    {id: 'code', model: 'Code', type: FieldType.Description, label: {text: 'Supplier Code'}, sortable: true, visible: true, readonly: true},
                    {id: 'desc', model: 'Description', type: FieldType.Description, label: {text: 'Supplier Description'}, sortable: true, visible: true, readonly: true},
                    {id: 'bpn1', model: 'BusinessPartnerName1', type: FieldType.Description, label: {text: 'Business Partner Name'}, sortable: true, visible: true, readonly: true},
                    {id: 'address', model: 'AddressLine', type: FieldType.Description, label: {text: 'Branch Address'}, sortable: true, visible: true, readonly: true},
                ]
            },
            dialogOptions: {
                headerText: 'Supplier Search Dialog',
                alerts: [
                    {theme: LookupAlertTheme.Warning, message: 'test warning'}
                ]
            },
            showDialog: true
        });

        this.paging.enabled = true;
        this.paging.pageCount = 20;
    }
}
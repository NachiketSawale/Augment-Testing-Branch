/*
 * Copyright(c) RIB Software GmbH
 */
import {Injectable} from '@angular/core';
import {FieldType, UiCommonLookupTypeDataService} from '@libs/ui/common';

//todo need extend IReqHeaderEntity
export interface IReqHeaderLookUpEntity{
    Id: number;
    Code:string;
    Description: string;
}
@Injectable({
    providedIn: 'root'
})
export class ProcurementShareReqLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IReqHeaderLookUpEntity, TEntity> {
    public constructor() {
        super('ReqHeaderLookupView', {
            uuid: 'b554e83b841c4941a3cb97f4c462f4d7',
            idProperty: 'Id',
            valueMember: 'Id',
            displayMember: 'Code',
            gridConfig: {
                columns: [
                    {
                        id: 'code',
                        model: 'Code',
                        type: FieldType.Code,
                        label: { text: 'Code', key: 'cloud.common.entityCode' },
                        sortable: true,
                        visible: true,
                        readonly: true
                    },
                    {
                        id: 'companyCode',
                        model: 'CompanyCode',
                        type: FieldType.Code,
                        label: { text: 'Company Code', key: 'cloud.common.entityCompanyCode' },
                        sortable: true,
                        visible: true,
                        readonly: true
                    },
                    {
                        id: 'companyName',
                        model: 'CompanyName',
                        type: FieldType.Description,
                        label: { text: 'Company Name', key: 'cloud.common.entityCompanyName' },
                        sortable: true,
                        visible: true,
                        readonly: true
                    }
                ]
            },
            dialogOptions: {
                headerText: {
                    text: 'Assign Basis Requisition',
                    key: 'procurement.common.reqHeaderUpdateInfo'
                }
            },
            showDialog: true
        });
    }
}
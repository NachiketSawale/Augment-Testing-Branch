/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { FieldType, IGridConfiguration, UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';
import { IBilHeaderEntity } from '@libs/sales/interfaces';
@Injectable({
    providedIn: 'root'
})

/**
 * Sales Common Bill Dialog V2 Lookup Service.
 */
export class SalesCommonBillsDialogV2LookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<IBilHeaderEntity, TEntity> {
    public configuration!: IGridConfiguration<IBilHeaderEntity>;
    public constructor() {
        super('salesbillingv2', {
            uuid: '0d39249367da4e79a5faca8834699e9b',
            valueMember: 'Id',
            displayMember: 'BillNo',
            gridConfig: {
                columns: [
                    {
                        id: 'BillNo',
                        model: 'BillNo',
                        type: FieldType.Code,
                        label: { text: 'BillNo', key: 'sales.billing.entityBillNo' },
                        sortable: true,
                        visible: true
                    },
                    {
                        id: 'Description',
                        model: 'DescriptionInfo.Translated',
                        type: FieldType.Translation,
                        label: { text: 'Description', key: 'cloud.common.entityDescription' },
                        sortable: true,
                        visible: true
                    },
                ],
            },
            dialogOptions: {
                headerText: {
                    text: 'Assign A Bill',
                    key: 'sales.common.dialogTitleAssignBill',
                }
            },
            showDialog: true
        });
    }
}

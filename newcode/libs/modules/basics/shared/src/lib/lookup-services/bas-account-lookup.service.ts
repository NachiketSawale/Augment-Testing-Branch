/*
 * Copyright(c) RIB Software GmbH
 */
import {Injectable} from '@angular/core';
import {FieldType, UiCommonLookupTypeLegacyDataService} from '@libs/ui/common';
import {BasAccountEntity} from './entities/bas-account-entity';


/*
 * Procurement Structure Account
 */
@Injectable({
    providedIn: 'root'
})
export class BasicsSharedBasAccountLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<BasAccountEntity, TEntity> {
    public constructor() {
        super('BasAccount', {
            uuid: 'ae7ce2f0f1d24bfc91d6300b18e636ad',
            valueMember: 'Id',
            displayMember: 'Code',
            gridConfig: {
                columns: [
                    {
                        id: 'code',
                        model: 'Code',
                        type: FieldType.Code,
                        label: {
                            text: 'Code',
                            key: 'cloud.common.entityCode'
                        },
                        visible: true,
                        sortable: false
                    },
                    {
                        id: 'desc',
                        model: 'DescriptionInfo',
                        type: FieldType.Translation,
                        label: {
                            text: 'Description',
                            key: 'cloud.common.entityDescription'
                        },
                        visible: true,
                        sortable: false
                    },
                    {
                        id: 'isBalanceSheet',
                        model: 'IsBalanceSheet',
                        type: FieldType.Boolean,
                        label: {
                            text: 'Is Balance Sheet',
                            key: 'cloud.common.isBalanceSheet'
                        },
                        visible: true,
                        sortable: false
                    },
                    {
                        id: 'isProfitAndLoss',
                        model: 'IsProfitAndLoss',
                        type: FieldType.Boolean,
                        label: {
                            text: 'Is Profit And Loss',
                            key: 'cloud.common.isProfitAndLoss'
                        },
                        visible: true,
                        sortable: false
                    },
                    {
                        id: 'isCostCode',
                        model: 'IsCostCode',
                        type: FieldType.Boolean,
                        label: {
                            text: 'Is Cost Code',
                            key: 'cloud.common.isCostCode'
                        },
                        visible: true,
                        sortable: false
                    },
                    {
                        id: 'isRevenueCode',
                        model: 'IsRevenueCode',
                        type: FieldType.Boolean,
                        label: {
                            text: 'Is Revenue Code',
                            key: 'cloud.common.isRevenueCode'
                        },
                        visible: true,
                        sortable: false
                    }
                ]
            }
        });
    }
}
/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { IPesSelfBillingEntity } from '../entities/pes-self-billing-entity.interface';
import { ProcurementModule } from '@libs/procurement/shared';
import { FieldType, createLookup } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ProcurementPesSelfbillingLookupService } from '../../services/lookups/procurement-pes-selfbilling-lookup.service';
import { ProcurementPesSelfbillingDetailDataService } from '../../services/procurement-pes-selfbilling-detail-data.service';

/**
 * The Procurement Pes Selfbilling Detail Entity Info
 */
export const PROCUREMENT_PES_SELFBILLING_DETAIL_ENTITY_INFO: EntityInfo = EntityInfo.create<IPesSelfBillingEntity>({
    grid: false,
    form: {
        title: { key: 'procurement.pes.selfBilling.selfBillingDetailTitle' },
        containerUuid: '94247a5009e24edcbb2e551096631424',
    },
    dataService: ctx => ctx.injector.get(ProcurementPesSelfbillingDetailDataService),
    dtoSchemeId: { moduleSubModule: ProcurementModule.Pes, typeName: 'PesSelfBillingDto' },
    permissionUuid: '54f637c8db0f432b8fdcd32f27e1f950',
    layoutConfiguration: {
        groups: [
            {
                gid: 'baseGroup',
                title: {
                    key: 'cloud.common.entityProperties',
                    text: 'Basic Data',
                },
                attributes: [
                    'Code', 'SbhStatusFk', 'BillDate', 'Description', 'DeliveredFromDate', 'DeliveredDate', 'TaxNo', 'VatNo', 'Responsible', 'Comment', 'Remark', 'UserDefinedText1',
                    'UserDefinedText2', 'UserDefinedText3', 'UserDefinedText4', 'UserDefinedText5',
                    'UserDefinedDate1', 'UserDefinedDate2', 'UserDefinedDate3', 'UserDefinedDate4',
                    'UserDefinedDate5', 'UserDefinedMoney1', 'UserDefinedMoney2', 'UserDefinedMoney3',
                    'UserDefinedMoney4', 'UserDefinedMoney5', 'IsProgress'],
            },
        ],
        overloads: {
            SbhStatusFk: {
                readonly: true,
                type: FieldType.Lookup,
                lookupOptions: createLookup({
                    dataServiceToken: ProcurementPesSelfbillingLookupService,
                    readonly: true
                })
            },
            'Code': {
                maxLength: 16
            },
            'Description': {
                maxLength: 252
            },
            'TaxNo': {
                maxLength: 252
            },
            'VatNo': {
                maxLength: 252
            },
            'Responsible': {
                maxLength: 255
            },
            'Comment': {
                maxLength: 255
            },
            'UserDefinedText1': {
                maxLength: 252
            },
            'UserDefinedTextt2': {
                maxLength: 252
            },
            'UserDefinedText3': {
                maxLength: 252
            },
            'UserDefinedText4': {
                maxLength: 252
            },
            'UserDefinedText5': {
                maxLength: 252
            }
        },
        labels: {
            ...prefixAllTranslationKeys('procurement.pes.', {
                SbhStatusFk: {
                    key: 'selfBilling.sbhStatus',
                    text: 'Status',
                },
                BillDate: {
                    key: 'selfBilling.billDate',
                    text: 'Bill Date',
                },
                DeliveredFromDate: {
                    key: 'selfBilling.deliveredfromDate',
                    text: 'Delivered From Date',
                },
                DeliveredDate: {
                    key: 'selfBilling.deliveredDate',
                    text: 'Delivered Date',
                },
                TaxNo: {
                    key: 'selfBilling.taxNo',
                    text: 'Tax No.',
                },
                VatNo: {
                    key: 'selfBilling.vatNo',
                    text: 'Vat No.',
                },
                UserDefinedText1: {
                    key: 'selfBilling.userDefinedText1',
                    text: 'User Defined Text1',
                },
                UserDefinedText2: {
                    key: 'selfBilling.userDefinedText2',
                    text: 'User Defined Text2',
                },
                UserDefinedText3: {
                    key: 'selfBilling.userDefinedText3',
                    text: 'User Defined Text3',
                },
                UserDefinedText4: {
                    key: 'selfBilling.userDefinedText4',
                    text: 'User Defined Text4',
                },
                UserDefinedText5: {
                    key: 'billingSchemaFinal',
                    text: 'User Defined Text5',
                },
                UserDefinedDate1: {
                    key: 'selfBilling.userDefinedDate1',
                    text: 'User defined Date1',
                },
                UserDefinedDate2: {
                    key: 'selfBilling.userDefinedDate2',
                    text: 'User defined Date2',
                },
                UserDefinedDate3: {
                    key: 'selfBilling.userDefinedDate3',
                    text: 'User defined Date3',
                },
                UserDefinedDate4: {
                    key: 'selfBilling.userDefinedDate4',
                    text: 'User defined Date4',
                },
                UserDefinedDate5: {
                    key: 'selfBilling.userDefinedDate5',
                    text: 'User defined Date5',
                },
                UserDefinedMoney1: {
                    key: 'selfBilling.userDefinedMoney1',
                    text: 'User defined Money1',
                },
                UserDefinedMoney2: {
                    key: 'selfBilling.userDefinedMoney2',
                    text: 'User defined Money2',
                },
                UserDefinedMoney3: {
                    key: 'selfBilling.userDefinedMoney3',
                    text: 'User defined Money3',
                },
                UserDefinedMoney4: {
                    key: 'selfBilling.userDefinedMoney4',
                    text: 'User defined Money4',
                },
                UserDefinedMoney5: {
                    key: 'selfBilling.userDefinedMoney5',
                    text: 'User defined Money5',
                },
                IsProgress: {
                    key: 'selfBilling.selfBillingIsProgress',
                    text: 'Is Progress',
                },

            }),
            ...prefixAllTranslationKeys('cloud.common.', {
                Code: {
                    key: 'entityCode',
                    text: 'Code',
                },
                Description: {
                    key: 'entityDescription',
                    text: 'Description',
                },
                Responsible: {
                    key: 'entityResponsible',
                    text: 'Responsible',
                },
                Comment: {
                    key: 'entityComment',
                    text: 'Comments',
                },
                Remark: {
                    key: 'entityRemark',
                    text: 'Remark',
                },
            }),
        },
    }
} as IEntityInfo<IPesSelfBillingEntity>);




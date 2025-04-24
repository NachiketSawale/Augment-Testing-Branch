import { Injectable } from '@angular/core';
import { createLookup, FieldOverloadSpec, FieldType, ILayoutConfiguration, ILayoutGroup } from '@libs/ui/common';
import { ITransactionEntity } from '@libs/sales/interfaces';
import { BasicsShareControllingUnitLookupService, BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { SalesBillingLabels } from '../../model/sales-billing-labels.class';

@Injectable({
    providedIn: 'root',
})

/**
 * Sales billing Transaction Layout service
 */
export class SalesBillingTransactionLayoutService {
    public generateLayout(): ILayoutConfiguration<ITransactionEntity> {
        const layoutConfig: ILayoutConfiguration<ITransactionEntity> = {
            groups: [
                {
                    gid: 'basicData',
                    title: {
                        key: 'cloud.common.entityProperties',
                        text: 'Basic Data',
                    },
                    attributes: ['DocumentType', 'Documentno', 'LineType', 'Currency', 'VoucherNumber', 'VoucherDate', 'PostingNarritive', 'PostingDate', 'NetDuedate', 'DiscountDuedate', 'DiscountAmount', 'Debtor', 'DebtorGroup', 'BusinesspostingGroup', 'AccountReceiveable', 'NominalAccount', 'Amount', 'Quantity', 'IsDebit', 'VatAmount', 'VatCode', 'IsProgress', 'OrderNumber', 'AmountAuthorized', 'ControllingUnitCode', 'ControllingUnitAssign01', 'ControllingunitAssign01desc', 'ControllingUnitAssign01Comment', 'ControllingUnitAssign02', 'ControllingunitAssign02desc', 'ControllingUnitAssign02Comment', 'ControllingUnitAssign03', 'ControllingunitAssign03desc', 'ControllingUnitAssign03Comment', 'ControllingUnitAssign04', 'ControllingunitAssign04desc', 'ControllingUnitAssign04Comment', 'ControllingUnitAssign05', 'ControllingunitAssign05desc', 'ControllingUnitAssign05Comment', 'ControllingUnitAssign06', 'ControllingunitAssign06desc', 'ControllingUnitAssign06Comment', 'ControllingUnitAssign07', 'ControllingunitAssign07desc', 'ControllingUnitAssign07Comment', 'ControllingUnitAssign08', 'ControllingunitAssign08desc', 'ControllingUnitAssign08Comment', 'ControllingUnitAssign09', 'ControllingunitAssign09desc', 'ControllingUnitAssign09Comment', 'ControllingUnitAssign10', 'ControllingunitAssign10desc', 'ControllingUnitAssign10Comment', 'IsSuccess', 'TransactionId', 'HandoverId', 'ReturnValue', 'LineNo', 'Assetno', 'PostingType', 'CodeRetention', 'PaymentTermFk', 'NominalDimension', 'NominalDimension2', 'NominalDimension3', 'ControllinggrpsetFk', 'ItemReference', 'ExtOrderNo', 'NominalAccountFi', 'IsCanceled', 'TaxCodeFk', 'TaxCodeMatrixCode', 'VatGroupFk', 'ControllingUnitIcFk', 'BilItemDescription', 'LineReference'],
                },
            ],
            labels: {
                ...SalesBillingLabels.getSalesBillingLabels()
            },
            overloads: {
                PaymentTermFk: BasicsSharedLookupOverloadProvider.providePaymentTermLookupOverload(true),
                ControllinggrpsetFk: {
                    form: {
                        visible: false
                    },
                    grid: {
                        // Todo - custom formatter controllingStructureGrpSetDTLActionProcessor
                    },
                    readonly: true
                },
                TaxCodeFk: BasicsSharedLookupOverloadProvider.provideTaxCodeListLookupOverload(true),
                VatGroupFk: BasicsSharedCustomizeLookupOverloadProvider.provideVATGroupReadonlyLookupOverload(),
                ControllingUnitIcFk: {
                    //TODO navigator                    
                    readonly: true,
                    type: FieldType.Lookup,
                    lookupOptions: createLookup({
                        dataServiceToken: BasicsShareControllingUnitLookupService,
                    }),
                    additionalFields: [
                        {
                            id: 'entityClearingControllingUnit',
                            displayMember: 'DescriptionInfo.Translated',
                            label: {
                                key: 'basics.company.entityClearingControllingUnitDesc',
                                text: 'Clearing Controlling Unit Description',
                            },
                            column: true,
                            singleRow: true,
                        },
                    ],
                },
            },
        };
        this.addReadOnlyToOverloads(layoutConfig);
        return layoutConfig;
    }

    private addReadOnlyToOverloads<T extends ITransactionEntity>(layoutConfig: ILayoutConfiguration<T>): void {

        if (!layoutConfig.overloads) {
            layoutConfig.overloads = {} as { [key in keyof Partial<T>]: FieldOverloadSpec<T> };
        }
        const overloads = layoutConfig.overloads as { [key in keyof Partial<T>]: FieldOverloadSpec<T> };

        (layoutConfig.groups as ILayoutGroup<T>[]).forEach(group => {
            group.attributes.forEach(attribute => {
                if (!overloads[attribute as keyof T]) {
                    overloads[attribute as keyof T] = { readonly: true } as FieldOverloadSpec<T>;
                } else {
                    overloads[attribute as keyof T] = { ...overloads[attribute as keyof T], readonly: true } as FieldOverloadSpec<T>;
                }
            });
        });
    }
}
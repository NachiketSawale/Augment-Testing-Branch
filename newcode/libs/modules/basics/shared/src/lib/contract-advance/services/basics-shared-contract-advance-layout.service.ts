/*
 * Copyright(c) RIB Software GmbH
 */
import {Injectable} from '@angular/core';
import {createLookup, FieldType, ILayoutConfiguration} from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedPaymentTermLookupService
} from '../../lookup-services/payment-term-lookup.service';
/**
 * advance layout service
 */
@Injectable({
    providedIn: 'root',
})
export class BasicsSharedContractAdvanceLayout {

    public async generateConfig<T extends object>(): Promise<ILayoutConfiguration<T>> {
        return <ILayoutConfiguration<T>>{
            groups: [
                {
                    gid: 'basicData',
                    title: {
                        text: 'Basic Data',
                        key: 'cloud.common.entityProperties'
                    },
                    attributes: [
                        'Description',
                        'DateDue',
                        'AmountDue',
                        'PercentProrata',
                        'DateDone',
                        'AmountDone',
                        'CommentText',
                        'Userdefined1',
                        'Userdefined2',
                        'Userdefined3',
                        'Userdefined4',
                        'Userdefined5',
                        'AmountDueOc',
                        'AmountDoneOc',
                        'PaymentTermFk',
                    ]
                }
            ],
            labels: {
                ...prefixAllTranslationKeys('cloud.common.', {
                    Description: {key: 'entityDescription', text: 'Description'},
                    CommentText: {key: 'entityCommentText', text: 'Comment'},
                }),
                ...prefixAllTranslationKeys('procurement.common.', {
                    PaymentTermFk: {key: 'paymentTerm', text: 'Payment Term'}
                }),
                ...prefixAllTranslationKeys('procurement.contract.', {
                    DateDue: {key: 'entityDateDue', text: 'Date Due'},
                    AmountDue: {key: 'entityAmountDue', text: 'Amount Due'},
                    PercentProrata: {key: 'entityPercentProrata', text: 'Percent Prorata'},
                    DateDone: {key: 'entityDateDone', text: 'Date Done'},
                    AmountDone: {key: 'entityAmountDone', text: 'Amount Done'},
                    AmountDueOc: {key: 'entityAmountDueOc', text: 'Amount Due Oc'},
                    AmountDoneOc: {key: 'entityAmountDoneOc', text: 'Amount Done Oc'},
                    Userdefined1: {key: 'entityUserDefined1', text: 'User Defined 1'},
                    Userdefined2: {key: 'entityUserDefined2', text: 'User Defined 2'},
                    Userdefined3: {key: 'entityUserDefined3', text: 'User Defined 3'},
                    Userdefined4: {key: 'entityUserDefined4', text: 'User Defined 4'},
                    Userdefined5: {key: 'entityUserDefined5', text: 'User Defined 5'},
                })
            },
            overloads: {
                PaymentTermFk: {
                    type: FieldType.Lookup,
                    lookupOptions: createLookup({
                        dataServiceToken: BasicsSharedPaymentTermLookupService,
                        showClearButton: true,
                        showDescription: true,
                        descriptionMember: 'Description',
                    }),
                },
            }
        };
    }
}
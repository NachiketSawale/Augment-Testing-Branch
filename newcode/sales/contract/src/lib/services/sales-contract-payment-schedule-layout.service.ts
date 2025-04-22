/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedProcurementPaymentScheduleStatusLookupService } from '@libs/basics/shared';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { IBasicsCustomizeProcurementPaymentScheduleStatusEntity } from '@libs/basics/interfaces';
import {
    SalesContractPaymentScheduleExtendedLayoutService
} from './sales-contract-payment-schedule-extended-layout.service';
import { IOrdPaymentScheduleEntity } from '@libs/sales/interfaces';

/**
 * Procurement common payment schedule layout service token
 */
export const SALES_CONTRACT_PAYMENT_SCHEDULE_LAYOUT_TOKEN = new InjectionToken<SalesContractPaymentScheduleLayoutService>('SalesContractPaymentScheduleLayoutService');

/**
 * Sales contract payment schedule layout service
 */
@Injectable({
    providedIn: 'root'
})
export class SalesContractPaymentScheduleLayoutService extends SalesContractPaymentScheduleExtendedLayoutService<IOrdPaymentScheduleEntity> {
    protected constructor() {
        const customLayout = {
            groups: [{
                gid: 'basicData',
                title: {text: 'Basic Data', key: 'cloud.common.entityProperties'},
                attributes: [
                    'Description',
                    'PrcPsStatusFk'
                ]
            }],
            labels: {
                ...prefixAllTranslationKeys('procurement.common.', {
                    'Description': {text: 'Description', key: 'paymentDescription'}
                }),
                ...prefixAllTranslationKeys('cloud.common.', {
                    'PrcPsStatusFk': {text: 'Status', key: 'entityStatus'}
                })
            },
            overloads: {
                PrcPsStatusFk: {
                    type: FieldType.Lookup,
                    lookupOptions: createLookup<IOrdPaymentScheduleEntity, IBasicsCustomizeProcurementPaymentScheduleStatusEntity>({
                        dataServiceToken: BasicsSharedProcurementPaymentScheduleStatusLookupService
                    })
                }
            }
        };
        super(customLayout as ILayoutConfiguration<IOrdPaymentScheduleEntity>);
    }
}
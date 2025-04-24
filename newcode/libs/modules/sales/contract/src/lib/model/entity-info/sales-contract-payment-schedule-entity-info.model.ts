/*
 * Copyright(c) RIB Software GmbH
 */

import { ProviderToken } from '@angular/core';
import { BaseValidationService } from '@libs/platform/data-access';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import {SalesContractPaymentScheduleHeaderComponent} from '../../components/payment-schedule/payment-schedule-header.component';
import {
    SALES_CONTRACT_PAYMENT_SCHEDULE_LAYOUT_TOKEN
} from '../../services/sales-contract-payment-schedule-layout.service';
import {SalesSharedPaymentScheduleHeaderInfoToken} from '../sales-contract-payment-schedule-header-info.interface';

/**
 * Create sales contract payment schedule entity info
 */
export class SalesContractCommonPaymentScheduleEntityInfo {
    public static create<
        T extends IOrdPaymentScheduleEntity,
        PT extends IEntityIdentification,
        PU extends CompleteIdentification<PT>>
    (config: {
        permissionUuid: string,
        formUuid: string,
        behaviorToken: ProviderToken<IEntityContainerBehavior<IGridContainerLink<T>, T>>
        dataServiceToken: ProviderToken<SalesContractPaymentScheduleDataServiceInterface<T, PT, PU>>
	     validationServiceToken?: ProviderToken<BaseValidationService<T>>,
    }) {
        return PaymentScheduleEntityInfo.create<T, PT, PU>({
            title: {text: 'Payment Schedule', key: 'procurement.common.paymentSchedule.paymentScheduleContainerGridTitle'},
            formTitle: {text: 'Payment Schedule Detail', key: 'procurement.common.paymentSchedule.paymentScheduleContainerFormTitle'},
            permissionUuid: config.permissionUuid,
            formUuid: config.formUuid,
            dtoSchemeConfig: {moduleSubModule: 'Sales.Contract', typeName: 'OrdPaymentScheduleDto'},
            behaviorToken: config.behaviorToken,
            dataServiceToken: config.dataServiceToken,
            validationServiceToken: config.validationServiceToken,
            layoutServiceToken: SALES_CONTRACT_PAYMENT_SCHEDULE_LAYOUT_TOKEN,
            topLeftContainerType: SalesContractPaymentScheduleHeaderComponent,
            topLeftContainerProviders: [{
                provide: SalesSharedPaymentScheduleHeaderInfoToken,
                useValue: {
                    dataServiceToken: config.dataServiceToken
                }
            }]
        });
    }
}



/*
 * Copyright(c) RIB Software GmbH
 */

import {
    EntityInfo,
    IEntityTreeConfiguration,
    CompositeGridConfigurationToken,
    CompositeGridContainerComponent
} from '@libs/ui/business-base';
import { ILayoutConfiguration } from '@libs/ui/common';
import { StaticProvider, Type } from '@angular/core';
import { IEntitySchemaId } from '@libs/platform/data-access';
import { OptionallyAsyncResource, Translatable } from '@libs/platform/common';
import {
    PaymentScheduleDataServiceInterface,
    SalesContractPaymentScheduleDataServiceInterface
} from '../interface/sales-contract-payment-schedule-data-service.interface';
import { IOrdPaymentScheduleEntity } from '@libs/sales/interfaces';

/**
 * Create common payment schedule entity info
 */
export class PaymentScheduleEntityInfo {
    public static create<
        T extends IOrdPaymentScheduleEntity,
        PT extends IEntityIdentification,
        PU extends CompleteIdentification<PT>>
    (config: {
        title: Translatable,
        formTitle: Translatable,
        permissionUuid: string,
        formUuid: string,
        dtoSchemeConfig: IEntitySchemaId,
        behaviorToken: ProviderToken<IEntityContainerBehavior<IGridContainerLink<T>, T>>,
        dataServiceToken: ProviderToken<PaymentScheduleDataServiceInterface<T, PT, PU>>,
        layoutServiceToken: ProviderToken<{ generateLayout(): Promise<ILayoutConfiguration<T>> }>,
        validationServiceToken?: ProviderToken<BaseValidationService<T>>,
        treeConfiguration?: OptionallyAsyncResource<IEntityTreeConfiguration<T>> | boolean,
        topLeftContainerType: Type<unknown>,
        topLeftContainerProviders: StaticProvider[]
    }) {
        return EntityInfo.create<T>({
            grid: {
                title: config.title,
                behavior: ctx => ctx.injector.get(config.behaviorToken),
                treeConfiguration: config.treeConfiguration,
                containerType: CompositeGridContainerComponent,
                providers: [{
                    provide: CompositeGridConfigurationToken,
                    useValue: {
                        maxTopLeftLength: 120,
                        topLeftContainerType: config.topLeftContainerType,
                        providers: config.topLeftContainerProviders
                    }
                }]
            },
            form: {
                containerUuid: config.formUuid,
                title: config.formTitle
            },
            dtoSchemeId: config.dtoSchemeConfig,
            permissionUuid: config.permissionUuid,
            dataService: ctx => ctx.injector.get(config.dataServiceToken),
            //validationService: ctx => ctx.injector.get(config.validationServiceToken),
            layoutConfiguration: ctx => ctx.injector.get(config.layoutServiceToken).generateLayout()
        });
    }
}
/*
 * Copyright(c) RIB Software GmbH
 */

import {Observable} from 'rxjs';
import {CompleteIdentification} from '@libs/platform/common';
import {IEntityProxy, IReadonlyParentService} from '@libs/procurement/shared';
import {IPrcHeaderContext} from './prc-header-context.interface';
import { IPrcHeaderEntity } from '@libs/procurement/interfaces';

/**
 * The interface for procurement header service
 */
export interface IPrcHeaderDataService<T extends object, U extends CompleteIdentification<T>> extends IReadonlyParentService<T, U> {

    /**
     * Entity proxy which is used to handle common logic like comparison, trace modification and notify modification
     */
    get entityProxy(): IEntityProxy<T>;

    /**
     * Payment term changed
     */
    get paymentTermChanged$(): Observable<IPaymentTermChangedEvent>;

    /**
     * Exchange rate changed
     */
    get exchangeRateChanged$(): Observable<IExchangeRateChangedEvent>;

    /**
     * Readonly state changed
     */
    get readonlyChanged$():Observable<boolean>;

    /**
     * Get procurement header context
     */
    getHeaderContext(): IPrcHeaderContext;

    /**
     * Get Procurement header entity
     */
    getHeaderEntity(): IPrcHeaderEntity;

    /**
     * Update total lead time when LeadTime field changed in item container
     * @param value
     */
    updateTotalLeadTime(value: number): void;
}

export interface IPaymentTermChangedEvent {
    paymentTermFiFk?: number | null;
    paymentTermPaFk?: number;
}

export interface IExchangeRateChangedEvent {
    exchangeRate: number;
    currencyFk: number;
    isCurrencyChanged: boolean;
}
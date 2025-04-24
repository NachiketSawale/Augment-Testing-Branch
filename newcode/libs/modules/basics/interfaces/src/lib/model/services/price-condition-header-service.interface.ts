/*
 * Copyright(c) RIB Software GmbH
 */
import {IEntitySelection, IParentRole} from '@libs/platform/data-access';
import {CompleteIdentification} from '@libs/platform/common';
import {Observable} from 'rxjs';
/**
 * service type
 */
export type IReadonlyParentService<T extends object, U extends CompleteIdentification<T>> = IParentRole<T, U> & IEntitySelection<T>;

export interface IBasicsPriceConditionHeaderService<T extends object,U extends CompleteIdentification<T>>  extends IReadonlyParentService<T, U>{
    /**
     * Emitter for priceCondition change
     */
    get priceConditionChanged$(): Observable<number | null>;
}
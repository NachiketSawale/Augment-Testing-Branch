/*
 * Copyright(c) RIB Software GmbH
 */

import {Observable} from 'rxjs';
import {IEntityContext} from '@libs/platform/common';
import {ConcreteFieldOverload} from '../layout-configuration/concrete-field-overload.type';

/**
 * Additional options for dynamic domain
 */
export interface IAdditionalDynamicOptions<T extends object> {

    /**
     * Returns an observable source of concrete field overload configuration object
     */
    readonly overload: (ctx: IEntityContext<T>) => Observable<ConcreteFieldOverload<T>>;

}
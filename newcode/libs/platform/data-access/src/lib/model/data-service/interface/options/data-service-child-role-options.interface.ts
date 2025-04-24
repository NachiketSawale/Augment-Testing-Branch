/*
 * Copyright(c) RIB Software GmbH
 */

import {IEntitySelection} from '../entity-selection.interface';
import {IParentRole} from '../parent-role.interface';
import {CompleteIdentification, LazyInjectionToken } from '@libs/platform/common';
import { IDataServiceRoleOptions } from './data-service-role-options.interface';


/**
 * Interface providing the essential options for child dataservices
 * @typeParam T -  entity type handled by the data service
 */
export interface IDataServiceChildRoleOptions<T, PT extends object, PU extends CompleteIdentification<PT>> extends IDataServiceRoleOptions<T> {
	readonly parent: (IParentRole<PT, PU> & IEntitySelection<PT>) | LazyInjectionToken<IParentRole<PT, PU> & IEntitySelection<PT>>;
}

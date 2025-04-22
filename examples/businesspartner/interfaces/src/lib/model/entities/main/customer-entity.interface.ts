/*
 * Copyright(c) RIB Software GmbH
 */

import { ICustomerEntityGenerated } from './customer-entity-generated.interface';

export interface ICustomerEntity extends ICustomerEntityGenerated {
    RubricCategoryId?: number | null;
}

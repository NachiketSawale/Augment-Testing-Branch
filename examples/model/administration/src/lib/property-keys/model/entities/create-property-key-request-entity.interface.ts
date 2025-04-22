/*
 * Copyright(c) RIB Software GmbH
 */

import { ICreatePropertyKeyRequestEntityGenerated } from './create-property-key-request-entity-generated.interface';

export interface ICreatePropertyKeyRequestEntity extends ICreatePropertyKeyRequestEntityGenerated {

	DefaultValue?: string | number | boolean | Date;
}

/*
 * Copyright(c) RIB Software GmbH
 */

import { AddressEntity, TelephoneEntity } from '@libs/basics/shared';
import { ISubsidiaryEntityGenerated } from './subsidiary-entity-generated.interface';

export interface ISubsidiaryEntity extends ISubsidiaryEntityGenerated {
    AddressItem?: AddressEntity | null;
    TelephoneNumberItem?: TelephoneEntity | null;
}

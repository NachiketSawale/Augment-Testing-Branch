/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IOenAddressEntityGenerated extends IEntityBase {

/*
 * City
 */
  City: string;

/*
 * CountryFk
 */
  CountryFk: number;

/*
 * Id
 */
  Id: number;

/*
 * OenCommunicationFk
 */
  OenCommunicationFk: number;

/*
 * Street
 */
  Street?: string | null;

/*
 * ZipCode
 */
  ZipCode: string;
}

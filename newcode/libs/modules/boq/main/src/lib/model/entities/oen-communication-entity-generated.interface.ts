/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IOenAddressEntity } from './oen-address-entity.interface';

export interface IOenCommunicationEntityGenerated extends IEntityBase {

/*
 * AdditionalInfo
 */
  AdditionalInfo?: string | null;

/*
 * Email
 */
  Email?: string | null;

/*
 * Fax
 */
  Fax?: string | null;

/*
 * Id
 */
  Id: number;

/*
 * OenAddress
 */
  OenAddress?: IOenAddressEntity | null;

/*
 * OenCompanyFk
 */
  OenCompanyFk?: number | null;

/*
 * OenPersonFk
 */
  OenPersonFk?: number | null;

/*
 * Phone
 */
  Phone?: string | null;

/*
 * Url
 */
  Url?: string | null;
}

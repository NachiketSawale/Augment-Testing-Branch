/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IOenCommunicationEntity } from './oen-communication-entity.interface';

export interface IOenPersonEntityGenerated extends IEntityBase {

/*
 * FamilyName
 */
  FamilyName: string;

/*
 * FirstName
 */
  FirstName?: string | null;

/*
 * Id
 */
  Id: number;

/*
 * OenCommunication
 */
  OenCommunication?: IOenCommunicationEntity | null;

/*
 * OenCompanyFk
 */
  OenCompanyFk?: number | null;

/*
 * OenContactFk
 */
  OenContactFk?: number | null;
}

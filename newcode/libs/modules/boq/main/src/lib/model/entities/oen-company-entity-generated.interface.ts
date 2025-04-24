/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IOenCommunicationEntity } from './oen-communication-entity.interface';
import { IOenPersonEntity } from './oen-person-entity.interface';

export interface IOenCompanyEntityGenerated extends IEntityBase {

/*
 * Id
 */
  Id: number;

/*
 * Name
 */
  Name: string;

/*
 * OenCommunication
 */
  OenCommunication?: IOenCommunicationEntity | null;

/*
 * OenContactFk
 */
  OenContactFk: number;

/*
 * OenPerson
 */
  OenPerson?: IOenPersonEntity | null;
}

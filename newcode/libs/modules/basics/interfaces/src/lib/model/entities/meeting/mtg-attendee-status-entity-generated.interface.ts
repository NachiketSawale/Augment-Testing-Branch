/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IMtgAttendeeEntity } from './mtg-attendee-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';


export interface IMtgAttendeeStatusEntityGenerated extends IEntityBase {

/*
 * Code
 */
  Code?: string | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * Icon
 */
  Icon?: number | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * IsDefault
 */
  IsDefault?: boolean | null;

/*
 * IsLive
 */
  IsLive?: boolean | null;

/*
 * MtgAttendeeEntities
 */
  MtgAttendeeEntities?: IMtgAttendeeEntity[] | null;

/*
 * Sorting
 */
  Sorting?: number | null;
}

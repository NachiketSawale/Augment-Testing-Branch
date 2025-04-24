/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { IEntityBase } from '@libs/platform/common';
import { IResourceTypeEntity } from '@libs/resource/interfaces';

export interface IRequestedTypeEntityGenerated extends IEntityBase {

/*
 * Duration
 */
  Duration?: number | null;

/*
 * Id
 */
  Id: number | null;

/*
 * IsRequestedEntirePeriod
 */
  IsRequestedEntirePeriod?: boolean | null;

/*
 * NecessaryOperators
 */
  NecessaryOperators?: number | null;

/*
 * ResourceTypeEntity_ResTypeFk
 */
  ResourceTypeEntity_ResTypeFk?: IResourceTypeEntity | null;

/*
 * ResourceTypeEntity_ResTyperequestedFk
 */
  ResourceTypeEntity_ResTyperequestedFk?: IResourceTypeEntity | null;

/*
 * TypeFk
 */
  TypeFk?: number | null;

/*
 * TypeRequestedFk
 */
  TypeRequestedFk?: number | null;

/*
 * UomDayFk
 */
  UomDayFk?: number | null;
}

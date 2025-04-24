/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ICustomLocation } from './custom-location.interface';
import { IPPSItemEntity } from './pps-item-entity.interface';

export interface ICustomLocationGenerated {

/*
 * Code
 */
  Code?: string | null;

/*
 * CustomLocations
 */
  CustomLocations?: ICustomLocation[] | null;

/*
 * Description
 */
  Description?: string | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * IsSplitedItem
 */
  IsSplitedItem?: boolean | null;

/*
 * LocationParentFk
 */
  LocationParentFk?: number | null;

/*
 * PpsItem
 */
  PpsItem?: IPPSItemEntity | null;

/*
 * ProjectId
 */
  ProjectId?: number | null;

/*
 * Sorting
 */
  Sorting?: number | null;

/*
 * image
 */
  image?: string | null;
}

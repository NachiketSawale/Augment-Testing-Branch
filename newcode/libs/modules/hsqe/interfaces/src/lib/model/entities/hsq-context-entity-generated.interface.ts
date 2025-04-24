/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IHsqCheckListGroupEntity } from './hsq-check-list-group-entity.interface';
import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface IHsqContextEntityGenerated extends IEntityBase {

/*
 * Code
 */
  Code: string;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * HsqCheckListGroupEntities
 */
  HsqCheckListGroupEntities?: IHsqCheckListGroupEntity[] | null;

/*
 * Id
 */
  Id: number;

/*
 * IsDefault
 */
  IsDefault: boolean;

/*
 * IsLive
 */
  IsLive: boolean;

/*
 * Sorting
 */
  Sorting: number;
}

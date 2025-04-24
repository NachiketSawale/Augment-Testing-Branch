/*
 * Copyright(c) RIB Software GmbH
 */

import { IControllingUnitEntity } from './controlling-unit-entity.interface';
import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface IControllingUnitStatusEntityGenerated extends IEntityBase {

/*
 * ControllingUnitEntities
 */
  ControllingUnitEntities?: IControllingUnitEntity[] | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * Id
 */
  Id: number;

/*
 * IsDefault
 */
  IsDefault: boolean;

/*
 * IsOpen
 */
  IsOpen: boolean;

/*
 * ReadOnly
 */
  ReadOnly: boolean;

/*
 * Sorting
 */
  Sorting: number;
}

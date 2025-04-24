/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBoqStructureEntity } from './boq-structure-entity.interface';
import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';
import { IBoqRoundingConfigEntity } from './boq-rounding-config-entity.interface';

export interface IBoqRoundingConfigTypeEntityGenerated extends IEntityBase {

/*
 * BoqRoundingConfigFk
 */
  BoqRoundingConfigFk: number;

/*
 * BoqRoundingconfigEntity
 */
  BoqRoundingconfigEntity?: IBoqRoundingConfigEntity | null;

/*
 * BoqStructureEntities
 */
  BoqStructureEntities?: IBoqStructureEntity[] | null;

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
 * IsEnterprise
 */
  IsEnterprise: boolean;

/*
 * IsLive
 */
  IsLive: boolean;

/*
 * MdcLineitemContextFk
 */
  MdcLineitemContextFk: number;
}

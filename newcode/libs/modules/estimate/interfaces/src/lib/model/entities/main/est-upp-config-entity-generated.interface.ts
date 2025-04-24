/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstBoq2uppConfigEntity } from './est-boq-2upp-config-entity.interface';
import { IEstUpp2CostcodeEntity } from './est-upp-2costcode-entity.interface';
import { IEstUppConfigTypeEntity } from './est-upp-config-type-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IEstUppConfigEntityGenerated extends IEntityBase {

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EstBoq2uppConfigEntities
 */
  EstBoq2uppConfigEntities?: IEstBoq2uppConfigEntity[] | null;

/*
 * EstUpp2CostcodeEntities
 */
  EstUpp2CostcodeEntities?: IEstUpp2CostcodeEntity[] | null;

/*
 * EstUppConfigTypeEntities
 */
  EstUppConfigTypeEntities?: IEstUppConfigTypeEntity[] | null;

/*
 * Id
 */
  Id: number;
}

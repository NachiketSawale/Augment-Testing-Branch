/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstAssemblyTypeEntity } from './est-assembly-type-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IEstAssemblyTypeLogicEntityGenerated extends IEntityBase {

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EstAssemblyTypeEntities
 */
  EstAssemblyTypeEntities?: IEstAssemblyTypeEntity[] | null;

/*
 * Id
 */
  Id: number;
}

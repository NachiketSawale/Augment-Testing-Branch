/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstAssemblyTypeLogicEntity } from './est-assembly-type-logic-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IEstAssemblyTypeEntityGenerated extends IEntityBase {

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EstAssemblyCatEntities
 */
  //EstAssemblyCatEntities?: IEstAssemblyCatEntity[] | null;

/*
 * EstAssemblyTypeLogicFk
 */
  EstAssemblyTypeLogicFk?: number | null;

/*
 * EstAssemblytypeLogicEntity
 */
  EstAssemblytypeLogicEntity?: IEstAssemblyTypeLogicEntity | null;

/*
 * Id
 */
  Id: number;

/*
 * IsBudget
 */
  IsBudget?: boolean | null;

/*
 * IsCost
 */
  IsCost?: boolean | null;

/*
 * IsDefault
 */
  IsDefault?: boolean | null;

/*
 * IsLive
 */
  IsLive?: boolean | null;

/*
 * ShortKeyInfo
 */
  ShortKeyInfo?: IDescriptionInfo | null;

/*
 * Sorting
 */
  Sorting?: number | null;
}

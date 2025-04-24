/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstAssemblyCatEntity } from './est-assembly-cat-entity.interface';
import { IEstAssemblyTypeEntity } from './est-assembly-type-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IEstAssemblyCatEntityGenerated extends IEntityBase {

/*
 * AssemblyCatChildren
 */
  AssemblyCatChildren: IEstAssemblyCatEntity[];

/*
 * AssemblyCatParent
 */
  AssemblyCatParent: IEstAssemblyCatEntity;

/*
 * Code
 */
  Code: string;

/*
 * DescriptionInfo
 */
  DescriptionInfo: IDescriptionInfo;

/*
 * EstAssemblyCatFk
 */
  EstAssemblyCatFk?: number | null;

/*
 * EstAssemblyCatSourceFk
 */
  EstAssemblyCatSourceFk?: number | null;

/*
 * EstAssemblyTypeEntity
 */
  EstAssemblyTypeEntity: IEstAssemblyTypeEntity;

/*
 * EstAssemblyTypeFk
 */
  EstAssemblyTypeFk?: number | null;

/*
 * EstAssemblyTypeLogicFk
 */
  EstAssemblyTypeLogicFk?: number | null;

/*
 * EstHeaderFk
 */
  EstHeaderFk?: number | null;

/*
 * HasChildren
 */
  HasChildren?: boolean | null;

/*
 * Id
 */
  Id: number;

/*
 * IsShowInLeading
 */
  IsShowInLeading?: boolean | null;

/*
 * LineItemContextFk
 */
  LineItemContextFk: number;

/*
 * MaxValue
 */
  MaxValue: string;

/*
 * MinValue
 */
  MinValue: string;

/*
 * PrjProjectFk
 */
  PrjProjectFk?: number | null;
}

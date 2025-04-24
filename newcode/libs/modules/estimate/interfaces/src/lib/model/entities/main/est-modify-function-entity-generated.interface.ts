/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstModifyFunctionEntity } from './est-modify-function-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IEstModifyFunctionEntityGenerated extends IEntityBase {

/*
 * Code
 */
  Code: string;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EstModifyFunctionChildren
 */
  EstModifyFunctionChildren?: IEstModifyFunctionEntity[] | null;

/*
 * EstModifyFunctionFk
 */
  EstModifyFunctionFk?: number | null;

/*
 * EstModifyFunctionParent
 */
  EstModifyFunctionParent?: IEstModifyFunctionEntity | null;

/*
 * Id
 */
  Id: number;
}

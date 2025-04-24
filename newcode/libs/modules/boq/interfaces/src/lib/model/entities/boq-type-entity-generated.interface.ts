/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IBoqStructureEntity } from './boq-structure-entity.interface';

export interface IBoqTypeEntityGenerated extends IEntityBase {

/*
 * BoqStructure
 */
  BoqStructure?: IBoqStructureEntity | null;

/*
 * BoqStructureFk
 */
  BoqStructureFk: number;

/*
 * Description
 */
  Description?: string | null;

/*
 * DescriptionTr
 */
  DescriptionTr?: number | null;

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
 * LineitemcontextFk
 */
  LineitemcontextFk: number;

/*
 * Sorting
 */
  Sorting: number;
}

/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IGccBudgetShiftEntity } from './gcc-budget-shift-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IGccBudgetShiftEntityGenerated extends IEntityBase {

/*
 * Code
 */
  Code?: string | null;

/*
 * Comment
 */
  Comment?: string | null;

/*
 * Description
 */
  Description?: string | null;

/*
 * GccBudgetShiftEntities_GccBudgetShiftFk
 */
  GccBudgetShiftEntities_GccBudgetShiftFk?: IGccBudgetShiftEntity[] | null;

/*
 * GccBudgetShiftEntity_GccBudgetShiftFk
 */
  GccBudgetShiftEntity_GccBudgetShiftFk?: IGccBudgetShiftEntity | null;

/*
 * GccBudgetShiftFk
 */
  GccBudgetShiftFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * MdcCounitSourceFk
 */
  MdcCounitSourceFk?: number | null;

/*
 * MdcCounitTargetFk
 */
  MdcCounitTargetFk?: number | null;

/*
 * Value
 */
  Value?: number | null;
}

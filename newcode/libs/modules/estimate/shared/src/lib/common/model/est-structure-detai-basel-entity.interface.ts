/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IEstStructureDetailBaseEntity extends IEntityBase {

/*
 * Code
 */
  Code?: string | null;

/*
 * EstQuantityRelFk
 */
  EstQuantityRelFk?: number | null;

/*
 * EstStructureConfigFk
 */
  EstStructureConfigFk?: number | null;

/*
 * EstStructureFk
 */
  EstStructureFk?: number | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * Sorting
 */
  Sorting: number;
}

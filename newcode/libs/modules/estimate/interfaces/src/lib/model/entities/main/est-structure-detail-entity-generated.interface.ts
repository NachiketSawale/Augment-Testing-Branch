/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstStructureConfigEntity } from './est-structure-config-entity.interface';
import { IEstStructureEntity } from './est-structure-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IEstStructureDetailEntityGenerated extends IEntityBase {

/*
 * Code
 */
  Code: string;

/*
 * EstQuantityRelFk
 */
  EstQuantityRelFk?: number | null;

/*
 * EstStructureConfigEntity
 */
  EstStructureConfigEntity?: IEstStructureConfigEntity | null;

/*
 * EstStructureConfigFk
 */
  EstStructureConfigFk?: number | null;

/*
 * EstStructureEntity
 */
  EstStructureEntity?: IEstStructureEntity | null;

/*
 * EstStructureFk
 */
  EstStructureFk?: number | null;

/*
 * Id
 */
  Id: number

/*
 * Sorting
 */
  Sorting?: number | null;
}

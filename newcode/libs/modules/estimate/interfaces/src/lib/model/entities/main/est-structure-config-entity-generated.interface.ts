/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstConfigEntity } from './est-config-entity.interface';
import { IEstStructureDetailEntity } from './est-structure-detail-entity.interface';
import { IEstStructureTypeEntity } from './est-structure-type-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IEstStructureConfigEntityGenerated extends IEntityBase {

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EstConfigEntities
 */
  EstConfigEntities?: IEstConfigEntity[] | null;

/*
 * EstStructureDetailEntities
 */
  EstStructureDetailEntities?: IEstStructureDetailEntity[] | null;

/*
 * EstStructureTypeEntities
 */
  EstStructureTypeEntities?: IEstStructureTypeEntity[] | null;

/*
 * GetQuantityTotalToStructure
 */
  GetQuantityTotalToStructure?: boolean | null;

/*
 * Id
 */
  Id: number;
}

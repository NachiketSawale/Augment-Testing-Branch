/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstAllowanceAssignmentEntity } from './est-allowance-assignment-entity.interface';
import { IEstAllowanceConfigTypeEntity } from './est-allowance-config-type-entity.interface';
import { IEstConfigEntity } from './est-config-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IEstAllowanceConfigEntityGenerated extends IEntityBase {

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EstAllowanceAssignmentEntities
 */
  EstAllowanceAssignmentEntities?: IEstAllowanceAssignmentEntity[] | null;

/*
 * EstAllowanceConfigTypeEntities
 */
  EstAllowanceConfigTypeEntities?: IEstAllowanceConfigTypeEntity[] | null;

/*
 * EstConfigEntities
 */
  EstConfigEntities?: IEstConfigEntity[] | null;

/*
 * Id
 */
  Id: number;
}

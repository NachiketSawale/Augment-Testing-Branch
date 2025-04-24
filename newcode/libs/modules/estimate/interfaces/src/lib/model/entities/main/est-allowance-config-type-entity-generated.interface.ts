/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstAllowanceAssignmentEntity } from './est-allowance-assignment-entity.interface';
import { IEstAllowanceConfigEntity } from './est-allowance-config-entity.interface';
import { IEstConfigEntity } from './est-config-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IEstAllowanceConfigTypeEntityGenerated extends IEntityBase {

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EstAllowanceAssignmentToDelete
 */
  EstAllowanceAssignmentToDelete?: IEstAllowanceAssignmentEntity[] | null;

/*
 * EstAllowanceAssignmentToSave
 */
  EstAllowanceAssignmentToSave?: IEstAllowanceAssignmentEntity[] | null;

/*
 * EstAllowanceConfigEntity
 */
  EstAllowanceConfigEntity?: IEstAllowanceConfigEntity | null;

/*
 * EstAllowanceConfigFk
 */
  EstAllowanceConfigFk?: number | null;

/*
 * EstConfigEntities
 */
  EstConfigEntities?: IEstConfigEntity[] | null;

/*
 * Id
 */
  Id: number;

/*
 * Isdefault
 */
  Isdefault?: boolean | null;

/*
 * Islive
 */
  Islive?: boolean | null;

/*
 * MdcContextFk
 */
  MdcContextFk?: number | null;
}

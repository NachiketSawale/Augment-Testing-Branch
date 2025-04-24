/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstRootAssignmentDetailEntity } from './est-root-assignment-detail-entity.interface';
import { IEstRootAssignmentParamEntity } from './est-root-assignment-param-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IEstRootAssignmentTypeEntityGenerated extends IEntityBase {

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EstRootAssignmentDetails
 */
  EstRootAssignmentDetails?: IEstRootAssignmentDetailEntity[] | null;

/*
 * EstRootAssignmentParams
 */
  EstRootAssignmentParams?: IEstRootAssignmentParamEntity[] | null;

/*
 * Id
 */
  Id: number;

/*
 * IsDefault
 */
  IsDefault?: boolean | null;

/*
 * IsLive
 */
  IsLive?: boolean | null;

/*
 * MdcLineItemContextFk
 */
  MdcLineItemContextFk?: number | null;
}

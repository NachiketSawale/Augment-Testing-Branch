/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstLineItemSelStatementEntity } from './est-line-item-sel-statement-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';
import { IEstHeaderEntity } from './est-header-base-entity.interface';

export interface IEstLineItemSelStStateEntityGenerated extends IEntityBase {

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EndTime
 */
  EndTime?: string | null;

/*
 * EstHeaderEntity
 */
  EstHeaderEntity?: IEstHeaderEntity | null;

/*
 * EstHeaderFk
 */
  EstHeaderFk?: number | null;

/*
 * EstLineItemSelStatementEntity
 */
  EstLineItemSelStatementEntity?: IEstLineItemSelStatementEntity | null;

/*
 * EstLineItemSelStatementFk
 */
  EstLineItemSelStatementFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * IsExecute
 */
  IsExecute?: boolean | null;

/*
 * LoggingMessage
 */
  LoggingMessage?: string | null;

/*
 * MdcLineItemContextFk
 */
  MdcLineItemContextFk?: number | null;

/*
 * SelStatementState
 */
  SelStatementState?: number | null;

/*
 * StartTime
 */
  StartTime?: string | null;
}

/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstLineItemSelStatementEntity } from './est-line-item-sel-statement-entity.interface';
import { IEstLineItemSelStStateEntity } from './est-line-item-sel-st-state-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IEstLineItemSelStatementEntityGenerated extends IEntityBase {

/*
 * BoqHeaderItemFk
 */
  BoqHeaderItemFk?: number | null;

/*
 * BoqItemFk
 */
  BoqItemFk?: number | null;

/*
 * ChildrenIsExecute
 */
  ChildrenIsExecute?: IEstLineItemSelStatementEntity[] | null;

/*
 * Code
 */
  Code: string;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EstAssemblyFk
 */
  EstAssemblyFk?: number | null;

/*
 * EstHeaderAssemblyFk
 */
  EstHeaderAssemblyFk?: number | null;

/*
 * EstHeaderFk
 */
  EstHeaderFk?: number | null;

/*
 * EstLineItemSelStStateEntities
 */
  EstLineItemSelStStateEntities?: IEstLineItemSelStStateEntity[] | null;

/*
 * EstLineItemSelStatementChildren
 */
  EstLineItemSelStatementChildren?: IEstLineItemSelStatementEntity[] | null;

/*
 * EstLineItemSelStatementEntity_EstLineItemSelStatementFk
 */
  EstLineItemSelStatementEntity_EstLineItemSelStatementFk?: IEstLineItemSelStatementEntity | null;

/*
 * EstLineItemSelStatementFk
 */
  EstLineItemSelStatementFk?: number | null;

/*
 * EstLineItemSelStatementType
 */
  EstLineItemSelStatementType?: number | null;

/*
 * HasChildren
 */
  HasChildren?: boolean | null;

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
 * MdlModelFk
 */
  MdlModelFk?: number | null;

/*
 * ObjectSelectStatement
 */
  ObjectSelectStatement?: string | null;

/*
 * ProjectFk
 */
  ProjectFk?: number | null;

/*
 * PsdActivityFk
 */
  PsdActivityFk?: number | null;

/*
 * Quantity
 */
  Quantity?: number | null;

/*
 * SelectStatement
 */
  SelectStatement?: string | null;

/*
 * StartTime
 */
  StartTime?: string | null;

/*
 * State
 */
  State?: number | null;

/*
 * WicCatFk
 */
  WicCatFk?: number | null;

/*
 * WicHeaderItemFk
 */
  WicHeaderItemFk?: number | null;

/*
 * WicItemFk
 */
  WicItemFk?: number | null;
}

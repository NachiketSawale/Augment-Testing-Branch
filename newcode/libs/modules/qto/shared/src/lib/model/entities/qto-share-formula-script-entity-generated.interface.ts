/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IQtoShareFormulaEntity } from './qto-share-formula-entity.interface';

export interface IQtoShareFormulaScriptEntityGenerated extends IEntityBase {

/*
 * Id
 */
  Id?: number | null;

/*
 * QtoFormulaEntity
 */
  QtoFormulaEntity?: IQtoShareFormulaEntity | null;

/*
 * QtoFormulaFk
 */
  QtoFormulaFk?: number | null;

/*
 * ScriptData
 */
  ScriptData?: string | null;

/*
 * TestInput
 */
  TestInput?: string | null;

/*
 * ValidateScriptData
 */
  ValidateScriptData?: string | null;
}

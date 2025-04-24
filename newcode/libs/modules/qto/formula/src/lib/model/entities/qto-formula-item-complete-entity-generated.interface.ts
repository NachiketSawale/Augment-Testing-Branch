/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IQtoFormulaEntity } from './qto-formula-entity.interface';
import { IQtoFormulaScriptEntity } from './qto-formula-script-entity.interface';
import { IQtoFormulaUomEntity } from './qto-formula-uom-entity.interface';

export interface IQtoFormulaItemCompleteEntityGenerated {

/*
 * MainItemId
 */
  MainItemId?: number | null;

/*
 * QtoFormula
 */
  QtoFormula?: IQtoFormulaEntity | null;

/*
 * QtoFormulaScriptToDelete
 */
  QtoFormulaScriptToDelete?: IQtoFormulaScriptEntity[] | null;

/*
 * QtoFormulaUomToDelete
 */
  QtoFormulaUomToDelete?: IQtoFormulaUomEntity[] | null;

/*
 * QtoFormulaUomToSave
 */
  QtoFormulaUomToSave?: IQtoFormulaUomEntity[] | null;
}

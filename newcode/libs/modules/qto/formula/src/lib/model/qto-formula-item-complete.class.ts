/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IQtoFormulaEntity } from './entities/qto-formula-entity.interface';
import { IQtoFormulaScriptEntity } from './entities/qto-formula-script-entity.interface';
import { IQtoFormulaUomEntity } from './entities/qto-formula-uom-entity.interface';

export class QtoFormulaItemComplete implements CompleteIdentification<IQtoFormulaEntity>{
    /*
     * MainItemId
     */
    public MainItemId?: number | null;

    /*
     * QtoFormula
     */
    public QtoFormula?: IQtoFormulaEntity | null;

    /*
     * QtoFormulaScriptToDelete
     */
    public QtoFormulaScriptToDelete?: IQtoFormulaScriptEntity[] | null;

    /*
     * QtoFormulaUomToDelete
     */
    public QtoFormulaUomToDelete?: IQtoFormulaUomEntity[] | null;

    /*
     * QtoFormulaUomToSave
     */
    public QtoFormulaUomToSave?: IQtoFormulaUomEntity[] | null;
}

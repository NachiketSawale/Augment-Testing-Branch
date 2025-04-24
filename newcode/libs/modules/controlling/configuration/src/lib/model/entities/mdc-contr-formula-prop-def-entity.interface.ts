/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IMdcContrFormulaPropDefEntityGenerated } from './mdc-contr-formula-prop-def-entity-generated.interface';

export interface IMdcContrFormulaPropDefEntity extends IMdcContrFormulaPropDefEntityGenerated {
    IsBaseConfigData: boolean;

    FormulaDividendDetail: string;

    ignoreFormulaInput: boolean;
}

export interface FormulaPropDefResult{
    cycledPath: string;
    result: boolean;
}

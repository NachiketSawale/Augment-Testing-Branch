/*
 * Copyright(c) RIB Software GmbH
 */

import {IDescriptionInfo} from '@libs/platform/common';

export class MdcContrFormulaPropDefEntity {
    public Id? :number;
    public Code : string | undefined;
    public DescriptionInfo? : IDescriptionInfo | null;
    public BasContrColumnTypeFk : number | undefined;
    public MdcContrConfigHeaderFk: number | undefined;
    public Formula : string | undefined;
    public FormulaDetail :string | undefined;
    public IsEditable : boolean | undefined;
    public IsDefault: boolean | undefined;
    public IsVisible : boolean | undefined;
    public FormulaDividendDetail : string | undefined;
    public Aggregates : string | undefined;
}
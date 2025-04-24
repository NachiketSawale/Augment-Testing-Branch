
/*
 * Copyright(c) RIB Software GmbH
 */

export interface IMdcContrColumnPropDefEntity {
    Id : number;
    Code :string;
    MdcContrConfigHeaderFk :number;
    ReportPeriodRelativeStart :string;
    ReportPeriodRelativeEnd :string;
    CalType :number;
    CalColumn :string;
    Aggregates :string;
}
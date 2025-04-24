/*
 * Copyright(c) RIB Software GmbH
 */

export interface IDocumentImportedLogInfo {
    ImportStatus? : string | null;
    BarCode : string;
    XmlName? : string | null;
    Comment : string;
    File : string;
    Id : number;
    DocId? : number | null;
    IsBarCodeWrong? : boolean | null;
    ErrMsg? : string;
    WarningMessage? : string;
}
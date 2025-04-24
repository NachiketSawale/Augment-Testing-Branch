/*
 * Copyright(c) RIB Software GmbH
 */

import {IDocumentImportedLogInfo} from './document-info.interface';

export interface IDocumentImportJob{
    Id : number;
    Description : string;
    XmlName : string;
    JobState : string;
    StartTime? : Date;
    EndTime? : Date;
    ProgressValue? : string;
    ErrorMessage : string;
    LoggingMessage : IDocumentImportedLogInfo[];
}
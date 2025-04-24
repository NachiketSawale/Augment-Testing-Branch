/*
 * Copyright(c) RIB Software GmbH
 */
import {IEntityBase} from '@libs/platform/common';


export interface IDocumentOrphan extends IEntityBase{
    Barcode:string;
    CommentText:string;
    BasFileArchiveDocFk:number;
    OriginFileName:string;
}
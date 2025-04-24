/*
 * Copyright(c) RIB Software GmbH
 */
import { IEntityBase,IEntityIdentification } from '@libs/platform/common';
/**
 * Document Project History entity interface
 */
export interface IDocumentProjectHistoryEntity extends IEntityBase,IEntityIdentification{
    PrjDocumentFk: number ;
    PrjDocumentRevision?: number | null;
    PrjDocumentOperationFk?: number | null;
    BasClerkFk?: number | null;
    Remark: string | null;
}
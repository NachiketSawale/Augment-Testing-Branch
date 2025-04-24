/*
 * Copyright(c) RIB Software GmbH
 */

import {IQtoDetailDocumentEntity} from '../model/entities/qto-detail-document-entity.interface';

export class QtoMainDeatilDocumentComplete {
    public MainItemId :number = 0;
    public QtoDetailDocumentsToSave?:IQtoDetailDocumentEntity[] | null = [];
    public QtoDetailDocumentsToDelete? :IQtoDetailDocumentEntity[] | null = [];
}
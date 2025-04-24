/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IQtoShareDetailEntity } from './entities/qto-share-detail-entity.interface';

/**
 * qto detail item complete entity
 */
export class QtoShareDetailGridComplete implements CompleteIdentification<IQtoShareDetailEntity>{

    /*
    * CostGroupToDelete
    */
    // public CostGroupToDelete?: IMainItem2CostGroupEntity[] | null = [];

    /*
     * CostGroupToSave
     */
    // public CostGroupToSave?: IMainItem2CostGroupEntity[] | null = [];

    /*
     * MainItemId
     */
    public MainItemId?: number | null = 10;

    /*
     * QtoDetail
     */
    public QtoDetail?: IQtoShareDetailEntity | null = null;



    /*
     * QtoDetailDocumentsToDelete
     */
    // public QtoDetailDocumentsToDelete?: IQtoDetailDocumentEntity[] | null = [];

    /*
     * QtoDetailDocumentsToSave
     */
    // public QtoDetailDocumentsToSave?: IQtoDetailDocumentEntity[] | null = [];
}

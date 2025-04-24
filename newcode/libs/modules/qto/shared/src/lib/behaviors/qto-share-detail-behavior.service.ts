/*
 * Copyright(c) RIB Software GmbH
 */


import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IQtoShareDetailEntity } from '../model/entities/qto-share-detail-entity.interface';
import {QtoShareDetailDataService} from '../services/qto-share-detail-data.service';

/**
 * The common behavior for qto detail entity containers
 */
export class QtoShareDetailBehavior<T extends IQtoShareDetailEntity, U extends CompleteIdentification<T>,
    PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> implements IEntityContainerBehavior<IGridContainerLink<T>, T> {

    

    /**
     * The constructor
     * @param dataService
     */
    public constructor(public dataService: QtoShareDetailDataService<T, U, PT, PU>) {

    }

    // TODO: Temporarily commenting out to resolve eslint the error because it never used.
    public onCreate(containerLink: IGridContainerLink<T>): void {
        // const dataSub = this.dataService.listChanged$.subscribe(data => {
        //     containerLink.gridData = data;
        // });
    }


}
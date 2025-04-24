/*
 * Copyright(c) RIB Software GmbH
 */

import { QtoShareDetailReadonlyProcessor } from '@libs/qto/shared';
import { IQtoMainDetailGridEntity } from '../../model/qto-main-detail-grid-entity.class';
import { QtoMainDetailGridComplete } from '../../model/qto-main-detail-grid-complete.class';
import { IQtoMainHeaderGridEntity } from '../../model/qto-main-header-grid-entity.class';
import { QtoMainHeaderGridComplete } from '../../model/qto-main-header-grid-complete.class';
import { QtoMainDetailGridDataService } from '../qto-main-detail-grid-data.service';

export class QtoDetailReadonlyProcessor extends QtoShareDetailReadonlyProcessor<IQtoMainDetailGridEntity, QtoMainDetailGridComplete,
    IQtoMainHeaderGridEntity, QtoMainHeaderGridComplete> {

    public constructor(protected qtoDetailDataService: QtoMainDetailGridDataService) {
        super(qtoDetailDataService);
    }
}
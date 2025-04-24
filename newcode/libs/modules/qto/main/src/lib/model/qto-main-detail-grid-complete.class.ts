/*
 * Copyright(c) RIB Software GmbH
 */

import { QtoShareDetailGridComplete } from '@libs/qto/shared';
import {IQtoDetailCommentsEntity} from './entities/qto-detail-comments-entity.interface';

export class QtoMainDetailGridComplete extends QtoShareDetailGridComplete{

    public QtoDetailCommentsToDelete?: IQtoDetailCommentsEntity[] | null = [];


    public QtoDetailCommentsToSave?: IQtoDetailCommentsEntity[] | null = [];
}

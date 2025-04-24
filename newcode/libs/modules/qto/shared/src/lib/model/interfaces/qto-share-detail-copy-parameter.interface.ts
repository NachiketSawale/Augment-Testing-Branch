/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {IQtoShareDetailEntity} from '../entities/qto-share-detail-entity.interface';

/**
 * copy function parameters
 */
export interface IQtoShareDetailCopyParameter<T extends IQtoShareDetailEntity> {
    isDrag: boolean;
    dragItems: T[];
    toTarget?: string;
    toTargetItemId?: number;
    selectedItem?: T;
    PageNumber?: number;
    QtoSheetFk?: number;
    isSearchCopy?: boolean;
    ordHeaderFk?: number;
}
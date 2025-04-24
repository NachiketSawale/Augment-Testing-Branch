/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IQtoShareStatusEntity } from '@libs/qto/shared';

export interface IQtoStatusEntity extends IQtoShareStatusEntity {
    IsCoreData: boolean;
    IsCoreDataExt: boolean;
}

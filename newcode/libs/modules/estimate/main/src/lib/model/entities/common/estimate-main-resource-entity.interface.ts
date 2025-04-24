/*
 * Copyright(c) RIB Software GmbH
 */

import { IEstResourceEntity } from '@libs/estimate/interfaces';

export interface IEstPkgResourceEntity extends IEstResourceEntity {
    IsChecked: boolean | null;
}

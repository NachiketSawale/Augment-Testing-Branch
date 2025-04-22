/*
 * Copyright(c) RIB Software GmbH
 */

import { ISimpleRowEntity } from './simple-row-entity.interface';

export interface ISimpleCheckableRowEntity extends ISimpleRowEntity {
	IsChecked?: boolean;
}
/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { ICosWicBoqWicCatEntity } from './cos-wic-boq-wic-cat-entity.interface';

export interface ICosBoqWicCatBoqFkEntity extends IEntityBase {
	/**
	 * Id
	 */
	Id: number;

	/**
	 * ICosWicBoqWicCatEntity
	 */
	WicBoqCat?: ICosWicBoqWicCatEntity[];
}

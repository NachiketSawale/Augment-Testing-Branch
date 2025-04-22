/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IBoqHeaderEntity, IBoqItemEntity } from '@libs/boq/interfaces';
import { IWipBoqEntity } from './wip-boq-entity.interface';

export interface IWipBoqCompositeEntityGenerated extends IEntityBase {

	/**
	 * BoqHeader
	 */
	BoqHeader: IBoqHeaderEntity;

	/**
	 * BoqRootItem
	 */
	BoqRootItem: IBoqItemEntity;

	/**
	 * Id
	 */
	readonly Id: number;

	/**
	 * WipBoq
	 */
	WipBoq?: IWipBoqEntity | null;
}

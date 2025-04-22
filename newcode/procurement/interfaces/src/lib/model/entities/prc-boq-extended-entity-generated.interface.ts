/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcBoqEntity } from './prc-boq-entity.interface';
import { IBoqHeaderEntity, IBoqItemEntity } from '@libs/boq/interfaces';
export interface IPrcBoqExtendedEntityGenerated {

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
	Id: number;

	/**
	 * PrcBoq
	 */
	PrcBoq?: IPrcBoqEntity;
}
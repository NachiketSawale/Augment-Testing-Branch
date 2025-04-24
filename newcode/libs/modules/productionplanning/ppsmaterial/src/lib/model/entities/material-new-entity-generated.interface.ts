/*
 * Copyright(c) RIB Software GmbH
 */

import { IMaterialEntity } from '@libs/basics/interfaces';
import { IPpsMaterialEntity } from './pps-material-entity.interface';

export interface IMaterialNewEntityGenerated extends IMaterialEntity {

	/**
	 * PpsMaterial
	 */
	PpsMaterial: IPpsMaterialEntity;
}

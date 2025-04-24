/*
 * Copyright(c) RIB Software GmbH
 */

import { IMtwoPowerbiItemEntity } from './mtwo-powerbiitem-entity.interface';

export interface IPermissionsEntityGenerated extends IMtwoPowerbiItemEntity{
	/**
	 * Report
	 */
	Report: IMtwoPowerbiItemEntity;

	/**
	 * Reports
	 */
	Reports: IMtwoPowerbiItemEntity[] | null;

}

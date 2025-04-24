/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBasicsBim360RFIEntity } from '../../model/entities/basics-bim360-rfi-entity.interface';

/**
 * BIM 360 RFI entity for view.
 */
export interface IBasicsBim360RFIViewEntity {
	/**
	 * The specific ID.
	 * Note: added for grid. Grid needs this field.
	 */
	Id: number;

	srcEntity: IBasicsBim360RFIEntity;
}

/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBasicsBim360DocumentEntity } from '../../model/entities/basics-bim360-document-entity.interface';

/**
 * BIM 360 document entity for view.
 * Note: grid need a number type Id field.
 */
export interface IBasicsBim360DocumentViewEntity {
	/**
	 * The specific ID.
	 * Note: added for grid. Grid needs this field.
	 */
	Id: number;

	DocumentId: string;

	FullName: string | null;

	srcEntity: IBasicsBim360DocumentEntity;
}

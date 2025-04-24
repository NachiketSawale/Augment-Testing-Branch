/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBasicsBim360IssueEntity } from '../../model/entities/basics-bim360-issue-entity.interface';

/**
 * BIM 360 issue entity for view.
 * Note: grid need a number type Id field.
 */
export interface IBasicsBim360IssueViewEntity {
	/**
	 * The specific ID.
	 * Note: added for grid. Grid needs this field.
	 */
	Id: number;

	srcEntity: IBasicsBim360IssueEntity;
}

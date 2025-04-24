/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { StatusIdentificationData } from './status-identification-data.interface';

export interface IStatusChangeGroup {

	/**
	 * status id - from
	 */
	fromStatusId: number;

	/**
	 * status name - from
	 */
	fromStatusName: string;

	/**
	 * Entity ids for status change
	 */
	entityIds: StatusIdentificationData[];

	/**
	 * project Id
	 */
	projectId?: number;
}

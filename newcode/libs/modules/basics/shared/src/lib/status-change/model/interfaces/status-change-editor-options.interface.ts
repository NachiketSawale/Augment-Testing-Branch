/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IStatus } from './status.interface';

/**
 * Change status editor options
 */
export interface IStatusChangeEditorOptions {
	/**
	 * editor title
	 */
	title: string;
	/**
	 * Status list
	 */
	statusList: IStatus[];
	/**
	 * from status id
	 */
	fromStatusId: number;
	/**
	 * Whether show available status
	 */
	showAvailableStatus: boolean;
	/**
	 *Whether is simple status
	 */
	isSimpleStatus?: boolean;
}

/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IStatus } from './interfaces/status.interface';

/**
 * Event when changing the status
 */
export class StatusChangeEvent {
	public constructor(
		public status: IStatus,
		public remark: string,
	) {}
}

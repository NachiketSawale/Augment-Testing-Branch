/*
 * Copyright(c) RIB Software GmbH
 */

import { IIdentificationDataMutable } from '@libs/platform/common';

/**
 * Type to hold pinned entity ids for workflow.
 */
export class WorkflowPinnedId {

	/**
	 * Creates an instance of pinned ids with required properties
	 */
	public constructor(public data: IIdentificationDataMutable, public description: string, public expiryDate?: Date) { }

	public get isExpired() {
		if (!this.expiryDate) {
			return false;
		}
		return this.expiryDate < new Date();
	}
}
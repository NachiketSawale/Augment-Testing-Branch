/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

/**
 * Creditstanding Entity
 */
export class CreditstandingEntity {
	/**
	 *
	 */
	public Id!: number;
	public DescriptionInfo!: IDescriptionInfo;
	public Sorting!: number;
	public IsDefault!: boolean;
	public Code?: string | null;
	public InsertedAt!: Date;
	public InsertedBy!: number;
	public UpdatedAt?: Date | null;
	public UpdatedBy?: number | null;
	public Version!: number;
	public IsLive!: boolean;
}

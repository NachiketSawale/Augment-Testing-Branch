/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

/**
 * Customer Status Entity
 */
export class CustomerStatusEntity {
	public Id!: number;
	public DescriptionInfo!: IDescriptionInfo;
	public Sorting!: number;
	public IsDefault!: boolean;
	public Icon!: number;
	public AccountingValue?: string | null;
	public InsertedAt!: Date;
	public InsertedBy!: number;
	public UpdatedAt?: Date | null;
	public UpdatedBy?: number | null;
	public Version!: number;
	public IsDeactivated!: boolean;
}

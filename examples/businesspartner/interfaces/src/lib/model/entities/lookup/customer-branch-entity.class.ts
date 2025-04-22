/*
 * Copyright(c) RIB Software GmbH
 */

import {  IEntityBase } from '@libs/platform/common';

export class CustomerBranchEntity implements IEntityBase{
	public Id!: number;
	public Code?: string | null;
	public Sorting!: number;
	public IsDefault!: boolean;
	public InsertedAt!: Date;
	public InsertedBy!: number;
	public UpdatedAt?: Date;
	public UpdatedBy?: number;
	public Version!: number;
	public Description!: string;
	public IsLive!: boolean;
}

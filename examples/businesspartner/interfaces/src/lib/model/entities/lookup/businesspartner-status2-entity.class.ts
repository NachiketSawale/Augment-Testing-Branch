/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export class BusinessPartnerStatus2Entity implements  IEntityBase{
	public Selected?: boolean;
	public Id!: number;
	public DescriptionInfo!: IDescriptionInfo;
	public Sorting!: number;
	public IsDefault!: boolean;
	public Icon!: number;
	public InsertedAt!: Date;
	public InsertedBy!: number;
	public UpdatedAt?: Date;
	public UpdatedBy?: number;
	public Version!: number;
}

/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityIdentification } from '@libs/platform/common';

export class PpsMaintenanceEntity implements IEntityIdentification {
	public CommentText?: string;
	public EndDate!: Date;
	public Id!: number;
	public PpsProductionPlaceFk?: number;
	public StartDate!: Date;
	public InsertedAt!: Date;
	public InsertedBy!: number;
	public UpdatedAt?: Date;
	public UpdatedBy?: number;
	public Version!: number;
}

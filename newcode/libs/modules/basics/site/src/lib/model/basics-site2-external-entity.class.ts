/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityIdentification } from '@libs/platform/common';

export class BasicsSite2ExternalEntity implements IEntityIdentification {
	public Id!: number;
	public DescriptionInfo!: IDescriptionInfo;
	public BasExternalsourceFk!: number;
	public ExtCode!: number;
	public ExtDescription!: string;
	public CommentText!: string;
	public Sorting!: number;
	public IsDefault!: boolean;
	public ProductionRelease!: boolean;

	public InsertedAt!: Date;
	public InsertedBy!: number;
	public UpdatedAt?: Date;
	public UpdatedBy?: number;
	public Version!: number;
}

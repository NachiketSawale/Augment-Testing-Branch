/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityIdentification } from '@libs/platform/common';

export class PpsCommonCalendarSiteEntity implements IEntityIdentification {
	public Id!: number;
	public DescriptionInfo!: IDescriptionInfo;
	public PpsEntityFk!: number;
	public CalCalendarFk!: number;
	public CommentText!: string;
	public Userdefined1!: string;
	public Userdefined2!: string;
	public Userdefined3!: string;
	public Userdefined4!: string;
	public Userdefined5!: string;
	public InsertedAt!: Date;
	public InsertedBy!: number;
	public UpdatedAt?: Date;
	public UpdatedBy?: number;
	public Version!: number;
}

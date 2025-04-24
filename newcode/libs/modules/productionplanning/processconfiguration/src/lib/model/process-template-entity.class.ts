/*
 * Copyright(c) RIB Software GmbH
 */

/* tslint:disable */
import { IEntityIdentification, IDescriptionInfo } from '@libs/platform/common';

export class ProcessTemplateEntity implements IEntityIdentification {
    public Id!: number;
    public DescriptionInfo!: IDescriptionInfo;
    public ProcessTypeFk!: number;
    public IsDefault!: boolean;
	public IsLive!: boolean;
    public CalCalendarFk!: number;
    public Userdefined1?: string;
    public Userdefined2?: string;
    public Userdefined3?: string;
    public Userdefined4?: string;
    public Userdefined5?: string;
	public InsertedAt!: Date;
	public InsertedBy!: number;
	public UpdatedAt?: Date;
	public UpdatedBy?: number;
	public Version!: number;
}

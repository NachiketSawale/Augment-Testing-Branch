/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityIdentification } from '@libs/platform/common';

export class PpsProductionPlaceEntity implements IEntityIdentification {
	public Id!: number;
	public DescriptionInfo!: IDescriptionInfo;
	public Code!: string;
	public Description!: string;
	public Sorting!: number;
	public PpsProdPlaceTypeFk!: number;
	public ResResourceFk! : number;
	public BasSiteFk!: number;
	public PositionX!: string;
	public PositionY!: string;
	public PositionZ!: string;
	public IsLive!: boolean;
	public Length!: number;
	public BasUomLengthFk!: number;
	public Width!: number;
	public BasUomWidthFk!: number;
	public Height!: number;
	public BasUomHeightFk!: number;

	public InsertedAt!: Date;
	public InsertedBy!: number;
	public UpdatedAt?: Date;
	public UpdatedBy?: number;
	public Version!: number;
}

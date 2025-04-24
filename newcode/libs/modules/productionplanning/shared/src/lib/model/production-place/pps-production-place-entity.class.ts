/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityIdentification } from '@libs/platform/common';

export class PpsProductionPlaceEntity implements IEntityIdentification {
	public BasSiteFk!: number;
	public BasUomHeightFk?: number;
	public BasUomLengthFk?: number;
	public BasUomWidthFk?: number;
	public Code!: string;
	public Description!: IDescriptionInfo;
	public Height?: number;
	public Id!: number;
	public IsLive?: boolean;
	public Length?: number;
	public PermissionObjectInfo?: string;
	public PositionX?: number;
	public PositionY?: number;
	public PositionZ?: number;
	public PpsProdPlaceTypeFk!: number;
	public ResResourceFk?: number;
	public Sorting!: number;
	public Width?: number;
	public InsertedAt!: Date;
	public InsertedBy!: number;
	public UpdatedAt?: Date;
	public UpdatedBy?: number;
	public Version!: number;
}

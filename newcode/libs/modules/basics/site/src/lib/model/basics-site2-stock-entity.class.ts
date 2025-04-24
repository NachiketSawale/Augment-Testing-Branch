/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityIdentification } from '@libs/platform/common';

export class BasicsSite2StockEntity implements IEntityIdentification {
	public Id!: number;
	public DescriptionInfo!: IDescriptionInfo;
	public PrjStockFk!: number;
	public PrjStockLocationFk!: number;
	public IsDefault!: boolean;
	public IsProductionStock!: boolean;
	public IsComponentMaterialStock!: boolean;
	public IsActualStock!: boolean;
	public CommentText!: null;

	public InsertedAt!: Date;
	public InsertedBy!: number;
	public UpdatedAt?: Date;
	public UpdatedBy?: number;
	public Version!: number;
}

/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';

import { IPriceVersionUsedCompanyEntity } from './entities/price-version-used-company-entity.interface';
import { IMaterialPriceVersion2CompanyEntity } from './entities/material-price-version-2-company-entity.interface';
import { IMdcMatPricever2custEntity } from './entities/mdc-mat-pricever-2-cust-entity.interface';
import { IMaterialPriceVersionEntity } from './entities/material-price-version-entity.interface';

export class MaterialPriceVersionComplete implements CompleteIdentification<IMaterialPriceVersionEntity> {
	/**
	 * CompaniesToSave
	 */
	public CompaniesToSave?: IPriceVersionUsedCompanyEntity[] | null = [];

	/**
	 * MainItemId
	 */
	public MainItemId: number = 0;

	/**
	 * MaterialPriceVersion
	 */
	public MaterialPriceVersion?: IMaterialPriceVersionEntity | null;

	/**
	 * MaterialPriceVersion2CompanyToDelete
	 */
	public MaterialPriceVersion2CompanyToDelete?: IMaterialPriceVersion2CompanyEntity[] | null = [];

	/**
	 * MaterialPriceVersion2CompanyToSave
	 */
	public MaterialPriceVersion2CompanyToSave?: IMaterialPriceVersion2CompanyEntity[] | null = [];

	/**
	 * MaterialPriceVersion2CustomerToDelete
	 */
	public MaterialPriceVersion2CustomerToDelete?: IMdcMatPricever2custEntity[] | null = [];

	/**
	 * MaterialPriceVersion2CustomerToSave
	 */
	public MaterialPriceVersion2CustomerToSave?: IMdcMatPricever2custEntity[] | null = [];

	public constructor(e: IMaterialPriceVersionEntity | null) {
		if (e) {
			this.MainItemId = e.Id;
			this.MaterialPriceVersion = e;
		}
	}
}

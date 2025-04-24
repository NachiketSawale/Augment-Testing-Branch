/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IMdcTaxCodeEntity, IMdcTaxCodeMatrixEntity } from '@libs/basics/interfaces';

export class MdcTaxCodeComplete implements CompleteIdentification<IMdcTaxCodeEntity> {
	/**
	 * EntitiesCount
	 */
	public EntitiesCount: number = 0;

	/**
	 * MainItemId
	 */
	public MainItemId: number = 0;

	/**
	 * MdcTaxCode
	 */
	public MdcTaxCode?: IMdcTaxCodeEntity | null;

	/**
	 * TaxCodeMatrixToDelete
	 */
	public TaxCodeMatrixToDelete?: IMdcTaxCodeMatrixEntity[] | null = [];

	/**
	 * TaxCodeMatrixToSave
	 */
	public TaxCodeMatrixToSave?: IMdcTaxCodeMatrixEntity[] | null = [];

	public constructor(e: IMdcTaxCodeEntity | null) {
		if (e) {
			this.MainItemId = e.Id;
			this.MdcTaxCode = e;
			this.EntitiesCount = e ? 1 : 0;
		}
	}
}

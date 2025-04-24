/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType } from '@libs/ui/common';

/**
 * Price version lookup entity
 */
export class PriceVersionEntity{
	/**
	 * Description info price version description
	 */
	public priceverdesc!: FieldType.Description;

    /**
	 * Description info price list description
	 */
	public pricelistfk!: FieldType.Lookup;
	

	/**
	 * The constructor
	 * @param priceversiondesc
	 * @param pricelistdesc
	 */
	public constructor(public priceversiondesc: FieldType.Description, public pricelistdesc: FieldType.Lookup) {
	}
}
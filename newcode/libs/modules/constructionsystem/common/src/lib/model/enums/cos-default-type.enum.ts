/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Data Type: Construction System Default
 */
export enum CosDefaultType {
	GivenDefault = 1,
	PropertyOrGivenDefault = 2,
	PropertyOrQuantityQuery = 3,
	QuantityQuery = 4,
	QuantityQueryOrProperty = 5,
	PropertyCurrentObjectOrGivenDefault = 6,
	PropertyCurrentObjectOrQuantityQuery = 7,
	QuantityQueryOrPropertyCurrentObject = 8,
	Customize = 9,
}

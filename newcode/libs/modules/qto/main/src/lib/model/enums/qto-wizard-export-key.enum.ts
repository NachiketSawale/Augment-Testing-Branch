/*
 * Copyright(c) RIB Software GmbH
 */
export enum QTO_SCOPE {
	RESULT_HIGHLIGHTED = 1,
	RESULT_SET,
	ALL_QTO,
}

export enum QTO_FORMAT {
	DA11 = 1,
	X31,
	CRBX,
	XML,
}

export enum CrbOptionKey {
	Prices = 'prices',
	PriceConditions = 'priceconditions',
	Quantities = 'quantities',
	Ranges = 'ranges',
}

export enum CrbDocumentKey {
	A = 1,
	B,
	C,
	D,
	I,
}

export enum StepId {
	Basic = 'basicStep',
	Enhance = 'enhanceStep',
	CrbSia = 'crbSiaStep',
}

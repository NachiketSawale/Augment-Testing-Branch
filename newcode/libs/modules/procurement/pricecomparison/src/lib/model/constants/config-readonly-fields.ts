/*
 * Copyright(c) RIB Software GmbH
 */

import { CompareFields } from './compare-fields';

export const ConfigReadonlyFields = [
	CompareFields.isFreeQuantity,
	CompareFields.isLumpsum,
	CompareFields.notSubmitted,
	CompareFields.included,
	CompareFields.exQtnIsEvaluated,
	CompareFields.paymentTermPaFk,
	CompareFields.paymentTermFiFk
];
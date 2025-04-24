/*
 * Copyright(c) RIB Software GmbH
 */

import { IBilHeaderEntity } from '@libs/sales/interfaces';

export interface IConsecutiveBillNoFields {
	/**
	 * SelectedBill
	 */
	SelectedBill?: IBilHeaderEntity;

	/**
	 * BillNo
	 */
	BillNo: string;

	/**
	 * ConsecutiveBillNo
	 */
	ConsecutiveBillNo: string;

	/**
	 * GenerateConsecutiveBillNo
	 */

	GenerateConsecutiveBillNo: boolean;
}

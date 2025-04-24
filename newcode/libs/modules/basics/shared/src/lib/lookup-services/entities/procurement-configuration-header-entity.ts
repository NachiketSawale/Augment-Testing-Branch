/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

/**
 * Procurement Configuration header entity
 */
export class ProcurementConfigurationHeaderEntity {
	public DescriptionInfo!: IDescriptionInfo;
	public IsDefault!: boolean;
	public AutoCreateBoq!: boolean;
	public IsFreeItemsAllowed!: boolean;
	public IsConsolidateChange!: boolean;
	public IsChangeFromMainContract!: boolean;
	public TransactionItemInc!: number;
	public BasConfigurationTypeFk!: number;
	public IsInheritUserDefined !: boolean;


	/**
	 * constructor
	 * @param Id
	 */
	public constructor(public Id: number) {
	}
}

/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

/**
 * Procurement Configuration entity
 */
export class ProcurementConfigurationEntity {
	public DescriptionInfo!: IDescriptionInfo;
	public RubricCategoryFk!: number;
	public PrcConfigHeaderFk!: number;
	public IsService!: boolean;
	public IsMaterial!: boolean;
	public PrcContractTypeFk!: number;
	public PrcAwardMethodFk!: number;
	public PaymentTermPaFk!: number;
	public PaymentTermFiFk!: number;
	public IsDefault!: boolean;

	/**
	 * constructor
	 * @param Id
	 */
	public constructor(public Id: number) {}
}

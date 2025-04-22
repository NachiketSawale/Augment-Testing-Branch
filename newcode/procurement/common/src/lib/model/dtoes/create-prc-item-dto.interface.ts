/*
 * Copyright(c) RIB Software GmbH
 */

export interface ICreatePrcItemDto {
	PrcHeaderFk: number;
	ProjectFk: number;
	ConfigurationFk: number;
	BasPaymentTermFiFk?: number | null;
	BasPaymentTermPaFk?: number | null;
	TaxCodeFk?: number;
	Itemnos?: number[];
	PrcPackageFk?: number;

	/**
	 * Todo - rename and add meaningful comment in future
	 */
	FrmHeaderFk?: number;
	/**
	 * Todo - rename and add meaningful comment in future
	 */
	FrmStyle?: FrmStyle;
	/**
	 * parent prc item id if exist
	 */
	parentId?: number;
	/**
	 * Todo - procurement header id, please reuse PrcHeaderFk in future
	 */
	InstanceId?: number;

	IsContract?: boolean;
	ContractHeaderFk?: number | null;

	IsPackage?: boolean;
}

export enum FrmStyle {
	Contract = 2,
	Package = 3,
	Quote = 4,
}

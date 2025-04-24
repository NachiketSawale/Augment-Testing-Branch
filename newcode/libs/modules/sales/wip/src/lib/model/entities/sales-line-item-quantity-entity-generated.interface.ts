/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface ISalesLineItemQuantityGeneratedEntity extends IEntityBase {


	/**
	 * Id
	 */
	Id: number;

	/**
	 * DescriptionInfo
	 */
	DescriptionInfo?: IDescriptionInfo | null;

	/**
	 * ProjectNo
	 */
	ProjectNo: string;

	/**
	 * ProjectName
	 */
	ProjectName:string;

	/**
	* Code
	 */
	Code: string;

	/**
	 * EstimationDescription
	 */
	EstimationDescription:IDescriptionInfo | null;

	/**
	 * EstimationCode
	 */
	EstimationCode:string;
}
/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

/**
 * Workflow type properties
 */
export interface IWorkflowType {
	/**
	 * Id of workflow type.
	 */
	Id: string;

	/**
	 * Code of workflow type.
	 */
	Code: string;

	/**
	 * Translated information of workflow type.
	 */
	DescriptionInfo: IDescriptionInfo;

	/**
	 * Row information of workflow type.
	 */
	Sorting: number;

	/**
	 * Default value of workflow type.
	 */
	IsDefault: boolean;

	/**
	 * Checks if workflow type is active.
	 */
	IsLive: boolean;
}
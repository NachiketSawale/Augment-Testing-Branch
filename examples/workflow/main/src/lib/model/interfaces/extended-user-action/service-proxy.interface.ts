/*
 * Copyright(c) RIB Software GmbH
 */

import { TValue } from '@libs/workflow/interfaces';

/**
 * Properties that are used in iframe for calling angular service methods.
 */
export interface IServiceCallProxy {
	/**
	 * Name of the service used in iframe script.
	 */
	ServiceName: string,

	/**
	 * Name of the method used in iframe script.
	 */
	MethodName: string,

	/**
	 * Parameters passed to the method in iframe script.
	 */
	Parameters: TValue[]
}
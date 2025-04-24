/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {ISelectOptions} from './select-options.interface';

/**
 * Represents the configuration for a *select* control whose data is retrieved from a data service.
 *
 * @group Fields API
 */
export interface IServiceSelectOptions extends ISelectOptions {

	/**
	 * The name of the data service.
	 */
	serviceName: string;

	/**
	 * A custom name for the service method that loads the items.
	 */
	serviceMethod?: string;
}
/*
 * Copyright(c) RIB Software GmbH
 */

import { StaticProvider, Type } from '@angular/core';

/**
 * An interface that declares additional options for a custom component.
 *
 * @group Fields API
 */
export interface IAdditionalCustomComponentOptions {

	/**
	 * The type of the component to instantiate.
	 */
	componentType: Type<object>;

	/**
	 * An optional array of custom additional injection providers for the custom component.
	 */
	providers?: StaticProvider[];
}
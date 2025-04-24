/*
 * Copyright(c) RIB Software GmbH
 */

import { IDdPathSelectorConfig } from './dd-path-selector-config.interface';

export interface IDynamicFieldSelector {
	/**
	 * Id
	 */
	Id: string;

	/**
	 * DisplayName
	 */
	DisplayName: string;

	/**
	 * SelectorConfig
	 */
	SelectorConfig: IDdPathSelectorConfig;
}
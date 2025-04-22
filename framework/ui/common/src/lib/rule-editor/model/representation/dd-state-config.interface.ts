/*
 * Copyright(c) RIB Software GmbH
 */

import { ContextProvider } from '../schema-graph-node/context-provider.class';

/**
 * The configuration structure for DdDataState
 */
export interface IDdStateConfig {
	/**
	 * focusTableName
	 */
	focusTableName: string;

	/**
	 * moduleName
	 */
	moduleName: string;

	/**
	 * uiTypeId
	 */
	uiTypeId?: string;

	/**
	 * targetKind
	 */
	targetKind?: string;

	/**
	 * targetId
	 */
	targetId?: number;

	/**
	 * targetTableName
	 */
	targetTableName?: string;

	/**
	 * contextProvider
	 */
	contextProvider?: ContextProvider;
}
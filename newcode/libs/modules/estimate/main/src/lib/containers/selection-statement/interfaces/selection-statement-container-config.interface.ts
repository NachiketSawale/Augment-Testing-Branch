/*
 * Copyright(c) RIB Software GmbH
 */

import { InjectionToken, StaticProvider, Type } from '@angular/core';

export const SelectionStatementContainerConfigToken = new InjectionToken<ISelectionStatementContainerConfig>('line-item-selection-statement-grid-config');


/**
 *  composite grid  container configuration
 */

export interface ISelectionStatementContainerConfig {
	/**
	 * The  providers
	 * Optionally
	 */
	readonly providers?: StaticProvider[];
	/**
	 * The bottom component or right component
	 * Optionally
	 */
	readonly rightContainerType?: Type<unknown>;

}

export interface ISelStatementApplyConfigEntity {
	totalRecords?:number;
	changedRecords?:number;
	unchangedRecords?:number;
	logConflicts?:string;
	selStatementCode?:string;
	startTime?:string;
	logDetails?:string;
}
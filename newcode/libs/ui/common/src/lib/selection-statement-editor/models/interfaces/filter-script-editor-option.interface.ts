/*
 * Copyright(c) RIB Software GmbH
 */

import { Observable } from 'rxjs';
import { FilterScriptDefOptions } from './filter-script-def-options.interface';

/*
* Filter Script Editor Option
* */
export interface IFilterScriptEditorOption {
	/**
	 * def provider
	 */
	defProvider?: IFilterScriptDefProvider;
}

/**
 * Filter Script definition provider
 */
export interface IFilterScriptDefProvider {
	/**
	 * Get defs
	 */
	getDefs(): Observable<FilterScriptDefOptions>;

	/**
	 * Add variable defs
	 * @param items
	 */
	addVariable(items: { name: string, type: string, description: string }[]): void;
}
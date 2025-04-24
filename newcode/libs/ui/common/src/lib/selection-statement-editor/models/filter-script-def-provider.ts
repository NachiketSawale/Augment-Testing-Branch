/*
 * Copyright(c) RIB Software GmbH
 */

import { IFilterScriptDefProvider } from './interfaces/filter-script-editor-option.interface';
import { defer, Observable, of } from 'rxjs';
import { FilterScriptDefOptions } from './interfaces/filter-script-def-options.interface';
import { filterScriptOption } from './filter-script-def-options.class';

export class FilterScriptDefProvider implements IFilterScriptDefProvider {
	public addVariable(items: { name: string; type: string; description: string }[]): void {
	}

	public getDefs(): Observable<FilterScriptDefOptions> {
		return defer(() =>{
			return of(filterScriptOption);
		});
	}

}
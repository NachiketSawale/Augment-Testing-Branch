/*
 * Copyright(c) RIB Software GmbH
 */


import { Injectable } from '@angular/core';
import { IDdStateConfig } from '../model/representation/dd-state-config.interface';
import { SchemaGraphProvider } from '../model/schema-graph-node/schema-graph-provider.class';
import { DdDataState } from '../model/schema-graph-node/dd-data-state.class';
import { switchMap } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class RuleEditorSchemaGraphService {

	private readonly schemaGraphProvider: SchemaGraphProvider;
	private readonly dataState: DdDataState;

	public constructor() {
		this.schemaGraphProvider = new SchemaGraphProvider();
		this.dataState = new DdDataState();
	}


	public getSchemaGraphProvider(config: IDdStateConfig) {

		if((!config.focusTableName || config.focusTableName === '') && (!config.moduleName || config.moduleName === '')) {
			throw new Error('Neither focus table nor module name specified.');
		}

		return this.dataState.initialize(config).pipe(
			switchMap(()=>{
				return this.schemaGraphProvider.initialize(this.dataState);
			}),
			map(()=>{
				return this.schemaGraphProvider;
			})
		);
	}
}

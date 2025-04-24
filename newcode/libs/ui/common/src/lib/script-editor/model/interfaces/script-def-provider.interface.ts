/*
 * Copyright(c) RIB Software GmbH
 */

import { Observable } from 'rxjs';
import { Def } from 'tern/lib/tern';

/**
 * Script definition provider
 */
export interface IScriptDefProvider {
	/**
	 * Get defs
	 */
	getDefs(): Observable<Def[]>;

	/**
	 * Add variable defs
	 * @param items
	 */
	addVariable(items: { name: string, type: string, description: string }[]): void;
}
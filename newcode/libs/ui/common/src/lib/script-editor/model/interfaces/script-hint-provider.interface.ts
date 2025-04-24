/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Completion } from '@codemirror/autocomplete';
import { Observable } from 'rxjs';

/**
 * Script hint provider interface.
 */
export interface IScriptHintProvider {

	/**
	 * Get argument hints
	 * @param funcName
	 * @param index
	 * @param argsBefore
	 */
	getArgHints(funcName: string, index: number, argsBefore?: string[]): Observable<Completion[]>;
}
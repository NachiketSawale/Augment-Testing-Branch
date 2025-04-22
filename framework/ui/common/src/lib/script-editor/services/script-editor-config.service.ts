/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IScriptEditorConfig } from '../model/interfaces/script-editor-options.interface';
import { ScriptDefProvider } from '../model/script-def-provider';

/**
 * Global script editor config service
 */
@Injectable({
	providedIn: 'root'
})
export class ScriptEditorConfigService implements IScriptEditorConfig {

	/**
	 *
	 */
	public completeOptions = {
		caseInsensitive: true,
		guess: false,
		includeKeywords: true
	};

	/**
	 *
	 */
	public defProvider = new ScriptDefProvider('default');
}

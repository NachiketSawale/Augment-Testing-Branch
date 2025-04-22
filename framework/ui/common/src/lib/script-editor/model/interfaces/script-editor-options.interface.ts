/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IScriptHintProvider } from './script-hint-provider.interface';
import { IScriptDefProvider } from './script-def-provider.interface';

/**
 * Script editor options
 */
export interface IScriptEditorOptions {
	/**
	 * autocomplete options
	 */
	completeOptions?: IScriptEditorCompleteOptions;

	/**
	 * hint provider
	 */
	hintProvider?: IScriptHintProvider;

	/**
	 * def provider
	 */
	defProvider?: IScriptDefProvider;
}

/**
 * Script editor config
 */
export interface IScriptEditorConfig extends  IScriptEditorOptions {
	/**
	 * required
	 */
	completeOptions: IScriptEditorCompleteOptions;

	/**
	 * Required
	 */
	defProvider: IScriptDefProvider;
}

/**
 * Autocomplete options
 */
export interface IScriptEditorCompleteOptions {
	/**
	 * Tern server request option
	 */
	caseInsensitive?: boolean;
	/**
	 * Tern server request option
	 */
	guess?: boolean;
	/**
	 * Tern server request option
	 */
	includeKeywords?: boolean;
}
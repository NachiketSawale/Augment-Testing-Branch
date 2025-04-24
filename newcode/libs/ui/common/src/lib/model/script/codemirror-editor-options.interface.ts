/*
 * Copyright(c) RIB Software GmbH
 */

import { CodemirrorLanguageModes } from './codemirror-language-modes.enum';

/**
 * CodeMirror Options Properties for configuration
 */
export interface ICodemirrorEditorOptions {
	readOnly: boolean,
	multiline: boolean,
	languageMode: CodemirrorLanguageModes,
	enableLineNumbers: boolean,
	enableBorder?: boolean
	isInputOutput?: boolean
}

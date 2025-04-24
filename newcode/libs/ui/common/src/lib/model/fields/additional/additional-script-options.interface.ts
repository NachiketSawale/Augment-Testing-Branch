/*
 * Copyright(c) RIB Software GmbH
 */

import { ICodemirrorEditorOptions } from '../../script/codemirror-editor-options.interface';

/**
 * Defines additional options for script editor fields.
 *
 * @group Fields API
 */
export interface IAdditionalScriptOptions {
	editorOptions: ICodemirrorEditorOptions
}

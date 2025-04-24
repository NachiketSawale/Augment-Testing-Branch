/*
 * Copyright(c) RIB Software GmbH
 */

import { StringStream } from '@codemirror/language';

/**
 * Filter Script State
 */
export interface IQueryEditorState {
	tokenize(stream: StringStream, state: IQueryEditorState): string | null;
}

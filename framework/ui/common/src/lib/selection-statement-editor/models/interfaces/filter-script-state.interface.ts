/*
 * Copyright(c) RIB Software GmbH
 */

import { StringStream} from '@codemirror/language';

/**
 * Filter Script State
 */
export interface IFilterScriptState{
	tokenize(stream : StringStream, state: IFilterScriptState): string | null;
}
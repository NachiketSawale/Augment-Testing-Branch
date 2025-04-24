/*
 * Copyright(c) RIB Software GmbH
 */

import { IEditorDialog } from '@libs/ui/common';

export interface IAsyncActionEditorDialog<TValue> extends IEditorDialog<TValue> {
	loading: boolean;
}
/*
 * Copyright(c) RIB Software GmbH
 */

import { IEditorDialog } from '@libs/ui/common';

export interface ICompareExportUserDecisionEditorDialog extends IEditorDialog<boolean> {
	loading: boolean;
	message: string;
}
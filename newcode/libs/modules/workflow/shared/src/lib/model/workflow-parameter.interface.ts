/*
 * Copyright(c) RIB Software GmbH
 */

import { ICodemirrorEditorOptions } from '@libs/ui/common';
import { Translatable } from '@libs/platform/common';

export interface IWorkflowParameter {
	id?: number,
	key: string,
	value: string,
	editorOptions: ICodemirrorEditorOptions,
	label: Translatable
}

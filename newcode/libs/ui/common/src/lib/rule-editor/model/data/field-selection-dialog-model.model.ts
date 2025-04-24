/*
 * Copyright(c) RIB Software GmbH
 */

import { InjectionToken } from '@angular/core';
import { IEntityFieldTreeSelectionOptions } from '../representation/entity-field-tree-selection-option.interface';
import { SchemaGraphNode } from '../schema-graph-node/schema-graph-node.class';

/***
 * Field selection dialog state
 */
export class FieldSelectionDialogModel {

	/***
	 * The selected node
	 */
	public selectedNode?: SchemaGraphNode;

	/***
	 * Configuration Options for the tree selection
	 */
	public options!: IEntityFieldTreeSelectionOptions;
}

/***
 * Field selection dialog model injection token
 */
export const FIELD_SELECTION_DLG_MODEL_TOKEN = new InjectionToken<FieldSelectionDialogModel>('field-selection-dlg-model');
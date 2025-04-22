/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { EntityFieldTreeSelectionComponent } from '../entity-field-tree-selection/entity-field-tree-selection.component';
import { IEntityFieldTreeSelectionOptions } from '../../model/representation/entity-field-tree-selection-option.interface';
import { UiCommonDialogService } from '../../../dialogs/base/services/dialog.service';
import { FIELD_SELECTION_DLG_MODEL_TOKEN, FieldSelectionDialogModel } from '../../model/data/field-selection-dialog-model.model';
import { ICustomDialogOptions } from '../../../dialogs/base/model/interfaces/custom-dialog-options.interface';
import { SchemaGraphNode } from '../../model/schema-graph-node/schema-graph-node.class';
import { IDdStateConfig } from '../../model/representation/dd-state-config.interface';



/***
 * Shows the Field Selection
 */
@Component({
	selector: 'ui-common-expression-field-selector',
	templateUrl: './expression-field-selector.component.html',
	styleUrls: ['./expression-field-selector.component.scss']
})
export class ExpressionFieldSelectorComponent {

	/***
	 * Field selected event emitter
	 */
	@Output()
	public $onSelectedNode: EventEmitter<SchemaGraphNode> = new EventEmitter<SchemaGraphNode>();

	@Input()
	public ddStateConfig?: IDdStateConfig;

	/***
	 * The selected field
	 */
	public selectedNode?: SchemaGraphNode;

	private dialogService = inject(UiCommonDialogService);



	/***
	 * select column button click handler. opens the field selection dialog
	 */
	public onSelectColumnClicked() {
		this.openFieldTreeSelectionDialog();
	}

	private openFieldTreeSelectionDialog() {
		const fieldSelectionOptions: IEntityFieldTreeSelectionOptions = {
			alongPath: '',
			maxDepth: 1,
			moduleName: this.ddStateConfig?.moduleName ?? '',
			tableName: this.ddStateConfig?.focusTableName ?? ''
		};

		const dlgModel = new FieldSelectionDialogModel();
		dlgModel.options = fieldSelectionOptions;

		const dlgOptions : ICustomDialogOptions<string, EntityFieldTreeSelectionComponent> = {
			bodyComponent: EntityFieldTreeSelectionComponent,
			bodyProviders: [
				{
					provide: FIELD_SELECTION_DLG_MODEL_TOKEN,
					useValue: dlgModel
				}
			],
			buttons: [
				{
					id: 'ok',
					caption: {key: 'ui.common.dialog.okBtn'},
				},
				{
					id: 'cancel',
					caption: {key: 'ui.common.dialog.cancelBtn'},
				},
			],
			width: '60%'
		};

		this.dialogService.show(dlgOptions)?.then(result => {
			if(dlgModel.selectedNode) {
				this.selectedNode = dlgModel.selectedNode;
				this.$onSelectedNode.emit(this.selectedNode);
			}
		});
	}

	/***
	 * Gets the selected field title
	 */
	public get fieldTitle() {

		return this.getFieldDisplayName(this.selectedNode);
	}

	private getFieldDisplayName(node: SchemaGraphNode | undefined) {
		if(!node) {
			return '';
		}

		if(!node.path || !node.path.includes('.')){
			return node.name;
		} else {
			const prefix = node.path.substring(node.path.indexOf('.')+1);
			console.log(node.path, prefix);
			return prefix.replace('.', '►') + '►' + node.name;
		}
	}
}

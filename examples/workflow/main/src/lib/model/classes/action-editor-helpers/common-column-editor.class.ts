/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, IGridConfiguration } from '@libs/ui/common';
import { IActionParam, IWorkflowAction } from '@libs/workflow/interfaces';
import { ActionEditorBase, ActionEditorGridColumns } from '../common-action-editors/action-editor-base.class';
import { StandardViewGridConfig } from '../../types/standard-view-configuration.type';
import { IGridProperties } from '../../interfaces/action-editor/grid-view-properties.interface';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';

/**
 * Common editor class that renders editor view grid with `Key` and `Value` columns.
 */
export class CommonColumnEditor extends ActionEditorBase<ActionEditorGridColumns> {
	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);
	}

	protected override setGridProperties(standardviewGridConfig: StandardViewGridConfig<IActionParam, IWorkflowAction, ActionEditorGridColumns>): IGridProperties<IActionParam, ActionEditorGridColumns> {
		const gridConfiguration: IGridConfiguration<ActionEditorGridColumns> = {
			uuid: '77bdb2bc27c84a47a45e867e4ff80659',
			columns: [
				{
					id: 'key',
					model: 'Key',
					sortable: true,
					label: { key: 'basics.workflow.action.key' },
					type: FieldType.Description,
					visible: true,
				},
				{
					id: 'value',
					model: 'Value',
					sortable: true,
					label: { key: 'basics.workflow.action.value' },
					type: FieldType.Description,
					visible: true,
				}
			],
			skipPermissionCheck: true
		};

		const itemSetter = (gridInput: IActionParam) => {
			return (gridInput.value).split(';').map((item, index) => {
				return {
					Id: index,
					Key: item.split(':')[0] ?? '',
					Value: item.split(':')[1] ?? ''
				};
			}).filter(item => item.Key !== '');
		};

		const itemGetter = (gridContent: ActionEditorGridColumns[]) => {
			let stringContent = '';
			if (gridContent) {
				stringContent = gridContent.map((item) => {
					if (item.Key === undefined && item.Value === undefined) {
						return '';
					}
					return `${item.Key ?? ''}:${item.Value ?? ''}`;
				}).join(';');
			}
			this.getActionObj(standardviewGridConfig.formRowId, standardviewGridConfig.formGroupId!).value = stringContent;
		};

		return {
			itemGetter,
			itemSetter,
			gridConfiguration,
			enableToolbarActions: true
		};
	}
}
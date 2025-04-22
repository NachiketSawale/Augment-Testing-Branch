/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, OnDestroy, inject } from '@angular/core';
import { ContainerBaseComponent } from '@libs/ui/container-system';
import { ColumnDef, FieldType, IFieldValueChangeInfo, IGridConfiguration } from '@libs/ui/common';
import { Subscription } from 'rxjs';
import { IActionParam, IWorkflowAction } from '@libs/workflow/interfaces';
import { BasicsWorkflowActionDataService } from '../../services/workflow-action/workflow-action.service';
import { PropertyType } from '@libs/platform/common';

export class InputDefinitionEntity {
	public constructor(public Id: number) {
	}
	public Key?: string;
	public Value?: string;
}
/**
 * Container for displaying/editing input parameters for an action in the workflow module.
 */
@Component({
	selector: 'workflow-main-input-parameters-container',
	templateUrl: './workflow-input-parameters-container.component.html',
	styleUrls: ['./workflow-input-parameters-container.component.scss'],
})
export class WorkflowInputParametersContainerComponent extends ContainerBaseComponent implements OnDestroy {
	private dataColumns: ColumnDef<InputDefinitionEntity>[] = (this.createRows() as ColumnDef<InputDefinitionEntity>[]).map(row => {
		row.visible = true;
		row.width = 200;
		return row;
	});

	public configuration: IGridConfiguration<InputDefinitionEntity> = {};

	private selectedAction$: Subscription;
	private selectedAction!: IWorkflowAction | null;
	private result$?: Subscription;
	private readonly actionService = inject(BasicsWorkflowActionDataService);

	/**
	 * Initializes component with ui addons, container definition and workflow action data service
	 * //@param workflowActionDataService
	 */
	public constructor(/*private modalDialogService: UiCommonDialogService*/) {
		super();
		this.selectedAction$ = this.actionService.selectedAction$.subscribe((action: IWorkflowAction | null) => {
			this.selectedAction = action;
			const inputParams: InputDefinitionEntity[] = [];
			if (action) {
				action.input?.forEach((inputItem: IActionParam) => {
					const tmp: InputDefinitionEntity = {
						Id: inputItem.id,
						Key: inputItem.key,
						Value: inputItem.value
					};
					inputParams.push(tmp);
				});
			}
			this.configuration = {
				uuid: 'a8601aedc43e42fab13fee63a84d01f6',
				columns: this.dataColumns,
				items: inputParams
			};
		});
	}

	/**
	 * ToDO comment
	 */
	public valueChanged(info: IFieldValueChangeInfo<InputDefinitionEntity>) {
		if (this.selectedAction) {
			this.selectedAction.input?.forEach((inputItem: IActionParam) => {
				if (inputItem.id === info.entity.Id && info.newValue !== null && info.newValue !== undefined) {
					inputItem.value = info.newValue.toString();
				}
			});
		}
	}

	/**
	 * This method is invoked once the component is destroyed. All subscriptions are cleaned in this method.
	 */
	public override ngOnDestroy() {
		// unsubscribing to selected action subject from action data service
		this.selectedAction$.unsubscribe();
		this.result$?.unsubscribe();

		super.ngOnDestroy();
	}

	private createRows(): ColumnDef<InputDefinitionEntity>[] {
		const change = (key: string) => {
			return (changeInfo: IFieldValueChangeInfo<InputDefinitionEntity, PropertyType>) => {
				this.actionService?.setFieldModified(key, changeInfo.newValue);
			};
		};

		return [{
			id: 'key',
			label: {
				text: 'Key',
			},
			keyboard: {
				enter: true,
				tab: true
			},
			readonly: true,
			sortable: false,
			type: FieldType.Description,
			model: 'Key',
			change: change('Key')
		}, {
			id: 'value',
			label: {
				text: 'Value',
			},
			keyboard: {
				enter: true,
				tab: true
			},
			readonly: false,
			sortable: false,
			type: FieldType.Description,
			model: 'Value',
			change: change('Value')
		}];
	}

}
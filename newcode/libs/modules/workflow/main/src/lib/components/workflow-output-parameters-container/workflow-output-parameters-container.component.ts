/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, OnDestroy, inject } from '@angular/core';
import { ContainerBaseComponent } from '@libs/ui/container-system';
import { ColumnDef, FieldType, IFieldValueChangeInfo, IGridConfiguration } from '@libs/ui/common';
import { Subscription } from 'rxjs';
import { IActionParam, IWorkflowAction } from '@libs/workflow/interfaces';
import { BasicsWorkflowActionDataService } from '../../services/workflow-action/workflow-action.service';
import { InputDefinitionEntity } from '../workflow-input-parameters-container/workflow-input-parameters-container.component';
import { PropertyType } from '@libs/platform/common';

/**
 * Container for displaying/editing output parameters for an action in the workflow module.
 */
@Component({
	selector: 'workflow-main-output-parameters-container',
	templateUrl: './workflow-output-parameters-container.component.html',
	styleUrls: ['./workflow-output-parameters-container.component.scss'],
})
export class WorkflowOutputParametersContainerComponent extends ContainerBaseComponent implements OnDestroy {
	private selectedAction$: Subscription;
	private selectedAction!: IWorkflowAction | null;
	private readonly actionService = inject(BasicsWorkflowActionDataService);
	public configuration: IGridConfiguration<OutputDefinitionEntity> = {};
	private dataColumns: ColumnDef<OutputDefinitionEntity>[] = (this.createRows() as ColumnDef<OutputDefinitionEntity>[]).map(row => {
		row.visible = true;
		row.width = 200;
		return row;
	});

	/**
	 * Initializes Workflow output parameter container
	 */
	public constructor() {
		super();

		// subscribing to selected action subject from action data service
		this.selectedAction$ = this.actionService.selectedAction$.subscribe((action: IWorkflowAction | null) => {
			this.selectedAction = action;
			const outputParams: OutputDefinitionEntity[] = [];
			if (action) {
				action.output?.forEach((outputItem: IActionParam) => {
					const gridItem: OutputDefinitionEntity = {
						Id: outputItem.id,
						Key: outputItem.key,
						Value: outputItem.value
					};
					outputParams.push(gridItem);
				});
			}
			this.configuration = {
				uuid: 'a8601aedc43e42fab13fee63a84d01f6',
				columns: this.dataColumns,
				items: outputParams
			};
		});
	}

	/**
	 * This method is invoked once the component is destroyed. All subscriptions are cleaned in this method.
	 */
	public override ngOnDestroy(): void {
		// unsubscribing to selected action subject from action data service
		this.selectedAction$.unsubscribe();

		super.ngOnDestroy();
	}

	/**
	 * ToDO comment
	 */
	public valueChanged(info: IFieldValueChangeInfo<InputDefinitionEntity>) {
		if(this.selectedAction){
			this.selectedAction.output?.forEach((outputItem: IActionParam) => {
				if(outputItem.id === info.entity.Id && info.newValue !== null && info.newValue !== undefined) {
					outputItem.value = info.newValue.toString();
				}
			});
		}
	}

	private createRows(): ColumnDef<OutputDefinitionEntity>[] {
		const change = (model: string) => {
			return (changeInfo: IFieldValueChangeInfo<InputDefinitionEntity, PropertyType>) => {
				this.actionService?.setFieldModified(model, changeInfo.newValue);
			};
		};

		return [{
			id: 'key',
			label: {
				text: 'Key',
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
			readonly: false,
			sortable: false,
			type: FieldType.Description,
			model: 'Value',
			change: change('Value')
		}];
	}
}

export class OutputDefinitionEntity{
	public constructor(public Id: number) {
	}
	public Key?: string;
	public Value?: string;
}
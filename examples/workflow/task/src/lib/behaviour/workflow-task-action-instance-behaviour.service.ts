/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { inject, Injectable } from '@angular/core';
import { ISearchPayload, PlatformTranslateService } from '@libs/platform/common';
import { IWorkflowActionInstanceTask } from '@libs/workflow/shared';
import { WorkflowTaskActionInstanceDataService } from '../service/workflow-task-action-instance-data.service';
import { ConcreteMenuItem, ItemType, IYesNoDialogOptions, StandardDialogButtonId, UiCommonMessageBoxService } from '@libs/ui/common';
import * as _ from 'lodash';
import { WorkflowClientAction } from '@libs/workflow/interfaces';

/**
 * Behaviour used to control workflow action instance configuration grid in workflow task module.
 */
@Injectable({
	providedIn: 'root'
})
export class WorkflowTaskActionInstanceBehaviourService implements IEntityContainerBehavior<IGridContainerLink<IWorkflowActionInstanceTask>, IWorkflowActionInstanceTask> {
	private readonly actionInstanceDataService = inject(WorkflowTaskActionInstanceDataService);
	private readonly translationService = inject(PlatformTranslateService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);

	private disableButtons: boolean = false;

	private loadActionInstances(containerLink: IGridContainerLink<IWorkflowActionInstanceTask>): void {
		const searchPayload: ISearchPayload = {
			executionHints: false,
			filter: '',
			includeNonActiveItems: false,
			isReadingDueToRefresh: false,
			pageNumber: 0,
			pageSize: 100,
			pattern: '',
			pinningContext: [],
			projectContextId: null,
			useCurrentClient: true
		};
		this.actionInstanceDataService.refresh(searchPayload).then(data => {
			containerLink.gridData = data.dtos;
		});
	}

	/**
	 * On container creation callback.
	 * @param containerLink
	 */
	public onCreate(containerLink: IGridContainerLink<IWorkflowActionInstanceTask>) {
		this.loadActionInstances(containerLink);

		const menuItems: ConcreteMenuItem[] = [
			{
				caption: {key: 'basics.workflowTask.tools.finishTask'},
				iconClass: 'tlb-icons ico-info' /*ico-task-ok'*/,
				type: ItemType.Item,
				sort: 0,
				fn: async () => {
					this.disableButtons = true;
					await this.bulkFinishTaskRecord();
					this.disableButtons = false;
				},
				disabled: () => {
					const selection = this.actionInstanceDataService.getSelection();
					if (!_.isEmpty(selection)) {
						return this.disableButtons || _.some(selection, function (task) {
							return task.ActionId !== WorkflowClientAction.UserInput;
						});
					}
					return true;
				}
			},
			{
				caption: {key: 'basics.workflowTask.tools.escalateTask'},
				iconClass: 'tlb-icons ico-delete' /*ico-task-escalate'*/,
				type: ItemType.Item,
				sort: 1,
				fn: async () => {
					this.disableButtons = true;
					await this.deleteTaskRecord();
					this.disableButtons = false;
				},
				disabled: () => {
					return _.isEmpty(this.actionInstanceDataService.getSelection()) || this.disableButtons;
				}
			}
		];
		containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete', 'print', 'columnFilter', 'clipboard']);
		containerLink.uiAddOns.toolbar.addItems(menuItems);
	}

	private async bulkFinishTaskRecord() {
		const selectedTaskIdList = this.actionInstanceDataService.getSelection().map(e => e.Id);
		const confirmationHeader = this.translationService.instant('basics.workflowTask.countinueTask.header').text;
		const confirmationMessage = this.translationService.instant('basics.workflowTask.countinueTask.statusConfirmation', {taskCount: selectedTaskIdList.length}).text;
		const finishedHeader = this.translationService.instant('basics.workflowTask.countinueTaskStatus.taskChangeSuccessfully.header').text;
		const finishedMessage = this.translationService.instant('basics.workflowTask.countinueTaskStatus.taskChangeSuccessfully.taskFinishedStatus', {taskCount: selectedTaskIdList.length}).text;

		const options: IYesNoDialogOptions = {
			defaultButtonId: StandardDialogButtonId.Yes,
			id: 'finishTasks',
			headerText: confirmationHeader,
			bodyText: confirmationMessage
		};
		const result = await this.messageBoxService.showYesNoDialog(options);

		if (result?.closingButtonId === StandardDialogButtonId.Yes) {
			await this.actionInstanceDataService.continueWorkflowByActionInBulk(selectedTaskIdList);
			// only grid deletion, backend deletion should not happen (will not atm cause of no version)
			// also selection is not changed after deletion (deleted entities are still selected)
			this.actionInstanceDataService.delete(this.actionInstanceDataService.getSelection());
			this.messageBoxService.showMsgBox(finishedMessage, finishedHeader, 'info');
			//TODO: select next item in grid
		}
	}

	private async deleteTaskRecord() {
		const selectedTaskIdList = this.actionInstanceDataService.getSelection().map(e => e.Id);
		const confirmationHeader = this.translationService.instant('basics.workflowTask.deleteTask.header').text;
		const confirmationMessage = this.translationService.instant('basics.workflowTask.deleteTask.deleteConfirmation', {taskCount: selectedTaskIdList.length}).text;
		const finishedHeader = this.translationService.instant('basics.workflowTask.action.escalation.header').text;
		const finishedMessage = this.translationService.instant('basics.workflowTask.action.escalation.taskEscalation', {taskCount: selectedTaskIdList.length}).text;

		const options: IYesNoDialogOptions = {
			defaultButtonId: StandardDialogButtonId.No,
			id: 'deleteTasks',
			headerText: confirmationHeader,
			bodyText: confirmationMessage
		};
		const result = await this.messageBoxService.showYesNoDialog(options);

		if (result?.closingButtonId === StandardDialogButtonId.Yes) {
			this.actionInstanceDataService.escalateTaskInBulk(selectedTaskIdList).then(() => {
				// only grid deletion, backend deletion should not happen (will not atm cause of no version)
				// also selection is not changed after deletion (deleted entities are still selected)
				this.actionInstanceDataService.delete(this.actionInstanceDataService.getSelection());
				this.messageBoxService.showMsgBox(finishedMessage, finishedHeader, 'info');
				//TODO: select next item in grid
			});
		}
	}
}
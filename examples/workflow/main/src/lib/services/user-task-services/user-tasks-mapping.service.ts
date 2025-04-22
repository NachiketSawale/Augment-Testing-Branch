import { Injectable, Type } from '@angular/core';
import { LazyInjectable } from '@libs/platform/common';
import { IUserTaskComponent, IUsertaskComponentService, USER_TASK_COMPONENT_SERVICE } from '@libs/workflow/interfaces';
import { WorkflowUserformActionComponent } from '../../components/workflow-client-actions/workflow-userform-action/workflow-userform-action.component';
import { WorkflowUserInputActionComponent } from '../../components/workflow-client-actions/user-input-action/user-input-action.component';
import { WorkflowClientAction } from '@libs/workflow/interfaces';

@LazyInjectable({
	token: USER_TASK_COMPONENT_SERVICE,
	useAngularInjection: true
})

/**
 * A class used to provide the user-task component mapping based on its ActionId parameter.
 */
@Injectable({
	providedIn: 'root'
})
export class UsertaskComponentMappingService implements IUsertaskComponentService {

	private componentMap = new Map<string, Type<IUserTaskComponent>>([
		[WorkflowClientAction.UserForm, WorkflowUserformActionComponent],
		[WorkflowClientAction.UserInput, WorkflowUserInputActionComponent]
	]);

	/**
	 * To provide user-task component instance
	 * @param actionId
	 * @returns
	 */
	public getComponentByActionId(actionId: string): Type<IUserTaskComponent> {
		return this.componentMap.get(actionId)!;
	}

}
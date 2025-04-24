/*
 * Copyright(c) RIB Software GmbH
 */


import { Injectable, inject } from '@angular/core';
import { IIdentificationData, LazyInjectable, PlatformHttpService } from '@libs/platform/common';
import { cloneDeep, each, find, isObject, isString, remove } from 'lodash';
import { BasicsWorkflowActionDataService } from '../workflow-action/workflow-action.service';
import {
	WorkflowClientUuid,
	IActionParam,
	DebugContext,
	IWorkflowActionTask,
	IWorkflowInstance,
	IWorkflowInstanceService,
	WORKFLOW_INSTANCE_SERVICE,
	WorkflowContinueActionInstance,
	WorkflowInstanceStatus
} from '@libs/workflow/interfaces';

type WorkflowInstanceData = {
	TemplateId: number;
	EntityId?: IIdentificationData | number | null;
	JsonContext?: string;
	Identification?: IIdentificationData | null;
}

@LazyInjectable({
	token: WORKFLOW_INSTANCE_SERVICE,
	useAngularInjection: true
})

/**
 * Service used to handle the execution of a workflow template.
 */
@Injectable({
	providedIn: 'root',
})
export class WorkflowInstanceService implements IWorkflowInstanceService {
	private readonly workflowActionService = inject(BasicsWorkflowActionDataService);
	private workflowCallbackListener: ((instance?: IWorkflowInstance) => void)[] = [];
	private readonly httpService = inject(PlatformHttpService);

	/**
	 * Starts a new workflow instance for selected workflow template
	 * @param id
	 * @param entityIdOrIdent
	 * @param jsonContext
	 * @param suppressPopup
	 */
	public startWorkflow(id: number, entityIdOrIdent?: IIdentificationData | number, jsonContext?: string, suppressPopup?: boolean): Promise<IWorkflowInstance | undefined> {
		//TODO: Add module name
		const endpoint: string = 'basics/workflow/instance/start';
		const request: WorkflowInstanceData = {
			TemplateId: id,
			EntityId: isObject(entityIdOrIdent) ? null : entityIdOrIdent,
			JsonContext: jsonContext,
			Identification: isObject(entityIdOrIdent) ? entityIdOrIdent as IIdentificationData : null
		};
		return this.httpService.post<IWorkflowInstance>(endpoint, request).then(this.workflowCallback);
	}

	//Start workflow by event
	public startWorkflowByEvent(uuid: WorkflowClientUuid, entityIdOrIdent: IIdentificationData | number | null, jsonContext: string | null, suppressPopup: boolean = false): Promise<IWorkflowInstance | undefined> {
		//TODO: Add module name
		const endpoint: string = 'basics/workflow/instance/startbyevent';
		const request = {
			UUID: uuid,
			EntityId: isObject(entityIdOrIdent) ? null : entityIdOrIdent,
			Context: jsonContext,
			Identification: isObject(entityIdOrIdent) ? entityIdOrIdent : null
		};
		const workflowCallbackListener = this.workflowCallbackListener;
		return this.httpService.post<IWorkflowInstance>(endpoint, request).then((response) => this.workflowCallback(response, workflowCallbackListener));
	}

	//Start workflow bulk
	public startWorkflowBulk(id: number, entityIdsOrIdents: number[] | IIdentificationData[], jsonContext: string) {
		//TODO: Add module name
		const endpoint: string = 'basics/workflow/instance/startbulk';
		const request = {
			TemplateId: id,
			EntityIds: isObject(entityIdsOrIdents) && isObject(entityIdsOrIdents[0]) ? [] : entityIdsOrIdents,
			JsonContext: jsonContext,
			Identification: isObject(entityIdsOrIdents) && isObject(entityIdsOrIdents[0]) ? entityIdsOrIdents : []
		};
		return this.httpService.post<IWorkflowInstance>(endpoint, request).then(this.workflowCallback);
	}

	//Start workflow different context
	public startWorkflowDifferentContext(id: number, entityId: number, jsonContextList: string[], suppressPopup = false) {
		//TODO: Add module name
		const endpoint: string = 'basics/workflow/instance/startWorkflowDifferentContext';
		const request = {
			TemplateId: id,
			EntityId: entityId,
			JsonContextList: jsonContextList
		};
		return this.httpService.post<IWorkflowInstance>(endpoint, request).then(this.workflowCallback);
	}

	//Continue workflow
	public continueWorkflow(task: WorkflowContinueActionInstance, callback?: (instance?: IWorkflowInstance) => void) {
		const data = cloneDeep(task);

		if (!isString(data.Context)) {
			data.Context = JSON.stringify(data.Context);
		}

		if (!isString(data.Output)) {
			data.Output = JSON.stringify(data.Output);
		}

		const endpoint = 'basics/workflow/instance/continue';

		const callbackFn = callback !== undefined ? callback : this.workflowCallback;
		return this.httpService.post<IWorkflowInstance>(endpoint, data).then((response) => callbackFn(response));
	}

	//Stop workflow
	public stopWorkflow(instanceId: number) {
		const endpoint = 'basics/workflow/instance/stop';
		const httpOptions = {params: {instanceId: instanceId}, headers: {errorDialog: 'false'}};
		return this.httpService.post<IWorkflowInstance>(endpoint, {}, httpOptions).then(this.workflowCallback);
	}

	//escalate workflow
	public async escalateTask(id: number) {
		const endpoint = 'basics/workflow/instance/escalatebyaction';
		const httpOption = {
			params: {
				'actionId': id,
			},
			headers: {errorDialog: 'false'}
		};
		const result = await this.httpService.get<IWorkflowInstance>(endpoint, httpOption);
		this.workflowCallbackListener.forEach((callback) => {
			callback(result);
		});
	}

	//escalate workflow in bulk
	public async escalateTaskInBulk(taskList: string[]) {
		const endpoint = 'basics/workflow/instance/escalatebyactioninbulk';
		const httpOptions = {body: taskList, headers: {errorDialog: 'false'}};

		const result = await this.httpService.post<IWorkflowInstance>(endpoint, {}, httpOptions);
		this.workflowCallbackListener.forEach((callback) => {
			callback(result);
		});
	}

	//continue workflow by action
	public async continueWorkflowByActionInBulk(taskList: string[]) {
		const endpoint = 'basics/workflow/instance/continueworkflowbyactioninbulk';
		const httpOptions = {body: taskList, headers: {errorDialog: 'false'}};

		const result = await this.httpService.post<IWorkflowInstance>(endpoint, {}, httpOptions);
		this.workflowCallbackListener.forEach((callback) => {
			callback(result);
		});
	}

	/**
	 * Register workflow callback that will be executed once a workflow action has finished executing.
	 * @param fn
	 */
	public registerWorkflowCallback(fn: (instance?: IWorkflowInstance) => void) {
		this.workflowCallbackListener.push(fn);
	}

	/**
	 * Unregister workflow callbacks
	 * @param fn
	 */
	public unregisterWorkflowCallback(fn: (instance?: IWorkflowInstance) => void) {
		remove(this.workflowCallbackListener, (item) => {
			return item === fn;
		});
	}

	private workflowCallback(wfInstance?: IWorkflowInstance, workflowCallbackListener?: ((instance?: IWorkflowInstance) => void)[]): IWorkflowInstance | undefined {
		if (wfInstance) {
			if (wfInstance.Status) {
				wfInstance.StatusName = WorkflowInstanceStatus[wfInstance.Status];
			}

			let context;
			switch (wfInstance.Status) {
				case WorkflowInstanceStatus.Failed:
				case WorkflowInstanceStatus.Escalate:
					context = JSON.parse(wfInstance.Context);
					if (context.Exception) {
						wfInstance.ErrorMessage = context.Exception.Message;
					}
					break;
				case WorkflowInstanceStatus.ValidationError:
					context = JSON.parse(wfInstance.Context);
					if (context.ValidationException) {
						wfInstance.ErrorMessage = context.ValidationException.Message;
					}
					break;
				case WorkflowInstanceStatus.Finished:
				case WorkflowInstanceStatus.Waiting:
					workflowCallbackListener?.forEach((listener) => {
						listener(wfInstance);
					});
					break;
			}
		}
		return wfInstance;
	}

	public prepareTask(task: IWorkflowActionTask, context: object | DebugContext) {

		if (isString(task.Context)) {
			(task.Context as unknown as object) = this.saveFromJson(task.Context) as object;
			context = this.saveFromJson(task.Context) as object;
		}

		this.replaceFactory('Comment', context)(task);

		//TODO: Add date processor for endtime and started fields.
		//var processor = new BasicsCommonDateProcessor(['Endtime', 'Started']);
		//processor.processItem(item);

		//Parse input to object
		if (isString(task.input)) {
			task.input = this.saveFromJson(task.input) as IActionParam[];
		}

		//Parse output to object
		if (isString(task.output)) {
			task.output = this.saveFromJson(task.output) as IActionParam[];
		}

		this.prepareActionInput(task, context);
		this.prepareActionTitleAndSubtitle(task);
		this.prepareActionAndStatus(task);

		return task;
	}

	private prepareActionInput(task: IWorkflowActionTask, context: object) {
		if (task.actionId === '00000000000000000000000000000000') {
			each(task.input as IActionParam[], this.replaceFactory<IActionParam>('value', context, true));
		} else {
			each(task.input as IActionParam[], this.replaceFactory<IActionParam>('value', context));
		}
	}

	private prepareActionTitleAndSubtitle(task: IWorkflowActionTask): void {
		const configObj = find(task.input as IActionParam[], {key: 'Config'});
		let titleObj;
		let subTitleObj;

		if (configObj) {

			const configObjValue: {
				description: string,
				type: string,
				context: string,
				options: {
					displayText: string
				},
				visibleCondition: string,
				showDescriptionInFrontAsLabel: string
			}[] = JSON.parse(configObj.value);

			titleObj = find(configObjValue, {description: 'Title'});

			if (titleObj) {
				try {
					task.Title = titleObj.options.displayText;
				} catch (ex) {
					task.Title = task.Description;
				}
			}

			subTitleObj = find(configObjValue, {description: 'Subtitle'});
			if (subTitleObj) {
				try {
					task.SubTitle = subTitleObj.options.displayText;
				} catch (ex) {
					task.SubTitle = task.Comment;
				}
			}

		} else {
			titleObj = find(task.input as IActionParam[], {key: 'Title'});
			if (titleObj) {
				task.Title = titleObj.value;
			}
			subTitleObj = find(task.input as IActionParam[], {key: 'Subtitle'});
			if (subTitleObj) {
				task.SubTitle = subTitleObj.value;
			}
		}
	}

	private prepareActionAndStatus(task: IWorkflowActionTask) {
		if (task.actionId) {
			task.Action = this.workflowActionService.getActionById(task.actionId);
		}

		if (task.Status) {
			task.StatusName = WorkflowInstanceStatus[task.Status];
		}
	}

	private replaceFactory<T extends object = IWorkflowActionTask>(prop: keyof T, context: object, displaySpecialChars = false) {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const self = this;
		return function replaceContextParam(obj: T) {
			// eslint-disable-next-line no-useless-escape
			const regEx = new RegExp('\{\{(.*?)\}\}', 'g');
			const propValue = obj[prop];
			if (propValue && isString(propValue)) {
				[...propValue.matchAll(regEx)].forEach((match) => {
					try {
						let value = self.getFromContextJs(context, match[0]);
						if (isObject(value)) {
							value = JSON.stringify(value);
						}

						if (isString(value)) {
							value = value.replace(/[\n\r\t]+/gm, '');
						}

						if (value !== '' && self.isJson(value)) {
							(obj[prop] as string) = propValue.replace('"' + match[0] + '"', value);
						} else if (isString(value) && displaySpecialChars) {
							value = value.replace(/\\/gm, '\\\\');
							value = value.replace(/\\"/g, '\\\\"');
						}
						(obj[prop] as string) = propValue.replace(match[0], value);
					} catch (err) {
						console.error(err);
					}
				});

			}

		};
	}

	private saveFromJson(obj: string | object): string | object {
		if (typeof obj === 'string' && obj.length > 0) {
			try {
				const objAsJson = JSON.parse(obj);
				return isObject(objAsJson) ? objAsJson : this.saveFromJson(objAsJson);
			} catch (err) {
				return '';
			}
		}
		return '';
	}

	private getFromContextJs(context: object, placeholder: string) {
		const path = placeholder.replace('{{', '').replace('}}', '');

		const fn = new Function('Context', 'return ' + path + ';');
		const fnFallback = new Function('Context', 'return Context.' + path + ';');
		let result;
		try {
			result = fn(context);
		} catch (e) {
			try {
				result = fnFallback(context);
				if (result === undefined) {
					result = placeholder;
				}
			} catch (e) {
				result = placeholder;
			}
		}
		return result;
	}

	private isJson(str: string | object) {
		str = typeof str !== 'string' ? JSON.stringify(str) : str;
		try {
			str = JSON.parse(str);
		} catch (e) {
			return false;
		}
		if (typeof str === 'object' && str !== null) {
			return true;
		}
		return false;
	}
}

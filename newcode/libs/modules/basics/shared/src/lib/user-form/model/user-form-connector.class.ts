/*
 * Copyright(c) RIB Software GmbH
 */

import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import { firstValueFrom, Subject, Subscription } from 'rxjs';
import { IUserFormCompleteData } from './interfaces/user-form-complete-data.interface';
import { BasicsSharedUserFormClient } from './user-form-client.class';
import { IUserFormDataItem } from './interfaces/user-form-data-item.interface';
import { IUserFormData } from './interfaces/user-form-data.interface';
import { PlatformConfigurationService, ServiceLocator } from '@libs/platform/common';
import { IUserFormConnectorInitializeOptions } from './interfaces/user-form-connector-initialize-options.interface';

/**
 * The connector to connect application and user form.
 */
export class BasicsSharedUserFormConnector {
	private http = ServiceLocator.injector.get(HttpClient);
	private configService = ServiceLocator.injector.get(PlatformConfigurationService);

	private window!: Window;

	public constructor(
		public readonly options: IUserFormConnectorInitializeOptions
	) {
		this.client = new BasicsSharedUserFormClient(this);
	}

	private readonly client: BasicsSharedUserFormClient;

	private formSavedSubscriptions: Subscription[] = [];
	private formSaved: Subject<IUserFormCompleteData> = new Subject<IUserFormCompleteData>;

	private formChangedSubscriptions: Subscription[] = [];
	private formChanged: Subject<IUserFormDataItem[]> = new Subject<IUserFormDataItem[]>();

	private formClosedSubscriptions: Subscription[] = [];
	private formClosed: Subject<void> = new Subject<void>();

	public connect(window: Window) {
		if (this.window) {
			console.warn('The application is connected to the user form!');
			return;
		}
		this.window = window;
		_.extend(this.window, {
			__itwo40: this.client
		});
		// Try executes ready function which defined in custom form.
		const ready = _.get(window, '__itwo40Ready') as unknown as (click: BasicsSharedUserFormClient) => void;
		if (_.isFunction(ready)) {
			ready(this.client);
		}
	}

	public getDataSource(): { [key: string]: unknown } | undefined {
		return this.options.getDataSource ? this.options.getDataSource() : {};
	}

	public registerFormSaved(callback: (data: IUserFormCompleteData) => void) {
		this.formSavedSubscriptions.push(
			this.formSaved.subscribe(callback)
		);
	}

	public registerFormChanged(callback: (changedItems: IUserFormDataItem[]) => void) {
		this.formChangedSubscriptions.push(
			this.formChanged.subscribe(callback)
		);
	}

	public registerFormClosed(callback: () => void) {
		this.formClosedSubscriptions.push(
			this.formClosed.subscribe(callback)
		);
	}

	public emitFormSaved(data: IUserFormCompleteData) {
		this.formSaved.next(data);
	}

	public emitFormChanged(changedItems: IUserFormDataItem[]) {
		this.formChanged.next(changedItems);
	}

	public emitFormClosed() {
		this.formClosed.next();
	}

	public collectFormData(): IUserFormDataItem[] {
		return this.window.document.forms.length ? this.client.collectFormData(this.window.document.forms[0]) : [];
	}

	public toUserFormData(dataItems: IUserFormDataItem[]): IUserFormData[] {
		return dataItems.map(item => {
			return {
				Name: item.name || '',
				Value: item.value !== null && item.value !== undefined ? item.value.toString() : ''
			};
		});
	}

	public saveFormData(formData: IUserFormData[]): Promise<IUserFormCompleteData> {
		const completeFormData = {
			FormId: this.options.formId,
			FormDataId: this.options.formDataId,
			ContextFk: this.options.contextId,
			UserFormData: formData,
			IsReadonly: this.options.isReadonly || false,
			Description: this.options.description || null,
			RubricFk: this.options.rubricFk,
			IntersectionId: this.options.intersectionId
		};

		const saveRequest = firstValueFrom(this.http.post<IUserFormCompleteData>(this.configService.webApiBaseUrl + 'basics/userform/saveformdata', completeFormData));

		return saveRequest.then((response) => {
			this.emitFormSaved(response);

			// Trigger workflow?
			if (response.WorkflowTemplateFk) {
				// TODO-DRIZZLE: To be implemented.
				// basicsWorkflowInstanceService.startWorkflow(response.WorkflowTemplateFk, response.FormDataId, null);
			}

			return response;
		});
	}

	public destroy() {
		this.formSavedSubscriptions.forEach(subscription => {
			subscription.unsubscribe();
		});

		this.formChangedSubscriptions.forEach(subscription => {
			subscription.unsubscribe();
		});

		this.formClosedSubscriptions.forEach(subscription => {
			subscription.unsubscribe();
		});
	}
}
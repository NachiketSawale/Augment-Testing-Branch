/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, Inject, inject } from '@angular/core';
import { createLookup, FieldType, FormRow, IFormConfig } from '@libs/ui/common';
import { UserInputConfig } from '../../../model/user-input-config.interface';
import { WORKFLOW_ACTION_CONTEXT_TOKEN, WORKFLOW_ACTION_INPUT_TOKEN } from '@libs/workflow/shared';
import { ClientActionRows, WorkflowClientAction, IActionParam } from '@libs/workflow/interfaces';
import { CustomElementProcessorUtilService } from '../../../services/custom-element-processor-util.service';
import { IUserTaskComponent } from '@libs/workflow/interfaces';
import { WorkflowAdvanceTypesComponent } from '../workflow-advance-types/workflow-advance-types.component';
import { UserInputSelectTypeLookupService } from '../../../services/workflow-lookup/user-input-select-type-lookup.service';
import { BasicsSharedClerkLookupService, BasicsSharedMaterialLookupService } from '@libs/basics/shared';


/**
 * User-Input client action form configuration.
 */
@Component({
	selector: 'workflow-main-user-input-action',
	templateUrl: './user-input-action.component.html',
	styleUrls: ['./user-input-action.component.scss'],
})
export class WorkflowUserInputActionComponent implements IUserTaskComponent {


	public config!: UserInputConfig[];
	public dialogData!: IFormConfig<ClientActionRows>;
	private advancedTypesSet: Set<string> = new Set([
		'uploadDocuments', 'space', 'title', 'divider', 'label', 'link', 'documentButton', 'entityLink',
		'wizardButton', 'workflowButton', 'reportButton', 'pinboardButton'
	]);

	/**
	 * holds the plain text or custom element for subtitle
	 */
	public dynamicDisplayText: string = '';

	/**
	 * if escapeHTML is false, render the custom template for subtitle.
	 */
	public isEscapeHTML: boolean = true;

	/**
	 * if user-input action is to be displayed on container, hideTitle flag will
	 * be set to true indicating that no subtitle or title is needed.
	 */
	public hideTitle: boolean = false;

	private readonly sanitizeContext = inject(CustomElementProcessorUtilService);

	/**
	 *
	 * @param inputDataInfo contains the input parameter data of user-input action.
	 * @param currentContext contains the current context.
	 */
	public constructor(
		@Inject(WORKFLOW_ACTION_INPUT_TOKEN) public inputDataInfo: IActionParam[],
		@Inject(WORKFLOW_ACTION_CONTEXT_TOKEN) public currentContext: ClientActionRows) {
		this.getUserInputDetails();
	}

	public getComponent(): string {
		return WorkflowClientAction.UserInput;
	}

	/**
	 * this function extracts the input configuration of user-input action and adds the rows accordingly.
	 */
	public getUserInputDetails() {
		const isTaskDetailContext = this.currentContext['isTaskSidebarContainer'] as boolean;
		if (isTaskDetailContext) {
			this.hideTitle = isTaskDetailContext;
			const inputParam = this.inputDataInfo.find(input => input.key === 'Context')?.value;
			if (inputParam) {
				const newContext = typeof inputParam === 'string' ? JSON.parse(inputParam) : inputParam;
				this.currentContext = {
					...this.currentContext,
					...newContext
				};
			}
		}
		const configInput = this.inputDataInfo.find(input => input.key === 'Config')?.value;
		if (configInput) {
			if (typeof (configInput) === 'string') {
				this.config = JSON.parse(configInput);
			} else {
				this.config = configInput;
			}

		}

		this.dialogData = {
			rows: []
		};

		this.config.forEach((item) => {
			item.isTaskSidebarContainer = isTaskDetailContext;
			if (item.type === 'subtitle') {
				this.handleSubtitle(item);
			} else {
				this.dialogData.rows.push(this.prepareFormConfig(item));
			}
		});

		this.dialogData.formId = 'userinput';
		this.dialogData.addValidationAutomatically = true;
		this.dialogData.showGrouping = false;

	}

	public prepareFormConfig(item: UserInputConfig): FormRow<ClientActionRows> {
		if (!(this.isAdvanceType(item.type))) {
			return this.createDomainType(item);
		} else {
			return this.createAdvanceDomainType(item);
		}
	}

	private createDomainType(item: UserInputConfig): FormRow<ClientActionRows> {
		const modelName = this.getModelName(item.context!);
		const itemLabel = this.showDescription(item);
		const isDescriptionEmpty = itemLabel === '';

		let inputRow: FormRow<ClientActionRows>;
		switch (item.type) {
			case 'description':
				inputRow = {
					id: item.type + modelName,
					type: FieldType.Description,
					model: modelName
				};
				break;
			case 'integer':
				inputRow = {
					id: item.type + modelName,
					type: FieldType.Integer,
					model: modelName
				};
				break;
			case 'date':
				inputRow = {
					id: item.type + modelName,
					type: FieldType.Date,
					model: modelName
				};
				break;
			case 'dateutc':
				inputRow = {
					id: item.type + modelName,
					type: FieldType.DateUtc,
					model: modelName
				};
				break;
			case 'money':
				inputRow = {
					id: item.type + modelName,
					type: FieldType.Money,
					model: modelName
				};
				break;
			case 'percent':
				inputRow = {
					id: item.type + modelName,
					type: FieldType.Percent,
					model: modelName
				};
				break;
			case 'factor':
				inputRow = {
					id: item.type + modelName,
					type: FieldType.Factor,
					model: modelName
				};
				break;
			case 'remark':
				inputRow = {
					id: item.type + modelName,
					type: FieldType.Remark,
					model: modelName
				};
				break;
			case 'code':
				inputRow = {
					id: item.type + modelName,
					type: FieldType.Code,
					model: modelName
				};
				break;
			case 'uploadDocuments':
				inputRow = {
					id: item.type + modelName,
					type: FieldType.FileSelect,
					model: modelName,
					options: {
						multiSelect: false,
						retrieveFile: true,
					},
				};
				break;
			case 'clerkLookup':
				inputRow = {
					id: item.type + modelName,
					type: FieldType.Lookup,
					model: modelName,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedClerkLookupService
					})
				};
				break;
			case 'materialLookup':

				inputRow = {
					id: item.type + modelName,
					type: FieldType.Lookup,
					model: modelName,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedMaterialLookupService,
						showClearButton: true,
						showDescription: false,
						showCustomInputContent: true
					})
				};
				break;
			case 'select':
				inputRow = {
					id: item.type + modelName,
					type: FieldType.Lookup,
					model: modelName,
					lookupOptions: createLookup({
						dataService: new UserInputSelectTypeLookupService(item),
						showClearButton: true,
					})
				};
				break;

			default:
				inputRow = {
					id: 'name',
					type: FieldType.Description,
					model: modelName
				};
		}

		if (!isDescriptionEmpty) {
			inputRow.label = {text: item.description};
		}

		return inputRow;
	}

	private createAdvanceDomainType(item: UserInputConfig): FormRow<ClientActionRows> {
		const inputRow: FormRow<ClientActionRows> = {
			id: 'customField' + item.type,
			type: FieldType.CustomComponent,
			componentType: WorkflowAdvanceTypesComponent,
			providers: [
				{provide: 'inputData', useValue: item}
			],
			model: item.type
		};
		return inputRow;
	}

	private handleSubtitle(item: UserInputConfig): void {
		const displayText: string = item.options?.['displayText'] as string;
		this.dynamicDisplayText = this.sanitizeContext.processCustomElement(displayText, 'html');
		this.isEscapeHTML = item.options?.['escapeHtml'] as boolean;
	}

	/**
	 * provides the configuration of form rows to UI common forms.
	 */
	public get formConfig(): IFormConfig<ClientActionRows> {
		return this.dialogData;
	}

	private getModelName(itemName: string | null): string {

		// if the "context" parameter of current item is null or empty, its value should not be bind into debug context.
		if (!itemName || itemName.trim() === '') {
			return '';
		}
		//if "context" starts with "Context." prefix, take its substring as model property
		//else take the context name as it is.
		const contextPrefix = 'Context.';

		if (itemName.startsWith(contextPrefix)) {
			return itemName.substring(contextPrefix.length);
		} else {
			return itemName;
		}
	}

	private showDescription(item: UserInputConfig): string {
		if (item.showDescriptionInFrontAsLabel) {
			return item.description;
		} else {
			return '';
		}

	}

	private isAdvanceType(type: string): boolean {
		return this.advancedTypesSet.has(type);
	}
}

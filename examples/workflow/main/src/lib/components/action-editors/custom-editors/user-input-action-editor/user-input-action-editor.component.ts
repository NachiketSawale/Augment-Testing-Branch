/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, Inject, inject } from '@angular/core';
import { IContainerUiAddOns } from '@libs/ui/container-system';
import { IActionParam, IWorkflowAction, CustomEditorOption } from '@libs/workflow/interfaces';
import { ColumnDef, ConcreteMenuItem, FieldType, FormRow, IDropdownBtnMenuItem, IEditorDialogResult, IFormConfig, IFormDialogConfig, IFormValueChangeInfo, IGridConfiguration, ISimpleMenuItem, ItemType, StandardDialogButtonId, UiCommonFormDialogService } from '@libs/ui/common';
import { IUserInputConfig } from '../../../../model/user-input-config.interface';
import { PARAMETERS_TOKEN, UI_ADDON_TOKEN } from '../../../../constants/workflow-action-editor-id';
import { UserInputEditorToolbarItems } from '../../../../model/enum/user-input-editor-toolbar-items.enum';
import { IUserInputEditorOptions } from '../../../../model/interfaces/user-input-editor-options.interface';
import { userInputEditorItems } from '../../../../constants/user-input-editor-constants';
import { IUserInputCheckboxItem } from '../../../../model/user-input-checkbox-item.interface';
import { ParameterType } from '../../../../model/enum/action-editors/parameter-type.enum';
import { ActionEditorHelper } from '../../../../model/classes/common-action-editors/action-editor-helper.class';

/**
 * UserInputActionEditorComponent : Contains the logic for displaying all functionalities
 * related to "user-input-action-editor" on Action Parameter Container.
 */
@Component({
	selector: 'workflow-main-user-input-action-editor',
	templateUrl: './user-input-action-editor.component.html',
	styleUrls: ['./user-input-action-editor.component.scss'],
})
export class UserInputActionEditorComponent {

	private toolbarItems = userInputEditorItems;
	/**
	 * columnData: stores the user input action config data.
	 */
	private columnData: IUserInputConfig[] = [];
	/**
	 * columns: column configuration for grid.
	 */
	private columns: ColumnDef<IUserInputConfig>[] = [
		{
			id: 'description',
			model: 'description',
			sortable: true,
			label: {
				text: 'Description',
			},
			type: FieldType.Description,
			required: false,
			searchable: true,
			visible: true,
			pinned: false,
		},
		{
			id: 'type',
			model: 'type',
			sortable: true,
			label: {
				text: 'Type',
			},
			type: FieldType.Description,
			required: true,
			searchable: true,
			visible: true,
			pinned: false,
			readonly: true
		},
		{
			id: 'context',
			model: 'context',
			sortable: true,
			label: {
				text: 'Result',
			},
			type: FieldType.Description,
			required: false,
			searchable: true,
			visible: true,
			pinned: false
		},
		{
			id: 'visibleCondition',
			model: 'visibleCondition',
			sortable: true,
			label: {
				text: 'Visible Condition',
			},
			type: FieldType.Description,
			required: false,
			searchable: true,
			visible: true,
			pinned: false
		},
		{
			id: 'showDescriptionInFrontAsLabel',
			model: 'showDescriptionInFrontAsLabel',
			sortable: true,
			label: {
				text: 'Show Description Ahead',
			},
			type: FieldType.Boolean,
			required: false,
			searchable: true,
			visible: true,
			pinned: false
		},

	];
	/**
	 *config: stores the configuration for the grid.
	 */
	public gridConfig: IGridConfiguration<IUserInputConfig>;

	private selectedEntity!: IUserInputConfig;
	/**
	 * Entity data for user-input-editor action with default
	 * values.
	 */
	public userInputConfig: IUserInputCheckboxItem = {
		IsPopUp: false,
		IsNotification: false,
		EvaluateProxy: false,
		DisableRefresh: false,
		AllowReassign: false
	};

	private allowedEditOptionTypes: Set<string> = new Set([
		'title', 'subtitle', 'uploadDocuments', 'label', 'link', 'documentButton',
		'entityLink', 'wizardButton', 'workflowButton', 'reportButton', 'pinboardButton'
	]);

	private readonly formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);
	/**
	 * Initialization of grid data , toolbar and grid config.
	 * @param uiAddons : injection token for toolbar configuration
	 * @param workflowAction :user-input action data.
	 */
	public constructor(@Inject(UI_ADDON_TOKEN) private uiAddons: IContainerUiAddOns, @Inject(PARAMETERS_TOKEN) public workflowAction: IWorkflowAction) {
		this.getGridData();
		this.prepareToolbar();
		this.gridConfig = {
			uuid: '7f93baff24f1464b8444430ca7f5cbad',
			columns: this.columns,
			items: this.columnData,
			skipPermissionCheck: true
		};

		this.transformUserInputData(this.workflowAction.input);
		this.editOption();
	}

	private transformUserInputData(workflowActionInput: IActionParam[]): void {
		const updatedConfig: IUserInputCheckboxItem = { ...this.userInputConfig };
		for (const item of workflowActionInput) {
			if (item.key in updatedConfig) {
				const value = typeof item.value === 'boolean' ? item.value : (item.value === 'true');
				updatedConfig[item.key] = value;
			}
		}
		this.userInputConfig = updatedConfig;
	}

	/**
	 * Toolbar configuration.
	 */
	public prepareToolbar() {
		for (const editorOption in this.toolbarItems) {
			if (Object.prototype.hasOwnProperty.call(this.toolbarItems, editorOption)) {
				const menuItems: ConcreteMenuItem[] = [];
				const currentItem = this.toolbarItems[parseInt(editorOption) as UserInputEditorToolbarItems];
				currentItem.Items.forEach((filteredItem: IUserInputEditorOptions, index: number) => {
					const menuItem: ISimpleMenuItem = {
						caption: { key: filteredItem.Description },
						hideItem: false,
						disabled: false,
						iconClass: '',
						id: filteredItem.ItemType,
						sort: index,
						type: ItemType.Item,
						fn: (info) => {
							info.item.id && this.addGridData(info.item.id);
						},
						permission: '#c',
					};
					menuItems.push(menuItem);
				});

				const item: IDropdownBtnMenuItem = {
					caption: { key: currentItem.Caption },
					hideItem: false,
					iconClass: currentItem.Icons,
					id: currentItem.Caption,
					layoutChangeable: true,
					layoutModes: 'vertical',
					type: ItemType.DropdownBtn,
					list: {
						showTitles: true,
						cssClass: 'radio-group',
						activeValue: 't-addObject',
						items: menuItems
					},
					sort: parseInt(editorOption)
				};
				this.uiAddons.toolbar.addItems([item]);

			}
		}

		const toolbarItems: ConcreteMenuItem[] = [
			{ id: 'd0', type: ItemType.Divider, hideItem: false },
			{
				caption: { key: 'basics.workflow.actionEditor.userInputActionEditor.editOption' },
				hideItem: false,
				iconClass: 'tlb-icons ico-pencil',
				id: 'edit',
				fn: () => {
					this.editOption();
				},
				sort: 6,
				permission: '#c',
				type: ItemType.Item,
				disabled: () => {
					return !this.isbtnDisabled('editoption');
				},
			},
			{
				caption: { key: 'cloud.common.toolbarDelete' },
				disabled: false,
				hideItem: false,
				iconClass: 'tlb-icons ico-rec-delete',
				id: 'delete',
				fn: () => {
					this.deleteGridData();
				},
				sort: 7,
				permission: '#c',
				type: ItemType.Item,
			},
			{ id: 'd0', type: ItemType.Divider, hideItem: false },
			{
				caption: { key: 'basics.workflow.actionEditor.userInputActionEditor.moveUp' },
				hideItem: false,
				iconClass: 'tlb-icons ico-grid-row-up',
				id: 'moveup',
				fn: () => {
					this.moveGridData('up');
				},
				sort: 8,
				permission: '#c',
				type: ItemType.Item,
				disabled: () => {
					return !this.isbtnDisabled('up');
				},
			},
			{
				caption: { key: 'basics.workflow.actionEditor.userInputActionEditor.moveDown' },
				hideItem: false,
				iconClass: 'tlb-icons ico-grid-row-down',
				id: 'movedown',
				fn: () => {
					this.moveGridData('down');
				},
				sort: 9,
				permission: '#c',
				type: ItemType.Item,
				disabled: () => {
					return !this.isbtnDisabled('down');
				},
			}
		];
		this.uiAddons.toolbar.addItems(toolbarItems);
	}
	/**
	 * callback fn used to store selected row data into selectedEntity property.
	 * @param selectedItems
	 */
	public selectionChanged(selectedItems: IUserInputConfig[]) {
		if (selectedItems.length > 0) {
			this.selectedEntity = selectedItems[0];
		}
	}

	private getGridData() {
		const userInputData = this.workflowAction.input.find(input => input.key === 'Config')?.value;
		if (userInputData) {
			if (typeof userInputData === 'string') {
				this.columnData = JSON.parse(userInputData);
			} else {
				this.columnData = userInputData;
			}
			this.columnData.forEach((item: IUserInputConfig, index: number) => {
				item.Id = index + 1;
			});
		}
	}

	private addGridData(newItem: string) {
		const maxId = Math.max(...this.columnData.map(item => item.Id!), 0) + 1;
		const newRow: IUserInputConfig = {
			description: '',
			type: newItem,
			context: null,
			showDescriptionInFrontAsLabel: false,
			visibleCondition: '',
			Id: maxId
		};
		this.columnData.push(newRow);
		this.gridConfig = {
			uuid: '7f93baff24f1464b8444430ca7f5cbad',
			columns: this.columns,
			items: this.columnData,
			containerType: 0
		};
		this.selectedEntity = newRow;
		this.updateConfigParam();
	}

	private updateConfigParam(): void {
		const configIndex = this.workflowAction.input.findIndex(i => i.key === 'Config');
		if (configIndex !== -1) {
			const updateConfig = this.columnData.map(({ Id, ...rest }) => rest);
			this.workflowAction.input[configIndex].value = JSON.stringify(updateConfig);
		}

	}

	private moveGridData(direction: string) {
		if (!this.selectedEntity) {
			return;
		}
		const currentIndex = this.columnData.findIndex(item => item.Id === this.selectedEntity.Id);
		let tempData;
		switch (direction) {

			case 'up':
				if (currentIndex === -1 || currentIndex === 0) {
					return;
				}
				tempData = { ...this.columnData[currentIndex - 1] };
				this.columnData[currentIndex - 1] = { ...this.selectedEntity, Id: this.columnData[currentIndex - 1].Id };
				this.columnData[currentIndex] = { ...tempData, Id: this.selectedEntity.Id };
				this.selectedEntity = this.columnData[currentIndex - 1];
				break;

			case 'down':
				if (currentIndex === -1 || currentIndex === this.columnData.length - 1) {
					return;
				}
				tempData = { ...this.columnData[currentIndex + 1] };
				this.columnData[currentIndex + 1] = { ...this.selectedEntity, Id: this.columnData[currentIndex + 1].Id };
				this.columnData[currentIndex] = { ...tempData, Id: this.selectedEntity.Id };
				this.selectedEntity = this.columnData[currentIndex + 1];
				break;

			default:
				return;
		}
		this.gridConfig = {
			uuid: '7f93baff24f1464b8444430ca7f5cbad',
			columns: this.columns,
			items: this.columnData,
			containerType: 0
		};

	}

	private deleteGridData() {
		if (!this.selectedEntity) {
			return;
		}
		const currentIndex = this.columnData.findIndex(item => item.Id === this.selectedEntity.Id);
		if (currentIndex === -1) {
			return;
		} else {
			this.columnData.splice(currentIndex, 1);
			if (currentIndex < this.columnData.length) {
				this.selectedEntity = this.columnData[currentIndex];
			} else if (currentIndex > 0) {
				this.selectedEntity = this.columnData[currentIndex - 1];
			}
		}
		this.gridConfig = {
			uuid: '7f93baff24f1464b8444430ca7f5cbad',
			columns: this.columns,
			items: this.columnData,
			containerType: 0
		};
	}

	private isbtnDisabled(direction: string): boolean {
		if (!this.selectedEntity) {
			return true;
		}
		const currentIndex = this.columnData.findIndex(item => item.Id === this.selectedEntity.Id);
		switch (direction) {
			case 'up':
				return currentIndex !== 0;
			case 'down':
				return currentIndex < this.columnData.length - 1;
			case 'editoption':
				return this.allowedEditOptionTypes.has(this.selectedEntity.type);
			default:
				return true;
		}
	}

	private editOption(): void {
		if (this.selectedEntity) {
			let ediOptionEntity: CustomEditorOption;
			if (this.selectedEntity.options) {
				ediOptionEntity = this.selectedEntity.options;
			} else {
				ediOptionEntity = {
					'displayText': '',
					'escapeHtml': false
				};
			}

			const config: IFormDialogConfig<CustomEditorOption> = {
				headerText: { key: 'Link Editor' },
				formConfiguration: this.generateEditOptionRows(),
				customButtons: [],
				entity: ediOptionEntity,
			};

			this.formDialogService.showDialog(config)?.then((result: IEditorDialogResult<CustomEditorOption>) => {
				if (result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
					this.selectedEntity.options = result.value;
					const index = this.columnData.findIndex(item => item.Id === this.selectedEntity.Id);
					if (index !== -1) {
						this.columnData[index] = this.selectedEntity;
					}
					const configIndex = this.workflowAction.input.findIndex(input => input.key === 'Config');
					if (configIndex !== -1) {
						const configValue = this.workflowAction.input[configIndex].value;
						if (Array.isArray(configValue)) {
							const entityIndex = configValue.findIndex((entity: IUserInputConfig) => entity.Id === this.selectedEntity.Id);
							if (entityIndex !== -1) {
								configValue[entityIndex] = this.selectedEntity;
								this.workflowAction.input[configIndex].value = configValue;
							}
						}
					}
				}
			});
		}
	}

	private generateEditOptionRows(): IFormConfig<CustomEditorOption> {
		let formRows: FormRow<CustomEditorOption>[] = [];
		if (this.allowedEditOptionTypes.has(this.selectedEntity.type)) {
			switch (this.selectedEntity.type) {
				case 'title':
				case 'subtitle':
					{
						formRows = [
							{
								id: 'escapeHtml',
								label: {
									text: 'escapeHtml',
								},
								type: FieldType.Boolean,
								model: 'escapeHtml'
							},
							{
								id: 'displayText',
								label: {
									text: 'displayText',
								},
								type: FieldType.Description,
								model: 'displayText',
							}
						];
					}
					break;
				case 'link': {
					formRows = [
						{
							id: 'url',
							label: {
								text: 'url',
							},
							type: FieldType.Url,
							model: 'url'
						},
						{
							id: 'displayText',
							label: {
								text: 'displayText',
							},
							type: FieldType.Description,
							model: 'displayText',
						}
					];
				}
					break;
			}

		}
		const formConfig: IFormConfig<CustomEditorOption> = {
			formId: 'editorOption',
			showGrouping: false,
			addValidationAutomatically: true,
			rows: formRows
		};
		return formConfig;
	}

	/**
	 * Form configuration for checkbox options in user-input-action editor.
	 */

	public formConfig: IFormConfig<IWorkflowAction> = {
		formId: 'userinputeditor',
		addValidationAutomatically: true,
		showGrouping: true,
		rows: [
			{
				id: 'compositeRow',
				type: FieldType.Composite,
				composite: this.getConfigRows()
			}
		]
	};

	private getConfigRows(): FormRow<IWorkflowAction>[] {
		const compositeFormRows: FormRow<IWorkflowAction>[] = [];
		const excludedInputs = ['Config', 'EscalationDisabled', 'StopVisible', 'CancelVisible', 'Context'];
		this.workflowAction.input.filter((input) => !excludedInputs.includes(input.key)).forEach((input, index) => {
			const compositeFormRow: FormRow<IWorkflowAction> = {
				id: `${input.key}${index}`,
				type: FieldType.Boolean,
				model: this.getModel(input.key, ParameterType.Input),
				label: input.key,
				sortOrder: index + 1,
			};
			compositeFormRows.push(compositeFormRow);
		});
		console.log(compositeFormRows);
		return compositeFormRows;
	}

	private getModel(key: string, parameterType: ParameterType): string {
		return ActionEditorHelper.setModelProperty(this.workflowAction, key, parameterType);
	}

	public formSelectionChanged(selectedItems: IFormValueChangeInfo<IUserInputCheckboxItem>) {
		this.userInputConfig = selectedItems.entity;
	}
}





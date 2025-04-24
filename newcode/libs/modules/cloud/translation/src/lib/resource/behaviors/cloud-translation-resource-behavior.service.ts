/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';

import { SortDirection } from '@libs/platform/common';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import {
	ColumnDef,
	FieldType,
	GridStep,
	IGridConfiguration,
	IGridDialogOptions,
	IMessageBoxOptions,
	InsertPosition,
	ItemType,
	IYesNoDialogOptions,
	MessageStep,
	MultistepDialog,
	StandardDialogButtonId,
	UiCommonGridDialogService,
	UiCommonMessageBoxService,
	UiCommonMultistepDialogService,
} from '@libs/ui/common';

import { CloudTranslationResourceDataService } from '../services/cloud-translation-resource-data.service';
import { IResourceEntity } from '../model/entities/resource-entity.interface';
import { CloudTranslationResourceCreateGlossaryService } from '../services/cloud-translation-create-glossary.service';
import { IAssignmentConfig, IAssignmentConfigResponse, IMultistepModelConfigObj, INewGlossaryConfig, INewGlossaryConfigResponse, INormalizationConfig, INormalizationConfigResponse } from '../model/cloud-translation-resource-mutistep.interface';

@Injectable({
	providedIn: 'root',
})
export class CloudTranslationResourceBehavior implements IEntityContainerBehavior<IGridContainerLink<IResourceEntity>, IResourceEntity> {
	/**
	 * CloudTranslationResourceDataService type assign
	 */
	private dataService: CloudTranslationResourceDataService;

	
	/**
	 * inject UiCommonMessageBoxService
	 */
	private readonly messageBoxService = inject(UiCommonMessageBoxService);

	/**
	 * inject UiCommonGridDialogService
	 */
	private readonly gridDialogService = inject(UiCommonGridDialogService);

	/**
	 * inject CloudTranslationResourceCreateGlossaryService
	 */
	private readonly createGlossaryService = inject(CloudTranslationResourceCreateGlossaryService);

	/**
	 * inject UiCommonMultistepDialogService
	 */
	private multistepDialogService = inject(UiCommonMultistepDialogService);

	public constructor() {
		this.dataService = inject(CloudTranslationResourceDataService);
	}
	/**
	 * On created service load event
	 *
	 * @param {IGridContainerLink<IResourceEntity>} containerLink
	 */
	public onCreate(containerLink: IGridContainerLink<IResourceEntity>): void {
		this.initToolBar(containerLink);
	}

	/**
	 * initialize or modify the defaul tool bar item menu
	 * @param {IGridContainerLink<IResourceEntity>} containerLink get current Container Details
	 */
	private initToolBar(containerLink: IGridContainerLink<IResourceEntity>): void {
		//TODO : This Tool and function action Behavior by default bind from the DataServiceHierarchicalLeaf gird type
		containerLink.uiAddOns.toolbar.addItemsAtId(
			{
				type: ItemType.Sublist,
				list: {
					items: [
						{
							caption: { key: 'cloud.translation.createGlossary' },
							iconClass: 'tlb-icons ico-glossary-res',
							id: 'createGlossary',
							disabled: (ctx) => {
								if (this.hasMultipleItemSelected()) {
									return true;
								}
								const selectedItem = this.dataService.getSelection();
								if (selectedItem) {
									return this.isDisabledCreateGlossary(selectedItem[0]);
								}
								return !this.dataService.canCreate();
							},
							fn: () => {
								this.onClickCreateGlossary();
							},
							sort: 0,

							type: ItemType.Item,
						},
						{
							caption: { key: 'cloud.translation.removeGlossary' },
							iconClass: 'tlb-icons ico-glossary-del',
							id: 'removeGlossary',
							disabled: (ctx) => {
								if (this.hasMultipleItemSelected()) {
									return true;
								}
								const selectedItem = this.dataService.getSelection();
								if (selectedItem) {
									return this.isDisabledRemoveGlossary(selectedItem[0]);
								}
								return !this.dataService.canCreate();
							},
							fn: () => {
								this.onClickRemoveGlossary();
							},
							sort: 0,

							type: ItemType.Item,
						},
					],
				},
				sort: 0,
			},
			EntityContainerCommand.CreateRecord,
			InsertPosition.Instead,
		);

		containerLink.uiAddOns.toolbar.addItemsAtId(
			{
				type: ItemType.Sublist,
				list: {
					items: [
						{
							caption: { key: 'cloud.translation.normalizeResource' },
							iconClass: 'tlb-icons ico-normalize',
							id: 'normalizeResources',
							disabled: (ctx) => {
								return !this.dataService.canCreate();
							},
							fn: () => {
								this.showNormalizationStepsDialog();
							},
							sort: 0,

							type: ItemType.Item,
						},
					],
				},
				sort: 0,
			},
			EntityContainerCommand.DeleteRecord,
			InsertPosition.Instead,
		);
		console.log(containerLink);
	}

	/**
	 * check dataservice multiple item selected
	 *
	 * @returns {boolean}
	 */
	public hasMultipleItemSelected(): boolean {
		return this.dataService.getSelection().length > 1;
	}

	/**
	 * check item is Disabled CreateGlossary
	 *
	 * @param {IResourceEntity} resource selected item
	 * @returns {boolean}
	 */
	public isDisabledCreateGlossary(resource: IResourceEntity): boolean {
		return resource === null || (resource?.IsGlossary as boolean);
	}

	/**
	 * check item is Disabled RemoveGlossary
	 *
	 * @param {IResourceEntity} resource selected item
	 * @returns {boolean}
	 */
	public isDisabledRemoveGlossary(resource: IResourceEntity): boolean {
		return resource === null || (!resource?.IsGlossary as boolean);
	}

	/**
	 * check item is Referencing OtherGlossary
	 *
	 * @param {IResourceEntity} resource selected item
	 * @returns {boolean}
	 */
	public isReferencingOtherGlossary(resource: IResourceEntity) {
		return !resource?.IsGlossary && resource?.ResourceFk !== null;
	}

	/**
	 * click on CreateGlossary tool menu item
	 */
	public onClickCreateGlossary() {
		const selectedItem = this.dataService.getSelection();
		if (this.isReferencingOtherGlossary(selectedItem[0])) {
			this.showDialogToDisplayGlossaryWithSelf(selectedItem[0]);
		} else {
			this.showGlossaryCreateConfirmationDialog();
		}
	}

	/**
	 * shown the dialog of Display Glossary
	 *
	 * @param {IResourceEntity} selectedItem selected item
	 */
	public async showDialogToDisplayGlossaryWithSelf(selectedItem: IResourceEntity) {
		const options: IYesNoDialogOptions = {
			defaultButtonId: StandardDialogButtonId.No,
			id: 'YesNoModal',
			dontShowAgain: true,
			showCancelButton: false,

			headerText: { key: 'cloud.translation.glossarydlg.makeGlossaryHeader' },
			//TODO:bodyText property need to change Translatable type
			//bodyText: 'cloud.translation.glossarydlg.errorText.referenceErrorMake',
			bodyText: 'Valid resource for creating glossary. Create now?',
		};
		const result = await this.messageBoxService.showYesNoDialog(options);

		if (result?.closingButtonId === StandardDialogButtonId.Yes) {
			const resourceIds = [selectedItem.ResourceFk, selectedItem.Id];
			console.log(resourceIds);
			//TODO : once cloudDesktopSidebarService service is implemented then used below code
			//cloudDesktopSidebarService.filterSearchFromPKeys(resourceIds);
		}
	}

	/**
	 * show the Glossary Create Confirmation Dialog
	 */
	public async showGlossaryCreateConfirmationDialog() {
		const item = this.dataService.getSelection();
		const topDescription = 'Existing glossary entry found with the same resource. Select an existing glossary and click "Assign to Glossary" (recommended). Or, click "Make Glossary" to make a new glossary (not recommended).';
		const payload = { ResourceId: item[0].Id as number };
		this.createGlossaryService.getGlossaryList(payload).subscribe(async (data: IResourceEntity[]) => {
			const gridDialogData: IGridDialogOptions<IResourceEntity> = {
				width: '700px',
				headerText: { key: 'cloud.translation.glossarydlg.makeGlossaryHeader' },
				topDescription: { text: topDescription, iconClass: 'icon tlb-icons ico-info', key: 'cloud.translation.glossarydlg.errorText.existingGlossaryFound' },
				buttons: [
					{ id: 'assigntoglossary', caption: { key: 'cloud.translation.glossarydlg.assignToGlossary' }, cssClass: 'assign highlight btn btn-default ', isDisabled: data ? false : true },
					{ id: StandardDialogButtonId.Cancel, caption: { key: 'ui.common.dialog.cancelBtn' }, autoClose: true },
				],
				customButtons: [{ id: 'makeglossary', caption: { key: 'cloud.translation.glossarydlg.makeGlossaryHeader' }, isDisabled: data ? false : true }],
				windowClass: 'grid-dialog',
				gridConfig: {
					uuid: '4d35ae8687dd4ed6aa5ce4b47befad0b',
					columns: [
						{
							type: FieldType.Integer,
							id: 'Id',
							readonly: true,
							model: 'Id',
							label: {
								text: 'Id',
								key: 'cloud.translation.previewdlg.id',
							},
							visible: true,
							sortable: true,
						},
						{
							type: FieldType.Text,
							id: 'ResourceTerm',
							readonly: true,
							model: 'ResourceTerm',
							label: {
								text: 'Term',
								key: 'cloud.translation.resourceterm',
							},
							visible: true,
							sortable: true,
						},
						{
							type: FieldType.Text,
							id: 'ResourceKey',
							readonly: true,
							model: 'ResourceKey',
							label: {
								text: 'Resource Key',
								key: 'cloud.translation.resourcekey',
							},
							visible: true,
							sortable: true,
						},
						{
							type: FieldType.Text,
							id: 'Remark',
							readonly: true,
							model: 'ResourceKey',
							label: {
								text: 'Resource Key',
								key: 'cloud.common.entityRemark',
							},
							visible: true,
							sortable: true,
						},
					],
					idProperty: 'Id',
				},
				items: data,
				isReadOnly: true,
				allowMultiSelect: false,
				selectedItems: [],
			};

			const result = await this.gridDialogService.show(gridDialogData);
			switch (result?.closingButtonId) {
				case 'makeglossary':
					//console.log('click on makeglossary');
					break;
				case 'assigntoglossary':
					this.assignResourceToSelectedGlossary(result?.value?.selectedItems[0] as number);
					break;

				default:
					break;
			}
			console.log(result);
		});
	}

	/**
	 * To Assign Resource To SelectedGlossary
	 *
	 * @param {number } id item id
	 */
	public assignResourceToSelectedGlossary(id: number) {
		if (id) {
			const selectedResource = this.dataService.getSelection();
			selectedResource[0].ResourceFk = id;
			this.dataService.updateEntities(selectedResource);
		}
	}

	/**
	 * on click Remove Glossary tool menu item
	 */
	public onClickRemoveGlossary() {
		const item = this.dataService.getSelection();
		this.createGlossaryService.getReferencingResources(item[0]).subscribe((data) => {
			if (data.children.length === 0) {
				this.deleteGlossary(item[0]);
			} else {
				this.showDialogToDisplayRefereeWithSelf(item[0], data);
			}
		});
	}

	/**
	 * show the Dialog To DisplayRefereeWithSelf
	 *
	 * @param {IResourceEntity}selectedItem  selected item
	 * @param {{ children: number[] }} resourceIds resource ids
	 */
	public async showDialogToDisplayRefereeWithSelf(selectedItem: IResourceEntity, resourceIds: { children: number[] }) {
		const options: IYesNoDialogOptions = {
			defaultButtonId: StandardDialogButtonId.No,
			id: 'YesNoModal',
			dontShowAgain: false,
			showCancelButton: false,
			headerText: { key: 'cloud.translation.glossarydlg.removeGlossaryHeader' },
			////TODO: bodyTest property set  Translatable datatype
			bodyText: 'cloud.translation.glossarydlg.errorText.referenceErrorRemove',
		};
		const result = await this.messageBoxService.showYesNoDialog(options);
		if (result?.closingButtonId === StandardDialogButtonId.Yes) {
			resourceIds.children.push(selectedItem.Id);
			////TODO: cloudDesktopSidebarService implementaion as per angular js refrence code
			//cloudDesktopSidebarService.filterSearchFromPKeys(resourceIds);
		}
	}

	/**
	 * To Delete Glossary
	 *
	 * @param {IResourceEntity} selectedItem selected Item
	 */
	public deleteGlossary(selectedItem: IResourceEntity) {
		this.showGlossaryRemoveConfirmationDialog(selectedItem);
	}

	/**
	 * Show Glossary Remove Confirmation Dialog
	 *
	 * @param {IResourceEntity} selectedItem selected Item
	 */
	public async showGlossaryRemoveConfirmationDialog(selectedItem: IResourceEntity) {
		const options: IYesNoDialogOptions = {
			defaultButtonId: StandardDialogButtonId.No,
			id: 'YesNoModal',
			dontShowAgain: true,
			showCancelButton: false,

			headerText: { key: 'cloud.translation.glossarydlg.removeGlossaryHeader' },
			//TODO:bodyText property need to change Translatable type
			//bodyText: 'cloud.translation.glossarydlg.errorText.referenceErrorMake',
			bodyText: 'cloud.translation.glossarydlg.confirmationText.remove',
		};
		const result = await this.messageBoxService.showYesNoDialog(options);
		if (result?.closingButtonId === StandardDialogButtonId.Yes) {
			this.createGlossaryService.removeGlossary(selectedItem.Id).subscribe(() => {
				const list = this.dataService.getList();
				const index = list.findIndex((item) => item.Id === selectedItem.Id);
				if (index !== -1) {
					list.splice(index, 1);
					this.dataService.refreshAll();
					///TODO : sort the ResourceTerm column in grid like  below code is angular js implementation for renfrence
					//platformGridAPI.rows.scroll($scope.gridId, 'top', 0);
					this.showGlossaryRemoveSuccessDialog();
				}
			});
		}
	}

	/**
	 * Show the Glossary Remove Success Dialog
	 */
	public async showGlossaryRemoveSuccessDialog() {
		const options: IMessageBoxOptions = {
			headerText: { key: 'cloud.translation.glossarydlg.removeGlossaryHeader' },
			bodyText: { key: 'cloud.translation.glossarydlg.successText.remove' },
			iconClass: 'info',
			buttons: [
				{
					id: StandardDialogButtonId.Ok,
				},
			],
		};
		const result = await this.messageBoxService.showMsgBox(options);
		//TODO: Operations to be done on the result object
		console.log(result);
	}

	/**
	 * click on Normalization tool item menu
	 */
	public async showNormalizationStepsDialog() {
		const step1Message = this.multiStepIntro();
		const step2Grid = await this.multiStepNewGlossaryConfig();
		const step3Grid = await this.multiStepNormalizeAssignment();
		const step4Grid = await this.multiStepnormalizationConfig();
		const demoModel: IMultistepModelConfigObj = {
			assignmentConfig: step3Grid.model.ChangedResources,
			newGlossaryConfig: step2Grid.model.OrphanResources,
			normalizationConfig: step4Grid.model.Message,
		};

		const multistepDialog = new MultistepDialog(demoModel, [step1Message, step2Grid.config, step3Grid.config, step4Grid.config]);
		const result = await this.multistepDialogService.showDialog(multistepDialog);
		//const btns = multistepDialog.dialogOptions?.buttons;
		////TODO:Data is not bind to gird in multistep dialog , testing is pending
		console.log(result);
	}

	/**
	 * configure the fist step introduction of dailog
	 *
	 * @returns {MessageStep} return the MessageStep object for introduction in mutistep dailog
	 */
	public multiStepIntro(): MessageStep {
		return new MessageStep('step1', { key: 'cloud.translation.normalizeDialog.introStep.stepTitle' }, { key: 'cloud.translation.normalizeDialog.introStep.stepDescription' }, 'ico-info');
	}

	/**
	 * configure the step of multi step dialog with gird object
	 *
	 * @returns {Promise<{ model: INewGlossaryConfigResponse; config: GridStep<INewGlossaryConfig> }>}
	 */
	public multiStepNewGlossaryConfig(): Promise<{ model: INewGlossaryConfigResponse; config: GridStep<INewGlossaryConfig> }> {
		return new Promise((res, rej) => {
			const columns: ColumnDef<INewGlossaryConfig>[] = [
				{
					id: 'ResourceTerm',
					model: 'ResourceTerm',
					sortable: false,
					label: {
						text: 'New Glossary',
						key: 'cloud.translation.normalizeDialog.newGlossaryStep.columns.glossaryTerm',
					},
					type: FieldType.Description,
					sort: SortDirection.None,
					required: true,
					maxLength: 16,

					tooltip: {
						text: 'New Glossary',
						key: 'cloud.translation.normalizeDialog.newGlossaryStep.columns.glossaryTerm',
					},
					cssClass: '',
					width: 100,
					visible: true,
					keyboard: {
						enter: true,
						tab: true,
					},
					pinned: false,
					readonly: true,
				},
				{
					id: 'Count',
					model: 'Count',
					sortable: false,
					label: {
						text: 'Duplicate Count',
						key: 'cloud.translation.normalizeDialog.newGlossaryStep.columns.duplicateCount',
					},
					type: FieldType.Description,
					sort: SortDirection.None,
					required: true,
					maxLength: 16,

					tooltip: {
						text: 'Duplicate Count',
						key: 'cloud.translation.normalizeDialog.newGlossaryStep.columns.duplicateCount',
					},
					cssClass: '',
					width: 100,
					visible: true,
					keyboard: {
						enter: true,
						tab: true,
					},
					pinned: false,
					readonly: true,
				},
			];

			this.createGlossaryService.getNormalizeCreate().subscribe((data) => {
				const newGlossaryConfigResponse: INewGlossaryConfigResponse = {
					Message: data.Message,
					OrphanResources: data.OrphanResources,
				};
				const stepGrid = new GridStep(
					'step2-1',
					{ key: 'cloud.translation.normalizeDialog.checkNewGlossaryStep.stepTitle' } || 'Check Glossary Create',
					{
						uuid: '4d35ae8687dd4ed6aa5ce4b47befad0b',
						columns: columns,
						items: data.OrphanResources ?? [],
					},

					'newGlossaryConfig' /*propertyName in the multistep model*/,
				);
				stepGrid.loadingMessage = { key: 'cloud.translation.normalizeDialog.checkNewGlossaryStep.loadingMessage' };
				stepGrid.disallowBack = true;
				stepGrid.disallowNext = true;
				res({ model: newGlossaryConfigResponse, config: stepGrid });
			});
		});
	}

	/**
	 * configure the multi step dailog with grid object
	 *
	 * @returns {Promise<{ model: IAssignmentConfigResponse; config: GridStep<IAssignmentConfig> }>}
	 */
	public multiStepNormalizeAssignment(): Promise<{ model: IAssignmentConfigResponse; config: GridStep<IAssignmentConfig> }> {
		return new Promise((res, rej) => {
			const columns: ColumnDef<IAssignmentConfig>[] = [
				{
					id: 'Id',
					model: 'Id',
					sortable: false,
					label: {
						text: 'Id',
						key: 'cloud.translation.normalizeDialog.assignmentStep.columns.id',
					},
					type: FieldType.Integer,
					sort: SortDirection.None,
					required: true,

					// searchable: true,
					tooltip: {
						text: 'Id',
						key: 'cloud.translation.normalizeDialog.assignmentStep.columns.id',
					},
					cssClass: '',
					width: 100,
					visible: true,
					keyboard: {
						enter: true,
						tab: true,
					},
					pinned: false,
					readonly: true,
				},
				{
					id: 'Exclude',
					model: 'Exclude',
					sortable: false,
					label: {
						key: 'cloud.translation.normalizeDialog.assignmentStep.columns.exclude',
					},
					type: FieldType.Description,
					sort: SortDirection.None,
					required: true,
					maxLength: 16,
					// searchable: true,
					tooltip: {
						key: 'cloud.translation.normalizeDialog.assignmentStep.columns.exclude',
					},
					cssClass: '',
					width: 100,
					visible: true,
					keyboard: {
						enter: true,
						tab: true,
					},
					pinned: false,
					readonly: true,
				},
				{
					id: 'ResourceTerm',
					model: 'ResourceTerm',
					sortable: false,
					label: {
						key: 'cloud.translation.normalizeDialog.assignmentStep.columns.resourceTerm',
					},
					type: FieldType.Description,
					sort: SortDirection.None,
					required: true,
					maxLength: 16,
					// searchable: true,
					tooltip: {
						key: 'cloud.translation.normalizeDialog.assignmentStep.columns.resourceTerm',
					},
					cssClass: '',
					width: 100,
					visible: true,
					keyboard: {
						enter: true,
						tab: true,
					},
					pinned: false,
					readonly: true,
				},
				{
					id: 'Path',
					model: 'Path',
					sortable: false,
					label: {
						key: 'cloud.translation.normalizeDialog.assignmentStep.columns.path',
					},
					type: FieldType.Description,
					sort: SortDirection.None,
					required: true,
					maxLength: 16,
					// searchable: true,
					tooltip: {
						key: 'cloud.translation.normalizeDialog.assignmentStep.columns.path',
					},
					cssClass: '',
					width: 100,
					visible: true,
					keyboard: {
						enter: true,
						tab: true,
					},
					pinned: false,
					readonly: true,
				},
				{
					id: 'AssignedTo',
					model: 'AssignedTo',
					sortable: false,
					label: {
						key: 'cloud.translation.normalizeDialog.assignmentStep.columns.assignedTo',
					},
					type: FieldType.Description,
					sort: SortDirection.None,
					required: true,
					maxLength: 16,
					// searchable: true,
					tooltip: {
						key: 'cloud.translation.normalizeDialog.assignmentStep.columns.assignedTo',
					},
					cssClass: '',
					width: 100,
					visible: true,
					keyboard: {
						enter: true,
						tab: true,
					},
					pinned: false,
					readonly: true,
				},
				{
					id: 'Exclude',
					model: 'Exclude',
					sortable: false,
					label: {
						text: 'Exclude',
					},
					type: FieldType.Description,
					sort: SortDirection.None,
					required: true,
					maxLength: 16,
					// searchable: true,
					tooltip: {
						text: 'Exclude',
					},
					cssClass: '',
					width: 100,
					visible: true,
					keyboard: {
						enter: true,
						tab: true,
					},
					pinned: false,
					readonly: true,
				},
			];

			this.createGlossaryService.getNormalizeAssignment().subscribe((data) => {
				const changedResources = data.ChangedResources;

				const treeData: { [key: string]: IAssignmentConfig } = {};
				const assignObj: IAssignmentConfig[] = [];

				let glossaryIndex = 0;
				changedResources.forEach((item) => {
					if (!treeData[item?.ResourceTerm?.toLowerCase() as string]) {
						treeData[item?.ResourceTerm?.toLowerCase() as string] = {
							Id: item?.TlsResourceFk === 0 ? 'G-' + glossaryIndex++ : item?.TlsResourceFk?.toString(),
							ResourceTerm: item?.ResourceTerm,
							AssignedTo: '',
							Path: '',
							Exclude: false,
							ChildItems: [],
							ParentId: 0,
						};
						assignObj.push(treeData[item?.ResourceTerm?.toLowerCase() as string]);
					}

					const childItem: IAssignmentConfig = {
						Id: item?.Id?.toString(),
						ResourceTerm: item?.ResourceTerm,
						AssignedTo: treeData[item?.ResourceTerm?.toLowerCase() as string]?.Id,
						Path: item?.Path,
						Exclude: false,
						ParentId: treeData[item.ResourceTerm?.toLowerCase() as string]?.Id,
					};
					assignObj.push(childItem);

					treeData[item.ResourceTerm?.toLowerCase() as string].ChildItems?.push(childItem);
				});

				let config: IGridConfiguration<IAssignmentConfig> = {
					columns: columns,
					uuid: '4d35ae8687dd4ed6aa5ce4b47befad0b',
					idProperty: 'Id',
					treeConfiguration: {
						description: ['ResourceTerm'],
						rootEntities: () => {
							return (
								config?.items?.reduce((result: IAssignmentConfig[], entity) => {
									if (!entity.ParentId) {
										result.push(entity);
									}
									return result;
								}, []) || []
							);
						},
						children: (entity) => {
							return (
								config?.items?.reduce((result: IAssignmentConfig[], item) => {
									if (entity.Id === item.ParentId) {
										result.push(item);
									}
									return result;
								}, []) || []
							);
						},
						parent: (entity) => {
							if (entity.ParentId) {
								return config?.items?.find((item) => item.Id === entity.ParentId) || null;
							}
							return null;
						},
					},
				};
				config = { ...config, columns: columns, items: assignObj };
				const model: IAssignmentConfigResponse = {
					Message: data.Message,
					ChangedResources: assignObj,
				};
				const stepGrid = new GridStep(
					'step3-1',
					{ key: 'cloud.translation.normalizeDialog.checkAssignmentStep.stepTitle' } ?? 'Check Resource Assignment',
					config,

					'assignmentConfig' /*propertyName in the multistep model*/,
				);
				stepGrid.loadingMessage = { key: 'cloud.translation.normalizeDialog.checkAssignmentStep.loadingMessage' } ?? 'Checking Resources which can be assigned a Glossary';
				stepGrid.disallowBack = true;
				stepGrid.disallowNext = true;
				res({ model: model, config: stepGrid });
			});
		});
	}

	/**
	 * configure the multi step dialog with grid object
	 *
	 * @returns {Promise<{ model: INormalizationConfigResponse; config: GridStep<INormalizationConfig> }>}
	 */
	public multiStepnormalizationConfig(): Promise<{ model: INormalizationConfigResponse; config: GridStep<INormalizationConfig> }> {
		return new Promise((res, rej) => {
			const columns: ColumnDef<INormalizationConfig>[] = [
				{
					id: 'Title',
					model: 'Title',
					sortable: false,
					label: {
						text: 'Title',
						key: 'cloud.translation.normalizeDialog.resultStep.columns.title',
					},
					type: FieldType.Text,
					sort: SortDirection.None,
					required: true,

					// searchable: true,
					tooltip: {
						text: 'Title',
						key: 'cloud.translation.normalizeDialog.resultStep.columns.title',
					},
					cssClass: '',
					width: 100,
					visible: true,
					keyboard: {
						enter: true,
						tab: true,
					},
					pinned: false,
					readonly: true,
				},
				{
					id: 'Message',
					model: 'Message',
					sortable: false,
					label: {
						key: 'cloud.translation.normalizeDialog.resultStep.columns.message',
					},
					type: FieldType.Description,
					sort: SortDirection.None,
					required: false,
					maxLength: 16,
					// searchable: true,
					tooltip: {
						key: 'cloud.translation.normalizeDialog.resultStep.columns.message',
					},
					cssClass: '',
					width: 100,
					visible: true,
					keyboard: {
						enter: true,
						tab: true,
					},
					pinned: false,
					readonly: true,
				},
			];
			//TODO: prepare payload pending this get from previous step multidialog step 3
			const payload: number[] = [];
			let fileUrl = '';
			const assignObj: INormalizationConfig[] = [];

			this.createGlossaryService.getNormalizeNew(payload).subscribe((data) => {
				const changedResources = data.Message;
				fileUrl = data.FileUrl;
				const treeData: { [key: string]: INormalizationConfig } = {};
				let index = 0;
				changedResources.forEach((item) => {
					if (!treeData[item?.Title?.toLowerCase() as string]) {
						const root = {
							Id: 'root' + index++,
							Title: item.Title,
							Message: '',
							ChildItems: [],
						};
						treeData[item?.Title?.toLowerCase() as string] = root;
						assignObj.push(root);
					}
					const childItem: INormalizationConfig = {
						Id: 'child' + index++,
						Title: item.Title,
						Message: item.Message,
						ParentId: treeData[item?.Title?.toLowerCase()]?.Id as string,
					};

					assignObj.push(childItem);
				});

				let config: IGridConfiguration<INormalizationConfig> = {
					columns: columns,
					uuid: '4d35ae8687dd4ed6aa5ce4b47befad0b',
					idProperty: 'Id',
					treeConfiguration: {
						description: [''],
						rootEntities: () => {
							return (
								config?.items?.reduce((result: INormalizationConfig[], entity) => {
									if (!entity.ParentId) {
										result.push(entity);
									}
									return result;
								}, []) || []
							);
						},
						children: (entity) => {
							return (
								config?.items?.reduce((result: INormalizationConfig[], item) => {
									if (item.ParentId && entity.Id && entity.Id === item.ParentId) {
										result.push(item);
									}
									return result;
								}, []) || []
							);
						},
						parent: (entity: INormalizationConfig) => {
							if (entity.ParentId) {
								return config?.items?.find((item) => item.Id === entity?.ParentId) || null;
							}
							return null;
						},
					},
				};

				config = { ...config, columns: columns, items: assignObj };
				const model: INormalizationConfigResponse = {
					FileUrl: data?.FileUrl,
					Message: assignObj,
				};
				const stepGrid = new GridStep(
					'step4-1',
					{ key: 'cloud.translation.normalizeDialog.normalizationStep.stepTitle' } ?? 'Normalization',
					config,

					'normalizationConfig' /*propertyName in the multistep model*/,
				);
				stepGrid.loadingMessage = { key: 'cloud.translation.normalizeDialog.normalizationStep.loadingMessage' };
				stepGrid.disallowBack = true;
				stepGrid.disallowNext = true;
				stepGrid.topButtons = [
					{
						text: { key: 'cloud.translation.normalizeDialog.resultStep.downloadReportBtn' } || 'Download Report',
						fn: (model) => {
							model.topDescription = 'Downloading Report ...';
							const elem: HTMLAnchorElement = document.createElement('a');
							elem.href = fileUrl;
							elem.addEventListener('click', function (evt) {
								setTimeout(() => {
									document.body.removeChild(elem);
								});
							});
							setTimeout(() => {
								document.body.appendChild(elem);
								elem.click();
								model.topDescription = 'Downloaded Report .';
							});
						},
					},
				];
				res({ model: model, config: stepGrid });
			});
		});
	}

}

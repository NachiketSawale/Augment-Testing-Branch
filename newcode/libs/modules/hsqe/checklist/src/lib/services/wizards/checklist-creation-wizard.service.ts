/*
 * Copyright(c) RIB Software GmbH
 */
import { HsqeChecklistCreationType } from '../../model/enums/hsqe-checklist-creation-type';
import { PlatformHttpService, PlatformLazyInjectorService, PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { CREATE_CHECKLIST_TOKEN, ICreateChecklistOption } from '../../model/entities/hsqe-checklist-option.interface';
import { CreateChecklistWizardDialogComponent } from '../../components/create-checklist-wizard-dialog/create-checklist-wizard-dialog.component';
import { ICustomDialogOptions, StandardDialogButtonId, UiCommonDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { CreateChecklistOptionWizardDialogComponent } from '../../components/create-checklist-option-wizard-dialog/create-checklist-option-wizard-dialog.component';
import { CHECKLIST_TEMPLATE_HEADER_DATA_PROVIDER, IHsqCheckListEntity } from '@libs/hsqe/interfaces';
import { HsqeChecklistDataService } from '../hsqe-checklist-data.service';
import { IChecklistCreationParams } from '../../model/entities/hsqe-checklist-creation-params.interface';
import { HsqeChecklistCreationMode } from '../../model/enums/hsqe-checklist-creation-mode';
enum HsqeChecklistCreationActivityMode {
	WithoutActivity = 0,
	withActivity = 1,
	CommonActivityWithTemplate,
}
export class ChecklistCreationWizardService {
	private readonly msgDialogService = ServiceLocator.injector.get(UiCommonMessageBoxService);
	private readonly modalDialogService = ServiceLocator.injector.get(UiCommonDialogService);
	private readonly httpService = ServiceLocator.injector.get(PlatformHttpService);
	private readonly checklistService = ServiceLocator.injector.get(HsqeChecklistDataService);
	private readonly lazyInjector = ServiceLocator.injector.get(PlatformLazyInjectorService);

	/**
	 * create checklist from wizard
	 */
	public async create() {
		const templateService = await this.lazyInjector.inject(CHECKLIST_TEMPLATE_HEADER_DATA_PROVIDER);
		const checkListTemplate = templateService.getSelectedEntity();
		const checklist = this.checklistService.getSelectedEntity();
		if (checklist?.IsSameContextProjectsByCompany) {
			this.msgDialogService.showMsgBox('hsqe.checklist.wizard.readOnlyRecord', 'hsqe.checklist.wizard.createCheckList.title', 'info')?.then();
			return;
		}
		this.modalDialogService.show<ICreateChecklistOption, CreateChecklistWizardDialogComponent>(this.getCreateChecklistModalOptions(this.checklistService.getProjectId(), !!checkListTemplate))?.then(async (result) => {
			if (result.closingButtonId === StandardDialogButtonId.Ok) {
				if (result.value) {
					const createType = result.value.createType;
					const params: IChecklistCreationParams = {
						projectId: result.value.projectFk,
						checkListTemplateId: checkListTemplate?.Id ?? null,
						fromCheckListTemplate: result.value.createType,
						createCheckListFlg: HsqeChecklistCreationMode.Default,
						createDistinctChecklist: result.value.createDistinctChecklist,
					};
					if (createType === HsqeChecklistCreationType.FromActivity) {
						const response = await this.httpService.post<HsqeChecklistCreationActivityMode>('hsqe/checklist/wizard/checkChecklist', params);
						if (response === HsqeChecklistCreationActivityMode.CommonActivityWithTemplate) {
							this.openChecklistCreationModeDialog(params);
						} else {
							this.msgDialogService.showMsgBox('hsqe.checklist.wizard.createCheckList.getNoRecordFromChecklistTemplate', 'hsqe.checklist.wizard.createCheckList.title', 'info')?.then();
						}
					} else {
						await this.createCheckList(params);
					}
				}
			}
		});
	}

	private openChecklistCreationModeDialog(params: IChecklistCreationParams) {
		const createChecklistFlagModalOptions: ICustomDialogOptions<number | undefined, CreateChecklistOptionWizardDialogComponent> = {
			headerText: {
				text: 'Check List Create Option',
				key: 'hsqe.checklist.wizard.createCheckList.createNewCheckListCreateOption',
			},
			bodyComponent: CreateChecklistOptionWizardDialogComponent,
			resizeable: true,
			minWidth: '650px',
			height: '250px',
			id: 'ChecklistCreationMode',
			buttons: [
				{
					id: StandardDialogButtonId.Ok,
					isDisabled: (info) => {
						return !info.dialog.body.checklistCreationMode;
					},
					fn: (event, info) => {
						info.dialog.value = info.dialog.body.checklistCreationMode;
						info.dialog.close(StandardDialogButtonId.Ok);
					},
				},
				{ id: StandardDialogButtonId.Cancel, caption: { key: 'ui.common.dialog.cancelBtn' } },
			],
		};
		this.modalDialogService.show(createChecklistFlagModalOptions)?.then(async (result) => {
			if (result.closingButtonId === StandardDialogButtonId.Ok) {
				if (result.value) {
					params.createCheckListFlg = result.value;
					await this.createCheckList(params);
				}
			}
		});
	}

	private async createCheckList(params: IChecklistCreationParams) {
		const translate = ServiceLocator.injector.get(PlatformTranslateService);
		let titleText = 'Info';
		let bodyText = '';
		let iconClass = 'info';
		const createChecklists = await this.httpService.post<IHsqCheckListEntity[]>('hsqe/checklist/wizard/createChecklist', params);
		if (createChecklists?.length > 0) {
			const codes: string[] = [];
			createChecklists.forEach((item) => {
				codes.push(item.Code);
				this.checklistService.onCreateSucceeded(item);
			});
			const codeStr = codes.join(',');
			bodyText = translate.instant('hsqe.checklist.wizard.createCheckList.createSuccessTip', { code: codeStr }).text;
			iconClass = 'ico-info';
		} else if (params.fromCheckListTemplate === HsqeChecklistCreationType.FromActivity) {
			titleText = 'hsqe.checklist.wizard.createCheckList.title';
			bodyText = 'hsqe.checklist.wizard.createCheckList.getNoRecordFromChecklistTemplate';
		}
		await this.msgDialogService.showMsgBox(bodyText, titleText, iconClass);
	}

	private getCreateChecklistModalOptions(projectId: number | null | undefined, hasCheckListTemplate: boolean) {
		const createChecklistModalOptions: ICustomDialogOptions<ICreateChecklistOption, CreateChecklistWizardDialogComponent> = {
			resizeable: true,
			backdrop: false,
			height: '280px',
			minWidth: '650px',
			buttons: [
				{
					id: StandardDialogButtonId.Ok,
					isDisabled: (info) => {
						const createType = info.dialog.body.createChecklistOption.createType;
						const projectId = info.dialog.body.createChecklistOption.projectFk;
						return (createType === HsqeChecklistCreationType.FromActivity && !projectId) || (createType === HsqeChecklistCreationType.FromTemplate && !hasCheckListTemplate);
					},
					fn: (event, info) => {
						info.dialog.value = info.dialog.body.createChecklistOption;
						info.dialog.close(StandardDialogButtonId.Ok);
					},
				},
				{ id: StandardDialogButtonId.Cancel, caption: { key: 'ui.common.dialog.cancelBtn' } },
			],
			headerText: { text: 'Create Check List', key: 'hsqe.checklist.wizard.createCheckList.title' },
			id: 'CreateChecklist',
			bodyComponent: CreateChecklistWizardDialogComponent,
			bodyProviders: [
				{
					provide: CREATE_CHECKLIST_TOKEN,
					useValue: {
						createType: HsqeChecklistCreationType.FromActivity,
						projectFk: projectId,
						createDistinctChecklist: true,
						hasCheckListTemplate: hasCheckListTemplate,
					},
				},
			],
		};
		return createChecklistModalOptions;
	}
}

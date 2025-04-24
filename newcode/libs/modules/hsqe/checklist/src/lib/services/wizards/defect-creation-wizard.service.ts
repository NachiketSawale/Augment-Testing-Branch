/*
 * Copyright(c) RIB Software GmbH
 */
import { IEntityIdentification, PlatformConfigurationService, PlatformHttpService, PlatformLazyInjectorService, ServiceLocator } from '@libs/platform/common';
import { HsqeChecklistDataService } from '../hsqe-checklist-data.service';
import { ICustomDialogOptions, IMessageBoxOptions, StandardDialogButtonId, UiCommonDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { IHsqCheckListEntity } from '@libs/hsqe/interfaces';
import { Router } from '@angular/router';
import { CreateDefectWizardDialogComponent } from '../../components/create-defect-wizard-dialog/create-defect-wizard-dialog.component';
import { CREATE_DEFECT_TOKEN } from '../../model/entities/hsqe-defect-creation-option.interface';
import { DEFECT_DATA_PROVIDER, IDfmDefectEntity } from '@libs/defect/interfaces';

enum ChecklistStatusFlag {
	Default,
	IsCancelOrIsDefect,
	HasDefect,
	NoCheckPoint,
	HasCheckPoint,
}

interface ICreatDefectParams {
	projectId?: number;
	checkList: IHsqCheckListEntity;
	assignSchedule: boolean;
}

export class DefectCreationWizardService {
	private readonly checklistService = ServiceLocator.injector.get(HsqeChecklistDataService);
	private readonly msgDialogService = ServiceLocator.injector.get(UiCommonMessageBoxService);
	private readonly modalDialogService = ServiceLocator.injector.get(UiCommonDialogService);
	private readonly httpService = ServiceLocator.injector.get(PlatformHttpService);
	private readonly headerText = 'hsqe.checklist.wizard.createDefect.title';
	private readonly configService = ServiceLocator.injector.get(PlatformConfigurationService);
	private readonly lazyInjector = ServiceLocator.injector.get(PlatformLazyInjectorService);

	// create defect from wizard
	public async create() {
		await this.checklistService.save();
		const iconClass = 'icon-info'; /// todo seems this icon do not show
		const checklist = this.checklistService.getSelectedEntity();
		if (!checklist) {
			this.msgDialogService.showMsgBox('hsqe.checklist.wizard.createDefect.noSelectedChecklistRecord', this.headerText, iconClass)?.then();
			return;
		}
		if (checklist?.IsSameContextProjectsByCompany) {
			this.msgDialogService.showMsgBox('hsqe.checklist.wizard.readOnlyRecord', this.headerText, iconClass)?.then();
			return;
		}
		const result = await this.httpService.get<ChecklistStatusFlag>('hsqe/checklist/wizard/checkStatus', {
			params: {
				checklistId: checklist.Id,
				statusId: checklist.HsqChlStatusFk,
			},
		});
		switch (result) {
			case ChecklistStatusFlag.IsCancelOrIsDefect:
				this.msgDialogService.showMsgBox('hsqe.checklist.wizard.createDefect.cannotCreateDefectByStatusTip', this.headerText, iconClass)?.then();
				break;
			case ChecklistStatusFlag.HasDefect:
				this.msgDialogService.showMsgBox('hsqe.checklist.wizard.createDefect.noIsDefectCheckListStatus', this.headerText, iconClass)?.then();
				break;
			case ChecklistStatusFlag.NoCheckPoint:
				await this.createDefectWithoutCheckPoint(checklist);
				break;
			default:
				await this.createDefect(checklist);
				break;
		}
	}

	private async createDefectWithoutCheckPoint(checklist: IHsqCheckListEntity) {
		const modalOption = {
			headerText: this.headerText,
			bodyText: 'basics.common.updateCashFlowProjection.deleteAndRecreateText',
			defaultButtonId: StandardDialogButtonId.Yes,
		};
		const result = await this.msgDialogService.showYesNoDialog(modalOption);
		if (result?.closingButtonId === StandardDialogButtonId.Yes) {
			await this.createDefect(checklist);
		}
	}

	private createDefect(checklist: IHsqCheckListEntity) {
		const params: ICreatDefectParams = {
			checkList: checklist,
			assignSchedule: true,
		};
		if (checklist.PrjProjectFk) {
			params.projectId = checklist.PrjProjectFk;
			this.createDefectByProject(params).then();
		} else {
			///todo waiting for cloudDesktopPinningContextService
			// var project = cloudDesktopPinningContextService.getPinningItem('project.main');
			// var projectId = null;
			// if (project) {
			// 	projectId = project.id;
			// }
			const projectId = null;
			this.modalDialogService.show(this.getDefectCreationModalOptions(projectId))?.then(async (result) => {
				if (result?.closingButtonId === StandardDialogButtonId.Ok && result?.value) {
					const response = await this.httpService.get<boolean>('hsqe/checklist/wizard/checkdefectscheduleproject', {
						params: {
							checklistId: checklist.Id,
							projectID: result.value,
						},
					});
					params.projectId = result.value;
					if (!response) {
						const feedback = await this.msgDialogService.showYesNoDialog({
							headerText: this.headerText,
							bodyText: 'hsqe.checklist.wizard.createDefect.projectNotSame',
							defaultButtonId: StandardDialogButtonId.Yes,
						});
						if (feedback?.closingButtonId === StandardDialogButtonId.Yes) {
							params.assignSchedule = false;
						}
					}
				}
				this.createDefectByProject(params).then();
			});
		}
	}

	private getDefectCreationModalOptions(projectId: number | null) {
		const createDefectModalOptions: ICustomDialogOptions<number, CreateDefectWizardDialogComponent> = {
			headerText: {
				text: 'Create Defect',
				key: 'hsqe.checklist.wizard.createDefect.title',
			},
			bodyComponent: CreateDefectWizardDialogComponent,
			resizeable: true,
			minWidth: '150px',
			height: '200px',
			id: 'create-defect-wizard',
			buttons: [
				{
					id: StandardDialogButtonId.Ok,
					isDisabled: (info) => {
						return !info.dialog.body.createDefectOption.projectFk;
					},
					fn: (event, info) => {
						info.dialog.value = info.dialog.body.createDefectOption.projectFk ?? undefined;
						info.dialog.close(StandardDialogButtonId.Ok);
					},
				},
				{ id: StandardDialogButtonId.Cancel, caption: { key: 'ui.common.dialog.cancelBtn' } },
			],
			bodyProviders: [
				{
					provide: CREATE_DEFECT_TOKEN,
					useValue: {
						projectFk: projectId,
					},
				},
			],
		};
		return createDefectModalOptions;
	}

	private async createDefectByProject(params: ICreatDefectParams) {
		const result = await this.httpService.post<IDfmDefectEntity>('hsqe/checklist/wizard/createDefect', params);
		if (result) {
			/// todo waiting for basicsLookupdataLookupDescriptorService
			// var lookupDataService = $injector.get('basicsLookupdataLookupDataService');
			// lookupDataService.getItemByKey('CheckList', param.checkList.Id).then(function (data){
			// 	if (data) {
			// 		basicsLookupdataLookupDescriptorService.updateData('CheckList', [data]);
			// 	}
			// });
			//navIds.push(defect.Id); use navigate
			const messageBoxOptions: IMessageBoxOptions = {
				id: 'create-defect-successfully',
				headerText: 'hsqe.checklist.wizard.createDefect.title',
				bodyText: {
					key: 'hsqe.checklist.wizard.createDefect.createDefectSuccessTip',
					params: { code: result.Code },
				},
				iconClass: 'tlb-icons icon ico-info',
				minWidth: '150px',
				height: '200px',
				resizeable: true,
				buttons: [
					{
						id: 'navigate',
						iconClass: 'tlb-icons ico-goto',
						fn: (event, info) => {
							this.goTo(result.Id);
							info.dialog.close();
						},
					},
					{
						id: StandardDialogButtonId.Ok,
					},
				],
			};

			this.msgDialogService.showMsgBox(messageBoxOptions)?.then((response) => {
				if (response) {
					this.checklistService.refreshAll().then(() => {
						const currentChecklist = this.checklistService.getSelection().find((item) => item.Id === params.checkList.Id);
						if (currentChecklist) {
							this.checklistService.select(currentChecklist);
						}
					});
				}
			});
		}
	}

	// navigate to defect module
	private async goTo(defectId: number) {
		///todo navigation seems not working
		const url = this.configService.defaultState + '/defect/main';
		await ServiceLocator.injector.get(Router).navigate([url]);
		const defectService = await this.getDefectDataService();
		const tempDefectIds: IEntityIdentification[] = [{ Id: defectId }];
		defectService.refreshOnlySelected(tempDefectIds);
	}

	private async getDefectDataService() {
		return await this.lazyInjector.inject(DEFECT_DATA_PROVIDER);
	}
}

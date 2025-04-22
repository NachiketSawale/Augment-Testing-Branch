import { Component, inject, OnInit } from '@angular/core';
import { ProcurementPackageUpdateSchedulingWizardService } from '../../wizards/procurement-package-update-scheduling-wizard.service';
import { IPackageUpdateSchedulingOptions, IPackageUpdateSchedulingWizard, ISetStatus, PACKAGE_UPDATE_SCHEDULING_RESULT_TOKEN } from '../../model/entities/procurement-package-update-scheduling-entity.interface';
import { PlatformModuleNavigationService, PlatformTranslateService } from '@libs/platform/common';
import { getCustomDialogDataToken } from '@libs/ui/common';
import { RadioSelect } from '../../model/enums/scheduling-radio-select.enum';
import { firstValueFrom } from 'rxjs';
import { ProjectSharedLookupService } from '@libs/project/shared';

@Component({
	selector: 'procurement-package-update-scheduling-dialog',
	templateUrl: './update-scheduling-dialog.component.html',
	styleUrls: ['./update-scheduling-dialog.component.scss'],
})
export class ProcurementPackageUpdateSchedulingDialogComponent implements OnInit {
	private readonly dialogWrapper = inject(getCustomDialogDataToken<string, ProcurementPackageUpdateSchedulingDialogComponent>());
	private readonly updateSchedulingResult = inject(PACKAGE_UPDATE_SCHEDULING_RESULT_TOKEN);
	private readonly updateSchedulingWizardService = inject(ProcurementPackageUpdateSchedulingWizardService);
	private readonly translate = inject(PlatformTranslateService);
	private readonly navigationService = inject(PlatformModuleNavigationService);
	private readonly projectLookupService = inject(ProjectSharedLookupService);
	private projectInfo: string = '';
	private executingMessage = this.updateSchedulingResult.scheduleInfo ? 'procurement.package.wizard.updateScheduling.updatingMessage' : 'procurement.package.wizard.updateScheduling.creatingMessage';
	private successMessage = this.updateSchedulingResult.scheduleInfo ? 'procurement.package.wizard.updateScheduling.updatedSucceedMessage' : 'procurement.package.wizard.updateScheduling.createdSucceedMessage';
	private executeFailedMessage = 'procurement.package.wizard.updateScheduling.executeFailedMessage';
	private disabledMsg = 'procurement.package.wizard.updateScheduling.disabledMsg';
	public options: IPackageUpdateSchedulingOptions;
	public status: ISetStatus;
	public wizardError: string = '';
	public radioSelect = RadioSelect;
	public dialogLoading: boolean = false;

	public constructor() {
		this.options = {
			request: this.updateSchedulingResult,
			title: 'Go to Schedule',
			executingMessage: this.translate.instant({ key: this.executingMessage, params: { code: this.updateSchedulingResult.scheduleInfo } }).text,
			executeFailedMessage: this.translate.instant({ key: this.executeFailedMessage, params: { code: this.updateSchedulingResult.scheduleInfo } }).text,
			executeSuccessedMessage: '',
			entity: { ScheduleFk: -1 },
			config: { model: 'ScheduleFk' },
			hasActivity: this.updateSchedulingResult.ActivityFk !== null && this.updateSchedulingResult.ScheduleFk !== null,
			disabledMsg: this.updateSchedulingResult.ActivityFk !== null && this.updateSchedulingResult.ScheduleFk !== null ? '' : this.translate.instant(this.disabledMsg).text,
			body: {
				bodyTitle: this.translate.instant('procurement.package.wizard.updateScheduling.bodyOptions').text,
				bodyToScheduling: this.translate.instant('procurement.package.wizard.updateScheduling.bodyToScheduling').text,
				bodyFromScheduling: this.translate.instant('procurement.package.wizard.updateScheduling.bodyFromScheduling').text,
				currentPackage: this.translate.instant('procurement.package.wizard.updateScheduling.currentPackage').text,
				currentProject: this.translate.instant({ key: 'procurement.package.wizard.updateScheduling.currentProject', params: { code: this.projectInfo } }).text,
				currentScheduling: this.translate.instant('procurement.package.wizard.updateScheduling.currentScheduling').text,
				radioSelect: this.radioSelect.CurrentProject,
			},
		};
		this.status = {
			isInit: true,
			isExecuting: false,
			isFailed: false,
			isSucceed: false,
		};
	}

	private async getProjectInfo(projectId: number) {
		const projectItem = await firstValueFrom(this.projectLookupService.getItemByKey({ id: projectId }));
		if (projectItem) {
			this.projectInfo = projectItem.ProjectNo + '-' + projectItem.ProjectName;
		}
	}

	public navigate() {
		this.onClose();
		//this.navigationService.navigate({ internalModuleName: 'scheduling.main', entityIdentifications: [{ id: this.options.entity.ScheduleFk as number }] });
		//todo
		/*naviService.navigate(
			{
				moduleName: 'scheduling.main',
				registerService: 'schedulingMainService',
			},
			this.options.entity,
			this.options.config.model,
		);*/
	}

	public ok() {
		if (this.status.isSucceed) {
			this.onClose();
			return;
		}
		this.setStatus(false, true, false, false);
		const executeParams = {
			MainItemId: this.options.request.PackageFk,
			ProjectId: this.options.request.ProjectFk,
			IsUpdateAll: true,
		};

		if (this.options.body.radioSelect === this.radioSelect.CurrentScheduling) {
			this.updateEventsFormScheduling(executeParams);
			return;
		}
		this.options.executingMessage = this.translate.instant({ key: this.executingMessage, params: { code: this.updateSchedulingResult.scheduleInfo } }).text;

		if (this.options.body.radioSelect === this.radioSelect.CurrentPackage) {
			executeParams.IsUpdateAll = false;
		}
		this.dialogLoading = true;
		this.updateSchedulingWizardService
			.updateSchedule(executeParams)
			.then((res) => {
				this.options.entity.ScheduleFk = res.Id;
				this.dialogLoading = false;
				const info = {
					code: this.updateSchedulingWizardService.updateScheduleInfo(res),
					code1: this.projectInfo,
				};
				this.options.executeSuccessedMessage = this.translate.instant({ key: this.successMessage, params: info }).text;
				this.setStatus(false, false, true, false);
			})
			.catch((error) => {
				this.dialogLoading = false;
				this.wizardError = error;
				this.setStatus(false, false, false, true);
				this.onClose();
			});
	}

	private updateEventsFormScheduling(params: IPackageUpdateSchedulingWizard) {
		this.options.executingMessage = this.translate.instant('procurement.package.wizard.updateScheduling.updatingPackageEvent').text;
		this.options.entity.ScheduleFk = this.options.request.ScheduleFk;
		this.updateSchedulingWizardService
			.updateEventsFormScheduling(params)
			.then((res) => {
				let resMsg = 'procurement.package.wizard.updateScheduling.noEventsUpdate';
				if (res) {
					resMsg = 'procurement.package.wizard.updateScheduling.okEventsUpdate';
				}
				this.options.executeSuccessedMessage = this.translate.instant(resMsg).text;
				this.setStatus(false, false, true, false);
			})
			.catch((error) => {
				this.wizardError = error;
				this.setStatus(false, false, false, true);
				this.onClose();
			});
	}

	private setStatus(isInit: boolean, isExecuting: boolean, isSucceed: boolean, isFailed: boolean) {
		this.status.isInit = isInit;
		this.status.isExecuting = isExecuting;
		this.status.isSucceed = isSucceed;
		this.status.isFailed = isFailed;
	}

	private onClose() {
		this.dialogWrapper.close();
	}

	public async ngOnInit(): Promise<void> {
		await this.getProjectInfo(this.updateSchedulingResult.ProjectFk);
		this.options.body.currentProject = this.translate.instant({ key: 'procurement.package.wizard.updateScheduling.currentProject', params: { code: this.projectInfo } }).text;
	}
}

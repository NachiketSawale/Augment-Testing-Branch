/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { StandardDialogButtonId, UiCommonMessageBoxService } from '@libs/ui/common';
import { PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { ICustomDialogOptions, UiCommonDialogService } from '@libs/ui/common';
import { ProcurementPackageHeaderDataService } from '../services/package-header-data.service';
import { IPackageUpdateSchedulingRequest, IPackageUpdateSchedulingWizard, PACKAGE_UPDATE_SCHEDULING_RESULT_TOKEN } from '../model/entities/procurement-package-update-scheduling-entity.interface';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import { ProcurementPackageEventDataService } from '../services/procurement-package-event-data.service';
import { ProcurementPackageUpdateSchedulingDialogComponent } from '../components/update-scheduling/update-scheduling-dialog.component';
import { IScheduleEntity } from '@libs/scheduling/interfaces';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageUpdateSchedulingWizardService {
	private readonly dialog = inject(UiCommonDialogService);
	private readonly translationService = inject(PlatformTranslateService);
	private readonly packageDataService = inject(ProcurementPackageHeaderDataService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly httpService = inject(PlatformHttpService);
	private readonly packageEventDataService = inject(ProcurementPackageEventDataService);
	private selectPackage: IPrcPackageEntity | null = null;
	private scheduleInfo: IScheduleEntity | null = null;
	private updateSchedulingRequest: IPackageUpdateSchedulingRequest = {
		PackageFk: 0,
		ProjectFk: 0,
		ActivityFk: 0,
		ScheduleFk: 0,
		scheduleInfo: '',
	};

	public onStartWizard(): void {
		this.packageDataService.updateAndExecute(() => {
			this.execute();
		});
	}

	private handleOk() {
		if (this.selectPackage) {
			this.packageEventDataService.loadSubEntities({ id: 0, pKey1: this.selectPackage.Id });
		}
	}

	public updateScheduleInfo(scheduleEntity: IScheduleEntity): string {
		this.scheduleInfo = scheduleEntity;
		if (this.scheduleInfo) {
			return this.scheduleInfo.Code;
		}
		return '';
	}

	public async getScheduleInfo() {
		if (this.scheduleInfo && this.scheduleInfo.ProjectFk === this.selectPackage?.ProjectFk) {
			return this.scheduleInfo;
		} else {
			const url = 'procurement/package/wizard/getscheduleinfo';
			const params = this.selectPackage ? this.selectPackage.ProjectFk : -1;
			const data = await this.httpService.get<IScheduleEntity>(url + '?ProjectFk=' + params);
			if (data) {
				this.scheduleInfo = data;
			}
			return this.scheduleInfo;
		}
	}

	public updateSchedule(executeParams: IPackageUpdateSchedulingWizard) {
		return this.httpService.post<IScheduleEntity>('procurement/package/wizard/updatescheduling', executeParams);
	}

	public updateEventsFormScheduling(executeParams: IPackageUpdateSchedulingWizard) {
		return this.httpService.post<string>('procurement/package/wizard/updateschedulingevent', executeParams);
	}

	private async execute(): Promise<void> {
		const headerText = this.translationService.instant('cloud.common.informationDialogHeader').text;
		if (!this.packageDataService?.hasSelection()) {
			const packageBodyText = this.translationService.instant('procurement.package.wizard.createRequisition.noPackageHeader').text;
			await this.messageBoxService.showMsgBox(packageBodyText, headerText, 'info');
			return;
		}
		this.selectPackage = this.packageDataService.getSelectedEntity();
		if (this.selectPackage) {
			this.updateSchedulingRequest.PackageFk = this.selectPackage.Id;
			this.updateSchedulingRequest.ProjectFk = this.selectPackage.ProjectFk;
			this.updateSchedulingRequest.ActivityFk = this.selectPackage.ActivityFk;
			this.updateSchedulingRequest.ScheduleFk = this.selectPackage.ScheduleFk;
		}

		const modalOption: ICustomDialogOptions<StandardDialogButtonId, ProcurementPackageUpdateSchedulingDialogComponent> = {
			headerText: this.translationService.instant('procurement.package.wizard.updateScheduling.caption').text,
			resizeable: true,
			buttons: [
				{
					id: 'Navigator',
					caption: { key: 'estimate.main.goToScheduler' },
					iconClass: 'tlb-icons ico-goto',
					isDisabled: (info) => {
						const component = info.dialog.body as ProcurementPackageUpdateSchedulingDialogComponent;
						return !component.status.isSucceed;
					},
					fn: (event, info) => {
						const component = info.dialog.body as ProcurementPackageUpdateSchedulingDialogComponent;
						component.navigate();
					},
				},
				{
					id: 'apply',
					caption: { key: 'cloud.common.ok' },
					isDisabled: (info) => {
						const component = info.dialog.body as ProcurementPackageUpdateSchedulingDialogComponent;
						return !component.status.isInit && !component.status.isSucceed;
					},
					fn: async (event, info) => {
						const component = info.dialog.body as ProcurementPackageUpdateSchedulingDialogComponent;
						component.ok();
					},
				},
				{
					id: StandardDialogButtonId.Cancel,
					caption: { key: 'cloud.common.cancel' },
					isVisible: (info) => {
						const component = info.dialog.body as ProcurementPackageUpdateSchedulingDialogComponent;
						return !component.status.isSucceed;
					},
				},
			],
			bodyComponent: ProcurementPackageUpdateSchedulingDialogComponent,
			bodyProviders: [
				{
					provide: PACKAGE_UPDATE_SCHEDULING_RESULT_TOKEN,
					useValue: this.updateSchedulingRequest,
				},
			],
		};

		this.getScheduleInfo().then((data) => {
			this.updateSchedulingRequest.scheduleInfo = '';
			if (data) {
				this.updateSchedulingRequest.scheduleInfo = data.Code;
			}
			this.dialog.show(modalOption)?.then((result) => {
				if (result) {
					this.handleOk();
				}
			});
		});
	}
}

/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IEditorDialogResult, StandardDialogButtonId, UiCommonFormDialogService } from '@libs/ui/common';
import { IBaselineEntity } from '@libs/scheduling/interfaces';
import { SchedulingMainDataService } from '../../services/scheduling-main-data.service';
import { CreateBaselineDialogConfig } from './create-baseline-dialog-config.class';
import { SchedulingEntityExecutionHelper } from '../common/scheduling-entity-execution-helper.class';
import { PlatformHttpService } from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})
export class CreateBaselineService{
	private readonly modalDialogService = inject(UiCommonFormDialogService);
	private readonly http = inject(PlatformHttpService);
	public specList: {id?: number | null, description?: string | null}[] = [];
	public baselineList: IBaselineEntity[] = [];

	public createBaseline(dataService: SchedulingMainDataService){
		/*
			TODO getSelectedSchedule, pinning context
			 private readonly schedule = schedulingMainService.getSelectedSchedule();
			 */
		const selectedEntity = dataService.getSelectedEntity();
		const scheduleId = selectedEntity?.ScheduleFk;
		const companyId = selectedEntity?.CompanyFk;

		if(scheduleId) {
			const baseline: IBaselineEntity = {
				Description: '',
				Remark:'',
				PsdScheduleFk: scheduleId
			};
			const dialogConfigurator = new CreateBaselineDialogConfig();

			const promise1 = this.http.post<IBaselineEntity>('basics/customize/baselinespec/list', {}).then((response) => {
				const copy = response as IBaselineEntity[];
				const list: { id?: number | null, description?: string | null }[] = [];

				if (copy && copy.length > 0) {
					copy.forEach(
						(e) => {
							list.push({
								id: e.Id,
								description: e.Description
							});
						});
				}
				this.specList = list;
			});

				const promise2 = this.http.post<IBaselineEntity>('scheduling/main/baseline/listbyschedule',
					{Filter: [scheduleId]}).then((response) => {
						const copy = response as IBaselineEntity[];
						const list: IBaselineEntity[] = [];

						if (copy && copy.length > 0) {
							copy.forEach(
								(e) => {
									list.push({
										Id: e.Id,
										Description: e.Description,
										Remark: e.Remark,
										InsertedAt: e.InsertedAt,
										InsertedBy: e.InsertedBy
									});
								});
						}
						this.baselineList = list;
					});
				Promise.all([promise1,promise2]).then(() => {
					this.modalDialogService.showDialog(dialogConfigurator.createFormConfiguration(baseline, this.specList))?.then((result: IEditorDialogResult<IBaselineEntity>) => {
					if (result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
						const action = {
							Action: 1,
							EffectedItemId: scheduleId,
							Baselines: [{
								Description: result.value?.Description,
								Remark: result.value?.Remark,
								BasCompanyFk: companyId,
								PsdScheduleFk: scheduleId
							}]
						};

						SchedulingEntityExecutionHelper.execute<IBaselineEntity>(action).then(() => {
							SchedulingEntityExecutionHelper.showSuccessDialog();
						});
					}
				});
			});
		} else {
			SchedulingEntityExecutionHelper.openDialogFailed();
		}
	}
}
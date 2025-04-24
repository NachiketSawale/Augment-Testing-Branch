/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IEditorDialogResult, StandardDialogButtonId, UiCommonDialogService } from '@libs/ui/common';
import { PlatformHttpService } from '@libs/platform/common';
import { IBaselineEntity } from '@libs/scheduling/interfaces';
import { SchedulingMainDataService } from '../../services/scheduling-main-data.service';
import { SchedulingEntityExecutionHelper } from '../common/scheduling-entity-execution-helper.class';
import { DeleteBaselineDialogConfig } from './delete-baseline-dialog-config.class';

export class BaselineToDelete {
	public Id?: number | null;
	public IsToDelete?: boolean;
	public Baseline?: IBaselineEntity | null;
}

@Injectable({providedIn: 'root'})
export class DeleteBaselineService{
	private readonly modalDialogService = inject(UiCommonDialogService);
	private readonly http = inject(PlatformHttpService);
	public baselineList : BaselineToDelete[] = [];

	public deleteBaseline(dataService: SchedulingMainDataService){
		/*
			TODO getSelectedSchedule, pinning context
			 private readonly schedule = schedulingMainService.getSelectedSchedule();
			 */
		const selectedEntity = dataService.getSelectedEntity();
		const scheduleId = selectedEntity?.ScheduleFk;

		if(scheduleId) {
			const dialogConfigurator = new DeleteBaselineDialogConfig();

			this.http.post<IBaselineEntity>('scheduling/main/baseline/listbyschedule',
				{Filter: [scheduleId]}).then((response) =>{
				const copy = response as IBaselineEntity[];
				const list: BaselineToDelete[] = [];

				if(copy && copy.length > 0){
					copy.forEach(
						(e) => {
							list.push({
								IsToDelete: false,
								Id: e.Id,
								Baseline: e
							});
						});
				}
				this.baselineList = list;
				}).then(() => {
				this.modalDialogService.show(dialogConfigurator.createFormConfiguration(this.baselineList))?.then((result: IEditorDialogResult<BaselineToDelete[]>) => {
					if (result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
						const action = {
							Action: 12,
							ScheduleId: scheduleId,
							Baselines: result.value?.filter(i => i.IsToDelete).map((obj) => {
								return obj.Baseline;
							})
						};

						SchedulingEntityExecutionHelper.execute<BaselineToDelete[]>(action).then(() => {
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
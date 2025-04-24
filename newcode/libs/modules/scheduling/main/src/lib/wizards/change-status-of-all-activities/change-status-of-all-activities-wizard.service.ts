/*
 * Copyright(c) RIB Software GmbH
 */


import { inject, Injectable } from '@angular/core';
import { StandardDialogButtonId, UiCommonDialogService } from '@libs/ui/common';
import { PlatformHttpService } from '@libs/platform/common';
import { SchedulingMainDataService } from '../../services/scheduling-main-data.service';
import { SchedulingEntityExecutionHelper } from '../common/scheduling-entity-execution-helper.class';
import { ChangeStatusOfAllActivitiesDialogConfig } from './change-status-of-all-activities-dialog-config.class';
import { IChangeActivityStateEntity } from '@libs/scheduling/interfaces';

@Injectable({
	providedIn: 'root'
})

export class ChangeActivityStateOfAllActivitiesWizardService {
	private readonly modalDialogService = inject(UiCommonDialogService);
	private readonly http = inject(PlatformHttpService);
	public dataItems: IChangeActivityStateEntity[] = [];

	public changeActivityStateOfAllActivitiesWizardService(dataService: SchedulingMainDataService){
		const listIds = dataService.getList().map((activity) => {
			if (activity){
				return activity.Id;
			}
			return null;
		});


		if (listIds.length <= 0){
			SchedulingEntityExecutionHelper.openDialogFailed();
		} else {
			const dialogConfiguration = new ChangeStatusOfAllActivitiesDialogConfig();

			this.http.get<IChangeActivityStateEntity[]>('scheduling/lookup/activitystates').then((response) => {
				if(response){
					response.sort((a,b) =>
						a.Sorting && b.Sorting && a.Sorting < b.Sorting ? -1 :
						a.Sorting === b.Sorting && a.Code && b.Code && a.Code < b.Code ? -1 : 1);
					response.forEach( item => {
						const newItem : IChangeActivityStateEntity = {
							Id: item.Id,
							Code: item.Code,
							Description: item.Description,
							Icon: item.Icon,
							IsAutomatic: item.IsAutomatic,
							IsStarted: item.IsStarted,
							IsDelayed: item.IsDelayed,
							IsAhead: item.IsAhead,
							IsFinished: item.IsFinished,
							IsFinishedDelayed: item.IsFinishedDelayed
						};
						//TODO change readonly of a cell in the column IsAutomatic
						this.dataItems.push(newItem);
					});
				}
			}).then(() => {
				this.modalDialogService.show(dialogConfiguration.createFormConfiguration(this.dataItems))?.then((result) => {
					if (result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
						const action = {
							Action: 6,
							ChangeActivityStateInfo: result.value,
							ActivityIds: listIds
						};
						SchedulingEntityExecutionHelper.execute<IChangeActivityStateEntity[]>(action).then(() => {
							SchedulingEntityExecutionHelper.showSuccessDialog();
							dataService.refreshAll();
						});
					}
				});
			});
		}
	}
}
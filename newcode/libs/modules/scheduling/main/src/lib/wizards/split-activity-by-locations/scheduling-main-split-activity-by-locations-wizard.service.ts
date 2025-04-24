/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IEditorDialogResult, StandardDialogButtonId, UiCommonDialogService } from '@libs/ui/common';
import { SchedulingMainDataService } from '../../services/scheduling-main-data.service';
import { SchedulingEntityExecutionHelper } from '../common/scheduling-entity-execution-helper.class';
import { SplitActivityByLocationsDialogConfig } from './split-activity-by-locations-dialog-config.class';
import { IProjectLocationEntity } from '@libs/project/interfaces';
import { PlatformHttpService } from '@libs/platform/common';

export class LocTableEntry{
	public Id?: number = 0;
	public useInSplit: boolean = false;
	public item: IProjectLocationEntity | null = null;
	public Parent?: number | null = null;
	public ParentEntity?: LocTableEntry | null = null;
	public Children?: LocTableEntry[] = [];
	public HasChildren?: boolean = false;
}

export class Relations {
	public Create: boolean = true;
	public RelationKindFk: number = 1;
	public FixLagTime: number = 0;
	public FixLagPercent: number = 0;
	public VarLagTime: number = 0;
	public VarLagPercent: number = 0;
}

@Injectable({
	providedIn: 'root'
})

export class SplitActivityByLocationsService {
	private readonly modalDialogService = inject(UiCommonDialogService);
	private readonly http = inject(PlatformHttpService);
	public locationsList: LocTableEntry[] = [];
	public relations: Relations = new Relations();

	public splitActivityByLocations(dataService: SchedulingMainDataService){
		const activityId = dataService.getSelectedEntity()?.Id;

		if(activityId) {
			this.locationsList = [];
			this.relations = new Relations();

			const dialogConfigurator = new SplitActivityByLocationsDialogConfig();

			this.http.get<IProjectLocationEntity[]>('project/location/treebyprojects?projectId=' + dataService.getSelectedEntity()?.ProjectFk).then((response) => {
					if(response && response.length > 0){
						response.forEach(
							(e) => {
								SchedulingEntityExecutionHelper.createLocTableEntry(e, this.locationsList, null);
							});
					}
				}
			).then(() => {
				this.modalDialogService.show(dialogConfigurator.createFormConfiguration())?.then((result: IEditorDialogResult<object>) => {
					if (result.closingButtonId === StandardDialogButtonId.Ok && result) {
						let count = 0;

						//TODO by selected baselines in grid, the property IsToDelete is not set to true
						const action = {
							Action: 2,
							EffectedItemId: activityId,
							Location: {
								LocID: 0,
								Code: '',
								Quantity: 0,
								Children: []
							},
							RelationShip: this.relations.Create ? this.relations : null
						};

						count = SchedulingEntityExecutionHelper.createLocDTOEntries(action.Location, this.locationsList, 0);

						if (count > 0) {
							SchedulingEntityExecutionHelper.execute(action).then(() => {
								SchedulingEntityExecutionHelper.showSuccessDialog();
								dataService.refreshAll();
							});
						}
					}
				});
			});
		} else {
			SchedulingEntityExecutionHelper.openDialogFailed();
		}
	}
}
/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceOptions,} from '@libs/platform/data-access';
import { IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IActivityEntity,IActivityProgressReportEntity } from '@libs/scheduling/interfaces';
import { ActivityComplete } from '../model/activity-complete.class';
import { SchedulingMainDataService } from './scheduling-main-data.service';

@Injectable({
	providedIn: 'root'
})

export class SchedulingProgressReportDataService extends DataServiceFlatLeaf<IActivityProgressReportEntity,
	IActivityEntity, ActivityComplete> {

	private readonly schedulingMainService = inject(SchedulingMainDataService);

	public constructor(schedulingMainDataService : SchedulingMainDataService) {
		const options: IDataServiceOptions<IActivityProgressReportEntity> = {
			apiUrl: 'scheduling/main/progressreport',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: ident => {
					const selection = schedulingMainDataService.getSelection()[0];
					return { mainItemId: selection.Id };
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IActivityProgressReportEntity,
				IActivityEntity, ActivityComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'ProgressReports',
				parent: schedulingMainDataService
			}
		};
		super(options);
	}

	public override registerModificationsToParentUpdate(complete: ActivityComplete, modified: IActivityProgressReportEntity[], deleted: IActivityProgressReportEntity[]) {
		if (modified && modified.length > 0) {
			complete.ProgressReportsToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			complete.ProgressReportsToDelete = deleted;
		}
	}

	public takeOverNewReports(newItems : IActivityProgressReportEntity[] | null) {
		let fireListLoaded = false;
		/* Handel the PerformanceDate conflict */
		const tmpArray = [];
		if (newItems !== null){
			for (let i = 0; i < newItems.length - 1; i++) {
				let exists = false;
				tmpArray.forEach((val2) => {
					if (newItems !== null &&
						newItems[i].PerformanceDate === val2.PerformanceDate && newItems[i].EstLineItemFk === val2.EstLineItemFk) {
						exists = true;
					}
				});
				if (exists === false && newItems[i] !== null) {
					tmpArray.push(newItems[i]);
				}
			}
		}
		if(tmpArray.length > 0){
			newItems = tmpArray;
		}

		const itemList = this.getList();

		newItems?.forEach((newItem : IActivityProgressReportEntity) => {
			this.processor.process(newItem);
			let tmpItem = itemList.find(i => i.Id === newItem.Id);
			if (!tmpItem) {
				if (this.schedulingMainService.getSelectedEntity()?.Id === newItem.ActivityFk) {
					if(itemList.length>0) {
						const filterDueDate = itemList.find(x => x.PerformanceDate/*TODO .format('YYYY[-]MM[-]DD[T00:00:00Z]')*/ === newItem.PerformanceDate/*TODO .format('YYYY[-]MM[-]DD[T00:00:00Z]')*/ && x.EstLineItemFk === newItem.EstLineItemFk);
						if(!filterDueDate) {
							itemList.push(newItem);
						}else{
							const index = itemList.indexOf(filterDueDate);
							if(newItem.Quantity !== null && newItem.Quantity !== undefined && newItem.Quantity>0){
								itemList[index] = newItem;
							}
						}
					} else {
						itemList.push(newItem);
					}

					fireListLoaded = true;
					//TODO data.markItemAsModified(newItem, data);
				} else {
					//TODO schedulingMainProgressReportTempService.takeCareOfNewReport(newItem);
				}
			} else {
				tmpItem = newItem;
				//TODO data.markItemAsModified(newItem, data);
			}
		});
		if (fireListLoaded) {
			//TODO data.listLoaded.fire(data.itemList);
		}
	}


}

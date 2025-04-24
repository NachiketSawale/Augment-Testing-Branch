import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { IActivityEntity, ILineItemProgressEntity } from '@libs/scheduling/interfaces';
import { ActivityComplete } from '../model/activity-complete.class';
import { Injectable } from '@angular/core';
import { SchedulingMainDataService } from './scheduling-main-data.service';
import { SchedulingMainReadonlyProcessorService } from './scheduling-main-readonly-processor.service';

@Injectable({
	providedIn: 'root'
})

export class SchedulingMainLineItemProgressDataService extends DataServiceFlatLeaf<ILineItemProgressEntity, IActivityEntity, ActivityComplete> {
	public constructor(schedulingMainDataService : SchedulingMainDataService) {
		const options: IDataServiceOptions<ILineItemProgressEntity> = {
			apiUrl: 'scheduling/main/lineitemprogress',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				prepareParam: () => {
					//TODO
					// dueDate from activity options dialog
					const dueDate= schedulingMainDataService.getDueDate()? new Date():'';
					if (dueDate) {
						return {mainItemId : schedulingMainDataService.getSelectedEntity()?.Id,
							performanceDueDate: dueDate.toISOString()};
					}
					return {mainItemId : schedulingMainDataService.getSelectedEntity()?.Id};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<ILineItemProgressEntity,
				IActivityEntity, ActivityComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'LineItemProgresses',
				parent: schedulingMainDataService
			},
			entityActions: {
				createSupported: false,
				deleteSupported: false
			},
			processors: [{
				process(toProcess: ILineItemProgressEntity) {
					schedulingMainDataService.processItem(toProcess);
				},
				revertProcess(toProcess: ILineItemProgressEntity) {
					schedulingMainDataService.processItem(toProcess);
				}
			}]
		};
		super(options);
		//TODO which processor is the right one?
		this.processor.addProcessor(new SchedulingMainReadonlyProcessorService<ILineItemProgressEntity>(this));
	}

	public takeOverNewValues(data : ILineItemProgressEntity | null) {
		const lineItem = this.getList().find(i => i.Id == data?.LineItemFk);
		if (lineItem !== null && lineItem !== undefined) {
			lineItem.PeriodQuantityPerformance = data?.PeriodQuantityPerformance;
			lineItem.DueDateQuantityPerformance = data?.DueDateQuantityPerformance;
			lineItem.RemainingLineItemQuantity = data?.RemainingLineItemQuantity;
			lineItem.PCo = data?.PCo;
			lineItem.PeriodWorkPerformance = data?.PeriodWorkPerformance;
			lineItem.DueDateWorkPerformance = data?.DueDateWorkPerformance;
			lineItem.RemainingLineItemWork = data?.RemainingLineItemWork;

			//TODO serviceContainer.data.itemModified.fire(null, lineItem);
		}
	}
}
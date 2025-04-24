import { inject, Injectable } from '@angular/core';
import { DataServiceFlatLeaf, EntityDateProcessorFactory, IDataServiceChildRoleOptions, IDataServiceOptions, IEntityProcessor, } from '@libs/platform/data-access';
import { IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import {IReportEntity, ITimekeepingBreakEntity} from '@libs/timekeeping/interfaces';
import { TimekeepingTimeControllingReportDataService } from './timekeeping-time-controlling-report-data.service';
import { ControllingReportComplete } from '../model/entities/controlling-report-complete.class';
@Injectable({
	providedIn: 'root'
})

export class TimekeepingTimeControllingBreakDataService extends DataServiceFlatLeaf<ITimekeepingBreakEntity,
	IReportEntity, ControllingReportComplete> {

	public constructor(timekeepingTimeControllingReportDataService : TimekeepingTimeControllingReportDataService) {
		const options: IDataServiceOptions<ITimekeepingBreakEntity> = {
			apiUrl: 'timekeeping/recording/break',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true,
				prepareParam: ident => {
					const selection = timekeepingTimeControllingReportDataService.getSelection()[0];
					return { pKey1 : selection.Id};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<ITimekeepingBreakEntity,
				IReportEntity, ControllingReportComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Breaks',
				parent: timekeepingTimeControllingReportDataService
			}
		};

		super(options);
	}

	protected override provideAllProcessor(options: IDataServiceOptions<ITimekeepingBreakEntity>): IEntityProcessor<ITimekeepingBreakEntity>[] {
		const allProcessor = super.provideAllProcessor(options);
		allProcessor.push(this.provideDateProcessor());
		return allProcessor;
	}

	private provideDateProcessor(): IEntityProcessor<ITimekeepingBreakEntity> {
		const dateProcessorFactory = inject(EntityDateProcessorFactory);
		return dateProcessorFactory.createProcessorFromSchemaInfo<ITimekeepingBreakEntity>({ moduleSubModule: 'Timekeeping.Recording', typeName: 'TimekeepingBreakDto' });
	}
}

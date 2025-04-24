import { inject, Injectable, InjectionToken } from '@angular/core';
import { DataServiceFlatLeaf, EntityDateProcessorFactory, IDataServiceChildRoleOptions, IDataServiceOptions, IEntityProcessor, } from '@libs/platform/data-access';
import { IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IReportEntity, ITimekeepingBreakEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingRecordingReportComplete } from '../model/timekeeping-recording-report-complete.class';
import { TimekeepingRecordingReportDataService } from './timekeeping-recording-report-data.service';

export const BREAK_DATA = new InjectionToken<ITimekeepingBreakEntity[]>('BreakData');

@Injectable({
	providedIn: 'root'
})

export class TimekeepingRecordingBreakDataService extends DataServiceFlatLeaf<ITimekeepingBreakEntity,
	IReportEntity, TimekeepingRecordingReportComplete> {

	public constructor(timekeepingRecordingReportDataService: TimekeepingRecordingReportDataService) {
		const options: IDataServiceOptions<ITimekeepingBreakEntity> = {
			apiUrl: 'timekeeping/recording/break',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true,
				prepareParam: ident => {
					const selection = timekeepingRecordingReportDataService.getSelection()[0];
					return {pKey1: selection.Id};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<ITimekeepingBreakEntity,
				IReportEntity, TimekeepingRecordingReportComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Breaks',
				parent: timekeepingRecordingReportDataService
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
		return dateProcessorFactory.createProcessorFromSchemaInfo<ITimekeepingBreakEntity>({moduleSubModule: 'Timekeeping.Recording', typeName: 'TimekeepingBreakDto'});
	}
}

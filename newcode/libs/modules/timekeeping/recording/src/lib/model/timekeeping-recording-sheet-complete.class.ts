import { CompleteIdentification } from '@libs/platform/common';
import { ISheetEntity,IReportEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingRecordingReportComplete } from './timekeeping-recording-report-complete.class';
export class TimekeepingRecordingSheetComplete implements CompleteIdentification<ISheetEntity>{

	 public MainItemId: number = 0;
	 public Sheets: ISheetEntity | null  = null;
	 public ReportsToSave: TimekeepingRecordingReportComplete[] | null = [];
	 public ReportsToDelete: IReportEntity[] | null = [];
	public constructor(e: ISheetEntity | null) {
		if (e) {
			this.MainItemId = e.Id;
			this.Sheets = e;
		}
	}
}

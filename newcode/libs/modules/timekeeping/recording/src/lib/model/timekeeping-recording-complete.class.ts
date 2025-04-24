import { CompleteIdentification } from '@libs/platform/common';
import { IRecordingEntity,ISheetEntity,ITimekeepingResultEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingRecordingSheetComplete } from './timekeeping-recording-sheet-complete.class';
import { TimekeepingRecordingResultComplete } from './timekeeping-recording-result-complete.class';
export class TimekeepingRecordingComplete implements CompleteIdentification<IRecordingEntity>{

	public Id: number = 0;

	public SheetsToSave:TimekeepingRecordingSheetComplete[] | null = [];
	public SheetsToDelete:ISheetEntity[] | null = [];
	public ResultsToSave: TimekeepingRecordingResultComplete[] | null = [];
	public ResultsToDelete: ITimekeepingResultEntity[] | null = [];
	public Recordings: IRecordingEntity[] | null = [];


}

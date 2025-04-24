import { CompleteIdentification } from '@libs/platform/common';
import { ITimekeepingResultEntity } from '@libs/timekeeping/interfaces';

export class TimekeepingRecordingResultComplete implements CompleteIdentification<ITimekeepingResultEntity>{

	public Id: number = 0;
	public Results: ITimekeepingResultEntity | null = null;


}

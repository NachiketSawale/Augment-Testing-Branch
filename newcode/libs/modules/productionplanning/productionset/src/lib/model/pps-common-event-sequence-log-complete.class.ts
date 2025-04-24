import { CompleteIdentification } from '@libs/platform/common';
import { IPpsLogReportVEntity } from './entities/external_entities/pps-log-report-ventity.interface';

export class PpsCommonEventSequenceLogComplete implements CompleteIdentification<IPpsLogReportVEntity>{

	public Id: number = 0;

	public Datas: IPpsLogReportVEntity[] | null = [];


}

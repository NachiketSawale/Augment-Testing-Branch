import { CompleteIdentification } from '@libs/platform/common';
import { IReportGroupEntity } from './entities/report-group-entity.interface';

export class BasicsConfigReportGroupComplete implements CompleteIdentification<IReportGroupEntity> {
	public mainItemId: number = 0;

	public Datas: IReportGroupEntity[] | null = [];
}

import { CompleteIdentification } from '@libs/platform/common';
import { ICompanyCostDataEntity } from './entities/company-cost-data-entity.interface';

export class ControllingActualsCostDataComplete implements CompleteIdentification<ICompanyCostDataEntity> {
	public Id: number = 0;

	public CompanyCostDataDto: ICompanyCostDataEntity | null = null;
}

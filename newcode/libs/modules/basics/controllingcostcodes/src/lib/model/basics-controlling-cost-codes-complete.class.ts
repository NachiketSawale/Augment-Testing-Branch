import { CompleteIdentification } from '@libs/platform/common';
import { IContrCostCodeEntity } from './entities/contr-cost-code-entity.interface';

export class BasicsControllingCostCodesComplete implements CompleteIdentification<IContrCostCodeEntity>{

	public Id: number = 0;

	public ContrCostCodes: IContrCostCodeEntity[] | null = [];
}

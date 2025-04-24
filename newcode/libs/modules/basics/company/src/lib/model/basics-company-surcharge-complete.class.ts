import { CompleteIdentification } from '@libs/platform/common';
import { ICompany2CostCodeEntity } from '@libs/basics/interfaces';

export class BasicsCompanySurchargeComplete implements CompleteIdentification<ICompany2CostCodeEntity>{

	public Id: number = 0;

	public Datas: ICompany2CostCodeEntity[] | null = [];


}

import { CompleteIdentification } from '@libs/platform/common';
import { ICompanyDebtorEntity } from '@libs/basics/interfaces';

export class BasicsCompanyDebtorComplete implements CompleteIdentification<ICompanyDebtorEntity>{

	public Id: number = 0;

	public Datas: ICompanyDebtorEntity[] | null = [];


}

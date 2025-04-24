import { CompleteIdentification } from '@libs/platform/common';
import { ICompanyTransactionEntity } from '@libs/basics/interfaces';

export class BasicsCompanyTransactionComplete implements CompleteIdentification<ICompanyTransactionEntity>{

	public Id: number = 0;

	public Datas: ICompanyTransactionEntity[] | null = [];


}

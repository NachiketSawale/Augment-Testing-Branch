import { CompleteIdentification } from '@libs/platform/common';
import { ICompanyUrlEntity } from '@libs/basics/interfaces';

export class BasicsCompanyUrlComplete implements CompleteIdentification<ICompanyUrlEntity>{

	public Id: number = 0;

	public Datas: ICompanyUrlEntity[] | null = [];


}

import { CompleteIdentification } from '@libs/platform/common';
import { ICompanyDeferaltypeEntity } from '@libs/basics/interfaces';

export class BasicsCompanyDeferaltypeComplete implements CompleteIdentification<ICompanyDeferaltypeEntity>{

	public Id: number = 0;

	public Datas: ICompanyDeferaltypeEntity[] | null = [];


}

import { CompleteIdentification } from '@libs/platform/common';
import { ICompany2TextModuleEntity } from '@libs/basics/interfaces';

export class BasicsCompanyTextModuleComplete implements CompleteIdentification<ICompany2TextModuleEntity>{

	public Id: number = 0;

	public Datas: ICompany2TextModuleEntity[] | null = [];


}

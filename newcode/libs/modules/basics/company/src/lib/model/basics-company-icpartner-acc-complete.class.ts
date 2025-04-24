import { CompleteIdentification } from '@libs/platform/common';
import { ICompanyICPartnerAccEntity } from '@libs/basics/interfaces';

export class BasicsCompanyICPartnerAccComplete implements CompleteIdentification<ICompanyICPartnerAccEntity>{

	public Id: number = 0;

	public Datas: ICompanyICPartnerAccEntity[] | null = [];


}

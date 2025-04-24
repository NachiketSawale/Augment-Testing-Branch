import { CompleteIdentification } from '@libs/platform/common';
import { ICompanyICPartnerEntity } from '@libs/basics/interfaces';

export class BasicsCompanyICPartnerCardComplete implements CompleteIdentification<ICompanyICPartnerEntity>{

	public Id: number = 0;

	public CompanyICPartner: ICompanyICPartnerEntity[] | null = [];


}

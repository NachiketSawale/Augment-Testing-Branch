
import { ICompanyEntity } from '@libs/basics/interfaces';
import { IContact2BasCompanyEntity } from '../common';

export interface IContact2CompanyResponse {
	Main: IContact2BasCompanyEntity[],
	Company: ICompanyEntity[]
}
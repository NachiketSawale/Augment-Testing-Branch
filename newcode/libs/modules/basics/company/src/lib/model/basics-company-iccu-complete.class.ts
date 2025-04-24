import { CompleteIdentification } from '@libs/platform/common';
import { ICompanyICCuEntity } from '@libs/basics/interfaces';

export class BasicsCompanyICCuComplete implements CompleteIdentification<ICompanyICCuEntity>{

	public Id: number = 0;

	public Datas: ICompanyICCuEntity[] | null = [];


}

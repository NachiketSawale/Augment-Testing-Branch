import { CompleteIdentification } from '@libs/platform/common';
import { ICompany2BasClerkEntity } from '@libs/basics/interfaces';

export class BasicsCompany2BasClerkComplete implements CompleteIdentification<ICompany2BasClerkEntity>{

	public Id: number = 0;

	public Datas: ICompany2BasClerkEntity[] | null = [];


}

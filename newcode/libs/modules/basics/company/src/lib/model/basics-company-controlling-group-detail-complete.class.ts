import { CompleteIdentification } from '@libs/platform/common';
import { ICompanyControllingGroupEntity } from '@libs/basics/interfaces';

export class BasicsCompanyControllingGroupDetailComplete implements CompleteIdentification<ICompanyControllingGroupEntity>{

	public Id: number = 0;

	public Datas: ICompanyControllingGroupEntity[] | null = [];


}

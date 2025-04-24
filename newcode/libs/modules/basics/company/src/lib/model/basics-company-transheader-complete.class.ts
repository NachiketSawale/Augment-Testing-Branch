import { CompleteIdentification } from '@libs/platform/common';
import { ICompanyTransheaderEntity } from '@libs/basics/interfaces';

export class BasicsCompanyTransheaderComplete implements CompleteIdentification<ICompanyTransheaderEntity>{

	public Id: number = 0;

	public Datas: ICompanyTransheaderEntity[] | null = [];


}

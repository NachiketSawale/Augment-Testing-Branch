import { CompleteIdentification } from '@libs/platform/common';
import { ITrsConfigEntity } from '@libs/basics/interfaces';


export class BasicsCompanyTrsConfigComplete implements CompleteIdentification<ITrsConfigEntity>{

	public Id: number = 0;

	public Datas: ITrsConfigEntity[] | null = [];


}

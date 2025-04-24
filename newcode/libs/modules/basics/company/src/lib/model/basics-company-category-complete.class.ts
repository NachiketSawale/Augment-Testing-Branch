import { CompleteIdentification } from '@libs/platform/common';
import { IRubricCategory2CompanyEntity } from '@libs/basics/interfaces';

export class BasicsCompanyCategoryComplete implements CompleteIdentification<IRubricCategory2CompanyEntity>{

	public Id: number = 0;

	public Datas: IRubricCategory2CompanyEntity[] | null = [];


}

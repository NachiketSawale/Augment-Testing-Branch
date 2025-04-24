import { CompleteIdentification } from '@libs/platform/common';
import { IStockEvaluationRule4CompEntity } from '@libs/basics/interfaces';

export class BasicsCompanyStockEvaluationRuleComplete implements CompleteIdentification<IStockEvaluationRule4CompEntity>{

	public Id: number = 0;

	public Datas: IStockEvaluationRule4CompEntity[] | null = [];


}

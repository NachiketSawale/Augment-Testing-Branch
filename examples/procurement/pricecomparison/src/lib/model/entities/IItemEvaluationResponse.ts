import { IQuoteHeaderEntity, IQuoteRequisitionEntity } from '@libs/procurement/quote';
import { ICustomCompareColumnEntity } from './custom-compare-column-entity.interface';

export interface IItemEvaluationResponse {
	Main: ICustomCompareColumnEntity[],
	Quote: IQuoteHeaderEntity[],
	QuoteRequisition: IQuoteRequisitionEntity[],
}
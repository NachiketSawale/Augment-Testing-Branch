import { CompleteIdentification } from '@libs/platform/common';
import { IBillHeaderEntity } from '../entities/bill-header-entity.interface';

export class SalesContractRelatedBillComplete implements CompleteIdentification<IBillHeaderEntity>{

	public Id: number = 0;
}
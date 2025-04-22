import { CompleteIdentification } from '@libs/platform/common';
import { IWipHeaderEntity } from '../entities/wip-header-entity.interface';

export class SalesContractRelatedWipComplete implements CompleteIdentification<IWipHeaderEntity>{

	public Id: number = 0;
}
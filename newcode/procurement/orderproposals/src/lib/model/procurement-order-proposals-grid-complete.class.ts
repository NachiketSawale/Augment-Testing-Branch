import { CompleteIdentification } from '@libs/platform/common';
import { IOrderProposalEntity } from './entities/order-proposal-entity.interface';

export class ProcurementOrderProposalsGridComplete implements CompleteIdentification<IOrderProposalEntity>{

	public Id: number = 0 ;

	public OrderProposals?: IOrderProposalEntity[] | null = [];

	
}

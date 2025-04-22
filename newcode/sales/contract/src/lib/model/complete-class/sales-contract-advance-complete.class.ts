import { CompleteIdentification } from '@libs/platform/common';
import { IOrdAdvanceEntity } from '@libs/sales/interfaces';

export class SalesContractAdvanceComplete implements CompleteIdentification<IOrdAdvanceEntity>{

	public Id: number = 0;
	public AdvanceEntityToSave: IOrdAdvanceEntity[] | null = [];
}
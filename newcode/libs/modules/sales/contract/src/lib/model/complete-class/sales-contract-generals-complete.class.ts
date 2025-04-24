import { CompleteIdentification } from '@libs/platform/common';
import { IGeneralsEntity } from '@libs/sales/interfaces';

export class SalesContractGeneralsComplete implements CompleteIdentification<IGeneralsEntity>{

	public Id: number = 0;

	public GeneralEntityToSave: IGeneralsEntity[] | null = [];

}

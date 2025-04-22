import { CompleteIdentification } from '@libs/platform/common';
import { IOrdWarrantyEntity } from '@libs/sales/interfaces';

export class SalesContractWarrantyComplete implements CompleteIdentification<IOrdWarrantyEntity> {

	public Id: number = 0;

	public WarrantyEntityToSave: IOrdWarrantyEntity[] | null = [];

}

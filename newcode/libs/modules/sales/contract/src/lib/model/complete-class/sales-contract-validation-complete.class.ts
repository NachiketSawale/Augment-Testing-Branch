import { CompleteIdentification } from '@libs/platform/common';
import { IOrdValidationEntity } from '@libs/sales/interfaces';

export class SalesContractValidationComplete implements CompleteIdentification<IOrdValidationEntity> {

	public Id: number = 0;

	public ValidationEntityToSave: IOrdValidationEntity[] | null = [];

}

import { CompleteIdentification } from '@libs/platform/common';
import { ISharedMandatoryDeadlinesEntity } from '@libs/sales/shared';

export class SalesContractMandatoryDeadlinesComplete implements CompleteIdentification<ISharedMandatoryDeadlinesEntity> {

	public Id: number = 0;

	public mandatoryDeadlinesEntityToSave: ISharedMandatoryDeadlinesEntity[] | null = [];

}

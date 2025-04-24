import { CompleteIdentification } from '@libs/platform/common';
import { IOrdMilestoneEntity } from '@libs/sales/interfaces';

export class SalesContractMilestonesComplete implements CompleteIdentification<IOrdMilestoneEntity> {

	public Id: number = 0;

	public MilestoneEntityToSave: IOrdMilestoneEntity[] | null = [];

}

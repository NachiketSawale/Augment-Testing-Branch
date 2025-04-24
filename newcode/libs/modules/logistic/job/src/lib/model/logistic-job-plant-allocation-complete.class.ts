import { CompleteIdentification } from '@libs/platform/common';
import { IJobPlantAllocationEntity } from '@libs/logistic/interfaces';

export class LogisticJobPlantAllocationComplete extends CompleteIdentification<IJobPlantAllocationEntity>{

	public MainItemId: number = 0;

	public PlantAllocations: IJobPlantAllocationEntity[] = [];




}

import { CompleteIdentification } from '@libs/platform/common';
import { IPpsFabricationUnitEntity, IPpsNestingEntity } from './models';

export class PpsFabricationunitComplete implements CompleteIdentification<IPpsFabricationUnitEntity> {

	public MainItemId: number = 0;
	public FabricationUnits: IPpsFabricationUnitEntity[] | null = [];
	public NestingToDelete: IPpsNestingEntity[] = [];
	public NestingToSave: IPpsNestingEntity[] = [];

}

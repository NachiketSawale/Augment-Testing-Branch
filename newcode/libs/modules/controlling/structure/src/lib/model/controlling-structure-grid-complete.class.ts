import { CompleteIdentification } from '@libs/platform/common';
import { IControllingUnitEntity, IControllingUnitGroupEntity } from './models';

export class ControllingStructureGridComplete implements CompleteIdentification<IControllingUnitEntity>{

	public MainItemId: number = 0;
	public ControllingUnits: IControllingUnitEntity[] | null = [];
	public ControllingUnitGroupsToSave: IControllingUnitGroupEntity[] | null = [];
	public ControllingUnitGroupsToDelete: IControllingUnitGroupEntity[] | null = [];

}

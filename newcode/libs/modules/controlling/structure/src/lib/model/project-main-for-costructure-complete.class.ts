import { CompleteIdentification } from '@libs/platform/common';
import { IProjectEntity } from '@libs/project/interfaces';
import { IControllingUnitEntity } from './models';


export class ProjectMainForCOStructureComplete implements CompleteIdentification<IProjectEntity>{

	public MainItemId: number = 0;

	public Projects: IProjectEntity[] | null = [];
	public ControllingUnitsToSave: IControllingUnitEntity[] | null = [];
	public ControllingUnitsToDelete: IControllingUnitEntity[] | null = [];
}

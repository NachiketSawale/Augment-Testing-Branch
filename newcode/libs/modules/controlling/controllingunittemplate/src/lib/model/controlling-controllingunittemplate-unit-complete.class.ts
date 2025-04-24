import { CompleteIdentification } from '@libs/platform/common';
import { IControltemplateGroupEntity, IControltemplateUnitEntity } from './models';

export class ControllingControllingunittemplateUnitComplete implements CompleteIdentification<IControltemplateUnitEntity> {

	public MainItemId: number = 0;
	public ControllingUnits: IControltemplateUnitEntity[] | null = [];

	public ControllingUnitTemplateGroupsToSave: IControltemplateGroupEntity[] | null = [];
	public ControllingUnitTemplateGroupsToDelete: IControltemplateGroupEntity[] | null = [];
}
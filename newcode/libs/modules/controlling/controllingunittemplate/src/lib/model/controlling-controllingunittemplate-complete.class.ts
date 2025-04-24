import { CompleteIdentification } from '@libs/platform/common';
import { IControltemplateEntity } from './entities/controltemplate-entity.interface';
import { IControltemplateUnitEntity } from './models';

export class ControllingControllingunittemplateComplete implements CompleteIdentification<IControltemplateEntity> {

	public MainItemId: number = 0;
	public ControllingUnitTemplates: IControltemplateEntity[] | null = [];

	public ControllingUnitsToSave: IControltemplateUnitEntity[] | null = [];

	public ControllingUnitsToDelete: IControltemplateUnitEntity[] | null = [];


}

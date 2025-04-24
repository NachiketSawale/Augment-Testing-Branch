import { CompleteIdentification } from '@libs/platform/common';
import { IControltemplateGroupEntity } from './models';

export class ControllingControllingunittemplateGroupComplete implements CompleteIdentification<IControltemplateGroupEntity> {

	public MainItemId: number = 0;

	public ControllingUnitGroups: IControltemplateGroupEntity[] | null = [];


}

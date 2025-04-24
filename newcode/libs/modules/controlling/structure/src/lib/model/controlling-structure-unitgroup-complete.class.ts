import { CompleteIdentification } from '@libs/platform/common';
import { IControllingUnitGroupEntity } from './models';

export class ControllingStructureUnitgroupComplete implements CompleteIdentification<IControllingUnitGroupEntity> {

	public MainItemId: number = 0;

	public ContollingUnitGroups: IControllingUnitGroupEntity[] | null = [];


}

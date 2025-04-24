import { CompleteIdentification } from '@libs/platform/common';
import { IResourcePlantComponentTypeEntity } from '@libs/resource/interfaces';

export class ResourceComponentTypeComplete implements CompleteIdentification<IResourcePlantComponentTypeEntity>{

	public Id: number = 0;

	public ComponentTypes: IResourcePlantComponentTypeEntity[] | null = [];


}

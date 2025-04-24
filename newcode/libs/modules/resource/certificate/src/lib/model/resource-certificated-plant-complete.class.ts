import { CompleteIdentification } from '@libs/platform/common';
import { ICertificatedPlantEntity } from '@libs/resource/interfaces';

export class ResourceCertificatedPlantComplete implements CompleteIdentification<ICertificatedPlantEntity>{

	public Id: number = 0;

	public Datas: ICertificatedPlantEntity[] | null = [];


}

import { CompleteIdentification } from '@libs/platform/common';
import { IEstPricelistEntity } from './entities/est-pricelist-entity.interface';

export class ResourcePlantpricingEstPricelistComplete implements CompleteIdentification<IEstPricelistEntity>{

	public Id: number = 0;

	public Datas: IEstPricelistEntity[] | null = [];


}

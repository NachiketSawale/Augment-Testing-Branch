import { CompleteIdentification } from '@libs/platform/common';
import { IPricelistEntity } from './entities/pricelist-entity.interface';

export class ResourcePlantpricingPricelistTypeComplete implements CompleteIdentification<IPricelistEntity>{

	public Id: number = 0;

	public Datas: IPricelistEntity[] | null = [];


}

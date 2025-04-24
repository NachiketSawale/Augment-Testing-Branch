import { CompleteIdentification } from '@libs/platform/common';
import { IPricelistEntity } from './entities/pricelist-entity.interface';

export class ResourcePlantpricingPricelistComplete implements CompleteIdentification<IPricelistEntity>{

	public Id: number = 0;

	public Datas: IPricelistEntity[] | null = [];


}

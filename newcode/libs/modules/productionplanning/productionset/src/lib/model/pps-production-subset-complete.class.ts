import { CompleteIdentification } from '@libs/platform/common';
import { IPpsProductionSubsetEntity } from './entities/external_entities/pps-production-subset-entity.interface';

export class PpsProductionSubsetComplete implements CompleteIdentification<IPpsProductionSubsetEntity>{

	public Id: number = 0;

	public Datas: IPpsProductionSubsetEntity[] | null = [];


}

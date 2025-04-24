import { IProductionsetEntity } from './models';
import { IPPSEventEntity, IPpsEventParentComplete, PPSEventComplete } from '@libs/productionplanning/shared';

export class ProductionplanningProductionsetComplete implements IPpsEventParentComplete<IProductionsetEntity> {
	public Id: number = 0;

	public Datas: IProductionsetEntity[] | null = [];
	public Productionset: IProductionsetEntity[] | null = [];

	public EventsToSave: PPSEventComplete[] | null = [];

	public EventsToDelete: IPPSEventEntity[] | null = [];
}

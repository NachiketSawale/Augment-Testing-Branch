

import {
	IPpsProductEntity,
	IPpsRackAssignEntity,
	IPpsProductToProdPlaceEntity,
	IEngProdComponentEntity
} from './models';
import { IPpsPhaseEntity, PpsPhaseComplete, IPpsEntityWithPhaseToSaveToDelete, IPPSEventEntity, IPpsEventParentComplete, PPSEventComplete } from '@libs/productionplanning/shared';

export class PpsProductComplete implements IPpsEventParentComplete<IPpsProductEntity>, IPpsEntityWithPhaseToSaveToDelete {

	public MainItemId: number = 0;

	public Product: IPpsProductEntity | null = null;
	public Products: IPpsProductEntity[] | null = [];

	public RackAssignmentToSave: IPpsRackAssignEntity[] = [];
	public RackAssignmentToDelete: IPpsRackAssignEntity[] = [];

	public EngProdComponentToSave: IEngProdComponentEntity[] = [];
	public EngProdComponentToDelete: IEngProdComponentEntity[] = [];

	public ProductToProdPlaceToSave: IPpsProductToProdPlaceEntity[] = [];
	public ProductToProdPlaceToDelete: IPpsProductToProdPlaceEntity[] = [];

	public PhaseToSave: PpsPhaseComplete[] = [];
	public PhaseToDelete: IPpsPhaseEntity[] = [];
	public EventsToSave: PPSEventComplete[] | null = [];

	public EventsToDelete: IPPSEventEntity[] | null = [];
}

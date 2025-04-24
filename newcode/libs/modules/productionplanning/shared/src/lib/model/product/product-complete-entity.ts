import { IPpsProductEntityGenerated } from './product-entity-generated.interface';
import { IPpsRackAssignEntityGenerated } from './pps-rack-assign-entity-generated.interface';
import { IPpsProductToProdPlaceEntityGenerated } from './pps-product-to-prod-place-entity-generated.interface';
import { IEngProdComponentEntityGenerated } from './eng-prod-component-entity-generated.interface';
import { IPPSEventEntity } from '../event/pps-event-entity.interface';
import { PPSEventComplete } from '../event/pps-event-complete.class';
import { IPpsEventParentComplete } from '../event/interface/productionplanning-event-parent.interfaces';

export class PpsProductCompleteEntity implements IPpsEventParentComplete<IPpsProductEntityGenerated> {
	public MainItemId: number = 0;

	public Products: IPpsProductEntityGenerated[] | null = [];

	public RackAssignmentToSave?: IPpsRackAssignEntityGenerated[] = [];
	public RackAssignmentToDelete?: IPpsRackAssignEntityGenerated[] = [];

	public EngProdComponentToSave?: IEngProdComponentEntityGenerated[] = [];
	public EngProdComponentToDelete?: IEngProdComponentEntityGenerated[] = [];

	public ProductToProdPlaceToSave?: IPpsProductToProdPlaceEntityGenerated[] = [];
	public ProductToProdPlaceToDelete?: IPpsProductToProdPlaceEntityGenerated[] = [];

	// public PhaseToSave: PpsPhaseComplete[] = [];
	// public PhaseToDelete: IPpsPhaseEntity[] = [];
	public EventsToDelete: IPPSEventEntity[] | null = [];
	public EventsToSave: PPSEventComplete[] | null = [];

	// public PhaseRequirementToSave: [] = [];
	// public PhaseRequirementToDelete: [] = [];
}

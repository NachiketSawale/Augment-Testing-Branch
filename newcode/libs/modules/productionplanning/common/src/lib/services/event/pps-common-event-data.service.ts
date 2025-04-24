import { IPPSEventEntity, IPpsEventParentComplete, IPpsEventParentEntity, IPpsEventParentService, PPSEventComplete } from '@libs/productionplanning/shared';
import { DataServiceFlatNode, IDataServiceChildRoleOptions, IEntitySelection, IParentRole, ServiceRole } from '@libs/platform/data-access';
import { first, get } from 'lodash';

export class PpsCommonEventDataService<PT extends IPpsEventParentEntity, PU extends IPpsEventParentComplete<PT>> extends DataServiceFlatNode<IPPSEventEntity, PPSEventComplete, PT, PU> {
	public constructor(private parentService: IParentRole<PT, PU> & IEntitySelection<PT> & IPpsEventParentService) {
		const options = {
			apiUrl: 'productionplanning/common/event',
			roleInfo: <IDataServiceChildRoleOptions<IPPSEventEntity, PT, PU>>{
				role: ServiceRole.Node,
				itemName: 'Event',
				parent: parentService,
			},
			readInfo: {
				endPoint: 'listForDateshift',
			},
			createInfo: {
				endPoint: 'createForCommon',
				prepareParam: () => {
					const selectedParent = this.getSelectedParent()!;
					return {
						foreignKey: this.parentService.ForeignKeyForEvent,
						jobId: selectedParent.LgmJobFk,
						mainItemId: selectedParent.Id,
					};
				},
			},
		};
		super(options);
	}

	public override isParentFn(parentKey: PT, entity: IPPSEventEntity): boolean {
		return parentKey.Id === get(entity, this.parentService.ForeignKeyForEvent);
	}

	protected override onLoadSucceeded(loaded: object): IPPSEventEntity[] {
		if (loaded) {
			return get(loaded, 'Main', []);
		}
		return [];
	}

	protected override provideLoadPayload(): object {
		const mainItemId = this.getSelectedParent()?.Id || -1;
		return { foreignKey: this.parentService.ForeignKeyForEvent, mainItemId: mainItemId };
	}

	public override createUpdateEntity(modified: IPPSEventEntity | null): PPSEventComplete {
		const evnetComplete = new PPSEventComplete();
		if (modified !== null) {
			evnetComplete.MainItemId = modified.Id;
			evnetComplete.Events = [modified];
		} else if (this.hasSelection()) {
			// fix issue that missing initializing MainItemId(MainItemId is 0) when only updating
			evnetComplete.MainItemId = this.getSelection()[0].Id;
		}
		return evnetComplete;
	}

	public override getModificationsFromUpdate(complete: PPSEventComplete): IPPSEventEntity[] {
		if (complete.Events === null) {
			complete.Events = [];
		}

		return complete.Events!;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerNodeModificationsToParentUpdate(complete: PU, modified: PPSEventComplete[], deleted: IPPSEventEntity[]): void {
		if (modified && modified.some(() => true)) {
			complete.EventsToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			complete.EventsToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: PU): IPPSEventEntity[] {
		if (complete && complete.EventsToSave) {
			return [...first(complete.EventsToSave)!.Events!];
		}
		return [];
	}
}

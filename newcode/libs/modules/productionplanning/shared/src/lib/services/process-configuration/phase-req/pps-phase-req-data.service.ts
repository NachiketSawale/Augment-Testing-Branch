import { isNull } from 'lodash';
import { DataServiceFlatLeaf, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceChildRoleOptions, IEntitySelection, ServiceRole } from '@libs/platform/data-access';
import { IPpsPhaseRequirementEntity } from '../../../model/process-configuration/pps-phase-requirement-entity.interface';
import { IPpsPhaseEntity } from '../../../model/process-configuration/pps-phase-entity.interface';
import { PpsPhaseComplete } from '../../../model/process-configuration/pps-phase-complete.class';

export class ProductionplanningSharedPhaseRequirementDataService<PT extends IPpsPhaseEntity, PU extends PpsPhaseComplete>
	extends DataServiceFlatLeaf<IPpsPhaseRequirementEntity, IPpsPhaseEntity, PpsPhaseComplete> {

	public constructor(private parentService: IEntitySelection<IPpsPhaseEntity>) {
		const options: IDataServiceOptions<IPpsPhaseRequirementEntity> = {

			apiUrl: 'productionplanning/processconfiguration/phaserequirement',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyphaseorprocess',
				usePost: false,
			},
			roleInfo: <IDataServiceChildRoleOptions<IPpsPhaseRequirementEntity, PT, PU>>{
				role: ServiceRole.Leaf,
				itemName: 'PhaseRequirement',
				parent: parentService,
			}
		};

		super(options);
	}

	protected override provideLoadPayload(): object {
		const parent = this.getSelectedParent() as IPpsPhaseEntity;
		return {
			PhaseId: parent.Id,
			ProcessId: parent.PpsProcessFk,
			WithStatus: true
		};
	}

	protected override onLoadSucceeded(loaded: object): IPpsPhaseRequirementEntity[] {
		return loaded as IPpsPhaseRequirementEntity[];
	}

	public override isParentFn(parentKey: PT, entity: IPpsPhaseRequirementEntity): boolean {
		const parent = parentKey as IPpsPhaseEntity;
		return entity.PpsPhaseFk === parent.Id;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: PpsPhaseComplete, modified: IPpsPhaseRequirementEntity[], deleted: IPpsPhaseRequirementEntity[]): void {
		if (modified && modified.length > 0) {
			parentUpdate.PhaseRequirementToSave = modified;
		}

		if (deleted && deleted.length > 0) {
			parentUpdate.PhaseRequirementToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(parentUpdate: PpsPhaseComplete): IPpsPhaseRequirementEntity[] {
		if (parentUpdate && !isNull(parentUpdate.PhaseRequirementToSave)) {
			return parentUpdate.PhaseRequirementToSave!;
		}
		return [];
	}

}
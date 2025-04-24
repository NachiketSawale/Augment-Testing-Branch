import { isNull } from 'lodash';
import {
	DataServiceFlatNode, IDataServiceEndPointOptions, IDataServiceOptions,
	IDataServiceChildRoleOptions,
	IEntitySelection, ServiceRole
} from '@libs/platform/data-access';
import { IPpsPhaseEntity } from '../../../model/process-configuration/pps-phase-entity.interface';
import { PpsPhaseComplete } from '../../../model/process-configuration/pps-phase-complete.class';
import { IPpsEntityWithProcessFk } from '../../../model/process-configuration/pps-entity-with-processfk.interface';
import { IPpsEntityWithPhaseToSaveToDelete } from '../../../model/process-configuration/pps-entity-with-phase2save2delete.interface';

export class ProductionplanningSharedPhaseDataService<PT extends IPpsEntityWithProcessFk, PU extends IPpsEntityWithPhaseToSaveToDelete>
	extends DataServiceFlatNode<IPpsPhaseEntity, PpsPhaseComplete, PT, PU> {

	public constructor(private parentService: IEntitySelection<PT>) {
		const options: IDataServiceOptions<IPpsPhaseEntity> = {
			apiUrl: 'productionplanning/processconfiguration/phase',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyprocess',
				usePost: false,
				prepareParam: (ident) => ({ ProcessId: this.getProcessId() })
			},
			roleInfo: <IDataServiceChildRoleOptions<IPpsPhaseEntity, PT, PU>>{
				role: ServiceRole.Node,
				itemName: 'Phase',
				parent: parentService,
			}
		};

		super(options);
	}

	private getProcessId(): number {
		return this.getProcessIdByParent(this.getSelectedParent());
	}

	private getProcessIdByParent(parentKey: PT | undefined): number {
		// const selectedParent = parentKey as any;
		// return (selectedParent.PpsProcessFk ?? selectedParent.ProcessFk) as number;
		return parentKey?.PpsProcessFk ?? -1;
	}

	public override isParentFn(parentKey: PT, entity: IPpsPhaseEntity): boolean {
		return entity.PpsProcessFk === this.getProcessIdByParent(parentKey);
	}

	public override createUpdateEntity(modified: IPpsPhaseEntity | null): PpsPhaseComplete {
		const complete = new PpsPhaseComplete();

		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.Phase = modified;
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: PpsPhaseComplete): IPpsPhaseEntity[] {
		if (complete.Phase) {
			return [complete.Phase];
		}
		return [];
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerNodeModificationsToParentUpdate(complete: IPpsEntityWithPhaseToSaveToDelete, modified: PpsPhaseComplete[], deleted: IPpsPhaseEntity[]) {
		if (modified && modified.length > 0) {
			complete.PhaseToSave = modified;
		}

		if (deleted && deleted.length > 0) {
			complete.PhaseToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(parentUpdate: IPpsEntityWithPhaseToSaveToDelete): IPpsPhaseEntity[] {
		if (parentUpdate && !isNull(parentUpdate.PhaseToSave)) {
			return parentUpdate.PhaseToSave.map(e => e.Phase!);
		}
		return [];
	}

}
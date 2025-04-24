import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { DataServiceFlatNode, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, IEntitySelection, ServiceRole } from '@libs/platform/data-access';
import { get, /*isNull,*/ set } from 'lodash';
import { IPpsHeaderEntity } from '../../model/header/pps-header-entity.interface';
import { PpsHeaderComplete } from '../../model/header/pps-header-complete.class';
// import { IEntityComparer } from 'libs/platform/data-access/src/lib/model/data-service/interface/entity-comparer.interface';
// import { SimpleEntityComparer } from 'libs/platform/data-access/src/lib/model/data-service/integral-part/simple-entity-comparer.class';

export class ProductionplanningSharedPpsHeaderDataService<PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>
	extends DataServiceFlatNode<IPpsHeaderEntity, PpsHeaderComplete, PT, PU> {

	public constructor(private parentService: IEntitySelection<PT>,
		private foreignKey: string  // PrjProjectFk or OrdHeaderFk
	) {

		const options: IDataServiceOptions<IPpsHeaderEntity> = {

			apiUrl: 'productionplanning/header',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listForCommon',
				usePost: false,
			},
			createInfo: {
				endPoint: 'createForCommon',
				prepareParam: () => {
					const selectedParent = this.getSelectedParent()!;
					const prjProjectFk = (this.foreignKey === 'OrdHeaderFk') ? (get(selectedParent, 'ProjectFk') as number)
						: selectedParent.Id;
					return {
						foreignKey: this.foreignKey,
						prjProjectFk: prjProjectFk,
						mainItemId: selectedParent.Id,
					};
				},
			},
			roleInfo: <IDataServiceChildRoleOptions<IPpsHeaderEntity, PT, PU>>{
				role: ServiceRole.Node,
				itemName: 'PPSHeader',
				parent: parentService,
			}
		};

		super(options);
	}

	protected override provideLoadPayload(): object {
		const parent = this.getSelectedParent();
		return {
			foreignKey: this.foreignKey, // PrjProjectFk or OrdHeaderFk
			mainItemId: get(parent, 'Id'),
		};
	}

	protected override onLoadSucceeded(loaded: object): IPpsHeaderEntity[] {
		if (loaded) {
			return get(loaded, 'dtos', []);
		}
		return [];
	}

	public override isParentFn(parentKey: PT, entity: IPpsHeaderEntity): boolean {
		return get(entity, this.foreignKey) === get(parentKey, 'Id');
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerNodeModificationsToParentUpdate(parentUpdate: PU, modified: PpsHeaderComplete[], deleted: IPpsHeaderEntity[]): void {
		if (modified && modified.length > 0) {
			set(parentUpdate, 'PPSHeaderToSave', modified);
		}

		if (deleted && deleted.length > 0) {
			set(parentUpdate, 'PPSHeaderToDelete', deleted);
		}
	}

	public override getSavedEntitiesFromUpdate(parentUpdate: PU): IPpsHeaderEntity[] {
		const toSave: IPpsHeaderEntity[] = [];
		if (parentUpdate) {
			const headerToSave = get(parentUpdate, 'PPSHeaderToSave') as PpsHeaderComplete[];
			headerToSave?.forEach(e => {
				toSave.concat(e.PPSHeaders!);
			});
		}
		return toSave;
	}

	public override getModificationsFromUpdate(complete: PpsHeaderComplete): IPpsHeaderEntity[] {
		if (complete.PPSHeaders) {
			return complete.PPSHeaders;
		}
		return [];
	}

	public override createUpdateEntity(modified: IPpsHeaderEntity | null): PpsHeaderComplete {
		const complete = new PpsHeaderComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.PPSHeaders = [modified];
		} else if (this.hasSelection()) {
			// fix issue that missing initializing MainItemId(MainItemId is 0) when only updating
			complete.MainItemId = this.getSelection()[0].Id;
		}
		return complete;
	}

	// temp testing codes, we don't need them after correcting method getSavedEntitiesFromUpdate
	// When saving the new object template entity, the following error will be thrown.
	//  In case not working with database ld property, the data service must provide a entity comparer
	// public override assertComparer(): IEntityComparer<IPpsHeaderEntity> {
	// 	return new SimpleEntityComparer<IPpsHeaderEntity>();
	// }
	// public override takeOverUpdated(updated: PU): void {
	// 	let saved: PpsHeaderComplete[] | null = null;
	// 	if (this.registerByMethod()) {
	// 		saved = this.getSavedEntitiesFromUpdate(updated);
	// 	} else {
	// 		type EntityKey = keyof typeof updated;
	// 		saved = (updated[this.itemName + 'ToSave' as EntityKey] as IPpsHeaderEntity[]);
	// 	}

	// 	if (saved && saved.length > 0) {
	// 		// this.entityList.updateEntities(saved);
	// 		// this.entityModification.entitiesUpdated(saved);
	// 		this.updateEntities(saved);
	// 		this.entitiesUpdated(saved);
	// 	}
	// }
}
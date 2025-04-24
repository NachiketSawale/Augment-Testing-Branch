/*
 * Copyright(c) RIB Software GmbH
 */

import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { BasItemType } from '@libs/basics/shared';
import { ControllingSharedGroupSetDataProcessor } from './processors/controlling-shared-group-set-processor.class';
import { ControllingSharedGroupSetReadonlyProcessor } from './processors/controlling-shared-group-set-readonly-processor.service';
import { ControllingUnitGroupSetCompleteIdentification, ControllingUnitGroupSetParentServiceFlatTypes, IControllingUnitdGroupSetEntity, IControllingUnitGroupSetEntityIdentification } from '@libs/controlling/interfaces';
import { IControllingSharedGroupSetServiceInterface } from './controlling-shared-group-set-factory.service';


/**
 * The basic data service for Controlling Group Set entity
 */
export class ControllingSharedGroupSetDataService<
	T extends IControllingUnitdGroupSetEntity,
	PT extends IControllingUnitGroupSetEntityIdentification,
	PU extends ControllingUnitGroupSetCompleteIdentification<PT>>
	extends DataServiceFlatLeaf<T, PT, PU>
	implements IControllingSharedGroupSetServiceInterface<PT> {
	public readonly dataProcessor: ControllingSharedGroupSetDataProcessor<T, PT, PU>;
	public readonly readonlyProcessor: ControllingSharedGroupSetReadonlyProcessor<T, PT, PU>;

	public constructor(public parentService: ControllingUnitGroupSetParentServiceFlatTypes<PT, PU>) {
		const options: IDataServiceOptions<T> = {
			apiUrl: 'controlling/structure/grpsetdtl',
			readInfo: {
				endPoint: 'list',
				usePost: false,
			},
			roleInfo: <IDataServiceChildRoleOptions<T, PT, PU>>{
				role: ServiceRole.Leaf,
				itemName: 'controllingStructureGrpSetDTL',
				parent: parentService,
			},
		};
		super(options);

		this.dataProcessor = new ControllingSharedGroupSetDataProcessor(this);
		this.readonlyProcessor = new ControllingSharedGroupSetReadonlyProcessor(this);
		this.processor.addProcessor([this.readonlyProcessor, this.dataProcessor]);
	}


	public override canDelete(): boolean {
		const canDeleteLocally = super.canDelete() && !this.isTextElementType();
		const isReadonly = this.getParentStatusIsReadonly();

		if (isReadonly !== undefined) {
			return !isReadonly && canDeleteLocally;
		}

		const parentCanDelete = this.parentService?.canDelete?.();
		if (parentCanDelete !== undefined) {
			return parentCanDelete && canDeleteLocally;
		}
		return canDeleteLocally;
	}

	public override canCreate() {
		const canCreateLocally = super.canCreate() && !this.isTextElementType();
		const isReadonly = this.getParentStatusIsReadonly();

		if (isReadonly !== undefined) {
			return !isReadonly && canCreateLocally;
		}

		const parentCanCreate = this.parentService?.canCreate?.();
		if (parentCanCreate !== undefined) {
			return parentCanCreate && canCreateLocally;
		}
		return canCreateLocally;
	}

	// PisReadonly(angularjs rename){
	public getParentStatusIsReadonly(): boolean | undefined {
		return undefined;
	}

	public getParentCanCreate(): boolean | undefined {
		return this.parentService?.canCreate?.();
	}

	public isTextElementType(): boolean {
		const parent = this.parentService.getSelectedEntity();
		if (parent) {
			return this.getBasItemTypeId(parent) === BasItemType.TextElement;
		}
		return false;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: PU, modified: T[], deleted: T[]) {
		if (modified && modified.some(() => true)) {
			if (modified && modified.length > 0) {
				parentUpdate.MainItemId = modified[0].headerFk;
				parentUpdate.controllingStructureGrpSetDTLToSave = modified;
			}
		}
		if (deleted && deleted.some(() => true)) {
			if (deleted && deleted.length > 0) {
				parentUpdate.MainItemId = deleted[0].headerFk;
				parentUpdate.controllingStructureGrpSetDTLToDelete = deleted;
			}
		}
	}

	public override isParentFn(parentKey: PT, entity: T): boolean {
		return entity.ControllinggrpsetFk === parentKey.ControllinggrpsetFk;
	}

	public override getSavedEntitiesFromUpdate(parentUpdate: PU): T[] {
		if (parentUpdate && parentUpdate.controllingStructureGrpSetDTLToSave) {
			return parentUpdate.controllingStructureGrpSetDTLToSave as T[];
		}
		return [];
	}

	public getBasItemTypeId(parent: PT): number | null | undefined {
		return undefined;
	}

	protected override onCreateSucceeded(created: object): T {
		const parent = this.parentService.getSelectedEntity();
		const entity = created as T;
		if (entity && parent) {
			entity.headerFk = parent.Id;
		}
		return entity;
	}

	protected override provideCreatePayload() {
		const parent = this.parentService.getSelectedEntity()!;
		return {
			mainItemId: parent.ControllinggrpsetFk,
			headerFk: parent.Id,
		};
	}

	protected override onLoadSucceeded(loaded: object): T[] {
		const parent = this.parentService.getSelectedEntity()!;
		if (loaded) {
			const entities = loaded as unknown as T[];
			this.dataProcessor.processItems(entities);
			return entities.map((item) => ({...item, headerFk: parent.Id}));
		}
		return [];
	}

	protected override provideLoadPayload() {
		const parent = this.parentService.getSelectedEntity()!;
		return {
			mainItemId: parent.ControllinggrpsetFk,
		};
	}

}

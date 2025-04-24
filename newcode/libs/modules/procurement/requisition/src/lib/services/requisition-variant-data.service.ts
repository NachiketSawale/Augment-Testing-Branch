import { Injectable } from '@angular/core';
import { DataServiceFlatNode, IDataServiceChildRoleOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { IReqVariantEntity } from '../model/entities/req-variant-entity.interface';
import { IReqHeaderEntity } from '../model/entities/reqheader-entity.interface';
import { ReqVariantCompleteEntity } from '../model/entities/req-variant-complete-entity.class';
import { ReqHeaderCompleteEntity } from '../model/entities/requisition-complete-entity.class';
import { ProcurementRequisitionHeaderDataService } from './requisition-header-data.service';
import { RequisitionVariantReadonlyProcessorService } from './requisition-variant-readonly-processor.service';

@Injectable({
	providedIn: 'root',
})
export class ProcurementRequisitionRequisitionVariantDataService extends DataServiceFlatNode<IReqVariantEntity, ReqVariantCompleteEntity, IReqHeaderEntity, ReqHeaderCompleteEntity> {
	public readonly readonlyProcessor: RequisitionVariantReadonlyProcessorService;

	public constructor(public parentService: ProcurementRequisitionHeaderDataService) {
		const options: IDataServiceOptions<IReqVariantEntity> = {
			apiUrl: 'procurement/requisition/variant',
			readInfo: {
				endPoint: 'list',
				prepareParam: (ident) => {
					return {
						mainItemId: ident.pKey1 ?? -1,
					};
				},
			},
			roleInfo: <IDataServiceChildRoleOptions<IReqVariantEntity, IReqHeaderEntity, ReqHeaderCompleteEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'RequisitionVariant',
				parent: parentService,
			},
		};
		super(options);

		this.readonlyProcessor = new RequisitionVariantReadonlyProcessorService(this);
	}

	protected override provideCreatePayload(): object {
		const selected = this.getSelectedParent();

		if (selected) {
			return {
				mainItemId: selected.Id,
			};
		}
		throw new Error('Please select a business partner first');
	}

	protected override onCreateSucceeded(created: IReqVariantEntity): IReqVariantEntity {
		return created;
	}

	public override canCreate(): boolean {
		return !this.parentService.getHeaderContext().readonly;
	}

	public override canDelete(): boolean {
		return !this.parentService.getHeaderContext().readonly;
	}

	public override createUpdateEntity(modified: IReqVariantEntity | null): ReqVariantCompleteEntity {
		const complete = new ReqVariantCompleteEntity();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.RequisitionVariant = modified;
		}
		return complete;
	}

	public override getModificationsFromUpdate(complete: ReqVariantCompleteEntity): IReqVariantEntity[] {
		return complete.RequisitionVariant ? [complete.RequisitionVariant] : [];
	}

	public override getSavedEntitiesFromUpdate(parentUpdate: ReqHeaderCompleteEntity): IReqVariantEntity[] {
		if (parentUpdate.RequisitionVariantToSave) {
			const variants = [] as IReqVariantEntity[];
			parentUpdate.RequisitionVariantToSave.forEach((updated) => {
				if (updated.RequisitionVariant) {
					variants.push(updated.RequisitionVariant);
				}
			});
			return variants;
		}
		return [];
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerNodeModificationsToParentUpdate(parentUpdate: ReqHeaderCompleteEntity, modified: ReqVariantCompleteEntity[], deleted: IReqVariantEntity[]) {
		if (modified && modified.length > 0) {
			const parentEntity = this.getSelectedParent();
			parentUpdate.MainItemId = parentEntity?.Id ?? parentUpdate.MainItemId;
			parentUpdate.RequisitionVariantToSave = modified;
		}

		if (deleted && deleted.length > 0) {
			const parentEntity = this.getSelectedParent();
			parentUpdate.MainItemId = parentEntity?.Id ?? parentUpdate.MainItemId;
			parentUpdate.RequisitionVariantToDelete = deleted;
		}
	}

	public override isParentFn(parentKey: IReqHeaderEntity, entity: IReqVariantEntity): boolean {
		return entity.ReqHeaderFk === parentKey.Id;
	}
}
import {inject, Injectable} from '@angular/core';
import {
	DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions,
	IDataServiceOptions,
	ServiceRole
} from '@libs/platform/data-access';
import {BusinessPartnerEvaluationSchemaSubGroupService} from './subgroup-data.service';
import { EvaluationSubgroupComplete, IEvaluationItemEntity, IEvaluationSubgroupEntity } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root'
})
export class BusinessPartnerEvaluationSchemaItemService extends DataServiceFlatLeaf<IEvaluationItemEntity,
	IEvaluationSubgroupEntity, EvaluationSubgroupComplete> {

	public constructor() {
		const option: IDataServiceOptions<IEvaluationItemEntity> = {
			apiUrl: 'businesspartner/evaluationschema/evaluationitem',
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'createnew'
			},
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: ident => {
					return {
						mainItemId: ident.pKey1
					};
				}
			},
			entityActions: {
				deleteSupported: true,
				createSupported: true
			},
			roleInfo: <IDataServiceChildRoleOptions<IEvaluationItemEntity, IEvaluationSubgroupEntity, EvaluationSubgroupComplete>>{
				itemName: 'Item',
				role: ServiceRole.Leaf,
				parent: inject(BusinessPartnerEvaluationSchemaSubGroupService)
			}

		};

		super(option);
	}

	protected override provideCreatePayload(): object {
		const parent = this.getSelectedParent();
		return {
			MainItemId: parent?.Id
		};
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: EvaluationSubgroupComplete,
	                                                    modified: IEvaluationItemEntity[], deleted: IEvaluationItemEntity[]) {
		if (modified && modified.length > 0) {
			parentUpdate.ItemToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			parentUpdate.ItemToDelete = deleted;
		}
	}

	public override isParentFn(parentKey: IEvaluationSubgroupEntity, entity: IEvaluationItemEntity): boolean {
		return entity.EvaluationSubGroupFk === parentKey.Id;
	}
}

import { inject, Injectable } from '@angular/core';
import {
	DataServiceFlatNode,
	IDataServiceChildRoleOptions, IDataServiceEndPointOptions,
	IDataServiceOptions,
	ServiceRole
} from '@libs/platform/data-access';
import { BusinessPartnerEvaluationSchemaGroupService } from './group-data.service';
import { EvaluationGroupComplete, IEvaluationGroupEntity, EvaluationSubgroupComplete, IEvaluationSubgroupEntity } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root'
})
export class BusinessPartnerEvaluationSchemaSubGroupService extends DataServiceFlatNode<IEvaluationSubgroupEntity, EvaluationSubgroupComplete,
IEvaluationGroupEntity,
	EvaluationGroupComplete> {

	public constructor(EvaluationSchemaGroupGridBehaviorService: BusinessPartnerEvaluationSchemaGroupService) {
		const options: IDataServiceOptions<IEvaluationSubgroupEntity> = {
			apiUrl: 'businesspartner/evaluationschema/evaluationsubgroup',
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'createnew',
				usePost: true,
				prepareParam: ident => {
					return {
						MainItemId: ident.pKey1
					};
				}
			},
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
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
			roleInfo: <IDataServiceChildRoleOptions<IEvaluationSubgroupEntity, IEvaluationGroupEntity, EvaluationGroupComplete>>{
				role: ServiceRole.Node,
				itemName: 'Subgroup',
				parent: inject(BusinessPartnerEvaluationSchemaGroupService)
			}
		};

		super(options);
	}

	public override  registerByMethod(): boolean {
		return true;
	}

	public override registerNodeModificationsToParentUpdate(parentUpdate: EvaluationGroupComplete,
	                                                        modified: EvaluationSubgroupComplete[], deleted: IEvaluationSubgroupEntity[]) {
		if (modified && modified.length > 0){
			parentUpdate.SubgroupToSave = modified;
		}

		if (deleted && deleted.length > 0){
			parentUpdate.SubgroupToDelete = deleted;
		}
	}

	protected override provideCreatePayload(): object {
		const parent = this.getSelectedParent();
		return {
			MainItemId: parent?.Id
		};
	}

	protected override onCreateSucceeded(created: object): IEvaluationSubgroupEntity {
		return created as IEvaluationSubgroupEntity;
	}

	public override createUpdateEntity(modified: IEvaluationSubgroupEntity | null): EvaluationSubgroupComplete {
		if (modified) {
			return {
				MainItemId: modified.Id,
				Subgroup: modified

			};
		} else {
			return { };
		}
	}

	public override getModificationsFromUpdate(complete: EvaluationSubgroupComplete): IEvaluationSubgroupEntity[] {
		return super.getModificationsFromUpdate(complete);
	}

	public override isParentFn(parentKey: IEvaluationGroupEntity, entity: IEvaluationSubgroupEntity): boolean {
		return entity.EvaluationGroupFk === parentKey.Id;
	}

}

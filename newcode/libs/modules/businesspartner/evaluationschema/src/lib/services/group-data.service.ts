import {inject, Injectable} from '@angular/core';
import {
	DataServiceFlatNode,
	IDataServiceChildRoleOptions, IDataServiceEndPointOptions,
	IDataServiceOptions,
	ServiceRole
} from '@libs/platform/data-access';
import {BusinesspartnerEvaluationschemaHeaderService} from './schema-data.service';
import { EvaluationGroupComplete, EvaluationGroupEntity, IEvaluationGroupEntity, EvaluationSchemaComplete, IEvaluationSchemaEntity } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root'
})
export class BusinessPartnerEvaluationSchemaGroupService extends DataServiceFlatNode<IEvaluationGroupEntity, EvaluationGroupComplete,
	IEvaluationSchemaEntity,
	EvaluationSchemaComplete> {

	public constructor(businesspartnerEvaluationschemaHeaderService: BusinesspartnerEvaluationschemaHeaderService) {
		const options: IDataServiceOptions<IEvaluationGroupEntity> = {
			apiUrl: 'businesspartner/evaluationschema/evaluationgroup',
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'createnew',
				usePost: true,
				prepareParam: ident =>  {
					return {
						MainItemId: ident.pKey1
					};
				},
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
			roleInfo: <IDataServiceChildRoleOptions<IEvaluationGroupEntity, IEvaluationSchemaEntity, EvaluationSchemaComplete>>{
				role: ServiceRole.Node,
				itemName: 'Group',
				parent: inject(BusinesspartnerEvaluationschemaHeaderService)
			}
		};

		super(options);
	}

	public override  registerByMethod(): boolean {
		return true;
	}

	public override  registerNodeModificationsToParentUpdate(parentUpdate: EvaluationSchemaComplete,
	                                                         modified: EvaluationGroupComplete[], deleted: IEvaluationGroupEntity[]) {
		if (modified && modified.length > 0){
			parentUpdate.GroupToSave = modified;
		}
		if (deleted && deleted.length > 0){
			parentUpdate.GroupToDelete = deleted;
		}
	}

	protected override provideCreatePayload(): object {
		const parent = this.getSelectedParent();
		return {
			MainItemId: parent?.Id
		};
	}

	protected override onCreateSucceeded(created: object): IEvaluationGroupEntity {
		if (created){
			return created as IEvaluationGroupEntity;
		}
		return new EvaluationGroupEntity() ;
	}

	public override createUpdateEntity(modified: IEvaluationGroupEntity | null): EvaluationGroupComplete {
		if (modified) {
			return {
				MainItemId: modified.Id,
				Group: modified
			};
		} else {
			return {};
		}
	}

	public override getModificationsFromUpdate(complete: EvaluationGroupComplete): IEvaluationGroupEntity[] {
		return super.getModificationsFromUpdate(complete);
	}

	public override isParentFn(parentKey: IEvaluationSchemaEntity, entity: IEvaluationGroupEntity): boolean {
		return entity.EvaluationSchemaFk === parentKey.Id;
	}

}

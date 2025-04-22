import {inject, Injectable} from '@angular/core';
import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions, IDataServiceEndPointOptions,
	IDataServiceOptions,
	ServiceRole
} from '@libs/platform/data-access';
import {BusinessPartnerEvaluationSchemaGroupService} from './group-data.service';
import { EvaluationGroupComplete, IEvaluationGroupEntity, EvaluationGroupIconEntity, IEvaluationGroupIconEntity } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root'
})
export class BusinessPartnerEvaluationschemaGroupIconService
	extends DataServiceFlatLeaf<IEvaluationGroupIconEntity, IEvaluationGroupEntity, EvaluationGroupComplete> {

	public constructor() {
		const options: IDataServiceOptions<IEvaluationGroupIconEntity> = {
			apiUrl: 'businesspartner/evaluationschema/evaluationgroupicon',
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'createnew',
				usePost: true
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
				createSupported: true,
				deleteSupported: true
			},
			roleInfo: <IDataServiceChildRoleOptions<IEvaluationGroupIconEntity, IEvaluationGroupEntity, EvaluationGroupComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'GroupIcon',
				parent: inject(BusinessPartnerEvaluationSchemaGroupService)
			},
		};

		super(options);
	}

	protected override onCreateSucceeded(created: object): IEvaluationGroupIconEntity {
		if(created){
			return created as IEvaluationGroupIconEntity;
		}
		return new EvaluationGroupIconEntity();
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

	public override registerModificationsToParentUpdate(parentUpdate: EvaluationGroupComplete,
	                                                    modified: IEvaluationGroupIconEntity[],
	                                                    deleted: IEvaluationGroupIconEntity[]) {
		if (modified && modified.length > 0){
			parentUpdate.GroupIconToSave = modified;
		}

		if (deleted && deleted.length > 0){
			parentUpdate.GroupIconToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: EvaluationGroupComplete): IEvaluationGroupIconEntity[] {
		if (complete && complete.GroupIconToSave) {
			return complete.GroupIconToSave;
		}

		return [];
	}

	public override isParentFn(parentKey: IEvaluationGroupEntity, entity: IEvaluationGroupIconEntity): boolean {
		return entity.EvaluationGroupFk === parentKey.Id;
	}
}

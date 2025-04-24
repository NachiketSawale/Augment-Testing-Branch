import {inject, Injectable} from '@angular/core';
import {
	DataServiceFlatLeaf, IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions,
	IDataServiceOptions,
	ServiceRole
} from '@libs/platform/data-access';
import {BusinesspartnerEvaluationschemaHeaderService} from './schema-data.service';
import { EvaluationSchemaComplete, EvaluationSchemaIconEntity, IEvaluationSchemaEntity, IEvaluationSchemaIconEntity } from '@libs/businesspartner/interfaces';


@Injectable({
	providedIn: 'root',
})
export class BusinesspartnerEvaluationschemaIconService extends DataServiceFlatLeaf<IEvaluationSchemaIconEntity, IEvaluationSchemaEntity, EvaluationSchemaComplete> {
	public constructor() {
		const options: IDataServiceOptions<IEvaluationSchemaIconEntity> = {
			apiUrl: 'businesspartner/evaluationschema/evaluationschemaicon',
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'createnew',
			},
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: (ident) => {
					return {
						mainItemId: ident.pKey1,
					};
				},
			},
			roleInfo: <IDataServiceChildRoleOptions<IEvaluationSchemaIconEntity, IEvaluationSchemaEntity, EvaluationSchemaComplete>>{
				itemName: 'EvaluationSchemaIcon',
				role: ServiceRole.Leaf,
				parent: inject(BusinesspartnerEvaluationschemaHeaderService),
			},
			entityActions: {
				createSupported: true,
				deleteSupported: true,
			},
		};

		super(options);
	}

	protected override onCreateSucceeded(created: object): IEvaluationSchemaIconEntity {
		if (created) {
			return created as IEvaluationSchemaIconEntity;
		}
		return new EvaluationSchemaIconEntity();
	}

	protected override provideCreatePayload(): object {
		const parent = this.getSelectedParent();
		return {
			MainItemId: parent?.Id,
		};
	}

	public override isParentFn(parentKey: IEvaluationSchemaEntity, entity: IEvaluationSchemaIconEntity): boolean {
		return entity.EvaluationSchemaFk == parentKey.Id;
	}
}

import { DataServiceFlatLeaf, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';

import { IEvaluationDataServiceInitializeOptions } from '../model/evaluation-data-entity-info-options.interface';
import { IEvaluationGetTreeResponse } from '@libs/businesspartner/interfaces';


export class BusinesspartnerSharedEvaluationChartDataService extends DataServiceFlatLeaf<IEvaluationGetTreeResponse, object, object> {
	public constructor(private readonly svrOptions: IEvaluationDataServiceInitializeOptions<IEvaluationGetTreeResponse, object>) {
		const options: IDataServiceOptions<IEvaluationGetTreeResponse> = {
			apiUrl: 'businesspartner/main/evaluation',
			readInfo: {
				endPoint: 'getchartdata',
				usePost: true,
			},
			roleInfo: <IDataServiceRoleOptions<IEvaluationGetTreeResponse>>{
				itemName: 'ChartData',
				role: ServiceRole.Leaf,
				parent: svrOptions.parentService,
			},
		};

		super(options);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override getSavedEntitiesFromUpdate(parentUpdate: object): IEvaluationGetTreeResponse[] {
		return [];
	}
}

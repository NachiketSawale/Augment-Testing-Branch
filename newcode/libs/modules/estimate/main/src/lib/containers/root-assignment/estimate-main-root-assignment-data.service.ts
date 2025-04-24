/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatRoot, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { IEstRootAssignmentData } from '@libs/estimate/interfaces';

/*
 * Service to handle data operations for the root assignment in estimates main
 */
@Injectable({
	providedIn: 'root',
})
export class EstimateMainRootAssignmentDataService extends DataServiceFlatRoot<IEstRootAssignmentData, IEstRootAssignmentData> {
	public constructor() {
		const options: IDataServiceOptions<IEstRootAssignmentData> = {
			apiUrl: '', // Leave empty since we're not using an API
			roleInfo: <IDataServiceRoleOptions<IEstRootAssignmentData>>{
				role: ServiceRole.Root,
				itemName: 'RootAssignment'
			}
		};
		super(options);

		// Static data to be used instead of calling API
		const staticData: IEstRootAssignmentData[] = [
			{
				Id: 1, //estimateMainService.getSelectedEstHeaderId ()
				EstHeaderFk: null, //estimateMainService.getSelectedEstHeaderId ()
				Estimate: 'Root',
				Rule: [],
				Param: [],
				IsEstHeaderRoot: true,
			},
		];

		// Set the static data using the setList method
		this.setList(staticData);

		// todo Rule & Prameter lookup service not implemented yet
	}
}

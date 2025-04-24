/*
 * Copyright(c) RIB Software GmbH
 */

// TODO this service is will be completely implemented in future

import { Injectable } from '@angular/core';
//import { PlatformGridControllerService } from 'path/to/platform-grid-controller.service';
//import { EstimateMainCommonUIService } from 'path/to/estimate-main-common-ui.service';
//import { EstimateDefaultGridConfig } from 'path/to/estimate-default-grid-config';
//import { EstimateMainValidationService } from 'path/to/estimate-main-validation.service';

@Injectable({ providedIn: 'root' })
export class EstimateCommonLiccostgroupControllerService {
	//  public  constructor(
	//     // private platformGridControllerService: PlatformGridControllerService,
	//     // private estimateMainCommonUIService: EstimateMainCommonUIService,
	//     // private estimateDefaultGridConfig: EstimateDefaultGridConfig,
	//     // private estimateMainValidationService: EstimateMainValidationService
	//   )

	public initLiccostgroupController(scope: unknown, licCostGroupNumber: string, mainService: unknown, licGroupServiceName: string, clipboardService: unknown, filterService: unknown): void {
		//const licGroupService = this.injector.get(licGroupServiceName);
		//const type = 'estLicCostGrp' + licCostGroupNumber + 'Items';

		//const name = 'EstLicCostGrp' + licCostGroupNumber;

		//let uiAttributes = ['Code', 'DescriptionInfo', 'Quantity', 'UomFk', 'Rule', 'Param'];

		if (licGroupServiceName === 'estimateAssembliesLiccostgroup' + licCostGroupNumber + 'Service') {
			// uiAttributes = uiAttributes.filter((attr) => !['Rule', 'Param'].includes(attr));
		}

		// const gridConfig = Object.assign(
		// 	{
		// 		marker: {
		// 			filterService: filterService,
		// 			//filterId: mainService.getServiceName().replace('Service', '') + 'LicCostgroup' + licCostGroupNumber + 'ListController',
		// 			//dataService: licGroupService,
		// 			serviceName: licGroupServiceName,
		// 		},
		// 		parentProp: 'LicCostGroupFk',
		// 		childProp: 'ChildItems',
		// 		childSort: true,
		// 		type: clipboardService ? type : undefined,
		// 		dragDropService: clipboardService ? clipboardService : undefined,
		// 	}, //this.estimateDefaultGridConfig);

		// 	//const uiService = this.estimateMainCommonUIService.createUiService(uiAttributes, { serviceName: licGroupServiceName, 'itemName': name });

		// 	//this.platformGridControllerService.initListController(scope, uiService, licGroupService, this.estimateMainValidationService, gridConfig);

		// 	//licGroupService.registerSelectionChanged(licGroupService.creatorItemChanged);

		// 	//mainService.registerRefreshRequested(licGroupService.refresh
		// );

		// scope.$on('$destroy', () => {
		//   //licGroupService.unregisterSelectionChanged(licGroupService.creatorItemChanged);
		//   //mainService.unregisterRefreshRequested(licGroupService.refresh);
		// });
	}
}

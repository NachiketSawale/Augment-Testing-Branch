import { IPpsEntityInfoOptions } from '../pps-entity-info-options.interface';

export interface IPpsCostGroupEntityInfoOptions<PT extends object> extends IPpsEntityInfoOptions<PT> {
	apiUrl: string; // example: 'productionplanning/item/' or 'productionplanning/drawing/' and so on...	
	dataLookupType: string; // example: 'Drawing2CostGroups',

	/* example of drawing costgroup: 
	provideLoadPayloadFn: (selectedParent: object) => {
		return {
			PKey1: get(selectedParent, 'PrjProjectFk'),
			PKey2: get(selectedParent, 'Id'),
		};
	}

	// related old angularjs code of service.initReadData in pps-drawing-cost-group-service.js
	service.initReadData = function (readData) {
				var selected = mainService.getSelected();
				readData.PKey1 = selected.PrjProjectFk;
				readData.PKey2 = selected.Id;
			};
	*/
	provideReadDataFn: (selectedParent: object) => object;

	/* example for drawing costgroup: 
	getMainItemIdFn: (selectedParent: object) => {
		return get(selectedParent, 'Id') as unknown as number;
	}
	*/
	/* example for ppsActivity costgroup: 
	getMainItemIdFn: (selectedParent: object) => {
		return get(selectedParent, 'PpsEventFk') as unknown as number;
	}
	*/
	getMainItemIdFn: (selectedParent: object) => number;
	// consider to rename as identityGetterFn: (selectedParent: object) => object if needs

}
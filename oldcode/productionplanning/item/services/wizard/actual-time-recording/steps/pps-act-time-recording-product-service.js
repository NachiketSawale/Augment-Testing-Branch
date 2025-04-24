(function (angular) {
	'use strict';
	/* global _ */
	const moduleName = 'productionplanning.item';

	angular.module(moduleName).service('ppsActualTimeRecordingProductDataService', Service);
	Service.$inject = ['platformDataServiceFactory', 'platformRuntimeDataService', 'ppsActualTimeRecordingProductAssignmentDataService', 'ppsActualTimeRecordingAreaDataService', 'ppsActualTimeRecordingTimeAssignmentDataService'];

	function Service(platformDataServiceFactory, platformRuntimeDataService, productAssignmentDataService, areaDataService, assignmentDataService) {
		const self = this;

		function getData(){
			const area = areaDataService.getSelected();
			if(area && area.Id){
				return productAssignmentDataService.getProducts(area.Id); // remark: area.Id is a site Id
			}
			return [];
		}

		const serviceOption = {
			flatLeafItem: {
				module: moduleName,
				serviceName: 'ppsActualTimeRecordingProductDataService',
				httpRead: {
					useLocalResource: true,
					resourceFunction: getData,
				},
				actions: { create: false, delete: false },
				dataProcessor: [{
					processItem: item => {
						let fields = [];
						const actualActionIdMask = 100000000;
						const correrctionActionIdMask = 200000000;
						_.each(item.TimeSymbolIds, timeSymbolId => {
							fields.push({ field: `Actions['${timeSymbolId + correrctionActionIdMask}'].ActionQuantity`, readonly: !(item?.Actions[timeSymbolId]?.ActionQuantity > 0) });
							fields.push({ field: `Actions['${timeSymbolId}'].ActionQuantity`, readonly: true });
							fields.push({ field: `Actions['${timeSymbolId+actualActionIdMask}'].ActionQuantity`, readonly: true });
						});
						platformRuntimeDataService.readonly(item, fields);
					}
				}],
				entityRole: {
					leaf: { itemName: 'Product', parentService: areaDataService }
				},
				modification: 'none',
				entitySelection: {supportsMultiSelection: false},
				presenter: {list: {}},
			}
		};

		const serviceContainer = platformDataServiceFactory.createService(serviceOption, self);
		serviceContainer.data.Initialised = true;

		// serviceContainer.service.getActions = () =>{
		// 	let mappingProductAssignments = getData();
		// 	let mappingActions = [];
		// 	mappingProductAssignments.forEach(p =>{
		// 		if(_.isArray(p.GeneralActionAssignments)){
		// 			mappingActions = mappingActions.concat(p.GeneralActionAssignments);
		// 		}
		// 	});
		// 	return mappingActions;
		// 	// remark: every element(as an object) in array mappingActions exists in actions of ppsActualTimeRecordingProductAssignmentDataService(ppsActualTimeRecordingProductAssignmentDataService.getActions())
		// };
	}
})(angular);

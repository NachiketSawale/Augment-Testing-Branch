(function (angular) {
	'use strict';
	let moduleName = 'productionplanning.ppsmaterial';
	let masterModule = angular.module(moduleName);

	masterModule.factory('productionplanningPpsMateriaSummarizedDataService', MateriaSummarizedDataService);
	MateriaSummarizedDataService.$inject = ['$injector', 'productionplanningPpsMaterialRecordMainService', 'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension', 'basicsLookupdataLookupDescriptorService',
		'platformRuntimeDataService'];

	function MateriaSummarizedDataService($injector, parentService, platformDataServiceFactory,
		platformDataServiceProcessDatesBySchemeExtension, basicsLookupdataLookupDescriptorService,
		platformRuntimeDataService) {

		const canCreate = () => {
			var selected = parentService.getSelected();
			return selected !== null && selected.PpsMaterial !== null;
		};

		const setModeEditable = (entity, mode) => {
			let fields = [];
			fields.push({
				field: 'SummarizeMode',
				readonly: mode !== 3 // mix mode
			});
			platformRuntimeDataService.readonly(entity, fields);

		};
		let serviceInfo = {
			flatLeafItem: {
				module: moduleName,
				serviceName: 'productionplanningPpsMateriaSummarizedDataService',
				entityNameTranslationID: 'productionplanning.ppsmaterial.summarizedMaterial.entitySummarizedMaterial',
				dataProcessor: [
					{
						processItem: (entity) => {
							let mdcMaterial = parentService.getSelected();
							if (mdcMaterial && mdcMaterial.PpsMaterial) {
								if (mdcMaterial.PpsMaterial) {
									let ppsMaterial = mdcMaterial.PpsMaterial;
									setModeEditable(entity, ppsMaterial.SummarizeMode);
								}
							}
						}
					}
				],
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/ppsmaterial/summarizedmaterial/',
					endRead: 'listByPpsMaterial',
					initReadData: function (readData) {
						var selected = parentService.getSelected();
						var ppsMaterialId = selected.PpsMaterial === null ? 0 : selected.PpsMaterial.Id;
						readData.filter = '?ppsmaterialId=' + ppsMaterialId;
					}
				},
				entityRole: {
					leaf: {
						itemName: 'SummarizedMaterial',
						parentService: parentService
					}
				},
				presenter: {
					list: {
						incorporateDataRead: function (readData, data) {
							basicsLookupdataLookupDescriptorService.attachData(readData);
							var result = {
								FilterResult: readData.FilterResult,
								dtos: readData || []
							};

							return container.data.handleReadSucceeded(result, data);
						},
						initCreationData: function (creationData) {
							let selected = parentService.getSelected();
							creationData.Id = selected.PpsMaterial === null ? 0 : selected.PpsMaterial.Id;
						},
						handleCreateSucceeded: function (item) {
							let selected = parentService.getSelected();
							if (selected.PpsMaterial) {
								const mode = selected.PpsMaterial.SummarizeMode;
								item.SummarizeMode = mode === 1 || mode === 2 ?
									mode : 1;
							}
							return item;
						}
					}
				},
				actions: {
					create: 'flat',
					canCreateCallBackFunc: canCreate,
					delete: {}
				}
			}
		};

		/* jshint -W003 */
		let container = platformDataServiceFactory.createNewComplete(serviceInfo);

		let service = container.service;

		let PpsMaterialUsedId = [];

		service.setPpsMaterialUsedId = (data) => {
			PpsMaterialUsedId = data;
		};

		service.getPpsMaterialUsedId = () => {
			return PpsMaterialUsedId;
		};

		service.updateMode = (mode) => {
			let list = service.getList();
			list.forEach((sum) => {
				sum.SummarizeMode = mode === 1 || mode === 2 ? mode : sum.SummarizeMode;
				setModeEditable(sum, mode);
			});
			service.gridRefresh();
		};

		return service;
	}

})(angular);

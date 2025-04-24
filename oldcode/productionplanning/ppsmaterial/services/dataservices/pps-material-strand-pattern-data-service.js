(function (angular) {
	'use strict';
	/* global globals, _ */
	var moduleName = 'productionplanning.ppsmaterial';
	var module = angular.module(moduleName);
	module.factory('ppsMaterialStrandPatternDataService', PpsMaterialStrandPatternDataService);

	PpsMaterialStrandPatternDataService.$inject = [
		'$injector',
		'platformDataServiceFactory',
		'productionplanningPpsMaterialRecordMainService'
	];

	function PpsMaterialStrandPatternDataService(
		$injector,
		platformDataServiceFactory,
		parentService
	) {
		var serviceOptions = {
			flatLeafItem: {
				module: module,
				serviceName: 'ppsMaterialStrandPatternDataService',
				entityNameTranslationID: 'productionplanning.ppsmaterial.strandPatternListViewTitle',
				addValidationAutomatically: true,
				httpRead: {route: globals.webApiBaseUrl + 'productionplanning/StrandPattern/', endRead: 'listbymaterialid',
					initReadData: function initReadData(readData) {
					var selected = parentService.getSelected();
					var materialId = (selected && selected.PpsMaterial) ? selected.PpsMaterial.Id : -1;
					readData.filter = '?materialId=' + materialId;
					}},
				entityRole: {
					leaf: {
						itemName: 'StrandPattern',
						parentService: parentService
					}
				},
				presenter: {
					list: {
						incorporateDataRead: function (readData, data) {
							var result = {
								FilterResult: readData.FilterResult,
								dtos: readData || []
							};
							return container.data.handleReadSucceeded(result, data);
						}
					}
				},
				actions: {}
			}
		};
		var container = platformDataServiceFactory.createNewComplete(serviceOptions);
		return container.service;
	}
})(angular);
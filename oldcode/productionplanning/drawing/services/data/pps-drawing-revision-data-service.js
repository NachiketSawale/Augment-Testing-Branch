(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.drawing';
	var module = angular.module(moduleName);

	module.factory('ppsDrawingRevisionDataService', RevisionDataService);

	RevisionDataService.$inject = ['$injector', 'platformDataServiceFactory',
		'productionplanningDrawingMainService', 'platformRuntimeDataService'];

	function RevisionDataService($injector, platformDataServiceFactory,
								 drawingMainService, runtimeDataService) {
		var serviceInfo = {
			flatNodeItem: {
				readonly: true,
				module: module,
				serviceName: 'ppsDrawingRevisionDataService',
				entityNameTranslationID: 'productionplanning.drawing.entityRevision',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/drawing/drwrevision/',
					endRead: 'getbydrawing'
				},
				presenter: {
					list: {
						incorporateDataRead: function (readData, data) {
							_.each(readData, function (data) {
								runtimeDataService.readonly(data, true);
							});
							return container.data.handleReadSucceeded(readData, data);
						}
					}
				},
				entityRole: {
					node: {
						itemName: 'Revisions',
						parentService: drawingMainService,
						parentFilter: 'drawingFk'
					}
				},
				actions: {
					create: false,
					delete: false
				}
			}
		};

		/* jshint -W003 */
		var container = platformDataServiceFactory.createNewComplete(serviceInfo);

		return container.service;
	}
})(angular);
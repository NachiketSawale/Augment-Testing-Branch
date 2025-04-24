/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	var moduleName = 'model.main';

	angular.module(moduleName).factory('modelMainIgeDimensionService', [
		'modelWdeViewerIgeDimensionServiceFactory',
		'modelMainObjectDataService',
		function (modelWdeViewerDimensionServiceFactory,
		          modelMainObjectDataService) {
			var options = {
				readonly: true,
				isHeaderModelObject: true,
				headerService: modelMainObjectDataService,
				mapHeaderId: function (header) {
					return {
						Id: header.Id,
						PKey1: header.ModelFk
					};
				}
			};

			return modelWdeViewerDimensionServiceFactory.create(options);
		}
	]);

	angular.module(moduleName).factory('modelMainDimensionService', [
		'modelWdeViewerDimensionServiceFactory',
		'modelMainObjectDataService',
		function (modelWdeViewerDimensionServiceFactory,
				  modelMainObjectDataService) {
			var options = {
				readonly: true,
				isHeaderModelObject: true,
				headerService: modelMainObjectDataService,
				mapHeaderId: function (header) {
					return {
						Id: header.Id,
						PKey1: header.ModelFk
					};
				}
			};

			return modelWdeViewerDimensionServiceFactory.create(options);
		}
	]);

})(angular);

(function(angular){
	'use strict';
	/* global _ */
	var moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainIgeDimensionService', [
		'modelWdeViewerIgeDimensionServiceFactory',
		'estimateMainService',
		'estimateMainLineItem2MdlObjectService',
		function (modelWdeViewerDimensionServiceFactory,
			estimateMainService,
			estimateMainLineItem2MdlObjectService) {
			var options = {
				readonly: true,
				objectUsageContract: 'Estimate.Main.ObjectUsage',
				headerService: estimateMainService,
				assignedObjectService: estimateMainLineItem2MdlObjectService,
				mapHeaderId: function (header) {
					return {
						Id: header.Id,
						PKey1: header.EstHeaderFk
					};
				},
				mapObjectId: function (assignObject) {
					return {
						Id: assignObject.MdlObjectFk,
						PKey1: assignObject.MdlModelFk
					};
				},
				filterByHeader: function (dimensions) {
					var list = estimateMainLineItem2MdlObjectService.getList();

					return list.map(function (item) {
						return _.find(dimensions, {
							ModelFk: item.MdlModelFk,
							ModelObjectFk: item.MdlObjectFk
						});
					});
				}
			};

			var service = modelWdeViewerDimensionServiceFactory.create(options);

			service.getValidHeaderIds = function () {
				return estimateMainService.getSelectedEntities().map(function (entity) {
					return {
						Id: entity.Id,
						PKey1: entity.EstHeaderFk
					};
				});
			};

			return service;
		}
	]);

})(angular);
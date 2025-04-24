(function (angular) {
	'use strict';

	angular.module('constructionsystem.master').factory('constructionSystemMasterFilterService', [
		'platformContextService', 'basicsLookupdataLookupFilterService', 'constructionSystemMasterHeaderService',
		function (platformContextService, basicsLookupdataLookupFilterService, parentService) {

			var service = {};

			var filters = [
				{
					key: 'basformfieldfk-for-construction-system-master-filter',
					serverSide: true,
					fn: function () {
						if (!angular.isDefined(parentService.getSelected()) || parentService.getSelected() === null)
						{return '';}
						var basformfk = parentService.getSelected().BasFormFk || -1;
						return 'FormFk ='+ basformfk;
					}
				}
			];

			/**
             * register all filters
             * this method aways call in contract-controller.js when controller loaded.
             */
			service.registerFilters = function registerFilters() {
				// self.leadingService = leadingService;
				basicsLookupdataLookupFilterService.registerFilter(filters);
			};

			/**
             * remove register all filters
             * this method aways call in contract-controller.js when controller destroy event called.
             */
			service.unRegisterFilters = function unRegisterFilters() {
				basicsLookupdataLookupFilterService.unregisterFilter(filters);
			};

			return service;
		}]);
})(angular);
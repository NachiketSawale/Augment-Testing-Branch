/*
 * $Id: platform-filter-helper-service.js 573965 2021-12-17 12:19:22Z nitdvhr $
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform.platformFilterHelperService
	 * @function
	 *
	 * @description Provides common filter
	 */
	angular.module('platform').factory('platformFilterHelperService', ['_',
		function (_) {
			let service = {};
			service.IsItemUniqueOutOfAllUnselected = function IsItemUniqueOutOfAllUnselected(item, dataService, map2UniqueItemFk){
				return !_.some(service.getListWithoutSelected(dataService), entity => map2UniqueItemFk(entity) === item.Id);
			};
			service.getListWithoutSelected = function getListWithoutSelected(dataService){
				return _.filter(dataService.getList(), entity => entity.Id !== dataService.getSelected().Id);
			};

			return service;
		}]);
})();
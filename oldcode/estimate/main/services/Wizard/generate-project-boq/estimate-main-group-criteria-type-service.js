/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('estimate.main').factory('estimateMainGroupCriteriaTypeService',['_', '$q', '$http', '$translate',
		function (_, $q, $http, $translate) {

			let service = {};

			let list = [];

			service.getList = function () {
				return list;
			};

			service.loadData = function(){
				return $q.when(list);
			};

			service.getSelectedItem = function(id){
				return _.find(list, function (item) {
					return item.Id === id;
				});
			};

			service.getSelectedStructureName = function(id){
				let selected = service.getSelectedItem(id);

				return selected ? selected.structureName : '';
			};

			service.initData = function () {
				list = [
					{Id: 0, mainId:0, Description: $translate.instant('estimate.main.generateProjectBoQsWizard.noCritera'), structureName:''},
					{Id: 1, mainId:0, Description: $translate.instant('estimate.main.generateProjectBoQsWizard.wicItemRefNo'), structureName:''},
					{Id: 16, mainId:0, Description: $translate.instant('estimate.main.generateProjectBoQsWizard.lineItemsStructure'), structureName:''}
				];
				return $q.when(list);
			};

			return service;

		}]);

})(angular);

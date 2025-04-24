/**
 * Created by xia on 10/30/2017.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	var moduleName = 'procurement.pes';
	var salesWipModule = angular.module(moduleName);

	salesWipModule.factory('pesHeaderLookupDataService', ['$http', '$q', '$injector', 'basicsLookupdataLookupFilterService', 'qtoBoqType',
		function ($http, $q, $injector, basicsLookupdataLookupFilterService, qtoBoqType) {

			var service = {};

			var pesHeaderList = [];

			var projectId = 0;

			var pesHeaderPromise = null;

			service.setProjectId = function(value){
				pesHeaderPromise = null;
				projectId = value;
			};

			service.getItemById = function(item , options){
				if (options && options.BoqType && options.BoqType !== qtoBoqType.QtoBoq){
					let itemService = $injector.get('qtoMainCommonService').getItemService(options.BoqType);
					return  itemService.getSelected();
				}
				else {
					let pesItem = null;
					if(pesHeaderList.length >0){
						pesItem = _.find(pesHeaderList, {Id: item});
						if (pesItem) {
							pesItem.DescriptionInfo = {
								Translated: pesItem.Description,
							};
						}
					}
					return pesItem;
				}
			};

			service.getItemByIdAsync = function(item, options){
				if(!pesHeaderPromise){
					pesHeaderPromise = $http.get(globals.webApiBaseUrl + 'procurement/pes/header/list?projectId=' + projectId);
				}
				return pesHeaderPromise.then(function(response){
					pesHeaderList = _.uniqBy(pesHeaderList.concat(response.data), 'Id');
					return service.getItemById(item, options);
				});
			};

			service.getList = function(){

				var filter = basicsLookupdataLookupFilterService.getFilterByKey('qto-procurement-pes-filter');

				if(filter){
					var value = filter.fn();

					if(angular.isDefined(value) && value !== null){

						pesHeaderPromise = $http.get(globals.webApiBaseUrl + 'procurement/pes/header/list?' + value);
						return pesHeaderPromise.then(function(response){
							pesHeaderList = _.uniqBy(pesHeaderList.concat(response.data), 'Id');
							return _.uniqBy(response.data, 'Code');
						});
					}
				}

				return $q.when([]);
			};

			return service;

		}]);
})(angular);
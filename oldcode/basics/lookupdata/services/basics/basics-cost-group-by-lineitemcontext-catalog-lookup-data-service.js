(function (angular) {
	/* global _ ,globals*/
	'use strict';

	angular.module ('basics.lookupdata').factory ('basicCostGroupCatalogByLineItemContextLookupDataService',

		['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator','$http','$q',

			function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator,$http,$q) {

				basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec ('basicCostGroupCatalogByLineItemContextLookupDataService', {
					valMember: 'Id',
					dispMember: 'Code',
					columns: [
						{
							id: 'Code',
							field: 'Code',
							name: 'Code',
							formatter: 'code',
							width: 100,
							name$tr$: 'cloud.common.entityCode'
						},
						{
							id: 'Description',
							field: 'DescriptionInfo',
							name: 'Description',
							formatter: 'translation',
							width: 300,
							name$tr$: 'cloud.common.entityDescription'
						}
					],
					uuid: 'e3763e6b34f24af08849ed25ba92b66c'
				});

				var basicCostGroupCatalogLookupDataServiceConfig = {
					httpRead: {
						route: globals.webApiBaseUrl + 'basics/costgroupcat/', endPointRead: 'licListByLineItemContext'
					},
					filterParam: 'lineItemContextId',
					prepareFilter: function () {
						return '?lineItemContextId=' + lineItemContextId +'&isIncludeIsNotLive=false';
					}
				};

				let service = platformLookupDataServiceFactory.createInstance (basicCostGroupCatalogLookupDataServiceConfig).service;

				let costGroupList = [];

				let loadPromise = null;
				let lineItemContextId =-1;
				service.setLineItemContextId = function setLineItemContextId(value){
					lineItemContextId = value;
				};

				service.getItemByIdAsync = function getItemByIdAsync(value) {
					let item =  _.find(costGroupList, {Id : value});
					if(item){
						return item;
					}
					if (!loadPromise) {
						loadPromise = getCostGroup(value);
					}
					return loadPromise.then (function (data) {
						loadPromise = null;
						costGroupList = data;
						return service.getItemById (value);
					});
				};

				function getCostGroup() {
					let deferred = $q.defer ();
					$http.get(globals.webApiBaseUrl + 'basics/costgroupcat/licListByLineItemContext?lineItemContextId='+lineItemContextId+'&isIncludeIsNotLive=true').then(function (response) {
						costGroupList = response.data;
						deferred.resolve (response.data);
					});
					return deferred.promise;
				}

				service.getItemById = function getItemById(value) {
					return _.find(costGroupList, {Id : value});
				};
				service.getItemByKey = service.getItemById;

				return service;
			}
		]);
})(angular);


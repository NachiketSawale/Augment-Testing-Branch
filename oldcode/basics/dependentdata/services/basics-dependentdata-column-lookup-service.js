/**
 * Created by reimer on 26.11.2014.
 */

(function () {

	'use strict';

	var moduleName = 'basics.dependentdata';

	/**
	 * @ngdoc service
	 * @name
	 * @returns
	 */
	angular.module(moduleName).factory('basicsDependentDataColumnLookupService',

		['$q','$http', 'basicsDependentDataMainService', 'basicsLookupdataLookupDescriptorService','basicsDependentDataColumnService', function ($q,$http, basicsDependentDataMainService, basicsLookupdataLookupDescriptorService,basicsDependentDataColumnService) {
			var service = {};

			var lookupType = 'basicsDependentDataColumn';
			service.loadData = function() {
				var deffered = $q.defer();
				var sectionId=0;
				if(basicsDependentDataMainService.getSelected()){
					sectionId = basicsDependentDataMainService.getSelected().Id;
				}
				$http.get(globals.webApiBaseUrl + 'basics/dependentdata/column/list?mainItemId='+sectionId).then(function (response){
					var data=response.data;
					basicsLookupdataLookupDescriptorService.updateData(lookupType,data);
					deffered.resolve(data);
				});
				return deffered.promise;
			};


			service.getList = function() {
				return service.loadData().then (function(data) {return data; } );
			};

			service.getItemByKey = function (value) {
				    var list = basicsLookupdataLookupDescriptorService.getData(lookupType);
				var backItem=null;
				     _.forEach(list,function(item){
					if(item.Id===value){
						  backItem=item;
					  }
				     });
				return backItem;

			};

			service.getItemById = function getItemById(id) {
				var list = basicsLookupdataLookupDescriptorService.getData(lookupType);
				return _.find(list, function (item) {
					return item.Id === id;
				});
			};

			service.getItemByIdAsync = function getItemByIdAsync(value) {
				return service.getItemByKey(value);
			};

			return service;


		}]);
})();




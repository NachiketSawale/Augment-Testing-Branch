/**
 * Created by reimer on 26.11.2014.
 */

(function () {

	'use strict';

	var moduleName = 'basics.userform';

	angular.module(moduleName).factory('basicsUserformProcessingTypeService',

		[function () {

			var processingTypes = [
				{Id: 0, Description: 'IN'},
				{Id: 1, Description: 'OUT'},
				// { id: 2, description: 'IN/OUT' } // not yet supported
				{Id: 3, Description: 'PLACEHOLDER'}
			];

			// var data;      // cached indexed object list
			var service = {};

			service.getlookupType = function () {
				return 'basicsUserformProcessingTypeLookup';
			};

			service.getList = function () {

				return processingTypes;

			};

			service.getItemByKey = function (value) {

				var list = service.getList();
				for (var i = 0; i < list.length; i++) {
					if (list[i].Id === value) {
						return list[i];
					}
				}
				return null;
			};

			service.refresh = function () {
				// data = null;
				// service.loadData();
			};

			return service;

		}]);
})();




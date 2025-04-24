/**
 * Created by reimer on 03.03.2015.
 */

(function () {

	'use strict';

	var moduleName = 'basics.characteristic';

	/**
	 * @ngdoc service
	 * @name
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('basicsCharacteristicPopupGroupService', ['$q', '$http', function ($q, $http) {

		var deffered = $q.defer();

		var selectedSectionId = -1;
		var data = null;      // cached object list

		var service = {};
		service.loadCompleted = false;

		//service.getlookupType = function() {
		//	return 'basicsCharacteristicGroupLookup';
		//};

		service.loadData = function(sectionId) {

			if (data === null || selectedSectionId !== sectionId) {

				service.loadCompleted = false;
				selectedSectionId = sectionId;

				$http.get(globals.webApiBaseUrl + 'basics/characteristic/group/treebysection?sectionId=' + sectionId)
					.then(function (response) {
						data = response.data;
						deffered.resolve();
						service.loadCompleted = true;
					});
			}
			else
			{
				deffered.resolve();
			}

			return deffered.promise;
		};

		service.getList = function() {
			return data;
		};

		service.getItemById = function (id) {

			if (data) {
				for (var i = 0; i < data.length; i++) {
					if (data[i].Id === id) {
						return data[i];
					}
				}
			}
			return null;
		};

		service.onSelectedItemChanged = new Platform.Messenger();

		var _selectedItem = null;
		service.setSelected = function (item) {
			_selectedItem = item;

			if (item === null){
				selectedSectionId = -1;
			}
			if (item !== null) {
				service.onSelectedItemChanged.fire(item);
			}
		};

		service.getSelected = function () {
			return _selectedItem;
		};

		return service;

	}
	]);
})(angular);

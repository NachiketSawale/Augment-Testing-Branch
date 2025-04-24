/**
 * Created by Frank Baedeker on 31.08.2020.
 */
(function () {
	'use strict';
	var moduleName = 'basics.customize';
	var basicsCustomizeModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name basicsCustomizeStatusDataService
	 * @function
	 *
	 * @description
	 * basicsCustomizeStatusRoleDataService is a service for providing states for the status matrix
	 */
	basicsCustomizeModule.service('basicsCustomizeStatusDataService', BasicsCustomizeStatusDataService);

	BasicsCustomizeStatusDataService.$inject = ['_', '$q', 'basicsCustomizeInstanceDataService', 'basicsCustomizeTypeDataService'];

	function BasicsCustomizeStatusDataService(_, $q, basicsCustomizeInstanceDataService, basicsCustomizeTypeDataService) {
		var data = {
			onlyShowFilteredItems: false,
			itemList: [],
			filteredItemList: [],
			itemTableName: ''
		};

		this.provideStates = function provideStatesForMatrix(selectedType) {
			var filteredItems = data.itemList;

			if(selectedType.onlyShowActiveStates) {
				filteredItems = data.filteredItemList;
			}

			if (selectedType.rubricCategoryId) {
				filteredItems = _.filter(filteredItems, function (item) {
					return item.RubricCategoryFk === selectedType.rubricCategoryId;
				});
			}
			filteredItems = _.sortBy(filteredItems, 'Sorting');

			return filteredItems;
		};

		this.loadStates = function loadStatesForMatrix() {
			var selectedType = basicsCustomizeTypeDataService.getSelected();
			if(!data.itemTableName && data.itemTableName === selectedType.DBTableName) {
				return $q.when(true);
			}

			return basicsCustomizeInstanceDataService.load().then(function(response) {
				data.itemList = response;
				data.filteredItemList = _.filter(response, function(state) { return state.IsLive && state.Sorting > 0; });
				data.itemTableName = selectedType.DBTableName;

				if(_.isUndefined(selectedType.onlyShowActiveStates)) {
					selectedType.onlyShowActiveStates = true;
				}

				return data.itemList;
			});
		};
	}
})();

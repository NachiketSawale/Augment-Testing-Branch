/**
 * Created by zwz on 2021/8/31.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.item';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name productionplanningItemPreselectionExtension
	 * @function
	 * @requires _
	 * @description
	 * productionplanningItemPreselectionExtension provides preselection feature after searching for PPS item list/tree controller
	 */
	angModule.service('productionplanningItemPreselectionExtension', Extension);
	Extension.$inject = ['_', 'platformDataServiceSelectionExtension'];

	function Extension(_, platformDataServiceSelectionExtension) {

		/**
		 * @ngdoc function
		 * @name modifyMethodsForPreselection
		 * @param {Object} data: data of the PU container
		 * @param {Object} service: dataService of the PU container
		 * @description modify method(s) handleReadSucceeded(etc.) of data for preselection after searching
		 **/
		this.modifyMethodsForPreselection = function (data, service) {
			function preselectedSpecifiedPu(data, service){
				if(_.isArray(service.itemFksFromNavForPuContainer) && service.itemFksFromNavForPuContainer.length >0 ){
					var mappingItems = _.filter(data.itemList, function (item) {
						return _.some(service.itemFksFromNavForPuContainer, function (itemFk) {
							return item.Id === itemFk;
						});
					});
					if(mappingItems.length >0){
						platformDataServiceSelectionExtension.doMultiSelect(mappingItems[0], mappingItems, data).then((selectedItem) =>{
							service.loadSubItems(selectedItem);
						});
					}
					service.itemFksFromNavForPuContainer = null;
				}
			}

			var basehandleReadSucceeded = data.handleReadSucceeded;
			data.handleReadSucceeded = function newHandleReadSucceeded(result, data){
				var itemTree = basehandleReadSucceeded(result, data);
				preselectedSpecifiedPu(data, service);
				return itemTree;
			};
			// remark: Here we "override" method data.handleReadSucceeded for handing case about preselecting specified PU from navigation after searching.
			// Ih the base handleReadSucceeded method, there is also relative codes of selection. for avoiding affecting our expected preselection behavior, we need to call the preselectedSpecifiedPu method after finishing base handleReadSucceeded method.
		};
	}
})(angular);

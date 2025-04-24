/**
 * Created by zwz on 2021/7/7.
 */

(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.transport';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name transportplanningTransportGotoBtnsExtension
	 * @function
	 * @requires _, $translate, platformModuleNavigationService
	 * @description
	 * transportplanningItemGotoBtnsExtension provides goto-buttons for Transport list controller
	 */
	angModule.service('transportplanningTransportGotoBtnsExtension', Extension);
	Extension.$inject = ['_', '$http', '$translate', 'platformModuleNavigationService'];

	function Extension(_, $http, $translate, naviService) {

		/**
		 * @ngdoc function
		 * @name createGotoBtns
		 * @description Public function that creates goto-buttons for Transport list controller.
		 * @param {Object} dataService: The dataService that functionality of goto-buttons depends on.
		 **/
		this.createGotoBtns = function (dataService) {
			return {
				id: 'goto',
				caption: $translate.instant('cloud.common.Navigator.goTo'),
				type: 'dropdown-btn',
				iconClass: 'tlb-icons ico-goto',
				list: {
					showImages: true,
					listCssClass: 'dropdown-menu-right',
					items: [{
						id: 'ppsItemGoto',
						caption: $translate.instant('productionplanning.item.entityItem'),
						type: 'item',
						iconClass: 'app-small-icons ico-production-planning',
						fn: function () {
							var navigator = {moduleName: 'productionplanning.item'};
							var selectedItem = dataService.getSelected();

							if (dataService.isSelection(selectedItem)) {
								// get products by routeId, then collect ItemFks from products, set ItemFks as part of param for navigation.
								const url = `${globals.webApiBaseUrl}productionplanning/common/product/listbyforeignkey?foreignKey=TrsRouteFk&&mainItemId=${selectedItem.Id}&&needAdditionalProperties=false`;
								$http.get(url).then(function (response) {
									var itemFks = _.map(response.data.Main, 'ItemFk');
									var navigator = {moduleName: 'productionplanning.item'};
									naviService.navigate(navigator, {LgmJobFk: selectedItem.JobDefFk, ItemFks: itemFks}, 'LgmJobFk');
								});
							}
						}
					}]
				},
				disabled: function () {
					return _.isEmpty(dataService.getSelected()) || _.isNil(dataService.getSelected().JobDefFk);
				}
			};
		};
	}
})(angular);

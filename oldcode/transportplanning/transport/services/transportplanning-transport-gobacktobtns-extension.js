
(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.transport';
	var angModule = angular.module(moduleName);

	angModule.service('trsTransportGobacktoBtnsExtension', Extension);
	Extension.$inject = ['_', '$http', '$translate', '$rootScope', 'platformGridAPI','platformModuleNavigationService'];

	function Extension(_, $http, $translate, $rootScope, platformGridAPI, navigationService) {
		this.createGobacktoBtns = function (service) {
			return {
				id: 'gobackto',
				caption: $translate.instant('cloud.common.Navigator.goBackTo'),
				type: 'dropdown-btn',
				iconClass: 'tlb-icons ico-goto-back',
				list: {
					showImages: true,
					listCssClass: 'dropdown-menu-right',
					items: [{
						id: 'trsRequisitionGobackto',
						caption: $translate.instant('transportplanning.requisition.entityRequisition'),
						type: 'item',
						iconClass: 'app-small-icons ico-transport-requisition',
						fn: function () {
							var selectedItem = service.getSelected();
							if (selectedItem && !_.isNil(selectedItem.RequisitionsInfo)&& !_.isNil(selectedItem.RequisitionsInfo.Ids) && selectedItem.RequisitionsInfo.Ids.length > 0) {
								var navigator = { moduleName: 'transportplanning.requisition' };
								$rootScope.$emit('before-save-entity-data');
								platformGridAPI.grids.commitAllEdits();
								service.update().then(function () {
									navigationService.navigate(navigator, selectedItem, 'RequisitionsInfo.Ids');
									return $rootScope.$emit('after-save-entity-data');
								});
							}
						},
						disabled: function () {
							var selectedItem = service.getSelected();
							return !selectedItem || _.isNil(selectedItem.RequisitionsInfo) || _.isNil(selectedItem.RequisitionsInfo.Ids) || selectedItem.RequisitionsInfo.Ids.length ===0 ;
						}
					},{
						id: 'ppsItemGoto',
						caption: $translate.instant('productionplanning.item.entityItem'),
						type: 'item',
						iconClass: 'app-small-icons ico-production-planning',
						fn: function () {
							var selectedItem = service.getSelected();

							if (service.isSelection(selectedItem)) {
								// get products by routeId, then collect ItemFks from products, set ItemFks as part of param for navigation.
								$rootScope.$emit('before-save-entity-data');
								platformGridAPI.grids.commitAllEdits();
								service.update().then(function () {
									const url = `${globals.webApiBaseUrl}productionplanning/common/product/listbyforeignkey?foreignKey=TrsRouteFk&&mainItemId=${selectedItem.Id}&&needAdditionalProperties=false`;
									$http.get(url).then(function (response) {
										var itemFks = _.map(response.data.Main, 'ItemFk');
										var navigator = {moduleName: 'productionplanning.item'};
										navigationService.navigate(navigator, {LgmJobFk: selectedItem.JobDefFk, ItemFks: itemFks}, 'LgmJobFk');
										return $rootScope.$emit('after-save-entity-data');
									});
								});
							}
						},
						disabled: function () {
							return _.isEmpty(service.getSelected()) || _.isNil(service.getSelected().JobDefFk) || !service.getSelected().CanbeSearchByJob;
						}
					}]
				}
			};
		};
	}
})(angular);

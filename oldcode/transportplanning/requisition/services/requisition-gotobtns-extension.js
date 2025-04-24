(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.requisition';
	var angModule = angular.module(moduleName);

	angModule.service('transportplanningRequisitionGotoBtnsExtension', Extension);
	Extension.$inject = ['_', '$translate', '$rootScope', 'platformGridAPI', 'platformModuleNavigationService'];

	function Extension(_, $translate, $rootScope, platformGridAPI, navigationService) {
		this.createGotoBtns = function (service) {
			return {
				id: 'goto',
				caption: $translate.instant('cloud.common.Navigator.goTo'),
				type: 'dropdown-btn',
				iconClass: 'tlb-icons ico-goto',
				list: {
					showImages: true,
					listCssClass: 'dropdown-menu-right',
					items: [{
						id: 'transportRouteGoto',
						caption: $translate.instant('transportplanning.transport.entityRoute'),
						type: 'item',
						iconClass: 'app-small-icons ico-transport',
						fn: function () {
							var selectedItem = service.getSelected();
							if (selectedItem && !_.isNil(selectedItem.RoutesInfo) && !_.isNil(selectedItem.RoutesInfo.Ids) && selectedItem.RoutesInfo.Ids.length > 0) {
								var navigator = { moduleName: 'transportplanning.transport' };
								$rootScope.$emit('before-save-entity-data');
								platformGridAPI.grids.commitAllEdits();
								service.update().then(function () {
									navigationService.navigate(navigator, selectedItem, 'RoutesInfo.Codes');
									return $rootScope.$emit('after-save-entity-data');
								});
							}
						},
						disabled: function () {
							var selectedItem = service.getSelected();
							return !selectedItem || _.isNil(selectedItem.RoutesInfo) || _.isNil(selectedItem.RoutesInfo.Ids) || selectedItem.RoutesInfo.Ids.length === 0;
						}
					}]
				}
			};
		};
	}
})(angular);


(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.requisition';
	var angModule = angular.module(moduleName);

	angModule.service('transportplanningRequisitionGobacktoBtnsExtension', Extension);
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
						id: 'activityGobackto',
						caption: $translate.instant('productionplanning.activity.entityActivity'),
						type: 'item',
						iconClass: 'app-small-icons ico-mounting-activity',
						fn: function () {
							var selectedItem = service.getSelected();
							if (selectedItem && !_.isNil(selectedItem.MntActivityFk)) {
								var navigator = { moduleName: 'productionplanning.activity' };
								$rootScope.$emit('before-save-entity-data');
								platformGridAPI.grids.commitAllEdits();
								service.update().then(function () {
									navigationService.navigate(navigator, { MntActivityFk: selectedItem.MntActivityFk }, 'MntActivityFk');
									return $rootScope.$emit('after-save-entity-data');
								});
							}
						},
						disabled: function () {
							var selectedItem = service.getSelected();
							return !selectedItem || _.isNil(selectedItem.MntActivityFk);
						}
					},{
						id: 'mntRequisitionGobackto',
						caption: $translate.instant('productionplanning.mounting.entityRequisition'),
						type: 'item',
						iconClass: 'app-small-icons ico-requisition',
						fn: function () {
							var selectedItem = service.getSelected();
							if (selectedItem && !_.isNil(selectedItem.MntActivityFk)) {
								$http.post(globals.webApiBaseUrl + 'basics/lookupdata/masternew/getitembykey?lookup=mntactivity', {id: selectedItem.MntActivityFk}).then(function (response) {
									var mntRequisition = response.data.MntRequisitionFk;
									var navigator = { moduleName: 'productionplanning.mounting' };
									$rootScope.$emit('before-save-entity-data');
									platformGridAPI.grids.commitAllEdits();
									service.update().then(function () {
										navigationService.navigate(navigator, {MntRequisitionFk:mntRequisition});
										return $rootScope.$emit('after-save-entity-data');
									});
								});
							}
						},
						disabled: function () {
							var selectedItem = service.getSelected();
							return !selectedItem || _.isNil(selectedItem.MntActivityFk);
						}
					},{
						id: 'ppsItemGobackto',
						caption: $translate.instant('productionplanning.item.entityItem'),
						type: 'item',
						iconClass: 'app-small-icons ico-production-planning',
						fn: function () {
							var selectedItem = service.getSelected();
							if (selectedItem && !_.isNil(selectedItem.LgmJobFk)) {
								$http.get(globals.webApiBaseUrl + 'productionplanning/common/item2event/listbyevent?eventId='+ selectedItem.PpsEventFk).then(function (response) {
									var itemFks = _.map(response.data, 'ItemFk');
									var navigator = {moduleName: 'productionplanning.item'};
									$rootScope.$emit('before-save-entity-data');
									platformGridAPI.grids.commitAllEdits();
									service.update().then(function () {
										navigationService.navigate(navigator, {LgmJobFk: selectedItem.LgmJobFk, ItemFks: itemFks}, 'LgmJobFk');
										return $rootScope.$emit('after-save-entity-data');
									});
								});
							}
						},
						disabled: function () {
							var selectedItem = service.getSelected();
							return !selectedItem || _.isNil(selectedItem.LgmJobFk);
						}
					}]
				}
			};
		};
	}
})(angular);

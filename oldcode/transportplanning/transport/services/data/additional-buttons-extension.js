/**
 * Created by zwz on 2020/1/20.
 */

(function (angular) {
	'use strict';

	/*global globals*/

	var moduleName = 'transportplanning.transport';
	var module = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name transportplanningTransportAdditionalButtonsExtension
	 * @function
	 * @requires $http, $translate
	 * @description
	 * transportplanningTransportAdditionalButtonsExtension provides functionality of additional buttons for transport transport data service
	 */
	module.service('transportplanningTransportAdditionalButtonsExtension', AdditionalButtonsExtension);
	AdditionalButtonsExtension.$inject = ['_', '$http', '$translate',
		'platformModalService', 'platformRuntimeDataService'];

	function AdditionalButtonsExtension(_, $http, $translate,
										platformModalService, platformRuntimeDataService) {

		this.addFunctionsForAdditionalButtons = function (service, data) {
			// extend copy button
			service.copy = function () {
				var source = service.getSelected();
				if (source) {
					service.isBusy = true;
					var creationData = {};
					$http.post(globals.webApiBaseUrl + 'transportplanning/transport/route/createroute', creationData).then(function (response) {
						var newItem = response.data;
						if (response.data) {
							copySpecificValues(source, newItem);
							data.onCreateSucceeded(newItem, data);
						}
					});
				}
			};

			service.copyMultiple = function (entity, scope) {
				var source = service.getSelected();
				if (source) {
					service.isBusy = true;
					$http.get(globals.webApiBaseUrl + 'transportplanning/transport/route/copyroutes?number=' + entity.CopyNumber).then(function (response) {
						if (response.data) {
							let lastNewItem = null;
							_.forEach(response.data, function (newItem) {
								copySpecificValues(source, newItem);
								data.onCreateSucceeded(newItem, data);
								lastNewItem = newItem;
							});
							if(response.data.length > 1 && !_.isNil(lastNewItem)){
								let otherNewItems = _.filter(response.data, item => item.Id !== lastNewItem.Id);
								platformRuntimeDataService.lock(otherNewItems, true); // these items will be readonly when they are locked, but they will be unlocked after triggering update and finishing update
								service.setSelected(lastNewItem);
								// remark: here we lock multi-copied new items(except the selected item) for fixing issue about concurrently updating. As a normal behavior of platform, entities should be locked while they are updating (for ticket #139140 by zwz on 2023/2/21)
							}
						}
						scope.isBusy = false;
						scope.$close(false);
					});
				}
			};

			function copySpecificValues(source, newItem) {
				newItem.BusinessPartnerFk = source.BusinessPartnerFk;
				newItem.CalCalendarFk = source.CalCalendarFk;
				newItem.CurrencyFk = source.CurrencyFk;
				newItem.CustomerFk = source.CustomerFk;
				newItem.DeliveryAddressContactFk = source.DeliveryAddressContactFk;
				newItem.EventTypeFk = source.EventTypeFk;
				newItem.JobDefFk = source.JobDefFk;
				newItem.LgmJobFk = source.LgmJobFk;
				newItem.PlannedStart = source.PlannedStart;
				if (!_.isNil(newItem.JobDefFk)) {
					newItem.PlannedDelivery = source.PlannedDelivery;
				}
				newItem.PlannedFinish = source.PlannedFinish;
				newItem.EarliestStart = source.EarliestStart;
				newItem.LatestStart = source.LatestStart;
				newItem.EarliestFinish = source.EarliestFinish;
				newItem.LatestFinish = source.LatestFinish;
				newItem.LicCostGroup1Fk = source.LicCostGroup1Fk;
				newItem.LicCostGroup2Fk = source.LicCostGroup2Fk;
				newItem.LicCostGroup3Fk = source.LicCostGroup3Fk;
				newItem.LicCostGroup4Fk = source.LicCostGroup4Fk;
				newItem.LicCostGroup5Fk = source.LicCostGroup5Fk;
				newItem.MdcControllingunitFk = source.MdcControllingunitFk;
				newItem.PrjCostGroup1Fk = source.PrjCostGroup1Fk;
				newItem.PrjCostGroup2Fk = source.PrjCostGroup2Fk;
				newItem.PrjCostGroup3Fk = source.PrjCostGroup3Fk;
				newItem.PrjCostGroup4Fk = source.PrjCostGroup4Fk;
				newItem.PrjCostGroup5Fk = source.PrjCostGroup5Fk;
				newItem.PrjLocationFk = source.PrjLocationFk;
				newItem.ProjectDefFk = source.ProjectDefFk;
				newItem.ProjectFk = source.ProjectFk;
				newItem.PsdActivityFk = source.PsdActivityFk;
				newItem.SiteFk = source.SiteFk;
				newItem.SubsidiaryFk = source.SubsidiaryFk;
				newItem.UomFk = source.UomFk;
				newItem.CopiedFromRouteId = source.Id;
				newItem.TruckTypeFk = source.TruckTypeFk;
				// newItem.TruckFk = source.TruckFk;   // not allow to copy truck and driver, see #122219
				// newItem.DriverFk = source.DriverFk;
			}

			service.getCopyButton = function () {
				return [{
					caption: 'cloud.common.taskBarShallowCopyRecord',
					type: 'dropdown-btn',
					iconClass: 'tlb-icons ico-copy',
					list: {
						showImages: true,
						cssClass: 'dropdown-menu-right',
						items: [{
							id: 'copyRoute',
							caption: $translate.instant('transportplanning.transport.copyRoute.one'),
							type: 'item',
							iconClass: 'tlb-icons ico-copy-paste',
							fn: function () {
								service.copy();
							},
							disabled: function () {
								return !service.getSelected() || service.isBusy;
							}
						},
							{
								id: 'copyRoutes',
								caption: $translate.instant('transportplanning.transport.copyRoute.multiple'),
								type: 'item',
								iconClass: 'tlb-icons ico-copy-paste-deep',
								fn: function () {
									setCopyNumberDialog();
								},
								disabled: function () {
									return !service.getSelected() || service.isBusy;
								}
							}]
					}
				}];
			};

			function setCopyNumberDialog() {
				var modalOptions = {
					iconClass: 'ico-info',
					width: '500px',
					resizeable: true,
					templateUrl: globals.appBaseUrl + 'transportplanning.transport/templates/transportplanning-transport-copy-route-dialog.html',
					controller: 'transportplanningTransportCopyRouteDialogController'
				};

				platformModalService.showDialog(modalOptions);
			}

		};

	}
})(angular);
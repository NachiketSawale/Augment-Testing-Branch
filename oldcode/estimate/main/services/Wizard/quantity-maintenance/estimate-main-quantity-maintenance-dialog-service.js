/**
 * Created by joshi on 30.03.2017.
 */

(function () {
	/* global globals , moment */
	'use strict';

	let moduleName = 'estimate.main';

	// list Quantity Types
	angular.module(moduleName).constant('estimateMainQuantityTypes', {
		'Planned': 1,
		'Installed': 2
	});

	/**
	 * @ngdoc service
	 * @name estimateMainQuantityMaintenanceDialogService
	 * @function
	 *
	 * @description
	 * This is the data service for  Line Items Quantity Maintenance functions.
	 */
	angular.module(moduleName).factory('estimateMainQuantityMaintenanceDialogService', ['$q', '$http', '$translate', '$injector', 'PlatformMessenger',  'platformModalService', 'estimateMainService', 'estimateMainLineItemQuantityService', 'estimateMainQuantityTypes',
		function ($q, $http, $translate, $injector, PlatformMessenger, platformModalService, estimateMainService, quantityService, estimateMainQuantityTypes) {

			let currentItem = {};
			let service = {
				showDialog:showDialog,
				update : update,
				getCurrentItem:getCurrentItem,
				setCurrentItem:setCurrentItem
			};

			function getCurrentItem() {
				return currentItem;
			}

			function setCurrentItem(item) {
				currentItem = item;
			}

			function getLineItems(estimateScope){
				if(estimateScope===2){
					return estimateMainService.getSelectedEntities();
				}else if (estimateScope===1) {
					return estimateMainService.getList();
				}
				else{
					return null;
				}
			}

			function showDialog() {
				let options = {
					templateUrl: globals.appBaseUrl + moduleName + '/templates/details-parameters-dialog/estimate-main-details-param-dialog.html',
					controller: 'estimateMainQuantityMaintenanceDialogController',
					width: '1100px',
					height: '550px',
					resizeable: true
				};

				// set params to save for display
				service.setCurrentItem({
					// selectedLevel: 'LineItems',
					factor: 1,
					date: moment(),
					estimateScope:0,
					targetQuantityTypeId : estimateMainQuantityTypes.Installed
				});
				platformModalService.showDialog(options);
			}

			function update(item) {
				let data = {
					// LineItems : item.selectedLevel === 'LineItems' ? estimateMainService.getSelectedEntities() : null,
					LineItems: getLineItems(item.estimateScope),
					SelectedLineItem : estimateMainService.getSelected(),
					EstHeaderFk : item.estimateScope === 0 ? estimateMainService.getSelectedEstHeaderId() : null,
					QuantityTypeFk : item.sourceQuantityTypeId,
					TargetQuantityTypeFk : item.targetQuantityTypeId,
					Factor : item.factor,
					Date : item.date.utc()
				};
				return $http.post(globals.webApiBaseUrl + 'estimate/main/lineitemquantity/updatemaintainquantity', data)
					.then(function(response){
						// lineItems update
						let result = response.data;
						if(result.lineItems && result.lineItems.length){
							estimateMainService.addList(result.lineItems);
							estimateMainService.setDynamicQuantityColumns(result.lineItems);
						}
						// lineItemQuantities update
						if(result.lineItemQuantities && result.lineItemQuantities.length){
							quantityService.addList(result.lineItemQuantities);
							quantityService.gridRefresh();
						}
						return result;
					});
			}

			return service;
		}

	]);
})();

(function(){
    'use strict';
	/* global moment, globals, _ */
	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name estimateMainActivityHandlerService
	 * @function
	 *
	 * @description
	 * estimateMainActivityHandlerService - service for handling line item activities ( updates calculations )
	 */
    estimateMainModule.factory('estimateMainActivityHandlerService',
		['$http', '$injector',
			function ($http, $injector,) {

                let service = {
                    handleActivityAssignmentForLineItems: handleActivityAssignmentForLineItems,
				};

				/**
				 *	handleActivityAssignmentForLineItems - Update this To and From dates and Calculate Quantity for Line Items if Activity is assigned and IsDurationQuantityActivity is true
				 */
                 function handleActivityAssignmentForLineItems(entity, value, model) {

					let activityId = (typeof value === 'number') ? value : entity.PsdActivityFk;
					let endpoint = globals.webApiBaseUrl + 'scheduling/main/activity/get?activityId=' + activityId;
					let estimateMainDurationCalculatorService = $injector.get('estimateMainDurationCalculatorService');
					let estimateMainLineItemDetailService = $injector.get('estimateMainLineItemDetailService');
					let estimateMainResourceService = $injector.get('estimateMainResourceService');
				
					return $http.get(endpoint).then(response => {
						let activity = response.data;
				
						if (!activity || !activity.PlannedStart || !activity.PlannedFinish) return;
				
						// Set dates
						entity.FromDate = moment.utc(activity.PlannedStart);
						entity.ToDate = moment.utc(activity.PlannedFinish);
				
						// Calculate duration
						let itemQty = entity.Quantity;

						return estimateMainDurationCalculatorService.getDuration(entity).then(newQty => {
							if (newQty > 0 && newQty !== itemQty) {
								entity.Quantity = newQty;
								entity.QuantityDetail = newQty.toString();
				
								let resources = estimateMainResourceService.getList();
								estimateMainLineItemDetailService.calcLineItemResNDynamicCol(model, entity, resources);
							}
						});
					});
				}
				return service;
			}
		]
	);
})();
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals, _ */
	'use strict';

	let moduleName = 'estimate.project';
	/**
	 * @ngdoc service
	 * @name estimateProjectEsttypeDialogService
	 * @function
	 *
	 * @description
	 * This is the data service for  details Formula Parameter Items functions.
	 */
	angular.module(moduleName).factory('estimateProjectEstTypeDialogService', ['$q', '$http', '$translate', '$injector', 'PlatformMessenger',  'platformModalService','estimateProjectEstTypeService', 'estimateProjectService',
		function ($q, $http, $translate, $injector, PlatformMessenger, platformModalService, estimateProjectEstTypeService, estimateProjectService) {

			let currentItem = {},
				copyData = {};

			let service = {
				onCurrentItemChanged : new PlatformMessenger()
			};

			service.getCurrentItem = function (){
				return currentItem;
			};

			service.setCurrentItem = function (item){
				currentItem = item;
			};

			service.showDialog = function showDialog(data) {
				copyData = data;
				let options = {
					templateUrl: globals.appBaseUrl + 'estimate.main' + '/templates/details-parameters-dialog/estimate-main-details-param-dialog.html',
					controller: 'estimateProjectEstTypeDialogController',
					width: '250px',
					height: '570px',
					resizeable: true
				};

				estimateProjectEstTypeService.loadData().then(function(list){
					let actType = data.EstHeader.EstTypeFk;
					function getNewEstType (){
						let newEstType = actType;
						if(actType >0){
							let item = _.find(list, {Id: ++actType});
							if(item){
								newEstType = item.Id;
							}
						}
						return newEstType;
					}
					// set params to save for display
					service.setCurrentItem({
						actualEstType: actType,
						newEstType: getNewEstType(),
						IsCopyBudget : false
					});
					platformModalService.showDialog(options);
				});
			};

			service.deepCopy = function(item){
				copyData.NewEstType = item.newEstType;
				copyData.IsCopyBudget = item.IsCopyBudget;
				copyData.IsCopyCostTotalToBudget = item.IsCopyCostTotalToBudget;
				copyData.IsCopyBaseCost = item.IsCopyBaseCost;
				copyData.UpdateControllingStrBudget = (item.IsUpdStrBudget !== undefined) ? item.IsUpdStrBudget : false;
				copyData.DoCalculateRuleParam = item.calcRuleParam;
				copyData.IsDeleteItemAssignment = item.IsDeleteItemAssignment;
				copyData.SetFixUnitPrice = item.SetFixUnitPrice;
				copyData.clearAqQuantityOfOptionalWithIT = item.clearAqQuantityOfOptionalWithIT || false;
				copyData.clearAqQuantityOfOptionalWithoutIT = item.clearAqQuantityOfOptionalWithoutIT || false;
				copyData.changeActiveEstimate = true;
				$http.post(globals.webApiBaseUrl + 'estimate/project/createdeepcopy', copyData)
					.then(function (response) {
						if(copyData.EstimateComplete && response.data.DoChangeActiveEstimate){
							estimateProjectService.load();
						}
						copyData.containerData.handleOnCreateSucceeded(response.data, copyData.containerData);
					},
					function (/* error */) {

					});
			};

			service.inExecutionPhase = function(item){
				if(item && item.newEstType && item.actualEstType){
					const newEstType = estimateProjectEstTypeService.getItemById(item.newEstType);
					const actEstType = estimateProjectEstTypeService.getItemById(item.actualEstType);
					if(newEstType && actEstType && newEstType.Isjob && actEstType.IsBid){
						return true;
					}
				}
				return false;
			};

			return service;
		}
	]);
})();

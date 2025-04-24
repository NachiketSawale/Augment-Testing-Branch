/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals, _ */
	'use strict';

	/**
	 * @ngdoc service
	 * @name projectMaterialPriceConditionService
	 * @description provides data and functions for priceConditionController
	 */
	angular.module('project.material').factory('projectMaterialPriceConditionService',
		['projectMaterialMainService',
			function (materialParentService) {

				let service = {};

				let parameters = {
					baseUrl: 'project/material/pricecondition/',
					parentService: materialParentService,
					itemName: 'PrjMatPrcConditions',
					getRecalculationData: function () {
						return {
							PriceConditionList: service.getList(),
							Material:materialParentService.getSelected()
						};
					}
				};
				parameters.serviceOption = {
					flatLeafItem: {
						httpCreate: {route: globals.webApiBaseUrl + parameters.baseUrl},
						httpRead: {
							route: globals.webApiBaseUrl + parameters.baseUrl,
							usePostForRead: true,
							initReadData: function initReadData(readData) {
								readData.mainItemId = parameters.parentService.getSelected().Id;
							}
						},
						presenter: {
							list: {
								incorporateDataRead: function (readData, data) {

									let items = [];
									if (readData) {
										if (angular.isArray(readData)) {  // from cache
											items = readData;
										} else {
											items = readData.Main;   // from backend
										}
									}

									service.markAllAsModified = function () {
										// let items = data.itemList;
										// service.clearModifications(items.length);
										// for (let i = 0; i < items.length; ++i) {
										// data.markItemAsModified(items[i], data);
										// }
									};

									return data.handleReadSucceeded(items, data);

								},
								initCreationData: function initCreationData(creationData, data) {
									let existingIds = [];
									_.forEach(data.itemList, function (k) {
										existingIds.push(k.PrcPriceConditionTypeFk);
									});
									creationData.ExistingIds = existingIds;
									creationData.ParentId = parameters.parentService.getSelected().Id;
								}
							}
						},
						entityRole: {leaf: {itemName: parameters.itemName, parentService: parameters.parentService}}
					}
				};

				// service = priceConditionFactory.createPriceConditionFactory(parameters);

				/* service.getCalculationResult = function (selectedItem) {
					let conditionId = selectedItem ? selectedItem.Id : materialParentService.getSelected().PrcPriceconditionFk;
					let list = this.getList();

					let priceExtra = _.reduce(_.map(list, function (k) {
						return k.IsPriceComponent ? k.Total : 0;
					}), function (memo, num) {
						return memo + num;
					}, 0);

					return {
						PrcPriceconditionFk: conditionId,
						PriceExtra: priceExtra
					};
				};

				service.getNewPriceConditionFromDetail = function (priceConditionId) {
					let postData = {
						PriceConditionId: priceConditionId,
						Material: materialParentService.getSelected()
					};
					return service.getNewPriceConditions(postData);
				};
*/

				return service;
			}
		]);
})(angular);

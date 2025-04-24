/**
 * Created by joshi on 27.10.2015.
 */
(function () {

	/* global _ */
	'use strict';
	/**
	 * @ngdoc controller
	 * @name boqMainBillToControllerFactory
	 * @function
	 *
	 * @description
	 * Controller factory for the flat grid view of boq bill to items.
	 **/

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('boq.main').factory('boqMainBillToControllerFactory',
		['$injector', 'boqMainBillToDataServiceFactory', 'platformGridControllerService', 'boqMainBillToUIServiceFactory', 'boqMainBillToValidationServiceProvider', 'boqMainBilltoLookupDataService', 'platformRuntimeDataService',
			function ($injector, boqMainBillToDataServiceFactory, platformGridControllerService, boqMainBillToUIServiceFactory, boqMainBillToValidationServiceProvider, boqMainBilltoLookupDataService, platformRuntimeDataService) {

				var service = {};

				/**
				 * @ngdoc function
				 * @name initController
				 * @function
				 * @methodOf boqMainBillToDataServiceFactory
				 * @description This function handles the initialization of the specification controller in whose context it is called
				 */
				service.initController = function initController($scope, boqMainService, serviceKey) {

					var boqMainBillToDataService = boqMainBillToDataServiceFactory.getService(boqMainService, serviceKey);
					var boqMainBillToValidationService = boqMainBillToValidationServiceProvider.getInstance(boqMainBillToDataService);
					var platformGridAPI = $injector.get('platformGridAPI');

					var myGridConfig = {
						initCalled: false,
						columns: [],
						cellChangeCallBack: function cellChangeCallBack(arg) {
							var col = arg.grid.getColumns()[arg.cell].field;
							var item = arg.item;
							var foundPrjBillToItem = null;
							if (col === 'PrjBillToId') {
								var prjBillToList = boqMainBilltoLookupDataService.getListSync();

								if (!_.isEmpty(prjBillToList)) {
									foundPrjBillToItem = _.find(prjBillToList, function (prjBillToItem) {
										return prjBillToItem.Id === item.PrjBillToId;
									});

									if (_.isObject(foundPrjBillToItem)) {
										item.Code = foundPrjBillToItem.Code;
										item.Description = foundPrjBillToItem.Description;
										item.Comment = foundPrjBillToItem.Comment;
										item.Remark = foundPrjBillToItem.Remark;
										item.BusinesspartnerFk = foundPrjBillToItem.BusinessPartnerFk;
										item.CustomerFk = foundPrjBillToItem.CustomerFk;
										item.SubsidiaryFk = foundPrjBillToItem.SubsidiaryFk;
										item.QuantityPortion = foundPrjBillToItem.QuantityPortion;
									}
								}
							}
							else if (col === 'QuantityPortion') {
								boqMainBillToDataService.calculateTotalQuantity(boqMainBillToDataService.getList());
							}

							boqMainBillToDataService.processBillToItem(item);

							var validationResult = boqMainBillToValidationService.validatePrjBillToId(item, item.PrjBillToId, 'PrjBillToId');
							platformRuntimeDataService.applyValidationResult(validationResult, item, 'PrjBillToId');
							validationResult = boqMainBillToValidationService.validateCode(item, item.Code, 'Code');
							platformRuntimeDataService.applyValidationResult(validationResult, item, 'Code');
							validationResult = boqMainBillToValidationService.validateBusinesspartnerFk(item, item.BusinesspartnerFk, 'BusinesspartnerFk');
							platformRuntimeDataService.applyValidationResult(validationResult, item, 'BusinesspartnerFk');
						}
					};

					var uiService = boqMainBillToUIServiceFactory.createUIService({currentBoqMainBillToDataService: boqMainBillToDataService});
					platformGridControllerService.initListController($scope, uiService, boqMainBillToDataService, boqMainBillToValidationService, myGridConfig);

					$injector.get('boqMainOenService').tryDisableContainer($scope, boqMainService, true);

					function adjustGridColumns() {
						let billToModes = $injector.get('billToModes');
						if (boqMainService.getCurrentBillToMode() === billToModes.quantityOrItemBased ) {
							let gridColumns = platformGridAPI.columns.getColumns($scope.gridId);

							if (!gridColumns) {
								return;
							}

							if(_.isObject(_.find(gridColumns, function(columnDef) {
								return columnDef.field === 'QuantityPortion' || columnDef.field === 'TotalQuantity';
							}))) {
								_.remove(gridColumns, {'field':'QuantityPortion'});
								_.remove(gridColumns, {'field':'TotalQuantity'});

								platformGridAPI.columns.configuration($scope.gridId, gridColumns);
								platformGridAPI.grids.refresh(        $scope.gridId);
								platformGridAPI.grids.invalidate(     $scope.gridId);
							}
						}
					}

					platformGridAPI.events.register($scope.gridId, 'onInitialized', adjustGridColumns);
					boqMainService.selectedBoqHeaderChanged.register(adjustGridColumns);

					$scope.$on('$destroy', function () {
						platformGridAPI.events.unregister($scope.gridId, 'onInitialized', adjustGridColumns);
						boqMainService.selectedBoqHeaderChanged.unregister(adjustGridColumns);
					});
				};

				return service;
			}
		]);
})();

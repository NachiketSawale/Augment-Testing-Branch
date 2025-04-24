/**
 * Created by zov on 7/26/2019.
 */
(function () {
	'use strict';
	/* global angular, globals, _ */

	var moduleName = 'productionplanning.product';
	angular.module(moduleName).factory('productionplanningProductWizardService', PPSProductWizardService);
	PPSProductWizardService.$inject = ['basicsCommonChangeStatusService',
		'productionplanningProductMainService',
		'platformSidebarWizardCommonTasksService',
		'platformSidebarWizardConfigService',
		'$http',
		'$translate',
		'$q',
		'platformModalService',
		'productionplanningProductReuseFromStockWizardHandler',
		'ppsBillingDataOfProductAndMaterialSelectionWizardHandler',
		'productPhaseRequirementDataService'];

	function PPSProductWizardService(basicsCommonChangeStatusService,
	                                 productionplanningProductMainService,
	                                 platformSidebarWizardCommonTasksService,
	                                 platformSidebarWizardConfigService,
	                                 $http,
	                                 $translate,
	                                 $q,
	                                 platformModalService,
												productionplanningProductReuseFromStockWizardHandler,
												ppsBillingDataOfProductAndMaterialSelectionWizardHandler,
												productPhaseRequirementDataService) {
		var service = {};
		var wizardID = 'productionplanningProductSidebarWizards';
		var wizardConfig = {
			showImages: true,
			showTitles: true,
			showSelected: true,
			cssClass: 'sidebarWizard'
		};

		service.activate = function activate() {
			platformSidebarWizardConfigService.activateConfig(wizardID, wizardConfig);
		};

		service.changeProductStatus = basicsCommonChangeStatusService.provideStatusChangeInstance(
			{
				statusName: 'ppsproduct',
				mainService: productionplanningProductMainService,
				refreshMainService: true,
				statusField: 'ProductStatusFk',
				statusDisplayField: 'DescriptionInfo.Translated',
				title: 'productionplanning.product.wizard.changeProductStatusTitle',
				updateUrl: 'productionplanning/common/wizard/changeproductstatus',
				supportMultiChange: true
			}
		).fn;

		service.enableProduct = platformSidebarWizardCommonTasksService.provideEnableInstance(
			productionplanningProductMainService,
			'enableProduct',
			'productionplanning.common.product.wizard.enableProduct',
			'Code',
			'productionplanning.common.product.wizard.enableProductDone',
			'productionplanning.common.product.wizard.productAlreadyEnabled',
			'product',
			20).fn;

		service.disableProduct = platformSidebarWizardCommonTasksService.provideDisableInstance(
			productionplanningProductMainService,
			'disableProduct',
			'productionplanning.common.product.wizard.disableProduct',
			'Code',
			'productionplanning.common.product.wizard.disableProductDone',
			'productionplanning.common.product.wizard.productAlreadyDisabled',
			'product',
			21).fn;

		service.changeProductPhaseRequirementStatus = basicsCommonChangeStatusService.provideStatusChangeInstance(
			{
				statusName: 'ppsphaserequirement',
				mainService: productionplanningProductMainService,
				dataService: productPhaseRequirementDataService,
				refreshMainService: false,
				statusField: 'PpsPhaseReqStatusFk',
				statusDisplayField: 'DescriptionInfo.Translated',
				title: 'productionplanning.product.wizard.changePhaseReqStatus',
				supportMultiChange: true
			}
		).fn;

		service.dispatchProducts = function (wizParams) {
			var selectedEntities = productionplanningProductMainService.getSelectedEntities();
			var modalOptions = {
				headerText: $translate.instant('productionplanning.product.wizard.createDispatchingNoteTitle'),
				bodyText: '',
				iconClass: 'ico-info'
			};

			var getMessageText = platformSidebarWizardCommonTasksService.prepareMessageText;
			if (selectedEntities && selectedEntities.length > 0) {
				// check wiazrd parameters
				$http.post(globals.webApiBaseUrl + 'transportplanning/transport/route/checkWizardParams4DispatchProduct', wizParams).then(function (response) {
					if (response.data) {
						modalOptions.bodyText = response.data;
						platformModalService.showDialog(modalOptions);
					} else {
						// check status
						var forbidPdtCodes = [];
						var allowedStatus = str2IntArray(wizParams['allowed status'], ',');
						selectedEntities.forEach(function (pdt) {
							if (allowedStatus.indexOf(pdt.ProductStatusFk) < 0) {
								forbidPdtCodes.push(pdt.Code);
							}
						});
						if (forbidPdtCodes.length > 0) {
							// notify forbid to create dispatching note
							modalOptions.bodyText = $translate.instant('productionplanning.product.wizard.notifyForbid2CreateDispNote') + _.join(forbidPdtCodes, ', ');
							platformModalService.showDialog(modalOptions);
						} else {
							modalOptions.bodyText = getMessageText('productionplanning.product.wizard.questionCreateDispNote', selectedEntities, 'Code', 'sel');
							return platformModalService.showYesNoDialog(modalOptions.bodyText, modalOptions.headerText, 'yes')
								.then(function (result) {
									if (result.yes) {
										productionplanningProductMainService.updateAndExecute(function () {
											var productCodes = _.map(selectedEntities, 'Code');
											productionplanningProductMainService.createDispatchingNote(wizParams, selectedEntities)
												.then(function (response) {
													var dispatchHeaderCode = response.data;
													var createHeaderMsg = $translate.instant('productionplanning.product.wizard.notifySucceed2CreateDispHeader') + dispatchHeaderCode + '<br><br><hr><br>';
													var dialogMessages = [];
													changeProductStatusAfterDispatch(selectedEntities, Number(wizParams.ProductStatus2Set))
														.then(function (statusErrMsg) {
															if (statusErrMsg !== '') {
																dialogMessages.push(statusErrMsg);
															} else {
																productCodes.forEach(function (code) {
																	dialogMessages.push($translate.instant('productionplanning.product.wizard.notifySucceed2CreateDispRecord') + code);
																});
															}
															modalOptions.bodyText = createHeaderMsg + _.join(dialogMessages, '<br>');
															platformModalService.showDialog(modalOptions);
														});
												});
										});
									}
								});
						}
					}
				});
			} else {
				modalOptions.bodyText = $translate.instant('productionplanning.product.wizard.notify2SelectProduct');
				return platformModalService.showDialog(modalOptions);
			}
		};

		function changeProductStatusAfterDispatch(products, statusId) {
			var defer = $q.defer();
			if (statusId !== 0) {
				var config = {
					headerText: $translate.instant('productionplanning.product.wizard.changeProductStatusTitle'),
					imageSelector: 'platformStatusIconService',
					isMultipleSelected: false,
					mainService: productionplanningProductMainService,
					refreshMainService: true,
					statusField: 'ProductStatusFk',
					statusName: 'ppsproduct',
					supportMultiChange: true,
					title: 'productionplanning.product.wizard.changeProductStatusTitle',
					updateUrl: 'productionplanning/common/wizard/changeproductstatus'
				};
				var promises = [];
				products.forEach(function (pdt) {
					if (pdt.TrsRteStatusFk !== statusId) {
						var options = _.clone(config);
						_.extend(options, {
							id: pdt.Id,
							entity: pdt,
							entities: [pdt],
							fromStatusId: pdt.ProductStatusFk,
							toStatusId: statusId !== -1 ? statusId : pdt.ProductStatusFk,
							checkAccessRight: false
						});
						promises.push(basicsCommonChangeStatusService.changeStatus(options, ''));
					}
				});
				$q.all(promises).then(function (results) {
					basicsCommonChangeStatusService.afterDoneAll(config, productionplanningProductMainService, results, products);
					var errMsgs = [];
					results.forEach(function (r) {
						if (!_.isNil(r.ErrorMsg)) {
							errMsgs.push(r.ErrorMsg);
						}
					});
					defer.resolve(_.join(errMsgs, '<br>'));
				});
			} else {
				defer.resolve('');
			}
			return defer.promise;
		}

		function str2IntArray(str, splitter) {
			var result = [];
			if (str) {
				var arr = str.split(splitter);
				arr.forEach(function (item) {
					result[result.length] = Number(item);
				});
			}
			return result;
		}

		function showDialog(title, message) {
			var modalOptions = {
				headerText: $translate.instant(title),
				bodyText: message,
				iconClass: 'ico-info'
			};

			return platformModalService.showDialog(modalOptions);
		}

		function validateSelectedProducts(selectedEntities, title) {
			// if no selection, show NoSelection error.
			if (!platformSidebarWizardCommonTasksService.assertSelection(selectedEntities[0], title)) {
				return false;
			}
			// other validation...

			// bundle validation: if a product is linked to a bundle, it cannot be handled alone
			// wizard "bookProductsToStockLocation" in Product module is only for handle single products that are not linked to bundles.
			var hasLinkedToBundle = selectedEntities.some(function (item){
				return !_.isNil(item.TrsProductBundleFk);
			});
			if(hasLinkedToBundle){
				// show error dialog
				showDialog(title,$translate.instant('productionplanning.product.wizard.errorOfHandleProductsThatIsLinkedToBundle'));
				return false;
			}

			return true;
		}

		service.bookProductsToStockLocation = function (wizParam){
			var selectedEntities = _.clone(productionplanningProductMainService.getSelectedEntities());

			var title = $translate.instant('productionplanning.product.wizard.bookStockLocationTitle');
			if (!validateSelectedProducts(selectedEntities, title)) {
				return;
			}

			var filterObj = {
				ProductIds : _.map(selectedEntities,'Id')
			};

			$http.post(globals.webApiBaseUrl+'productionplanning/common/productwithstockinfo/list',filterObj).then(function (response){
				function showDialog(productWithStoctInfoArray){
					var modalCreateConfig = {
						width: '960px',
						resizeable: true,
						templateUrl: globals.appBaseUrl + 'productionplanning.product/templates/pps-product-book-stock-location-wizard-dialog.html',
						controller: 'productionplanningProductBookStockLocationWizardController',
						resolve: {
							'$options': function () {
								return {
									products:productWithStoctInfoArray,
									wizardParas:wizParam,
									productService: productionplanningProductMainService
								};
							}
						}
					};
					platformModalService.showDialog(modalCreateConfig);
				}

				if(response.data){
					showDialog(response.data);
				}
			});
		};

		service.reuseProductFromStock = function (wizParam) {
			productionplanningProductMainService.update().then(() => {
				productionplanningProductReuseFromStockWizardHandler.reuseProductFromStock(productionplanningProductMainService, wizParam);
			});
		};

		service.doBillingDataProductAndMaterialSelection = function () {
			ppsBillingDataOfProductAndMaterialSelectionWizardHandler.showDialogForProduct(productionplanningProductMainService);
		};

		return service;
	}

})();
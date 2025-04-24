(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_,$ */

	var moduleName = 'procurement.package';
	/**
	 * Service of wizard 'create requistion' dialog controller of module 'procurement.package'.
	 */
	angular.module(moduleName).factory('procurementPackageWizardCreateRequisitionService', [
		'$http',
		'$sce',
		'$q',
		'$translate',
		'$rootScope',
		'$injector',
		'$state',
		'$timeout',
		'cloudDesktopSidebarService',
		'platformModalService',
		'basicsLookupdataLookupDescriptorService',
		'procurementPackageDataService',
		'procurementPackagePackage2HeaderService',
		'projectChangeLookupDataService',
		'basicsLookupdataLookupDataService',
		'platformDialogService',
		'basicsWorkflowWizardContextService',
		function (
			$http,
			$sce,
			$q,
			$translate,
			$rootScope,
			$injector,
			$state,
			$timeout,
			cloudDesktopSidebarService,
			platformModalService,
			lookupDescriptorService,
			packageDataService,
			subPackageDataService,
			changeLookupDataService,
			basicsLookupdataLookupDataService,
			platformDialogService,
			basicsWorkflowWizardContextService
		) {
			var prefix = 'procurement.package.wizard.createRequisition.';
			var service = {
				scope: null,
				selectedSubPackage: null,
				selectedPackage: null,
				execute: execute,
				initData: initData,
				showInfo: showInfo,
				showCreateRequisitionInfoDialog: showCreateRequisitionInfoDialog,
				overwriteRequisition: overwriteRequisition,
				createChangeOrderRequisition: createChangeOrderRequisition,
				createNewBaseRequisition: createNewBaseRequisition,
				createChangeOrderFromContract: createChangeOrderFromContract,
				showNavigationPage: showNavigationPage,
				requestDataFail: requestDataFail,
				basecontract: basecontract,
				selectedButtonReadonly: selectedButtonReadonly
			};

			function selectedButtonReadonly() {
				return service.scope.modalOptions.reqType !== 'createChangeOrder';
			}

			function execute(params) {
				var modalOptions = {
					headerTextKey: 'cloud.common.informationDialogHeader',
					bodyTextKey: 'procurement.package.wizard.createRequisition.noPackageHeader',
					showCancelButton: true,
					iconClass: 'ico-info'
				};
				const selectedPackage = params.isTriggeredByWorkflow ? basicsWorkflowWizardContextService.getContext().entity : packageDataService.getSelected();
				// no package selected
				if (!selectedPackage || !(selectedPackage.Id)) {
					return platformModalService.showDialog(modalOptions);
				}
				service.selectedPackage = selectedPackage;
				// no subPackages
				var subPackages = subPackageDataService.getList();
				let selectSubPackage = null;
				getSubPackage(selectedPackage.Id).then(function (result) {
					if (result.data && result.data.length > 0) {
						selectSubPackage = result.data[0];
						var pageState = {
							PageNumber: 0,
							PageSize: 1000
						};
						var prjChangeRequest = {
							AdditionalParameters: {
								ProjectFk: selectedPackage.ProjectFk,
								IsProcurement: true
							},
							FilterKey: 'project-change-lookup-for-procurement-common-filter',
							PageState: pageState
						};
						basicsLookupdataLookupDataService.getSearchList('ProjectChange', prjChangeRequest).then(function (result) {
							// changeLookupDataService.setFilter(selectedPackage.ProjectFk);
							// var options = {
							// dataServiceName: 'projectChangeLookupDataService'
							// };
							// changeLookupDataService.getList(options).then(function (data) {
							var data = result && result.items;
							var defaultChange = null;
							if (!!data && data.length === 1) {
								defaultChange = data[0];
							}
							service.selectedSubPackage = subPackageDataService.getSelected() ?? selectSubPackage;
							let request = {
								MainItemIds: service.selectedSubPackage ? [service.selectedSubPackage.PrcHeaderFk] : [],
								ModuleName: 'procurement.package'
							};
							$http.post(globals.webApiBaseUrl + 'procurement/common/wizard/hascontracteddata', request)
								.then(function (response) {
									let hasContractItem = response ? response.data : false;
									platformModalService.showDialog({
										templateUrl: globals.appBaseUrl + 'procurement.package/partials/create-requisition-wizard.html',
										width: '960px',
										height: 'auto',
										resizeable: true,
										defaultChange: defaultChange,
										hasContractItem: hasContractItem,
										resultPromise: params.isTriggeredByWorkflow ? params.resultPromise : null
									});
								});
						});
					} else {
						modalOptions.bodyTextKey = 'procurement.package.wizard.createRequisition.noPackage2Header';
						return platformModalService.showDialog(modalOptions).then(function () {
							params.resultPromise.resolve({cancel: false});
						});
					}
				});
			}

			function getSubPackage(selectedPackageId) {
				return $http.get(globals.webApiBaseUrl + 'procurement/package/prcpackage2header/getSubPackage', {params: {prcPackage: selectedPackageId}})
			}

			function hasData(subPackageId) {
				return $http.post(globals.webApiBaseUrl + 'procurement/package/wizard/hasdata', {subPackageId: subPackageId});
			}

			function hasContract(subPackageId) {
				return $http.get(globals.webApiBaseUrl + 'procurement/contract/header/hascontract?subPackageId=' + subPackageId);
			}

			function basecontract(subPackageId) {
				return $http.get(globals.webApiBaseUrl + 'procurement/contract/header/basecontract?subPackageId=' + subPackageId);
			}

			function checkBoqInOtherPkg(pkgId, pkgCode) {
				return $http.get(globals.webApiBaseUrl + 'procurement/contract/header/checkboqinotherpkg?packageid=' + pkgId + '&packagecode=' + pkgCode);
			}

			/* function getBaseRequistion(reqHeaderId) {
				return $http.get(globals.webApiBaseUrl + 'procurement/requisition/requisition/getreqheader?id=' + reqHeaderId);
			}

			function createRequisitionNoReqHeader(subPackageId) {
				return $http.get(globals.webApiBaseUrl + 'procurement/package/wizard/createrequisition?package2HeaderId=' + subPackageId);
			} */

			function overwriteRequisition(subPackageId, doesCopyHeaderTextFromPackage) {
				var param = 'package2HeaderId=' + subPackageId + '&doesCopyHeaderTextFromPackage=' + doesCopyHeaderTextFromPackage;
				return $http.get(globals.webApiBaseUrl + 'procurement/package/wizard/overwriterequisition?' + param);
			}

			function createChangeOrderRequisition(subPackageId, reqHeaderId, projectChangeId, isCreateWithNoDifference, doesCopyHeaderTextFromPackage) {
				var param = 'package2HeaderId=' + subPackageId + '&reqHeaderId=' + reqHeaderId + '&projectChangeId=' + projectChangeId + '&doesCopyHeaderTextFromPackage=' + doesCopyHeaderTextFromPackage + '&isCreateWithNoDifference=' + isCreateWithNoDifference;
				return $http.get(globals.webApiBaseUrl + 'procurement/package/wizard/changeorderrequisition?' + param);
			}

			function createNewBaseRequisition(subPackageId) {
				var param = 'package2HeaderId=' + subPackageId;
				return $http.get(globals.webApiBaseUrl + 'procurement/package/wizard/newbaserequisition?' + param);
			}

			function createChangeOrderFromContract(subPackageId, projectChangeId, contractId, baseReqId) {
				var requisitionId = (!baseReqId || baseReqId <= 0) ? null : baseReqId;
				var param = 'package2HeaderId=' + subPackageId + '&projectChangeId=' + projectChangeId + '&contractId=' + contractId + '&baseReqId=' + requisitionId;
				return $http.get(globals.webApiBaseUrl + 'procurement/package/wizard/changeorderFromContract?' + param);
			}

			function getCreatedRequisition(requisitionId) {
				return $http.get(globals.webApiBaseUrl + 'procurement/requisition/requisition/getitembyId?id=' + requisitionId);
			}

			function createRequisition(resultPromiseFromScope) {
				$http.get(globals.webApiBaseUrl + 'procurement/package/wizard/createrequisition?package2HeaderId=' + service.selectedSubPackage.Id).then(function (response) {
					packageDataService.load();
					if (resultPromiseFromScope) {
						basicsWorkflowWizardContextService.setResult(response.data);
						resultPromiseFromScope.resolve();
					}
					service.scope.modalOptions.requisitionEntity = response.data.RequsitionId;
					service.showNavigationPage(response.data.RequsitionId, false);
					service.scope.modalOptions.isBtnNavigateDisabled = false;
					service.scope.modalOptions.isBtnNextDisabled = true;

					service.scope.modalOptions.dialogLoading = false;
				}, function (error) {

					service.scope.modalOptions.dialogLoading = false;
					service.requestDataFail(error);
				});
			}

			function showCreateRequisitionInfoDialog(hasContractItem, needJudgeContractedItem, resultPromiseFromScope) {
				$http.get(globals.webApiBaseUrl + 'procurement/requisition/requisition/getcreatereqtype?subPackageId=' + service.selectedSubPackage.Id).then(function (response) {

					if (response.data.type === 'FirstTime') {
						if (needJudgeContractedItem) {
							if (hasContractItem) {
								let modalOptions = {
									headerText: $translate.instant('procurement.package.wizard.createRequisition.caption'),
									bodyText: $translate.instant('procurement.common.wizard.IsContractNote'),
									showYesButton: true,
									showNoButton: true,
									iconClass: 'ico-info',
									id: $injector.get('procurementContextService').showDialogTemp.isContractNoteDialogId,
									dontShowAgain: true
								};
								$injector.get('procurementContextService').showDialogAndAgain(modalOptions).then(function (result) {
									if (result.yes) {
										createRequisition(resultPromiseFromScope);
									}
								}, function () {
									service.scope.modalOptions.dialogLoading = false;
									service.scope.modalOptions.onClose();
								});
							} else {
								createRequisition(resultPromiseFromScope);
							}
						} else {
							createRequisition(resultPromiseFromScope);
						}
					} else {
						service.scope.modalOptions.reqType = response.data.type;
						service.scope.modalOptions.step = 'step2';
						// get and set data for requisition dialog grid
						var dataService = $injector.get('procurementPackageCreateRequisitionWizardRequisitionService');
						dataService.setList(response.data.list);
						service.scope.modalOptions.overwriteReq = true;

						service.scope.modalOptions.setchangeItem(service.scope.modalOptions.changeOrder.changeItemEnum.changeReq);
						service.scope.modalOptions.changeOrder.overwriteDisabled = true;
						service.scope.modalOptions.changeOrder.selectedBtnRadioValue = 'changeOrderRequisition';
						service.scope.modalOptions.dialogLoading = false;
					}
				});
			}

			service.setDataForCreateRequisition = function setDataForCreateRequisition(subPackageId, hasContractItem, pkg, resultPromiseFromScope) {
				// showInfo(false, '', 0);
				$q.all([hasData(subPackageId), basecontract(subPackageId), checkBoqInOtherPkg(pkg.Id, pkg.Code)]).then(function (responses) {
					// show warning when sub-package has no prcItems and Boqs
					if ((responses[0] && !responses[0].data) || (responses[2] && responses[2].data)) {
						service.scope.modalOptions.step = 'step1';
						showInfo(true, $translate.instant('procurement.package.wizard.noDataInSubPackage'), 2);
						service.scope.modalOptions.isBtnNavigateDisabled = true;
						service.scope.modalOptions.isBtnOKDisabled = false;
						service.scope.modalOptions.dialogLoading = false;
					}
					// can't allow create requisition if subPackage has contracts.
					if (responses[1] && responses[1].data) {
						service.scope.modalOptions.dialogLoading = false;
						if (responses[1].data.ConStatus) {
							if (!responses[1].data.ConStatus.IsOrdered) {
								service.scope.modalOptions.step = 'step4';
								showInfo(true, $translate.instant('procurement.package.wizard.hasExistingContractInfo'), 4);
							} else {
								var comparePackageWithContractChangedItemService = $injector.get('procurementComparePackageWithContractChangedItemService');
								comparePackageWithContractChangedItemService.load().then(function () {
									var responseData = comparePackageWithContractChangedItemService.getList();
									if (responseData === null || responseData.length === 0) {
										service.scope.modalOptions.step = 'step1';
										service.scope.modalOptions.dialogLoading = true;
										var msg = $translate.instant('procurement.package.wizard.createRequisition.noDifferenceFound');
										if (hasContractItem) {
											var iscontractItemMsg = $translate.instant('procurement.common.wizard.IsContractNote');
											msg = msg + '<br/>' + iscontractItemMsg;
										}
										showInfo(true, msg, 1);
										service.scope.modalOptions.isBtnNextDisabled = false;
										service.scope.modalOptions.dialogLoading = false;
									} else {
										service.scope.modalOptions.reqType = 'createNewBase';
										service.scope.modalOptions.step = 'step2';
										service.scope.modalOptions.setchangeItem(service.scope.modalOptions.changeOrder.changeItemEnum.contract);
										service.scope.modalOptions.changeOrder.overwriteDisabled = true;
										service.scope.modalOptions.changeOrder.selectedBtnRadioValue = 'changeOrderRequisition';
										service.scope.modalOptions.changeOrder.isOrderStatus = true;
									}
								});
							}
						}
						// showInfo(true, $translate.instant('procurement.package.wizard.hasExistingContract'), 3);
					} else {
						service.scope.modalOptions.isBtnNextDisabled = false;
						if (!(responses[0] && !responses[0].data)) {
							showCreateRequisitionInfoDialog(hasContractItem, true,resultPromiseFromScope);
						}
					}
				});
			};

			function initData(subPackageId) {
				showInfo(false, '', 0);
				$q.all([hasData(subPackageId), hasContract(subPackageId)]).then(function (responses) {
					// show warning when sub-package has no prcItems and Boqs
					if (responses[0] && !responses[0].data) {
						showInfo(true, $translate.instant('procurement.package.wizard.noDataInSubPackage'), 2);
						service.scope.modalOptions.dialogLoading = false;
					}
					// can't allow create requisition if subPackage has contracts.
					if (responses[1] && responses[1].data) {
						showInfo(true, $translate.instant('procurement.package.wizard.hasExistingContractInfo'), 3);
						service.scope.modalOptions.isBtnNextDisabled = true;
					} else {
						service.scope.modalOptions.isBtnNextDisabled = false;
					}
				});
			}

			function showNavigationPage(requisitionId, isChangeOrder) {
				var successMessage;
				var code;
				service.scope.trustAsHtml = $sce.trustAsHtml;
				if (requisitionId > -1) {
					if (!isChangeOrder) {
						subPackageDataService.load(); // update subpackage container data (ReqHeaderFk).
					}
					successMessage = $translate.instant(prefix + 'createReqSucceed');
					if (isChangeOrder) {
						successMessage = service.scope.modalOptions.reqType === 'createNewBase' ?
							$translate.instant(prefix + 'changeNewBaseSuccessfully') :
							$translate.instant(prefix + 'createChangeReqSuccessfully');
					}

					getCreatedRequisition(requisitionId).then(function (response) {
						if (response && response.data) {
							// code = response.data.Code + $translate.instant(prefix + 'for') + response.data.Description + $translate.instant(prefix + 'is') + response.data.ReqStatus.DescriptionInfo.Translated;
							code = $translate.instant(prefix + 'newCode',{newCode: response.data.Code});
							$($('#requisitionDIV').parent()).css('margin', '0 auto').css('width', '600px');
							service.showInfo(true, successMessage + '<br />' + code, 0, true);
						}
					});
					if (service.scope) {
						service.scope.modalOptions.isBtnPreviousDisabled = true;
						service.scope.modalOptions.isBtnOKDisabled = true;
						service.scope.modalOptions.step = 'step3';
						service.scope.modalOptions.changeOrder.showBtnNext = false;
					}

					/* Throw workflow event that is needed to execute a workflow
					 after the running of the createRequisitionWizard.
					 The Definition of the event can be found in the workflow module in the
					 file: basics-workflow-module.js.
					 This solution is temporary!
					 */
					$rootScope.$emit('28CDA93065E341D6BB793F282C2A62DF', {requisitionId: requisitionId});
				} else {
					successMessage = '<p>' + $translate.instant(prefix + 'noDifferenceFound') + '</p>';
					var projectChangeId = service.scope.projectChange.Id;

					// keep subPackageId when dialog closed.
					var subPakcageId = service.selectedSubPackage.Id;
					service.scope.modalOptions.onClose();

					platformDialogService.showDialog({
						headerText: $translate.instant('cloud.common.informationDialogHeader'),
						bodyText: successMessage,
						showOkButton: true,
						showCancelButton: true, // should close the previous dialog when click 'cancel'.
						iconClass: 'ico-info'
					}).then(function () {
						createChangeOrderRequisition(subPakcageId, projectChangeId, true).then(function (response) {
							showNavigationPage(response.data, true);
						}, function (error) {
							requestDataFail();
						});
					});
				}

				/* Throw workflow event that is needed to execute a workflow
				 after the running of the createRequisitionWizard.
				 The Definition of the event can be found in the workflow module in the
				 file: basics-workflow-module.js.
				 This solution is temporary!
				 */
				// $rootScope.$emit('28CDA93065E341D6BB793F282C2A62DF', {requisitionId: requisitionId});
			}

			function requestDataFail() {
				showInfo(true, $translate.instant(prefix + 'createFailed'), 3);
				service.scope.modalOptions.dialogLoading = false;
				service.scope.modalOptions.onClose();
			}

			/**
			 * @ngdoc function
			 * @param {bool} isShow (true: show, false: hidden)
			 * @param {string} message
			 * @param {number} type (0: success; 1: info; 2: warning; 3: error)
			 */
			function showInfo(isShow, message, type, req = false) {
				service.scope.error = {
					show: isShow,
					messageCol: 1,
					message: message,
					type: type,
					showReq: req
				};
			}

			return service;
		}
	]);

	/**
	 * data service for SubPackage grid of wizard 'create requisition' dialog' in module 'procurement.package'.
	 */
	angular.module(moduleName).factory('procurementPackageCreateRequisitionWizardSubPackageService', [
		'platformDataServiceFactory', 'procurementPackagePackage2HeaderService',
		function (platformDataServiceFactory, subPackageDataService) {

			var serviceOption = {
				module: angular.module(moduleName),
				serviceName: 'procurementPackageCreateRequisitionWizardSubPackageService',
				httpRead: {
					useLocalResource: true,
					resourceFunction: function () {
						var items = angular.copy(subPackageDataService.getList());
						_.each(items, function (item) {
							item.package2HeaderId = false;  // add new property for checkbox column.
						});

						return items;
					}
				},
				presenter: {list: {}},
				entitySelection: {}
			};

			var container = platformDataServiceFactory.createNewComplete(serviceOption);
			var service = container.service;

			// avoid console error: service.parentService() is not a function
			container.data.markItemAsModified = function () {
			};
			service.markItemAsModified = function () {
			};

			return service;
		}
	]);

	/**
	 * data service for Requisition grid of wizard 'create requisition' dialog' in module 'procurement.package'.
	 */
	angular.module(moduleName).factory('procurementPackageCreateRequisitionWizardRequisitionService', [
		'platformDataServiceFactory',
		function (platformDataServiceFactory) {

			var serviceOption = {
				module: angular.module(moduleName),
				serviceName: 'procurementPackageCreateRequisitionWizardRequisitionService',
				httpRead: {
					useLocalResource: true,
					resourceFunction: function () {
						return [];
					}
				},
				presenter: {list: {}},
				entitySelection: {},
				modification: {}
			};

			var container = platformDataServiceFactory.createNewComplete(serviceOption);
			var service = container.service;

			// avoid console error: service.parentService() is not a function
			container.data.markItemAsModified = function () {
			};
			service.markItemAsModified = function () {
			};

			return service;
		}
	]);

	/**
	 * data service for package wizard 'create contract' changed item controller.
	 */
	angular.module(moduleName).factory('procurementPackageCreateRequisitionChangedItemService', [
		'$translate', 'platformDataServiceFactory',
		'procurementPackagePackage2HeaderService', 'procurementPackageWizardCreateRequisitionService',
		function ($translate, platformDataServiceFactory, subPackageDataService, PackageWizardCreateRequisitionService) {
			// keep subPackageId when dialog closed.
			var serviceOption = {
				module: angular.module(moduleName),
				serviceName: 'procurementPackageCreateRequisitionChangedItemService',
				httpRead: {
					route: globals.webApiBaseUrl + 'requisition/requisition/wizard/',
					endRead: 'getpackagechangeditems',
					usePostForRead: false,
					initReadData: function initReadData(readData) {
						readData.filter = '?package2HeaderId=' + subPackageDataService.getIfSelectedIdElse(-1);
					}
				},
				presenter: {
					list: {
						incorporateDataRead: function (readData, data) {
							if (_.isEmpty(readData)) {
								var msg = $translate.instant('procurement.package.wizard.createRequisition.noDifferenceFound');
								PackageWizardCreateRequisitionService.showInfo(true, msg, 1);
							}
							return data.handleReadSucceeded(readData, data, true);
						}
					}
				},
				entitySelection: {}
			};

			var container = platformDataServiceFactory.createNewComplete(serviceOption);

			// avoid console error: service.parentService() is not a function
			container.data.markItemAsModified = function () {
			};
			container.service.markItemAsModified = function () {
			};

			return container.service;
		}
	]);
	/**
	 * data service for package wizard 'create contract' changed item controller.
	 */
	angular.module(moduleName).factory('procurementComparePackageWithContractChangedItemService', [
		'$translate', 'platformDataServiceFactory',
		'procurementPackagePackage2HeaderService', 'procurementPackageWizardCreateRequisitionService',
		function ($translate, platformDataServiceFactory, subPackageDataService, PackageWizardCreateRequisitionService) {
			// keep subPackageId when dialog closed.
			var serviceOption = {
				module: angular.module(moduleName),
				serviceName: 'procurementComparePackageWithContractChangedItemService',
				httpRead: {
					route: globals.webApiBaseUrl + 'procurement/contract/wizard/',
					endRead: 'getpackagechangeditems',
					usePostForRead: false,
					initReadData: function initReadData(readData) {
						readData.filter = '?subPackageId=' + subPackageDataService.getIfSelectedIdElse(-1);
					}
				},
				presenter: {
					list: {
						incorporateDataRead: function (readData, data) {
							if (PackageWizardCreateRequisitionService.scope.modalOptions.changeOrder.overwriteDisabled && _.isEmpty(readData)) {
								var msg = $translate.instant('procurement.package.wizard.createRequisition.noDifferenceFound');
								PackageWizardCreateRequisitionService.showInfo(true, msg, 1);
							}
							return data.handleReadSucceeded(readData, data, true);
						}
					}
				},
				entitySelection: {}
			};

			var container = platformDataServiceFactory.createNewComplete(serviceOption);

			// avoid console error: service.parentService() is not a function
			container.data.markItemAsModified = function () {
			};
			container.service.markItemAsModified = function () {
			};

			return container.service;
		}
	]);

	/**
	 * data service for package wizard 'base req ' changed item controller.
	 */
	angular.module(moduleName).factory('procurementBaseRequisitionService', [
		'$translate',
		'platformDataServiceFactory',
		'platformRuntimeDataService',
		'procurementPackagePackage2HeaderService',
		function ($translate,
			platformDataServiceFactory,
			platformRuntimeDataService,
			subPackageDataService) {
			// keep subPackageId when dialog closed.
			var serviceOption = {
				module: angular.module(moduleName),
				serviceName: 'procurementComparePackageWithContractChangedItemService',
				httpRead: {
					route: globals.webApiBaseUrl + 'procurement/requisition/requisition/',
					endRead: 'getbasereqs',
					usePostForRead: false,
					initReadData: function initReadData(readData) {
						readData.filter = '?subPackageId=' + subPackageDataService.getIfSelectedIdElse(-1);
					}
				},
				presenter: {
					list: {
						incorporateDataRead: function (readData, data) {
							_.forEach(readData, function (item) {
								platformRuntimeDataService.readonly(item, [{
									field: 'Selected',
									readonly: true
								}]);
							});
							return data.handleReadSucceeded(readData, data, true);
						}
					}
				},
				entitySelection: {}
			};

			var container = platformDataServiceFactory.createNewComplete(serviceOption);

			// avoid console error: service.parentService() is not a function
			container.data.markItemAsModified = function () {
			};
			container.service.markItemAsModified = function () {
			};

			return container.service;
		}
	]);
})(angular);
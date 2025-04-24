/**
 * Created by lja on 03/23/2015.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.rfq';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	angular.module(moduleName).factory('procurementRfqBusinessPartnerWizardMainService',
		['platformModalService', '$http', '$q', '$injector', 'procurementRfqMainService','procurementRfqRequisitionService',
			function (platformModalService, $http, $q, $injector, procurementRfqMainService,procurementRfqRequisitionService) {

				// http service
				var httpService = {};
				var url = globals.webApiBaseUrl + 'procurement/rfq/businesspartner/';
				var urlFindbidder = globals.webApiBaseUrl + 'procurement/rfq/wizard/';

				httpService.createRfqBusinessPartner = function (rfqHeaderId, businessPartnerList, checkBpMapContact, checkBpMapSubsidiary) {
					return $http.post(url + 'createrfqbusinesspartner', {
							MainItemId: rfqHeaderId,
						businessPartnerList: businessPartnerList,
						bpMapContactDic: checkBpMapContact,
						bpMapSubsidiaryDic: checkBpMapSubsidiary
					}
					);
				};

				httpService.getStructureCodes = function (rfqHeaderId) {
					return $http.get(urlFindbidder + 'getstructurecode?rfqHeaderId=' + rfqHeaderId);
				};


				httpService.findBidder = function (findBidderDto) {
					return $http.post(urlFindbidder + 'list', findBidderDto);
				};

				httpService.getDefaultAddress = function (reqHeaderId) {
					return $http.get(globals.webApiBaseUrl + 'procurement/requisition/requisition/getaddressbyreqheader?reqHeaderId=' + reqHeaderId);
				};

				httpService.getEvaluationSchema = function (structureIds) {
					return $http.post(globals.webApiBaseUrl + 'businesspartner/evaluationschema/listByStructureIds', structureIds);
				};

				// data service
				var service = {};

				service.getStructureCodes = function (rfqHeaderId) {
					var defer = $q.defer();
					httpService.getStructureCodes(rfqHeaderId).then(function (response) {
						defer.resolve(response.data);
					});
					return defer.promise;
				};

				service.getDefaultAddress = function (reqHeaderId) {
					var defer = $q.defer();
					httpService.getDefaultAddress(reqHeaderId).then(function (response) {
						defer.resolve(response.data);
					});
					return defer.promise;
				};

				service.execute = function () {
					var headerId = -1;

					var header = procurementRfqMainService.getSelected();
					if (header) {
						if (header.Version === 0) {
							return false; // header not saved.
						} else if (header.Version > 0) {
							headerId = header.Id;
						}
					}

					if (headerId === -1) {
						var modalOptions = {
							headerTextKey: 'cloud.common.informationDialogHeader',
							bodyTextKey: 'procurement.rfq.wizard.businessPartner.noReqHeader',
							showOkButton: true,
							iconClass: 'ico-info'
						};
						platformModalService.showDialog(modalOptions);
						return;
					}

					header.bpPrcHeaderEntity = undefined;
					var requisitionList = procurementRfqRequisitionService.getList();
					if (requisitionList.length > 0) {
						header.bpPrcHeaderEntity = requisitionList[0].PrcHeaderEntity;
					}
					service.getBidder(headerId).then(function (response) {
						const bidders = response.data.Main;
						platformModalService.showDialog({
							templateUrl: globals.appBaseUrl + 'businesspartner.main/templates/filter-business-partner-dialog.html',
							backdrop: false,
							resizeable: true,
							width: 'max',
							height: 'max',
							minHeight: '585px',
							IsWizardForFindBidder: true,
							approvalBPRequired: true,
							mainData: header,
							bidderData: bidders,
							id: '000af9b0abd14af8b594f45800ae99de',
							refreshBidderContainer: function () {
								$injector.get('procurementRfqBusinessPartnerService').load();
							},
							onReturnButtonPress: function () {
							}
						});
					});
				};


				service.createRfqBusinessPartner = function (rfqHeaderId, businessPartnerList, checkBpMapContact, checkBpMapSubsidiary) {
					var defer = $q.defer();
					httpService.createRfqBusinessPartner(rfqHeaderId, businessPartnerList, checkBpMapContact, checkBpMapSubsidiary)
						.then(function (response) {
							defer.resolve(response.data);
						}, function (error) {
							defer.reject(error);
						});
					return defer.promise;
				};

				service.getEvaluationSchema = function (structureIds) {
					var defer = $q.defer();
					httpService
						.getEvaluationSchema(structureIds)
						.then(function (response) {
							defer.resolve(response.data);
						}, function (error) {
							defer.reject(error);
						});
					return defer.promise;
				};

				service.getBidder = function (rfqHeaderId) {
					const biddersUrl = globals.webApiBaseUrl + 'procurement/rfq/businesspartner/getlist';
					const postData = {filter: '', Value: rfqHeaderId};
					return $http.post(biddersUrl, postData);
				};

				service.findBidder = function (findBidderDto) {
					var defer = $q.defer();
					httpService.findBidder(findBidderDto)
						.then(function (response) {
							defer.resolve(response.data);
						}, function (error) {
							defer.reject(error);
						});
					return defer.promise;
				};
				return service;
			}]);

	angular.module(moduleName).factory('procurementRfqBusinessPartnerWizardContractService',
		['platformModalService', '$http', '$q', 'procurementRfqMainService', 'PlatformMessenger',
			function (platformModalService, $http, $q, procurementRfqMainService, PlatformMessenger) {
				var service = {};
				// slick.grid2 code begin
				var currentItem;
				service.getSelected = function () {
					var qDefer = $q.defer();
					qDefer.reject(currentItem);
					return qDefer.promise;
				};
				service.setSelected = function (item) {
					var qDefer = $q.defer();
					currentItem = item;

					qDefer.reject(currentItem);
					return qDefer.promise;
				};
				var dataList = [];

				service.setDataList = function (value) {
					dataList = value;
				};

				service.getList = function () {
					return dataList;
				};
				service.refreshGrid = function () {
					service.getList();
					service.listLoaded.fire();
				};

				service.listLoaded = new PlatformMessenger();

				service.registerListLoaded = function registerListLoaded(callBackFn) {
					service.listLoaded.register(callBackFn);
				};
				service.unregisterListLoaded = function (callBackFn) {
					service.listLoaded.unregister(callBackFn);
				};
				service.unregisterSelectionChanged = function () {

				};
				// slick.grid2 code end

				return service;
			}]);

	angular.module(moduleName).factory('procurementRfqWizardBusinessPartnerListService',
		['platformModalService', '$http', '$q', 'procurementRfqMainService', 'PlatformMessenger',
			function (platformModalService, $http, $q, procurementRfqMainService, PlatformMessenger) {

				var service = {};

				// slick.grid2 code begin
				var currentItem;
				service.getSelected = function () {
					var qDefer = $q.defer();
					qDefer.reject(currentItem);
					return qDefer.promise;
				};
				service.setSelected = function (item) {
					var qDefer = $q.defer();
					currentItem = item;
					qDefer.reject(currentItem);
					return qDefer.promise;
				};
				var dataList = [];

				service.setDataList = function (value) {
					dataList = value;
				};

				service.getList = function () {
					return dataList;
				};
				service.refreshGrid = function () {
					service.getList();
					service.listLoaded.fire();
				};

				service.listLoaded = new PlatformMessenger();

				service.registerListLoaded = function registerListLoaded(callBackFn) {
					service.listLoaded.register(callBackFn);
				};
				service.unregisterListLoaded = function (callBackFn) {
					service.listLoaded.unregister(callBackFn);
				};

				service.unregisterSelectionChanged = function () {

				};

				service.setSelectedEntities = function(){
				};

				return service;
			}]);

})(angular);

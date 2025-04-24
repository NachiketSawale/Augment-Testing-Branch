(function (angular) {
	'use strict';
	var moduleName = 'procurement.rfq';
	/** @namespace parentItem.reqSelectedItem */
	/** @namespace data.IsDiffCurrency */
	/** @namespace data.IsDiffConfiguration */
	/** @namespace data.IsDiffProcurementStructure */
	/**
	 * @ngdoc service
	 * @name procurementRfqRequisitionValidationService
	 * @function
	 * @requires platformDataValidationService
	 *
	 * @description
	 * #validation service for rfq requisition.
	 */
	/* jshint -W072 */
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	angular.module(moduleName).factory('procurementRfqRequisitionValidationService', [
		'$http', '$q', 'platformDataValidationService', 'platformModalService', 'procurementRfqRequisitionService',
		function ($http, $q, platformDataValidationService, platformModalService, dataService) {

			var service = {};

			/**
			 * validate synchronously
			 */
			service.validateReqHeaderFk = function (entity, value, model) {
				value = value === -1 ? null : value;
				var list = dataService.getList();

				var firstRfqReqId = _.min(_.map(list, function (item) {
					return item.Id;
				}));

				if(entity.Id === firstRfqReqId){
					var parentService = dataService.parentService();
					var parentItem = parentService.getSelected();
					$http.get(globals.webApiBaseUrl + 'procurement/rfq/header/getStructureFk?reqHeaderId=' + value).then(function(response) {
						// TODO yew 2020.12.01 the data maybe null or ""
						var prcStructureFk = response.data;
						if(prcStructureFk === null || prcStructureFk === ''){
							prcStructureFk = 0;
						}
						var clerkData = {
							prcStructureFk : prcStructureFk,
							projectFk : parentItem.ProjectFk,
							companyFk : parentItem.CompanyFk
						};

						$http.post(globals.webApiBaseUrl + 'procurement/common/data/getClerkFk', clerkData).then(function(response) {
							if(parentItem.ClerkPrcFk === null){
								parentItem.ClerkPrcFk = response.data[0];
							}

							if(parentItem.ClerkReqFk === null){
								parentItem.ClerkReqFk = response.data[1];
							}

							if(parentItem.reqSelectedItem){
								parentItem.reqSelectedItem.Targetfk = value;
							}

							parentService.markItemAsModified(parentItem);
						});
					});
				}
				return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, dataService.getList(), service, dataService);
			};

			/**
			 * validate asynchronously
			 */
			service.asyncValidateReqHeaderFk = function validateReqHeaderFk(entity, value) {
				var defer = $q.defer();

				var list = dataService.getList();
				if (list.length === 1) {
					dataService.updateParentItem(value, dataService.getList(), function() {
						doWhenValid(entity, value, defer);
					});
				}
				else {
					var firstRfqReqId = _.min(_.map(list, function (item) {
						return item.Id;
					}));

					var firstReq = _.find(list, {Id: firstRfqReqId});
					var firstReqId = firstReq ? firstReq.ReqHeaderFk : -1;

					if (firstReqId !== -1 && entity.Id !== firstRfqReqId) {
						var compareList = [firstReqId, value];
						$http.post(globals.webApiBaseUrl + 'procurement/rfq/requisition/comparerfqrequisitioninfo', compareList).then(function (response) {
							var modalValue = {};
							var data = response.data;
							modalValue.isDiffCurrency = data.IsDiffCurrency;
							modalValue.isDiffConfiguration = data.IsDiffConfiguration;
							modalValue.isDiffProcurementStructure = data.IsDiffProcurementStructure;
							if (modalValue.isDiffConfiguration || modalValue.isDiffCurrency || modalValue.isDiffProcurementStructure) {
								showWarningDialog(entity, value, modalValue, defer);
							} else {
								doWhenValid(entity, value, defer);
							}
						}, function () {
							doWhenInvalid(entity, defer);
						});
					} else if (firstReqId === -1 && entity.Id !== firstRfqReqId) {
						var modalValue = {};
						modalValue.isDiffCurrency = true;
						showWarningDialog(entity, value, modalValue, defer);
					} else if (firstReqId === -1 && entity.Id === firstRfqReqId) {
						dataService.updateParentItem(value, dataService.getList(), function() {
							doWhenValid(entity, value, defer);
						});
					} else {
						doWhenValid(entity, value, defer);
					}
				}
				defer.promise.then(function(args){
					if(args.apply){
						dataService.reqHeaderFkChanged.fire('reqHeaderFkChanged', {entity: entity, value: value, model: {}});
					}
				});

				return defer.promise;
			};

			function showWarningDialog(entity, value, modalValue, defer) {
				var modalOptions = {
					templateUrl: globals.appBaseUrl + 'procurement.rfq/partials/requisition-creation-info-dialog.html',
					value: modalValue
				};
				platformModalService.showDialog(modalOptions).then(function (result) {
					if (result) {
						doWhenValid(entity, value, defer);
					} else {
						doWhenInvalid(entity, defer);
					}
				}, function () {
					doWhenInvalid(entity, defer);
				});
			}

			function doWhenValid(entity, value, defer) {
				defer.resolve({apply: true, valid: true});
				dataService.noneedResetReqHeaderToNull(entity.Id);
			}

			function doWhenInvalid(entity, defer){
				defer.resolve({apply: false, valid: true});
				dataService.needResetReqHeaderToNull(entity.Id);
			}

			return service;
		}
	]);
})(angular);

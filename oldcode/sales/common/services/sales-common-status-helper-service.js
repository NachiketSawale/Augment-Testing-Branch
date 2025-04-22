/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	var salesCommonModule = 'sales.common';

	/**
	 * @ngdoc service
	 * @name salesCommonStatusHelperService
	 * @description provides helper functions for working with sales status
	 */
	angular.module(salesCommonModule).service('salesCommonStatusHelperService', ['_', '$log', '$injector', '$translate',
		function (_, $log, $injector, $translate) {
			var service = {};

			// contract status lookup data
			var orderedStatusIds = [],
				orderedList = [];

			// TODO: move to other service (this here is 'StatusHelper')
			// get default contract type from customizing module
			service.getDefaultContractType = function getDefaultContractType(entity) {
				$injector.get('basicsLookupdataSimpleLookupService').getList({
					lookupModuleQualifier: 'project.main.contracttype',
					displayMember: 'Description',
					valueMember: 'Id'
				}).then(function (data) {
					var defaultItem = _.find(data, {isDefault: true});
					entity.ContractTypeFk = _.get(defaultItem, 'Id') || 0; // TODO: check if we should still set to 0
				});
			};

			service.initData = function initData() {
				var statusLookupDataService = $injector.get('salesContractStatusLookupDataService');
				return statusLookupDataService.getList({dataServiceName: 'salesContractStatusLookupDataService'}).then(function (list) {
					orderedList = _.filter(list, {IsOrdered: true, IsFinallyBilled: false});
					orderedStatusIds = _.map(orderedList, 'Id');
				});
			};

			service.checkIsOrderedByStatusId = function checkIsOrderedByStatusId(statusId) {
				return _.includes(orderedStatusIds, statusId);
			};

			service.getInfoMsgOnlyOrderedContracts = function getInfoMsgOnlyOrderedContracts() {
				// TODO: rubric category has to be considered here => not possible currently because this is already called
				//  after the main dialog is shown. So at least me make sure, the list (description)
				//  is distinct (if all rubric categories are included here)
				var infoMsgParam = {statuslist: _.join(_.uniq(_.map(orderedList, 'DescriptionInfo.Translated')), '" ' + $translate.instant('cloud.common.conjunctionOr') + ' "')};
				var infoMsg = $translate.instant('sales.common.onlyOrderedContractsStatusInfo', infoMsgParam);
				return infoMsg;
			};

			service.checkIsReadOnly = function checkIsReadOnly(statusDataServiceName, statusProperty, item) {
				if (_.isString(statusDataServiceName) && _.isString(statusProperty) && _.isObject(item) && _.has(item, statusProperty)) {
					var lookupService = $injector.get(statusDataServiceName);
					var readonlyStatusItems = _.filter(lookupService.getListSync(statusDataServiceName), {IsReadOnly: true});
					return _.some(readonlyStatusItems, {Id: item[statusProperty]});
				} else {
					$log.warn('Invalid arguments calling salesCommonStatusHelperService.checkIsReadOnly!');
				}
			};

			service.checkIsBilled = function checkIsBilled(billStatusFk) {
				var lookupService = $injector.get('salesBillingStatusLookupDataService');
				var isBilledStatusItems = _.filter(lookupService.getListSync('salesBillingStatusLookupDataService'), { IsBilled: true });
				return _.some(isBilledStatusItems, { Id: billStatusFk });
			};

			function showReadOnlyMsg(title, message) {
				var modalOptions = {
					headerText: $translate.instant(title),
					bodyText: message,
					iconClass: 'ico-info'
				};
				$injector.get('platformModalService').showDialog(modalOptions);
			}

			service.assertIsNotReadOnly = function (title, message, dataService, item) {
				if (!_.isFunction(_.get(dataService, 'checkItemIsReadOnly'))) {
					$log.warn('Dataservice does not provide checkItemIsReadOnly() function!');
					return;
				}

				if (dataService.checkItemIsReadOnly(item)) {
					showReadOnlyMsg(title, message);
					return false;
				}
				return true;
			};

			return service;
		}
	]);
})();

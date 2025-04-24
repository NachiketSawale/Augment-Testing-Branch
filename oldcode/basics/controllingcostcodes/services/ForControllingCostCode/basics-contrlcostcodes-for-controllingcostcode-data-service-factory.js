/**
 * Created by winjit.deshkar on 23.01.2023.
 */

(function (angular) {
	/* global globals */
	'use strict';
	let moduleName = 'basics.controllingcostcodes';

	/**
	 * @ngdoc service
	 * @name basicsContrlcostcodesForControllingCostCodeDataServiceFactory
	 * @description provides validation methods for all kind of change entities
	 */
	angular.module(moduleName).service('basicsContrlcostcodesForControllingCostCodeDataServiceFactory', BasicsContrlcostcodesForControllingCostCodeDataServiceFactory);

	BasicsContrlcostcodesForControllingCostCodeDataServiceFactory.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'basicsControllingCostCodesMainService'];

	function BasicsContrlcostcodesForControllingCostCodeDataServiceFactory(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsControllingCostCodesMainService) {
		let instances = {};

		let self = this;
		this.createDataService = function createDataService(templInfo, readOnly) {
			let dsName = self.getDataServiceName(templInfo);

			let srv = instances[dsName];
			if (_.isNull(srv) || _.isUndefined(srv)) {
				srv = self.doCreateDataService(dsName, templInfo, readOnly);
				instances[dsName] = srv;
			}

			return srv;
		};

		this.getNameInfix = function getNameInfix(templInfo) {
			return templInfo.dto;
		};

		this.getDataServiceName = function getDataServiceName(templInfo) {
			return 'basicsControllingCostCodes' + self.getNameInfix(templInfo) + 'ForControllingCostCodeDataService';
		};

		this.doCreateDataService = function doCreateDataService(dsName, templInfo) {
			let costcodeAffectedByControllingCostcodeOption = {
				flatLeafItem: {
					module: angular.module('basics.controllingcostcodes'),
					serviceName: dsName,
					entityNameTranslationID: 'basics.controllingcostcodes.forControllingCostCode',
					httpRead: {
						route: globals.webApiBaseUrl + templInfo.http + '/', endRead: 'ownedByControllingCostCode',
						initReadData: function (readData) {
							let selelctedChange = basicsControllingCostCodesMainService.getSelected();
							readData.filter = '?ContrCostCodeFk=' + selelctedChange.Id;
						}
					},
					presenter: {list: {}},
					actions: {delete: false, create: false},
					entityRole: {
						leaf: {
							itemName: 'ForControllingCostCode' + self.getNameInfix(templInfo),
							parentService: basicsControllingCostCodesMainService
						}
					}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(costcodeAffectedByControllingCostcodeOption);

			return serviceContainer.service;
		};
	}

})(angular);

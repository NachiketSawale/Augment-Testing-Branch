/**
 * Created by lcn on 7/27/2023
 */

(function (angular) {
	'use strict';
	const moduleName = angular.module('basics.company');

	moduleName.service('basicsCompanyStockEvaluationRuleDataService', BasicsCompanyStockEvaluationRuleDataService);

	BasicsCompanyStockEvaluationRuleDataService.$inject = ['$http', 'platformDataServiceFactory', 'basicsCompanyMainService', 'basicsCommonMandatoryProcessor', 'basicsCompanyConstantValues',];

	function BasicsCompanyStockEvaluationRuleDataService($http, platformDataServiceFactory, parentService, mandatoryProcessor, basicsCompanyConstantValues) {
		let service, data;
		let self = this;
		const companyTypes = basicsCompanyConstantValues.companyTypes;

		let basicsCompanyServiceOption = {
			flatLeafItem: {
				module: moduleName,
				serviceName: 'basicsCompanyStockEvaluationRuleDataService',
				entityNameTranslationID: 'basics.company.stockValuationRuleEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'basics/company/stockevaluationrule/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						readData.PKey1 = parentService.getSelected().Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							creationData.PKey1 = parentService.getSelected().Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'StockEvaluationRule4Comp', parentService: parentService}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(basicsCompanyServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
			mustValidateFields: true,
			typeName: 'StockEvaluationRule4CompDto',
			moduleSubModule: 'Basics.Company',
			validationService: 'basicsCompanyStockEvaluationRuleValidationService'
		});
		service = serviceContainer.service;
		data = serviceContainer.data;

		let canCreate = service.canCreate;
		service.canCreate = function () {
			let company = parentService.getSelected();
			if (!_.isNil(company) && company.CompanyTypeFk === companyTypes.group) {
				return false;
			}
			return canCreate();
		};

		data.onReadSucceeded = function incorporateDataRead(readData, data) {
			let company = parentService.getSelected();
			if (!_.isNil(company) && !!company.CompanyFk && company.Version === 0 && company.CompanyTypeFk === companyTypes.profitCenter) {
				let oldCompanyId = company.CompanyFk, newCompanyId = company.Id;
				$http.get(globals.webApiBaseUrl + 'basics/company/stockevaluationrule/deepcopy?mainItemId=' + oldCompanyId + '&assignItemId=' + newCompanyId).then(function (response) {
					let list = response.data;
					if (!_.isEmpty(list)) {
						service.markEntitiesAsModified(list);
					}
					return data.handleReadSucceeded(list, data);
				});
			} else {
				return data.handleReadSucceeded(readData, data);
			}
		};

		return service;
	}
})(angular);

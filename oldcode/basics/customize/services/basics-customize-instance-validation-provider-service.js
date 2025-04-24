/**
 * Created by Frank Baedeker on 27.04.2015.
 */
(function () {
	'use strict';
	var moduleName = 'basics.customize';
	var basicsCustomizeModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name basicsCustomizeInstanceValidationProviderService
	 * @function
	 *
	 * @description
	 * basicsCustomizeInstanceValidationProviderService provides validation service appropriate for the currently slected data type
	 */
	basicsCustomizeModule.service('basicsCustomizeInstanceValidationProviderService', BasicsCustomizeInstanceValidationProviderService);
	BasicsCustomizeInstanceValidationProviderService.$inject = ['_', '$injector', 'platformValidationServiceFactory',
		'basicsCustomizePropertyFilterService', 'basicsCustomizeTypeDataService', 'basicsCustomizeInstanceDataService'];

	function BasicsCustomizeInstanceValidationProviderService(_, $injector, platformValidationServiceFactory,
		 basicsCustomizePropertyFilterService, basicsCustomizeTypeDataService, basicsCustomizeInstanceDataService) {

		var self = this;

		this.getInstanceValidationService = function getInstanceValidationService() {
			var sel = basicsCustomizeTypeDataService.getSelected();

			return self.getInstanceValidationServiceFor(sel);
		};

		this.getInstanceValidationServiceFor = function getInstanceValidationServiceFor(sel) {
			var valServ = null;
			if (sel) {
				switch (sel.DBTableName) {
					case 'BAS_COSTCODE_TYPE':
						valServ = $injector.get('basicsCustomizeEstCostCodeTypeValidationService');
						break;
					case 'BAS_DOCUMENT_TYPE':
						valServ = $injector.get('basicsCustomizeDocumentTypeValidationService');
						break;
					case 'BAS_EXTERNALDESKTOPTILES':
						valServ = $injector.get('basicsCustomizeExternalDesktopTilesValidationService');
						break;
					case 'BAS_STRINGCOLUMNCONFIG':
						valServ = $injector.get('basicsCustomizeStringColumnConfigurationValidationService');
						break;
					case 'BAS_SYSTEMOPTION':
						valServ = $injector.get('basicsCustomizeSystemOptionValidationService');
						break;
					case 'BID_TYPE':
						valServ = $injector.get('basicsCustomizeBidTypeValidationService');
						break;
					case 'BOQ_ITEM_FLAG' :
						valServ = $injector.get('basicsCustomizeBoQItemFlagValidationService');
						break;
					case 'EST_ASSEMBLY_TYPE' :
						valServ = $injector.get('basicsCustomizeEstAssemblyTypeValidationService');
						break;
					case 'EST_PARAMETER':
						valServ = $injector.get('basicsCustomizeEstimationParameterValidationService');
						break;
					case 'GCC_COSTCODE_ASSIGN':
						valServ = $injector.get('basicsCustomizeGeneralContractorControllingCostCodeAssignValidationService');
						break;
					case 'LGM_JOBTYPE':
						valServ = $injector.get('basicsCustomizeLogisticJobValidationService');
						break;
					case 'MDC_TAX_CODE':
						valServ = $injector.get('basicsCustomizeTaxCodeValidationService');
						break;
					case 'MDC_WAGE_GROUP':
						valServ = $injector.get('basicsCustomizeWageGroupValidationService');
						break;
					case 'ORD_TYPE':
						valServ = $injector.get('basicsCustomizeBidTypeValidationService');
						break;
					case 'ORD_STATUS':
						valServ = $injector.get('basicsCustomizeOrdStatusValidationService');
						break;
					case 'PRC_GENERALSTYPE':
						valServ = $injector.get('basicsCustomizeGeneralTypeValidationService');
						break;
					case 'PRJ_CONTRUNITTEMPLATE':
						valServ = $injector.get('basicsCustomizeControllingUnitTemplateValidationService');
						break;
					case 'RES_TYPE':
						valServ = $injector.get('basicsCustomizeResourceTypeValidationService');
						break;
					default:
						valServ = self.createStandardValidationService(sel);
						break;
				}
			}

			return valServ;
		};

		function matchesFilter(prop, filter) {
			return !filter || filter.length === 0 || _.findIndex(filter, function (val) {
				return val === prop.Name;
			}) === -1;
		}

		this.hasToCreatePasswordValidation = function hasToCreatePasswordValidation(selType) {
			var needPwdValidation = false;

			switch (selType.DBTableName) {
				case 'BAS_EXTERNALCONFIG':
					needPwdValidation = true;
					break;
				case 'BAS_EXTERNALSOURCE2USER':
					needPwdValidation = true;
					break;
				case 'BAS_ITWOBASELINE_SERVER':
					needPwdValidation = true;
					break;
				case 'FRM_USERDIRECTORY':
					needPwdValidation = true;
					break;
			}

			return needPwdValidation;
		};

		this.createPasswordValidationForProperty = function createPasswordValidationForProperty(valServ, property) {
			var funcName = 'validate' + property;
			var propName = 'Is' + property + 'Changed';

			valServ[funcName] = function validatePassword(entity) {
				entity[propName] = true;

				return true;
			};
		};

		this.createPasswordValidationService = function createPasswordValidationService(selType) {
			var valServ = {};

			switch (selType.DBTableName) {
				case 'BAS_EXTERNALCONFIG':
					self.createPasswordValidationForProperty(valServ, 'Password');
					break;
				case 'BAS_EXTERNALSOURCE2USER':
					self.createPasswordValidationForProperty(valServ, 'Password');
					break;
				case 'BAS_ITWOBASELINE_SERVER':
					self.createPasswordValidationForProperty(valServ, 'UrlPassword');
					break;
				case 'FRM_USERDIRECTORY':
					self.createPasswordValidationForProperty(valServ, 'LdapPassword');
					break;
			}

			return valServ;
		};

		this.hasToCreateStandardValidation = function hasToCreateStandardValidation(selType) {
			return selType.HasRequiredProperty;
		};

		this.createStandardValidationService = function createStandardValidationService(selType) {
			var valServ = null;

			if (self.hasToCreatePasswordValidation(selType)) {
				valServ = self.createPasswordValidationService(selType);
			} else if (self.hasToCreateStandardValidation(selType)) {
				valServ = {};
				var props = {};
				var config = {
					mandatory: [],
					uniques: []
				};
				var filter = basicsCustomizePropertyFilterService.getHiddenFieldsForType(selType);

				_.forEach(selType.Properties, function (prop) {
					if (matchesFilter(prop, filter)) {
						if ((prop.IsVisible && !prop.IsReadonly) || (prop.Name !== 'Id' && !prop.IsHistory)) {
							props[prop.Name] = {domain: prop.Domain};
							if (prop.Required) {
								config.mandatory.push(prop.Name);
							}

							if (prop.Domain === 'code') {
								config.uniques.push(prop.Name);
							}
						}
					}
				});

				platformValidationServiceFactory.addValidationServiceInterfaceFromProperties(props, config, valServ,
					basicsCustomizeInstanceDataService);

				valServ.mustValidateFields = config.mandatory;
				valServ.mandatoryProperties = props;
			}

			return valServ;
		};
	}
})();

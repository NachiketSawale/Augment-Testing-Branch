/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	var salesCommonModule = 'sales.common';

	/**
	 * @ngdoc value
	 * @name salesCommonSystemOption
	 * @description provides constants for sales related system options
	 */
	angular.module(salesCommonModule).constant('salesCommonSystemOption', Object.freeze({
		UpdateAlreadyBilledQuantity: 10121
		// TODO: add other sales related system options here
	}));

	/**
	 * @ngdoc service
	 * @name salesCommonSystemOptionService
	 * @description provides functions to get data for sales related system options
	 */
	angular.module(salesCommonModule).service('salesCommonSystemOptionService', ['_', '$injector', '$log', '$q', 'basicCustomizeSystemoptionLookupDataService', 'salesCommonSystemOption',
		function (_, $injector, $log, $q, basicCustomizeSystemoptionLookupDataService, salesCommonSystemOption) {
			var sysOpt2Value = {};

			return {
				init: function () {
					return $q.all([basicCustomizeSystemoptionLookupDataService.getParameterValueAsync(salesCommonSystemOption.UpdateAlreadyBilledQuantity).then(d => sysOpt2Value[salesCommonSystemOption.UpdateAlreadyBilledQuantity] = d)]);
				},
				getValue: function getValue(sysOptionId) {
					return sysOpt2Value[sysOptionId];
				},
				getValueAsBool: function getValueAsBool(sysOptionId) {
					var rawVal = sysOpt2Value[sysOptionId];
					if (_.isString(rawVal)) {
						var valueLowerCase = rawVal.toLowerCase();
						if (_.includes(['1', '0'], valueLowerCase)) { // TODO: _.isNumeric(...) not available (!!_.parseInt(valueLowerCase))
							return '1' === valueLowerCase;
						} else if (_.includes(['true', 'false'], valueLowerCase)) {
							return 'true' === valueLowerCase;
						}
					}
					// should not happen, we expect string from basicCustomizeSystemoptionLookupDataService
					$log.warn('Value for sysOptionId:' + sysOptionId + ' is invalid.');
				}
			};
		}]);

	/**
	 * @ngdoc service
	 * @name salesCommonDataHelperService
	 * @description provides data related functions for all sales modules
	 */
	angular.module(salesCommonModule).service('salesCommonDataHelperService', ['_', '$injector', '$q', '$http', 'globals', 'basicsCommonTextFormatConstant', 'PlatformMessenger',
		function (_, $injector, $q, $http, globals, basicsCommonTextFormatConstant, PlatformMessenger) {

			function getClerkIdByUserId(userId) {
				return $injector.get('basicsClerkUtilitiesService').getClerkByUserId(userId).then(function (clerk) {
					return clerk && clerk.IsLive ? clerk.Id : null;
				});
			}

			function getClerkIdByProjectId(projectId) {
				return getProjectById(projectId).then(function (project) {
					return project && project.IsLive ? project.ClerkFk : null;
				});
			}

			function getContractTypeIdByConfig(configId) {
				var salesConfigLookupItem = $injector.get('basicsLookupdataLookupDescriptorService').getLookupItem('prcconfiguration', configId);
				return $q.when(_.get(salesConfigLookupItem, 'PrjContractTypeFk') || null);
			}

			function getContractTypeIdByProject(projectId) {
				return getProjectById(projectId).then(function (project) {
					return _.get(project, 'ContractTypeFk');
				});
			}

			function getDefaultContractTypeId() {
				return getDefaultContractType().then(function (contractType) {
					return _.get(contractType, 'Id');
				});
			}

			function getDefaultContractType() {
				return $injector.get('basicsLookupdataSimpleLookupService').getList({
					lookupModuleQualifier: 'project.main.contracttype',
					displayMember: 'Description',
					valueMember: 'Id'
				}).then(function (data) {
					var defaultItem = _.find(data, {isDefault: true});
					return defaultItem || null;
				});
			}

			function getProjectById(projectId) {
				if (_.isNull(projectId) || _.isUndefined(projectId)) {
					return $q.when(null);
				}
				var deferred = $q.defer();
				$http.post(globals.webApiBaseUrl + 'project/main/listfiltered', {'ProjectContextId': projectId})
					.then(function (data) {
						var project = _.find(_.get(data, 'data.dtos'), {Id: projectId});
						deferred.resolve(project);
					});

				return deferred.promise;
			}

			function getSalesConfigurations() {
				var lookupDescriptorService = $injector.get('basicsLookupdataLookupDescriptorService');
				// we take default sales config header (or first available)
				return lookupDescriptorService.loadData('prcconfigheader').then((configHeaders) => {
					const SalesConfigType = 2;
					var defaultSalesCfgHeader = _.find(configHeaders, {IsDefault: true, BasConfigurationTypeFk: SalesConfigType});
					var firstSalesCfgHeader = _.first(_.filter(configHeaders, {BasConfigurationTypeFk: SalesConfigType}));
					var defaultOrFirstSalesCfgHeaderId = _.get(defaultSalesCfgHeader || firstSalesCfgHeader, 'Id');
					return lookupDescriptorService.loadData('prcconfiguration').then((configs) => {
						return (defaultOrFirstSalesCfgHeaderId) ? _.filter(configs, {PrcConfigHeaderFk: defaultOrFirstSalesCfgHeaderId}) : [];
					}, (/* error */) => {
						return;
					});
				}, (/* error */) => {
					return;
				});
			}

			function getDefaultOrFirstSalesConfig(rubricCategoryId) {
				return getSalesConfigurations().then(function (data) {
					var items = _.filter(data, {RubricCategoryFk: rubricCategoryId});
					return _.get(_.find(items, {IsDefault: true}), 'Id') || _.get(_.first(items), 'Id') || null;
				});
			}

			function getDefaultRubricCategoryId(rubricId) {
				var lookupService = 'basicsMasterDataRubricCategoryLookupDataService';
				var rubricCategoryDataService = $injector.get(lookupService);
				rubricCategoryDataService.setFilter(rubricId);
				return rubricCategoryDataService.getList({lookupType: lookupService}).then(function (data) {
					var defaultItem = _.find(data, {IsDefault: true});
					return _.get(defaultItem, 'Id');
				});
			}

			var prcHeaderTextTypeChange = new PlatformMessenger();

			function getTextModulesByTextModuleType(entity, salesHeaderDataService, salesHeaderTextDataService) {
				let rubricId = angular.isFunction(salesHeaderDataService.getRubricId) ? salesHeaderDataService.getRubricId() : null;
				entity = entity || salesHeaderTextDataService.getSelected();
				if (!entity || !rubricId) {
					return $q.when(null);
				}

				let textModuleTypeFk = entity.BasTextModuleTypeFk;
				let isProject = false;
				const getTextModulesWithoutConfigUrl = globals.webApiBaseUrl + 'basics/procurementconfiguration/textmodule/gettextmodulesbytextmoduletype?rubricId=' + rubricId + '&prcTextTypeFk=' + entity.PrcTexttypeFk + '&textModuleTypeFk=' + textModuleTypeFk + '&isProject=' + isProject;
				return $http.get(getTextModulesWithoutConfigUrl).then(function (response) {
					if (!response) {
						return;
					}
					let textModuleList = response.data;
					salesHeaderTextDataService.salesHeaderTextTypeChange.fire(null, { entity: entity, textModuleList: textModuleList });
					return textModuleList;
				});
			}

			function getTextModuleList(entity, salesHeaderDataService, salesHeaderTextDataService) {
				var selectedSalesHeader = salesHeaderDataService.getSelected();
				entity = entity || salesHeaderTextDataService.getSelected();
				if (!selectedSalesHeader || !entity) {
					return $q.when(null);
				}
				let textModuleTypeFk = entity.TextModuleTypeFk || entity.BasTextModuleTypeFk || -1;
				let isProject = false;
				return $http.get(globals.webApiBaseUrl + 'basics/procurementconfiguration/textmodule/prcHeaderTextModuleList' + '?prcConfigurationFk=' + selectedSalesHeader.ConfigurationFk + '&prcTextTypeFk=' + entity.PrcTexttypeFk + '&textModuleTypeFk=' + textModuleTypeFk + '&isProject=' + isProject)
					.then(function (response) {
						if (!response) {
							return;
						}
						return response.data;
					});
			}

			function updateByTextType(entity, needUpdateText, salesHeaderDataService, salesHeaderTextDataService) {
				entity = entity || salesHeaderTextDataService.getSelected();
				getTextModuleList(entity, salesHeaderDataService, salesHeaderTextDataService).then(function (list) {
					if (!entity || !needUpdateText) {
						return;
					}
					if (!angular.isArray(list)) {
						entity.Content = null;
						entity.ContentString = null;
						entity.PlainText = null;
						return;
					}
					var textModules = _.filter(list, {PrcTextTypeFk: entity.PrcTexttypeFk});
					if (!angular.isArray(textModules) || textModules.length === 0) {
						entity.Content = null;
						entity.ContentString = null;
						entity.PlainText = null;
						return;
					}

					var text = {};
					_.forEach(textModules, function (item) {
						if (((entity.TextFormatFk === basicsCommonTextFormatConstant.specification ||
									entity.TextFormatFk === basicsCommonTextFormatConstant.specificationNhtml) &&
								Object.prototype.hasOwnProperty.call(text, 'specification')) &&
							((entity.TextFormatFk === basicsCommonTextFormatConstant.html ||
									entity.TextFormatFk === basicsCommonTextFormatConstant.specificationNhtml) &&
								Object.prototype.hasOwnProperty.call(text, 'html'))) {
							return;
						}

						if (!item.IsDefault) {
							return;
						}

						var textModuleTextFormat = null;
						if (item.TextFormatFk) {
							textModuleTextFormat = item.TextFormatFk;
						} else {
							if (item.BasBlobsFk) {
								textModuleTextFormat = basicsCommonTextFormatConstant.specification;
							} else if (!item.BasBlobsFk && item.BasClobsFk) {
								textModuleTextFormat = basicsCommonTextFormatConstant.html;
							}
						}
						if (textModuleTextFormat === basicsCommonTextFormatConstant.specification && !Object.prototype.hasOwnProperty.call(text, 'specification')) {
							text.specification = item;
						} else if (textModuleTextFormat === basicsCommonTextFormatConstant.html && !Object.prototype.hasOwnProperty.call(text, 'html')) {
							text.html = item;
						}
					});

					// eslint-disable-next-line no-unused-vars
					var oldContentString = entity.ContentString;
					// eslint-disable-next-line no-unused-vars
					var oldPlainText = entity.PlainText;

					var promises = [];
					promises.push(text.specification ? salesHeaderTextDataService.setTextMoudleValue(text.specification.Id) : $q.when(null));
					promises.push(text.html ? salesHeaderTextDataService.setTextMoudleValue(text.html.Id) : $q.when(null));

					var updateFormat = 0;
					if (promises.length > 0) {
						$q.all(promises)
							.then(function (results) {
								if (!angular.isArray(results)) {
									return;
								}
								var text4Spec = results[0] ? results[0].ContentString : null;
								var text4Html = results[1] ? results[1].PlainText : null;

								if (text4Spec) {
									updateFormat = 1;
									if (text4Spec !== entity.ContentString) {
										entity.ContentString = text4Spec;
									}
								}

								if (text4Html) {
									updateFormat += 2;
									if (text4Html !== entity.PlainText) {
										entity.PlainText = text4Html;
									}
								}

								if (updateFormat === 1) {
									if (angular.isString(entity.PlainText)) {
										entity.PlainText = null;
									}
								} else if (updateFormat === 2) {
									if (angular.isString(entity.ContentString)) {
										entity.Content = null;
										entity.ContentString = null;
									}
								} else if (updateFormat === 0) {
									entity.Content = null;
									entity.ContentString = null;
									entity.PlainText = null;
								}
							});
					}
				});
			}

			function suggestPreviousWipId(mainContractId) {
				if (mainContractId && mainContractId > 0) {
					return $http.post(globals.webApiBaseUrl + 'sales/wip/suggestpreviouswipid?mainContractId=' + mainContractId);
				}
			}

			function suggestPreviousBillId(contractId) {
				if (contractId && contractId > 0) {
					return $http.post(globals.webApiBaseUrl + 'sales/billing/suggestpreviousbillid?contractId=' + contractId);
				}
			}

			return {
				getClerkIdByUserId: getClerkIdByUserId,
				getClerkIdByProjectId: getClerkIdByProjectId,
				getContractTypeIdByConfig: getContractTypeIdByConfig,
				getContractTypeIdByProject: getContractTypeIdByProject,
				getDefaultContractTypeId: getDefaultContractTypeId,
				getDefaultContractType: getDefaultContractType,
				getProjectById: getProjectById,
				getSalesConfigurations: getSalesConfigurations,
				getDefaultOrFirstSalesConfig: getDefaultOrFirstSalesConfig,
				getDefaultRubricCategoryId: getDefaultRubricCategoryId,
				updateByTextType: updateByTextType,
				prcHeaderTextTypeChange: prcHeaderTextTypeChange,
				suggestPreviousBillId: suggestPreviousBillId,
				suggestPreviousWipId: suggestPreviousWipId,
				getTextModulesByTextModuleType: getTextModulesByTextModuleType
			};
		}]);
})();
/**
 * Created by anl on 4/3/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.accounting';

	angular.module(moduleName).factory('productionplanningAccountingRuleDataService', RuleDataService);

	RuleDataService.$inject = ['$q', '$http', '$injector', 'platformDataServiceFactory',
		'basicsLookupdataLookupDescriptorService',
		'productionplanningAccountingRuleSetDataService',
		'basicsCommonMandatoryProcessor',
		'basicsLookupdataLookupFilterService'];

	function RuleDataService($q, $http, $injector, platformDataServiceFactory,
							 basicsLookupdataLookupDescriptorService,
							 parentService,
							 basicsCommonMandatoryProcessor,
							 basicsLookupdataLookupFilterService) {

		function createService(config) {
			var oParentService = config.parentService || parentService;
			var matchFiledMap = [];
			var serviceOptions = {
				flatLeafItem: {
					module: moduleName,
					serviceName: 'productionplanningAccountingRuleDataService',
					entityNameTranslationID: 'productionplanning.accounting.entityRule',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'productionplanning/accounting/rule/',
						endRead: 'getbyruleset',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							var selected = oParentService.getSelected();
							readData.PKey1 = selected.Id;
						}
					},
					entityRole: {
						leaf: {
							itemName: 'Rules',
							parentService: oParentService,
							parentFilter: 'RuleSetFk'
						}
					},
					useItemFilter: true,
					entitySelection: {supportsMultiSelection: true},
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								basicsLookupdataLookupDescriptorService.attachData(readData);
								var result = {
									FilterResult: readData.FilterResult,
									dtos: readData.Main || []
								};

								return container.data.handleReadSucceeded(result, data);
							},
							initCreationData: function (creationData) {
								creationData.Pkey1 = oParentService.getSelected().Id;
							}
						}
					}
				}
			};

			var container = platformDataServiceFactory.createNewComplete(serviceOptions); // jshint ignore:line

			container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'RuleDto',
				moduleSubModule: 'ProductionPlanning.Accounting',
				validationService: 'productionpalnningAccountingRuleValidationService'
			});

			var service = container.service;

			service.SetMatchFieldNull = function () {
				var selectedRule = service.getSelected();
				selectedRule.MatchFieldFk = null;
				var validationService = $injector.get('productionpalnningAccountingRuleValidationService');
				validationService.validateMatchFieldFk(selectedRule, null, 'MatchFieldFk');
				service.markItemAsModified(selectedRule);
			};

			service.SetMatchFieldMap = function load() {
				var importFormats, matchFields;
				var matchFieldPromise = $http.post(globals.webApiBaseUrl + 'basics/customize/engineeringaccountingrulematchfield/list').then(function (response) {
					matchFields = response.data;
				});
				var importFormatPromise = $http.post(globals.webApiBaseUrl + 'basics/customize/engineeringaccountingruleimportformat/list').then(function (response) {
					importFormats = response.data;
				});

				$q.all([matchFieldPromise, importFormatPromise]).then(function () {
					var action = function (item) {
						var fields = [];
						angular.forEach(matchFields, function (matchFiled) {
							if (matchFiled.AccImportFormatFk === item.Id) {
								fields.push(matchFiled);
							}
						});
						matchFiledMap[item.Id] = fields;
					};
					importFormats.forEach(action);
				});
			};

			service.GetMatchFields = function (importFormatId) {
				return matchFiledMap[importFormatId];
			};
			
			service.handleFieldChanged=function (entity, field) {
				switch (field) {
					case 'ImportFormatFk':
						service.SetMatchFieldNull();
						break;
				}
			};

			var filters = [{
				key: 'productionplanning-accounting-rule-matchfield-filter',

				fn: function (item) {
					var rule = service.getSelected();
					if (rule) {
						var fields = service.GetMatchFields(rule.ImportFormatFk);
						return _.find(fields, {Id: item.Id});
					}

				}
			}];
			service.registerLookupFilter = function () {
				basicsLookupdataLookupFilterService.registerFilter(filters);
			};

			service.unregisterLookupFilter = function () {
				basicsLookupdataLookupFilterService.unregisterFilter(filters);
			};

			service.SetMatchFieldMap();

			// extend method onCreateSucceeded on service, this method will be used in productionplanningAccountingRuleCopyPasteBtnsExtension(for HP-ALM ##123238 by zwz 2021/10/18)
			service.onCreateSucceeded = function (newItem){
				container.data.onCreateSucceeded(newItem, container.data);
			};

			return service;
		}

		var serviceCache = {};

		function getService(config) {
			var serviceKey = config.serviceKey;
			if (!serviceCache[serviceKey]) {
				serviceCache[serviceKey] = createService(config);
			}
			return serviceCache[serviceKey];
		}

		var service = createService({});
		service.getService = getService;
		return service;
	}

})(angular);
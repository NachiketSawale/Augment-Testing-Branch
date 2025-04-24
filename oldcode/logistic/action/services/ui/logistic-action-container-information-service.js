/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var logisticActionModule = angular.module('logistic.action');
	/**
	 * @ngdoc service
	 * @name logisticActionContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	logisticActionModule.service('logisticActionContainerInformationService', LogisticActionContainerInformationService);
	LogisticActionContainerInformationService.$inject = ['_', '$injector', 'platformLayoutHelperService', 'logisticActionConstantValues',
		'basicsLookupdataConfigGenerator', 'basicsLookupdataLookupFilterService'];
	function LogisticActionContainerInformationService(_, $injector, platformLayoutHelperService, logisticActionConstantValues,
		basicsLookupdataConfigGenerator, basicsLookupdataLookupFilterService ) {
		let self = this;
		const guids = logisticActionConstantValues.uuid.container;
		let dynamicConfigurations = {};
		/* jshint -W074 */ // There is no complexity; try harder, J.S.Hint.
		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			var config = {};
			switch (guid) {
				case guids.actionTargetList:
					config = platformLayoutHelperService.getStandardGridConfig(self.getActionTargetServiceInfo(), self.getActionTargetLayout);
					break;
				case guids.actionTargetDetails:
					config = platformLayoutHelperService.getStandardDetailConfig(self.getActionTargetServiceInfo(), self.getActionTargetLayout);
					break;
				case guids.actionItemTemplatesList:
					config = platformLayoutHelperService.getStandardGridConfig(self.getActionItemTemplatesServiceInfo(), self.getActionItemTemplatesLayout);
					break;
				case guids.actionItemTemplatesDetails:
					config = platformLayoutHelperService.getStandardDetailConfig(self.getActionItemTemplatesServiceInfo(), self.getActionItemTemplatesLayout);
					break;
				case guids.actionItemTypesList:
					config = platformLayoutHelperService.getStandardGridConfig(self.getActionItemTypesServiceInfo(), self.getActionItemTypesLayout);
					break;
				case guids.actionItemTypesDetails:
					config = platformLayoutHelperService.getStandardDetailConfig(self.getActionItemTypesServiceInfo(), self.getActionItemTypesLayout);
					break;
				case guids.sourceActionItemTemplatesByType:
					config = self.getSourceActionItemTemplatesByTypeConfig();
					break;
				default:
					config = self.hasDynamic(guid) ? dynamicConfigurations[guid] : {};
					break;
			}
			return config;
		};

		this.hasDynamic = function hasDynamic(guid) {
			return !_.isNull(dynamicConfigurations[guid]) && !_.isUndefined(dynamicConfigurations[guid]);
		};

		(function registerFilter(){
			var actionRelatedFilter = [
				{
					key: 'logistic-action-item-type-by-target-filter',
					fn: function filterItemTypeByTarget(item) {
						const itemTemp = $injector.get('logisticActionItemTemplatesDataService').getSelected();
						return item && itemTemp && item.ActionTargetFk === itemTemp.ActionTargetFk;
					}
				}
			];
			basicsLookupdataLookupFilterService.registerFilter(actionRelatedFilter);
		})();

		this.getActionTargetServiceInfo = function getActionTargetServiceInfo() {
			return {
				standardConfigurationService: 'logisticActionTargetLayoutService',
				dataServiceName: 'logisticActionTargetDataService',
			};
		};
		this.getActionTargetLayout = function getActionTargetLayout() {
			return platformLayoutHelperService.getSimpleBaseLayout('1.0.0','logistic.action',
				['descriptioninfo']);
		};

		this.getActionItemTemplatesServiceInfo = function getActionItemTemplatesServiceInfo() {
			return {
				standardConfigurationService: 'logisticActionItemTemplatesLayoutService',
				dataServiceName: 'logisticActionItemTemplatesDataService',
				validationServiceName: 'logisticActionItemTemplatesValidationService'
			};
		};
		this.getActionItemTemplatesLayout = function getActionItemTemplatesLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'logistic.action',
				['recordno','descriptioninfo','longdescriptioninfo','url','islive','hasdate','hasurl','hasprjdoc'
					,'hasplantcert','hasbusinesspartner','hasprccontract','hasclerk']);
			res.overloads = platformLayoutHelperService.getOverloads(['url'], self);
			return res;
		};

		this.getActionItemTypesServiceInfo = function getActionItemTypesServiceInfo() {
			return {
				standardConfigurationService: 'logisticActionItemTypesLayoutService',
				dataServiceName: 'logisticActionItemTypesDataService',
				validationServiceName: 'logisticActionItemTypesValidationService'
			};
		};
		this.getActionItemTypesLayout = function getActionItemTypesLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'logistic.action',
				['actionitemtypefk', 'commenttext']);
			res.overloads = platformLayoutHelperService.getOverloads(['actionitemtypefk'], self);
			return res;
		};

		this.getSourceActionItemTemplatesByTypeConfig = function getSourceActionItemTemplatesByTypeConfig() {
			var config = this.getContainerInfoByGuid(guids.actionItemTemplatesList);
			var templateInfo = {
				dto: 'ActionItemTemp2ItemTypeDto',
				http: 'logistic/action/item',
				endRead: 'listbyactionitemtype',
				usePostForRead: true,
				filterFk: 'actionItemTypeFk',
				presenter: 'list',
				sortOptions: {initialSortColumn: {field: 'ActionItemTemplateFk', id: 'actionItemTemplateFk'}, isAsc: true},
				isInitialSorted: false,
				sourceDataService: config.dataServiceName
			};
			config.templInfo = templateInfo;
			config.dataServiceName = $injector.get('logisticActionItemTemplateSourceDataServiceFactory').createDataService(templateInfo);
			config.validationServiceName = {};
			config.listConfig.type = 'sourceActionItemTemplate';

			return config;
		};

		this.getOverload = function getOverload(overload) {
			var ovl = null;
			switch (overload) {
				case 'actionitemtypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.logisticsactionitemtype',null,{
						field: 'ActionTargetFk',
						filterKey: 'logistic-action-item-type-by-target-filter',
						customIntegerProperty: 'LGM_ACTIONTARGET_FK'
					});
					break;
			}
			return ovl;
		};


	}
})(angular);

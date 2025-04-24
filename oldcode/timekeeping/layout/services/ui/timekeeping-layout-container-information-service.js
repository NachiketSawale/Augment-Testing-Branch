/*
 * $Id: timekeeping-layout-container-information-service.js 568106 2019-11-25 17:01:03Z henkel $
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	var timekeepingLayoutModule = angular.module('timekeeping.layout');

	/**
	 * @ngdoc service
	 * @name timekeepingLayoutContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	timekeepingLayoutModule.service('timekeepingLayoutContainerInformationService', TimekeepingLayoutContainerInformationService);

	TimekeepingLayoutContainerInformationService.$inject = ['platformLayoutHelperService', 'basicsLookupdataConfigGenerator',
		'timekeepingLayoutConstantValues'];

	function TimekeepingLayoutContainerInformationService(platformLayoutHelperService, basicsLookupdataConfigGenerator, timekeepingLayoutConstantValues) {
		var self = this;
		var guids = timekeepingLayoutConstantValues.uuid.container;

		/* jshint -W074 */ // There is no complexity; try harder, J.S.Hint.
		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			var config = {};
			switch (guid) {
				case guids.inputPhaseList: // timekeepingLayoutInputPhaseListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getInputPhaseServiceInfos());
					break;
				case guids.inputPhaseDetails: // timekeepingLayoutInputPhaseDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getInputPhaseServiceInfos());
					break;
				case guids.inputPhaseGroupList: // timekeepingLayoutInputPhaseGroupListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getInputPhaseGroupServiceInfos());
					break;
				case guids.inputPhaseGroupDetails: // timekeepingLayoutInputPhaseGroupDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getInputPhaseGroupServiceInfos());
					break;
				case guids.inputPhaseTimeSymbolList: // timekeepingLayoutInputPhaseTimeSymbolListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getTimeSymbolServiceInfos());
					break;
				case guids.inputPhaseTimeSymbolDetails: // timekeepingLayoutInputPhaseTimeSymbolDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getTimeSymbolServiceInfos());
					break;
				case guids.userInterfaceLayoutList: // timekeepingLayoutUserInterfaceLayoutListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getUserInterfaceLayoutServiceInfos());
					break;
				case guids.userInterfaceLayoutDetails: // timekeepingLayoutUserInterfaceLayoutDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getUserInterfaceLayoutServiceInfos());
					break;
			}

			return config;
		};

		this.getInputPhaseServiceInfos = function getInputPhaseServiceInfos() {
			return {
				standardConfigurationService: 'timekeepingLayoutInputPhaseLayoutService',
				dataServiceName: 'timekeepingLayoutInputPhaseDataService',
				validationServiceName: 'timekeepingLayoutInputPhaseValidationService'
			};
		};

		this.getInputPhaseLayout = function getInputPhaseLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'timekeeping.layout.inputPhase',
				['descriptioninfo', 'sorting', 'durationmodefk', 'mincount', 'maxcount', 'timesymbolfk',
					'timesymboluserinterfacefk', 'inputphasechainmodefk', 'modificationfactor', 'modificationdelta',
					'timesymbolchainedfk']);

			res.overloads = platformLayoutHelperService.getOverloads(['durationmodefk', 'timesymbolfk',
				'timesymboluserinterfacefk', 'inputphasechainmodefk', 'timesymbolchainedfk'], self);

			return res;
		};

		this.getInputPhaseGroupServiceInfos = function getInputPhaseGroupServiceInfos() {
			return {
				standardConfigurationService: 'timekeepingLayoutInputPhaseGroupLayoutService',
				dataServiceName: 'timekeepingLayoutInputPhaseGroupDataService',
				validationServiceName: 'timekeepingLayoutInputPhaseGroupValidationService'
			};
		};

		this.getInputPhaseGroupLayout = function getInputPhaseGroupLayout() {
			return platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'timekeeping.layout.inputPhaseGroup',
				['descriptioninfo', 'sorting', 'mincount', 'maxcount']);
		};

		this.getTimeSymbolServiceInfos = function getTimeSymbolServiceInfos() {
			return {
				standardConfigurationService: 'timekeepingLayoutInputPhaseTimeSymbolLayoutService',
				dataServiceName: 'timekeepingLayoutInputPhaseTimeSymbolDataService',
				validationServiceName: 'timekeepingLayoutInputPhaseTimeSymbolValidationService'
			};
		};

		this.getTimeSymbolLayout = function getTimeSymbolLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'timekeeping.layout.phaseTimeSymbol',
				['timesymbolfk']);

			res.overloads = platformLayoutHelperService.getOverloads(['timesymbolfk'], self);

			return res;
		};

		this.getUserInterfaceLayoutServiceInfos = function getUserInterfaceLayoutServiceInfos() {
			return {
				standardConfigurationService: 'timekeepingLayoutUserInterfaceLayoutService',
				dataServiceName: 'timekeepingLayoutUserInterfaceLayoutDataService',
				validationServiceName: 'timekeepingLayoutInputPhaseGroupValidationService'
			};
		};

		this.getUserInterfaceLayoutLayout = function getUserInterfaceLayoutLayout() {
			return platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'timekeeping.Layout.userInterfaceLayout',
				['descriptioninfo']);
		};

		this.getOverload = function getOverload(overload) {
			var ovl = null;

			switch (overload) {
				case 'timesymbolfk':
				case 'timesymbolchainedfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'timekeepingTimeSymbolLookupDataService'
					});
					break;
				case 'durationmodefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.timekeepingdurationmode');
					break;
				case 'timesymboluserinterfacefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.timesymbolpresentation');
					break;
				case 'inputphasechainmodefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.inputphasechainmode');
					break;
			}

			return ovl;
		};

	}

})(angular);

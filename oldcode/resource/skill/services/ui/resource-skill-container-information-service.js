/*
 * $Id: resource-skill-container-information-service.js 580913 2020-03-27 10:08:28Z berweiler $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var resourceSkillModule = angular.module('resource.skill');

	/**
	 * @ngdoc service
	 * @name resourceSkillContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	resourceSkillModule.service('resourceSkillContainerInformationService', ResourceSkillContainerInformationService);

	ResourceSkillContainerInformationService.$inject = ['platformLayoutHelperService', 'basicsLookupdataConfigGenerator',
		'resourceCommonLayoutHelperService', 'resourceSkillConstantValues'];

	function ResourceSkillContainerInformationService(platformLayoutHelperService,basicsLookupdataConfigGenerator,
		resourceCommonLayoutHelperService, resourceSkillConstantValues) {
		var self = this;
		var guids = resourceSkillConstantValues.uuid.container;

		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			var config = {};

			switch (guid) {
				case guids.skillList: // resourceSkillListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getResourceSkillServiceInfo(), self.getResourceSkillLayout);
					break;
				case guids.skillDetail: // resourceSkillMainEntityNameDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getResourceSkillServiceInfo(), self.getResourceSkillLayout);
					break;
				case guids.skillChainList: // resourceSkillListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getResourceSkillChainServiceInfo(), self.getResourceSkillChainLayout);
					break;
				case guids.skillChainDetail: // resourceSkillMainEntityNameDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getResourceSkillChainServiceInfo(), self.getResourceSkillChainLayout);
					break;
			}

			return config;
		};

		this.getResourceSkillServiceInfo = function getResourceSkillServiceInfo() {
			return {
				standardConfigurationService: 'resourceSkillLayoutService',
				dataServiceName: 'resourceSkillDataService',
				validationServiceName: 'resourceSkillValidationService'
			};
		};

		this.getResourceSkillLayout = function getResourceSkillLayout() {
			var res = platformLayoutHelperService.getTwoGroupsBaseLayout('1.0.0', 'resource.skill.skill',
				['descriptioninfo', 'skilltypefk', 'skillgroupfk', 'remark', 'isdefault', 'sorting', 'ismandatory', 'typefk'],
				platformLayoutHelperService.getUserDefinedTextGroup(5, null, null, '0'));

			res.overloads = platformLayoutHelperService.getOverloads(['skilltypefk', 'skillgroupfk', 'typefk'], self);
			res.addAdditionalColumns = true;

			return res;
		};

		this.getResourceSkillChainServiceInfo = function getResourceSkillChainServiceInfo() {
			return {
				standardConfigurationService: 'resourceSkillChainLayoutService',
				dataServiceName: 'resourceSkillChainDataService',
				validationServiceName: 'resourceSkillChainValidationService'
			};
		};

		this.getResourceSkillChainLayout = function getResourceSkillChainLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'resource.skill.skillchain',
				['chainedskillfk']);

			res.overloads = platformLayoutHelperService.getOverloads(['chainedskillfk'], self);
			res.addAdditionalColumns = true;

			return res;
		};

		this.getOverload = function getOverloads(overload) {
			var ovl = null;

			switch(overload) {
				case 'skilltypefk': ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.resourceskilltype'); break;
				case 'skillgroupfk': ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.resourceskillgroup'); break;
				case 'chainedskillfk': ovl = resourceCommonLayoutHelperService.provideResourceSkillOverload(); break;
				case 'typefk': ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'resourceTypeLookupDataService',
						cacheEnable: true
					});
			}

			return ovl;
		};
	}
})(angular);

/*
 * $Id: project-main-container-information-service.js 383850 2016-07-14 07:24:36Z zos $
 * Copyright (c) RIB Software AG
 */

(function (angular) {
	'use strict';
	var projectMainModule = angular.module('resource.type');

	/**
	 * @ngdoc service
	 * @name resourceTypeContainerInformationService
	 * @function
	 *
	 * @description
	 */
	projectMainModule.service('resourceTypeContainerInformationService', ResourceTypeContainerInformationService);

	ResourceTypeContainerInformationService.$inject = ['platformLayoutHelperService', 'basicsLookupdataConfigGenerator',
		'resourceCommonLayoutHelperService', 'resourceTypeConstantValues', 'logisticCommonContextService', 'basicsLookupdataLookupFilterService', 'platformContextService'];

	function ResourceTypeContainerInformationService(platformLayoutHelperService, basicsLookupdataConfigGenerator,
		resourceCommonLayoutHelperService, resourceTypeConstantValues, logisticCommonContextService, basicsLookupdataLookupFilterService, platformContextService) {
		var self = this;
		var container = resourceTypeConstantValues.uuid.container;

		/* jshint -W074 */ // ignore cyclomatic complexity warning
		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			var config = {};
			switch (guid) {
				case container.typeList: // resourceTypeListController
					var listConfig = {
						initCalled: false,
						columns: [],
						parentProp: 'ResourceTypeFk',
						childProp: 'SubResources'
					};
					config = platformLayoutHelperService.getGridConfig(self.getResourceTypeServiceInfos(), self.getResourceTypeLayout, listConfig);
					break;
				case container.typeDetail: // resourceTypeDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getResourceTypeServiceInfos(), self.getResourceTypeLayout);
					break;
				case container.requiredSkillList: // resourceTypeRequiredSkillListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getRequiredSkillServiceInfos(), self.getRequiredSkillLayout);
					break;
				case container.requiredSkillDetail: // resourceTypeRequiredSkillDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getRequiredSkillServiceInfos(), self.getRequiredSkillLayout);
					break;
				case container.planningBoardFilterList: // resourceTypePlanningBoardFilterListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getPlanningBoardFilterServiceInfos(), self.getPlanningBoardFilterLayout);
					break;
				case container.planningBoardFilterDetail: // resourceTypePlanningBoardFilterDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getPlanningBoardFilterServiceInfos(), self.getPlanningBoardFilterLayout);
					break;
				case container.requestedTypeList: // requestedTypeListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getRequestedTypeServiceInfos(), self.getRequestedTypeLayout);
					break;
				case container.requestedTypeDetail: // requestedTypeDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getRequestedTypeServiceInfos(), self.getRequestedTypeLayout);
					break;
				case container.requestedSkillVList: // requestedSkillVListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getRequestedSkillVServiceInfos(), self.getRequestedSkillVLayout);
					break;
				case container.requestedSkillVDetail: // requestedSkillVDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getRequestedSkillVServiceInfos(), self.getRequestedSkillVLayout);
					break;
				case container.alternativeResTypeList: // alternativeResTypeListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getAlternativeResTypeServiceInfos(), self.getAlternativeResTypeLayout);
					break;
				case container.alternativeResTypeDetail: // alternativeResTypeDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getAlternativeResTypeServiceInfos(), self.getAlternativeResTypeLayout);
					break;
			}

			return config;
		};

		this.getResourceTypeServiceInfos = function getResourceTypeServiceInfos() {
			return {
				standardConfigurationService: 'resourceTypeLayoutService',
				dataServiceName: 'resourceTypeDataService',
				validationServiceName: 'resourceTypeValidationService'
			};
		};

		this.getResourceTypeLayout = function getResourceTypeLayout() {
			var res = platformLayoutHelperService.getFiveGroupsBaseLayout('1.0.0', 'resource.type.type',
				['descriptioninfo', 'dispatchergroupfk', 'uomfk', 'isplant', 'iscrane', 'istruck', 'isdriver', 'isdetailer',
					'isstructuralengineer', 'hr', 'has2nddemand', 'istrailer', 'istransportpermission', 'commenttext', 'specification', 'mdcmaterialfk', 'prcstructurefk', 'issmalltools',
					'createtemporaryresource', 'plantgroupfk', 'isbulk'
				],
				platformLayoutHelperService.getUserDefinedTextGroup(5, 'userDefTextGroup', 'userdefinedtext', '0'),
				platformLayoutHelperService.getUserDefinedNumberGroup(5, 'userDefNumberGroup', 'userdefinednumber', '0'),
				platformLayoutHelperService.getUserDefinedDateGroup(5, 'userDefDateGroup', 'userdefineddate', '0'),
				platformLayoutHelperService.getUserDefinedBoolGroup(5, 'userDefBoolGroup', 'userdefinedbool', '0')
			);

			res.overloads = platformLayoutHelperService.getOverloads(['dispatchergroupfk', 'uomfk', 'prcstructurefk', 'mdcmaterialfk', 'plantgroupfk'], self);
			res.addition = {
				'grid': [
					{
						'afterId': 'prcstructurefk',
						'id': 'structureDescription',
						'field': 'prcstructurefk',
						'name$tr$': 'cloud.common.entityStructureDescription',
						'formatter': 'lookup',
						'formatterOptions': {
							'lookupType': 'prcstructure',
							'displayMember': 'DescriptionInfo.Translated'
						},
						'width': 150
					}
				],
				'detail': []
			};

			return res;
		};

		this.getRequiredSkillServiceInfos = function getRequiredSkillServiceInfos() {
			return {
				standardConfigurationService: 'resourceTypeRequiredSkillLayoutService',
				dataServiceName: 'resourceTypeRequiredSkillDataService',
				validationServiceName: 'resourceTypeRequiredSkillValidationService'
			};
		};

		this.getRequiredSkillLayout = function getRequiredSkillLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'resource.type.required.skill',
				['skillfk', 'comment']);

			res.overloads = platformLayoutHelperService.getOverloads(['skillfk'], self);

			return res;
		};

		this.getPlanningBoardFilterServiceInfos = function getPlanningBoardFilterServiceInfos() {
			return {
				standardConfigurationService: 'resourceTypePlanningBoardFilterLayoutService',
				dataServiceName: 'resourceTypePlanningBoardFilterDataService',
				validationServiceName: 'resourceTypePlanningBoardFilterValidationService'
			};
		};

		this.getPlanningBoardFilterLayout = function getPlanningBoardFilterLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'resource.type.planningboard.filter',
				['modulefk', 'comment']);

			res.overloads = platformLayoutHelperService.getOverloads(['modulefk'], self);

			return res;
		};

		this.getRequestedTypeServiceInfos = function getRequestedTypeServiceInfos() {
			return {
				standardConfigurationService: 'resourceTypeRequestedTypeLayoutService',
				dataServiceName: 'resourceTypeRequestedTypeDataService',
				validationServiceName: ''
			};
		};

		this.getRequestedTypeLayout = function getRequestedTypeLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'resource.type.requestedtype.filter',
				['typerequestedfk', 'isrequestedentireperiod', 'duration', 'uomdayfk', 'necessaryoperators']);

			res.overloads = platformLayoutHelperService.getOverloads(['typerequestedfk', 'uomdayfk'], self);

			return res;
		};

		this.getRequestedSkillVServiceInfos = function getRequestedSkillVServiceInfos() {
			return {
				standardConfigurationService: 'resourceTypeRequestedSkillVLayoutService',
				dataServiceName: 'resourceTypeRequestedSkillVDataService',
				validationServiceName: ''
			};
		};

		this.getRequestedSkillVLayout = function getRequestedSkillVLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'resource.type.requestedskillv.filter',
				['typerequestedfk', 'resskillfk', 'isrequestedentireperiod', 'duration', 'uomdayfk', 'necessaryoperators']);

			res.overloads = platformLayoutHelperService.getOverloads(['typerequestedfk', 'resskillfk', 'uomdayfk'], self);

			return res;
		};

		this.getAlternativeResTypeServiceInfos = function getAlternativeResTypeServiceInfos() {
			return {
				standardConfigurationService: 'resourceTypeAlternativeResTypeLayoutService',
				dataServiceName: 'resourceTypeAlternativeTypeDataService',
				validationServiceName: 'resourceTypeAlternativeTypeValidationService'
			};
		};

		this.getAlternativeResTypeLayout = function getAlternativeResTypeLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'resource.type.alternativerestype',
				['plantgroupfk', 'resaltertypefk', 'quantity']);

			res.overloads = platformLayoutHelperService.getOverloads(['plantgroupfk', 'resaltertypefk'], self);

			return res;
		};

		this.getOverload = function getOverloads(overload) {
			var ovl = null;

			switch (overload) {
				case 'uomfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsUnitLookupDataService',
						cacheEnable: true
					});
					break;
				case 'typerequestedfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'resourceTypeLookupDataService',
						cacheEnable: true
					});
					break;
				case 'uomdayfk' :
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsUnitLookupDataService',

					cacheEnable: true
				});
					break;
				case 'mdcmaterialfk':
					ovl = {
						navigator: {
							moduleName: 'basics.material'
						},
						grid: {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'MaterialCommodity',
								displayMember: 'Code'
							},
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									showClearButton: true,
									additionalColumns: true,
									addGridColumns: [{
										id: 'Description',
										field: 'DescriptionInfo.Translated',
										width: 150,
										name: 'Description',
										name$tr$: 'cloud.common.entityDescription'
									}]
								},
								directive: 'basics-material-material-lookup'
							},
							width: 100
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupOptions: {
									showClearButton: true
								},
								lookupDirective: 'basics-material-material-lookup',
								displayMember: 'Code',
								descriptionMember: 'DescriptionInfo.Translated'
							}
						}
					};
					break;

				case 'prcstructurefk':
					ovl = {
						navigator: {
							moduleName: 'basics.procurementstructure'
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-procurementstructure-structure-dialog',
								lookupOptions: {
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'prcstructure',
								displayMember: 'Code'
							}
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-procurementstructure-structure-dialog',
								descriptionField: 'StructureDescription',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									initValueField: 'StructureCode',
									showClearButton: true
								}
							}
						}
					};
					break;
				case 'dispatchergroupfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.logisticsdispatchergroup');
					break;
				case 'skillfk':
					ovl = resourceCommonLayoutHelperService.provideResourceSkillOverload();
					break;
				case 'resskillfk':
					ovl = resourceCommonLayoutHelperService.provideResourceSkillOverload();
					break;
				case 'modulefk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName: 'resourceTypePlanningBoardModuleFilterLookupDataService'},
						{required: true});
					break;
				case 'groupfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.resourcegroup');
					break;
				case 'plantgroupfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'resourceEquipmentGroupLookupDataService',
						cacheEnable: true,
						readonly: true,
						additionalColumns: false
					});
					break;
				case 'resaltertypefk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'resourceTypeLookupDataService',
						cacheEnable: true,
						additionalColumns: true
					});
					break;
			}

			return ovl;
		};
	}
})(angular);

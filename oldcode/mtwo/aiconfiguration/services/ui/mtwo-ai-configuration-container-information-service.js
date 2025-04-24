/*
 * $Id: mtwo-ai-configuration-container-information-service.js 627575 2021-03-15 06:14:44Z chd $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let mainModule = angular.module('mtwo.aiconfiguration');

	/**
	 * @ngdoc service
	 * @name mtwoAIConfigurationContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	mainModule.service('mtwoAIConfigurationContainerInformationService', MtwoAIConfigurationContainerInformationService);

	MtwoAIConfigurationContainerInformationService.$inject = ['_', '$injector', 'platformLayoutHelperService', 'mtwoAIConfigurationConstantValues'];

	function MtwoAIConfigurationContainerInformationService(_, $injector, platformLayoutHelperService, mtwoAIConfigurationConstantValues) {
		let self = this;
		let guids = mtwoAIConfigurationConstantValues.uuid.container;

		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			let config = {};
			let listConfig = {
				initCalled: false, columns: [], parentProp: 'MtoModelParameterFk', childProp: 'ChildItems',
				type: 'ModelParameter', dragDropService: null
			};

			switch (guid) {
				case guids.modelList: // mtwoAIConfigurationModelListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getModelListServiceInfos(), self.getModelListLayout);
					config.validationServiceName = 'mtwoAIConfigurationHeaderValidationService';
					break;
				case guids.modelVersion: // mtwoAIConfigurationModelVersionController
					config = platformLayoutHelperService.getStandardGridConfig(self.getModelVersionServiceInfos(), self.getModelVersionLayout);
					break;
				case guids.modelInput: // mtwoAIConfigurationModelInputParameterController
					config = platformLayoutHelperService.getGridConfig(self.getModelInputParameterServiceInfos(), null, listConfig);
					break;
				case guids.modelOutput: // mtwoAIConfigurationModelOutputParameterController
					config = platformLayoutHelperService.getGridConfig(self.getModelInputParameterServiceInfos(), null, listConfig);
					break;
				default:
					break;
			}

			return config;
		};

		this.getModelListServiceInfos = function getModelListServiceInfos() {
			return {
				standardConfigurationService: 'mtwoAIConfigurationModelListUIStandardService',
				dataServiceName: 'mtwoAIConfigurationModelListDataService'
			};
		};

		this.getModelVersionServiceInfos = function getModelVersionServiceInfos() {
			return {
				standardConfigurationService: 'mtwoAIConfigurationModelVersionUIStandardService',
				dataServiceName: 'mtwoAIConfigurationModelVersionService'
			};
		};

		this.getModelInputParameterServiceInfos = function getModelInputParameterServiceInfos() {
			return {
				standardConfigurationService: 'mtwoAIConfigurationModelInputParameterUIStandardService',
				dataServiceName: 'mtwoAIConfigurationModelInputParameterService'
			};
		};

		this.getModelOutputParameterServiceInfos = function getModelOutputParameterServiceInfos() {
			return {
				standardConfigurationService: 'mtwoAIConfigurationModelOutputParameterUIStandardService',
				dataServiceName: 'mtwoAIConfigurationModelOutputParameterService'
			};
		};

		this.getModelListLayout = function getModelListLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'mtwo.aiconfiguration.modelList',
				['id', 'code', 'description']);

			res.overloads = platformLayoutHelperService.getOverloads(['id'], self);
			return res;
		};

		this.getModelVersionLayout = function getModelVersionLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'mtwo.aiconfiguration.modelVersion',
				['description', 'islive', 'modeltype', 'guid']);

			res.overloads = platformLayoutHelperService.getOverloads(['modeltype', 'guid'], self);
			return res;
		};

		this.getModelInputParameterLayout = function getModelInputParameterLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'mtwo.aiconfiguration.modelInput',
				['name', 'valuetype', 'alias']);

			res.overloads = platformLayoutHelperService.getOverloads(['name', 'valuetype'], self);
			return res;
		};

		this.getModelOutputParameterLayout = function getModelOutputParameterLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'mtwo.aiconfiguration.modelOutput',
				['name', 'valuetype']);

			res.overloads = platformLayoutHelperService.getOverloads(['name', 'valuetype'], self);
			return res;
		};

		this.getOverloads = function getOverloads(overloads) {
			let ovls = {};
			if (overloads) {
				_.forEach(overloads, function (ovl) {
					var ol = self.getOverload(ovl);
					if (ol) {
						ovls[ovl] = ol;
					}
				});
			}

			return ovls;
		};

		this.getOverload = function getOverloads(overload) {
			let ovl = null;

			switch (overload) {
				case 'id':
					ovl = {readonly: true};
					break;
				case 'code':
					ovl = {readonly: true};
					break;
				case 'description':
					ovl = {readonly: true};
					break;
				case 'name':
					ovl = {readonly: true};
					break;
				case 'valuetype':
					ovl = {readonly: true};
					break;
				case 'guid':
					ovl = {readonly: true};
					break;
				case 'modeltype':
					ovl = {
						'grid': {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'modelType',
								displayMember: 'Description',
								dataServiceName: 'mtwoAIConfigurationModelTypeLookupService'
							}
						},
						readonly: true
					};
					break;
			}
			return ovl;
		};
	}
})(angular);

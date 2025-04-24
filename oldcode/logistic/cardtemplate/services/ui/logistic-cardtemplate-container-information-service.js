/*
 * $Id: logistic-cardtemplate-container-information-service.js 619799 2021-01-13 15:45:40Z henkel $
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	var logisticCardtemplateModule = angular.module('logistic.cardtemplate');

	/**
	 * @ngdoc service
	 * @name logisticCardtemplateContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	logisticCardtemplateModule.service('logisticCardtemplateContainerInformationService', LogisticCardtemplateContainerInformationService);

	LogisticCardtemplateContainerInformationService.$inject = ['platformLayoutHelperService','basicsLookupdataConfigGenerator',
		'logisticCardTemplateConstantValues', 'logisticCommonLayoutOverloadService', 'basicsLookupdataLookupFilterService',
		'resourceWotLookupConfigGenerator'];

	function LogisticCardtemplateContainerInformationService(platformLayoutHelperService, basicsLookupdataConfigGenerator,
		logisticCardTemplateConstantValues, logisticCommonLayoutOverloadService, basicsLookupdataLookupFilterService,
		resourceWotLookupConfigGenerator) {

		var self = this;
		var guids = logisticCardTemplateConstantValues.uuid.container;

		(function registerFilter(){
			var jobCardTemplateRelatedFilter = [
				{
					key: 'logistic-job-category-by-rubric-filter',
					fn: function (rubricCategory /* , entity */) {
						return rubricCategory.RubricFk === 37;  // Rubric for jobcard
					}
				},
				{
					key: 'logistic-material-filter',
					serverSide: true,
					fn: function (entity, searchOptions) {
						if (entity) {
							searchOptions.MaterialTypeFilter = {
								IsForLogistics: true,
							};
						}
					}
				},
				{
					key: 'logistic-card-rubric-category-lookup-filter',
					serverKey: 'rubric-category-by-rubric-company-lookup-filter',
					serverSide: true,
					fn: function () {
						return { Rubric: 37 };//37 is rubric for job card.
					}
				}
			];
			basicsLookupdataLookupFilterService.registerFilter(jobCardTemplateRelatedFilter);
		})();


		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			var config = {};

			switch (guid) {
				case guids.cardTemplateList: // logisticCardTemplateListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getCardTemplateServiceInfo(), self.getCardTemplateLayout);
					break;
				case guids.cardTemplateDetails: // logisticCardTemplateDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getCardTemplateServiceInfo(), self.getCardTemplateLayout);
					break;
				case guids.cardTemplateActivityList: // logisticCardTemplateActivityListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getCardTemplateActivityServiceInfo(), self.getCardTemplateActivityLayout);
					break;
				case guids.cardTemplateActivityDetails: // logisticCardTemplateActivityDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getCardTemplateActivityServiceInfo(), self.getCardTemplateActivityLayout);
					break;
				case guids.cardTemplateRecordList: // logisticCardTemplateRecordListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getCardTemplateRecordServiceInfo(), self.getCardTemplateRecordLayout);
					break;
				case guids.cardTemplateRecordDetails: // logisticCardTemplateRecordDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getCardTemplateRecordServiceInfo(), self.getCardTemplateRecordLayout);
					break;
				case guids.cardTemplateDocumentList: // logisticCardTemplateDocumentListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getCardTemplateDocumentServiceInfo(), self.getCardTemplateDocumentLayout);
					break;
				case guids.cardTemplateDocumentDetails: // logisticCardTemplateDocumentDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getCardTemplateDocumentServiceInfo(), self.getCardTemplateDocumentLayout);
					break;
			}

			return config;
		};

		this.getCardTemplateServiceInfo = function getCardTemplateServiceInfo() {
			return {
				standardConfigurationService: 'logisticCardTemplateLayoutService',
				dataServiceName: 'logisticCardTemplateDataService',
				validationServiceName: 'logisticCardTemplateValidationService'
			};
		};

		this.getCardTemplateLayout = function getCardTemplateLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'logistic.cardtemplate.card',
				['code', 'descriptioninfo', 'comment', 'remark', 'workoperationtypefk', 'resourcefk','rubriccategoryfk']);

			res.overloads = platformLayoutHelperService.getOverloads(['workoperationtypefk', 'resourcefk','rubriccategoryfk'], self);
			res.addAdditionalColumns = true;

			return res;
		};

		this.getCardTemplateActivityServiceInfo = function getCardTemplateActivityServiceInfo() {
			return {
				standardConfigurationService: 'logisticCardTemplateActivityLayoutService',
				dataServiceName: 'logisticCardTemplateActivityDataService',
				validationServiceName: 'logisticCardTemplateActivityValidationService'
			};
		};

		this.getCardTemplateActivityLayout = function getCardTemplateActivityLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'logistic.cardtemplate.activity',
				['code', 'descriptioninfo', 'comment', 'remark']);

			// res.overloads = platformLayoutHelperService.getOverloads([], self);
			res.addAdditionalColumns = true;

			return res;
		};

		this.getCardTemplateRecordServiceInfo = function getCardTemplateRecordServiceInfo() {
			return {
				standardConfigurationService: 'logisticCardTemplateRecordLayoutService',
				dataServiceName: 'logisticCardTemplateRecordDataService',
				validationServiceName: 'logisticCardTemplateRecordValidationService'
			};
		};

		this.getCardTemplateRecordLayout = function getCardTemplateRecordLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'logistic.cardtemplate.record',
				['code', 'descriptioninfo', 'quantity', 'uomfk', 'comment', 'remark', 'jobcardrecordtypefk', 'workoperationtypefk', 'cardrecordfk', 'cardrecorddescription']);

			res.overloads = platformLayoutHelperService.getOverloads(['jobcardrecordtypefk', 'cardrecordfk', 'uomfk'], self);
			res.overloads.workoperationtypefk = resourceWotLookupConfigGenerator.provideWotLookupOverloadFilteredByPlant(true, 'PlantFk');
			res.addAdditionalColumns = true;

			return res;
		};

		this.getCardTemplateDocumentServiceInfo = function getCardTemplateDocumentServiceInfo() {
			return {
				standardConfigurationService: 'logisticCardTemplateDocumentLayoutService',
				dataServiceName: 'logisticCardTemplateDocumentDataService',
				validationServiceName: 'logisticCardTemplateDocumentValidationService'
			};
		};

		this.getCardTemplateDocumentLayout = function getCardTemplateDocumentLayout() {
			var res = platformLayoutHelperService.getFiveGroupsBaseLayout('1.0.0', 'logistic.card.document',
				['description', 'jobcarddocumenttypefk', 'documenttypefk', 'date', 'barcode', 'originfilename', 'url']);
			res.overloads = platformLayoutHelperService.getOverloads(['jobcarddocumenttypefk', 'documenttypefk', 'jobcarddoctypefk', 'originfilename', 'url'], self);
			res.addAdditionalColumns = true;

			return res;
		};


		this.getOverload = function getOverloads(overload) {
			var ovl = null;

			switch(overload) {
				case 'skilltypefk': ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.resourceskilltype'); break;
				case 'jobcardrecordtypefk': ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.jobcardrecordtype'); break;
				case 'cardrecordfk': ovl = logisticCommonLayoutOverloadService.getCardRecordLookupOverload(); break;
				case 'uomfk': ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig(platformLayoutHelperService.provideUoMLookupSpecification()); break;
				case 'workoperationtypefk': ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'resourceWorkOperationTypeLookupDataService'}); break;
				case 'resourcefk':ovl = platformLayoutHelperService.provideResourceLookupOverload(); break;
				case 'documenttypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.documenttype');
					break;
				case 'jobcarddocumenttypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.jobcarddocumenttype');
					break;
				case 'originfilename':
					ovl = {readonly: true};
					break;
				case 'rubriccategoryfk':
					ovl = {
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
								lookupOptions: {
									filterKey: 'logistic-card-rubric-category-lookup-filter',
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {'lookupType': 'RubricCategoryByRubricAndCompany', 'displayMember': 'Description'},
							width: 125
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
								descriptionMember: 'Description',
								lookupOptions: {
									filterKey: 'logistic-card-rubric-category-lookup-filter',
									showClearButton: true
								}
							}
						}
					};
					break;
			}

			return ovl;
		};
	}
})(angular);

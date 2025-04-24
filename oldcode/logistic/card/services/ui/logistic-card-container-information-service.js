/*
 * $Id: logistic-card-container-information-service.js 633446 2021-04-22 15:13:17Z baf $
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	const logisticCardModule = angular.module('logistic.card');

	/**
	 * @ngdoc service
	 * @name logisticCardContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	logisticCardModule.service('logisticCardContainerInformationService', LogisticCardContainerInformationService);

	LogisticCardContainerInformationService.$inject = ['_', '$injector','platformLayoutHelperService', 'basicsLookupdataConfigGenerator','logisticCardActivityDataService',
		'logisticCardConstantValues', 'logisticCommonLayoutOverloadService','resourceWotLookupConfigGenerator', 'logisticCardDataService','basicsLookupdataLookupFilterService','resourceCommonContainerInformationService','resourceCommonLayoutHelperService'];

	function LogisticCardContainerInformationService(_, $injector,platformLayoutHelperService, basicsLookupdataConfigGenerator,logisticCardActivityDataService,
		logisticCardConstantValues, logisticCommonLayoutOverloadService, resourceWotLookupConfigGenerator, logisticCardDataService,basicsLookupdataLookupFilterService,resourceCommonContainerInformationService,resourceCommonLayoutHelperService) {
		let self = this;
		const guids = logisticCardConstantValues.uuid.container;

		(function registerFilter(){
			var jobCardRelatedFilter = [
				{
					key: 'logistic-job-card-by-division-filter',
					fn: function filterJobCardByDivision(item) {
						const card = $injector.get('logisticCardDataService').getSelected();
						return item && card && item.DivisionFk === card.EquipmentDivisionFk;
					}
				},
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
				},
				{
					key: 'logistic-dispatching-rubric-category-lookup-filter',
					serverKey: 'rubric-category-by-rubric-company-lookup-filter',
					serverSide: true,
					fn: function () {
						return { Rubric: 34 };//34 is rubric for dispatching.
					}
				}
			];
			basicsLookupdataLookupFilterService.registerFilter(jobCardRelatedFilter);
		})();

		/* jshint -W074 */ // There is no complexity; try harder, J.S.Hint.
		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			let config = {};

			switch (guid) {
				case guids.cardList: // logisticCardListController
					// config = platformLayoutHelperService.getStandardGridConfig(self.getCardServiceInfo(), self.getCardLayout);
					config = platformLayoutHelperService.getStandardGridConfig(self.getCardServiceInfo());
					break;
				case guids.cardDetails: // logisticCardDetailController
					// config = platformLayoutHelperService.getStandardDetailConfig(self.getCardServiceInfo(), self.getCardLayout);
					config = platformLayoutHelperService.getStandardDetailConfig(self.getCardServiceInfo());
					break;
				case guids.activityList: // logisticCardActivityListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getActivityServiceInfo(), self.getActivityLayout);
					break;
				case guids.activityDetails: // logisticCardActivityDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getActivityServiceInfo(), self.getActivityLayout);
					break;

				case guids.recordList: // logisticCardRecordListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getRecordServiceInfo(), self.getRecordLayout);
					break;

				case guids.recordDetails: // logisticCardRecordDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getRecordServiceInfo(), self.getRecordLayout);
					break;
				case guids.cardDocumentList: // logisticCardDocumentListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getCardDocumentServiceInfo(), self.getCardDocumentLayout);
					break;
				case guids.cardDocumentDetails: // logisticCardDocumentDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getCardDocumentServiceInfo(), self.getCardDocumentLayout);
					break;
				case guids.cardWorkList: // logisticCardWorkListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getCardWorkServiceInfo(), self.getCardWorkLayout);
					break;
				case guids.cardWorkDetails: // logisticCardWorkDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getCardWorkServiceInfo(), self.getCardWorkLayout);
					break;
				case guids.cardActivityClerkList: // logisticCardActivityClerkListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getCardActivityClerkServiceInfo(), self.getCardActivityClerkLayout);
					break;
				case guids.cardActivityClerkDetails: // logisticCardActivityClerkDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getCardActivityClerkServiceInfo(), self.getCardWorkLayout);
					break;
				case guids.plantCompatibleMaterialList:
					config = platformLayoutHelperService.getStandardGridConfig(self.getPlantCompatibleMaterialServiceInfo());
					break;
				case guids.plantCompatibleMaterialDetails:
					config = platformLayoutHelperService.getStandardDetailConfig(self.getPlantCompatibleMaterialServiceInfo());
					break;

				case guids.plantLocationList:
					config = platformLayoutHelperService.getStandardGridConfig(self.getPlantLocationViewServiceInfo());
					break;
				case guids.plantLocationDetails:
					config = platformLayoutHelperService.getStandardDetailConfig(self.getPlantLocationViewServiceInfo()
					);
					break;

			}

			return config;
		};

		this.getCardServiceInfo = function getCardServiceInfo() {
			return {
				standardConfigurationService: 'logisticCardLayoutService',
				dataServiceName: 'logisticCardDataService',
				validationServiceName: 'logisticCardValidationService'
			};
		};

		this.getCardLayout = function getCardLayout() {
			let res = platformLayoutHelperService.getFiveGroupsBaseLayout('1.0.0', 'logistic.card.card',
				['code', 'description', 'plannedstart', 'plannedfinish', 'workoperationtypefk', 'actualstart', 'actualfinish',
					'jobfk', 'jobcardtemplatefk', 'dispatchheaderfk', 'jobcardstatusfk', 'reservationfk', 'comment', 'plantfk','resourcefk','requisitionfk','rubriccategoryfk','jobcardareafk','jobcardgroupfk','jobcardpriorityfk',
					'basclerkownerfk','basclerkresponsiblefk','meterreading','notdonecount','jobperformingfk'],
				platformLayoutHelperService.getUserDefinedTextGroup(5, 'userDefTextGroup', 'userdefinedtext', '0'),
				platformLayoutHelperService.getUserDefinedNumberGroup(5, 'userDefNumberGroup', 'userdefinednumber', '0'),
				platformLayoutHelperService.getUserDefinedDateGroup(5, 'userDefDateGroup', 'userdefineddate', '0'));

			res.overloads = platformLayoutHelperService.getOverloads(['jobfk', 'jobcardtemplatefk', 'dispatchheaderfk', 'jobcardstatusfk', 'workoperationtypefk',
				'reservationfk', 'plantfk','resourcefk','requisitionfk','rubriccategoryfk','jobcardareafk','jobcardgroupfk','jobcardpriorityfk','basclerkownerfk','basclerkresponsiblefk','jobperformingfk'], self);
			res.addAdditionalColumns = true;
			res.overloads.notdonecount={readonly: true};
			return res;
		};
		/*Card structure*/
		this.getCardStructureLayout = function getCardStructureLayout() {
			let res = platformLayoutHelperService.getFiveGroupsBaseLayout('1.0.0', 'logistic.card.card',
				['plantfk','jobfk', 'jobcardtemplatefk', 'dispatchheaderfk', 'jobcardstatusfk','rubriccategoryfk','jobcardareafk','jobcardgroupfk','jobcardpriorityfk']);

			res.overloads = platformLayoutHelperService.getOverloads(['plantfk','jobfk', 'jobcardtemplatefk', 'dispatchheaderfk', 'jobcardstatusfk','rubriccategoryfk','jobcardareafk','jobcardgroupfk','jobcardpriorityfk'], self);
			return res;
		};

		/*Clerk Activity*/
		this.getCardActivityClerkServiceInfo = function getCardActivityClerkServiceInfo() {
			return {
				standardConfigurationService: 'logisticCardActivityClerkLayoutService',
				dataServiceName: 'logisticCardActivityClerkDataService',
				validationServiceName: 'logisticCardActivityClerkValidationService'
			};
		};

		this.getPlantLocationViewServiceInfo = function getPlantLocationViewServiceInfo() {
			return resourceCommonContainerInformationService.getPlantLocationListInfo('logisticCardPlantLocationDataService');
			};

		this.getCardActivityClerkLayout = function getCardActivityClerkLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'logistic.card.activityclerk',
				['clerkfk', 'start','finish']);

			res.overloads = platformLayoutHelperService.getOverloads(['clerkfk', 'jobcardfk'], self);
			res.addAdditionalColumns = true;

			return res;
		};

		/*Clerk Activity*/


		this.getActivityServiceInfo = function getActivityServiceInfo() {
			return {
				standardConfigurationService: 'logisticCardActivityLayoutService',
				dataServiceName: 'logisticCardActivityDataService',
				validationServiceName: 'logisticCardActivityValidationService'
			};
		};

		this.getActivityLayout = function getActivityLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'logistic.card.activity',
				['code', 'description','remark','comment','clerkfk','isdone','actualstartdate','actualstopdate','jobcardareafk']);

			res.overloads = platformLayoutHelperService.getOverloads(['clerkfk','jobcardareafk'], self);
			res.addAdditionalColumns = true;

			return res;
		};

		this.getRecordServiceInfo = function getRecordServiceInfo() {
			return {
				standardConfigurationService: 'logisticCardRecordLayoutService',
				dataServiceName: 'logisticCardRecordDataService',
				validationServiceName: 'logisticCardRecordValidationService'
			};
		};

		this.getRecordLayout = function getRecordLayout() {
			let res = platformLayoutHelperService.getFiveGroupsBaseLayout('1.0.0', 'logistic.card.record',
				['recordno', 'description','jobcardrecordtypefk', 'cardrecordfk', 'cardrecorddescription', 'uomfk', 'dispatchrecordfk',
					'workoperationtypefk','quantity','deliveredquantity','acceptedquantity','employeefk',
					'procurementstructurefk', 'reservationid'],
				platformLayoutHelperService.getUserDefinedTextGroup(6, 'userDefTextGroup', 'userdefinedtext', '0'),
				platformLayoutHelperService.getUserDefinedNumberGroup(6, 'userDefNumberGroup', 'userdefinednumber', '0'),
				platformLayoutHelperService.getUserDefinedDateGroup(6, 'userDefDateGroup', 'userdefineddate', '0'));

			res.overloads = platformLayoutHelperService.getOverloads(['cardrecordfk', 'jobcardrecordtypefk', 'dispatchrecordfk',
				'workoperationtypefk', 'employeefk', 'uomfk', 'procurementstructurefk', 'reservationid'], self);
			res.addAdditionalColumns = true;

			return res;
		};


		this.getCardDocumentServiceInfo = function getCardDocumentServiceInfo() {
			return {
				standardConfigurationService: 'logisticCardDocumentLayoutService',
				dataServiceName: 'logisticCardDocumentDataService',
				validationServiceName: 'logisticCardDocumentValidationService'
			};
		};

		this.getCardDocumentLayout = function getCardDocumentLayout() {
			let res = platformLayoutHelperService.getFiveGroupsBaseLayout('1.0.0', 'logistic.card.document',
				['descriptioninfo', 'jobcarddoctypefk', 'documenttypefk', 'date', 'barcode', 'originfilename', 'url']);
			res.overloads = platformLayoutHelperService.getOverloads(['documenttypefk', 'jobcarddoctypefk', 'originfilename', 'url'], self);
			res.addAdditionalColumns = true;

			return res;
		};

		this.getCardWorkServiceInfo = function getCardWorkServiceInfo() {
			return{
				standardConfigurationService: 'logisticCardWorkLayoutService',
				dataServiceName: 'logisticCardWorkDataService',
				validationServiceName: ''
			};
		};

		this.getCardWorkLayout = function getCardWorkLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0','logistic.card.work',
				['employeefk','workstart','workend','workday','workbreak','workingminutes','totaltime','sundryservicefk']);
			res.overloads =platformLayoutHelperService.getOverloads(['employeefk','sundryservicefk'],self);
			res.addAdditionalColumns= true;
			res.overloads.totaltime = {readonly: true};

			return res;
		};

		this.getPlantCompatibleMaterialServiceInfo = function getPlantCompatibleMaterialServiceInfo() {
			return {
				standardConfigurationService: 'logisticCardPlantCompatibleMaterialLayoutService',
				dataServiceName: 'logisticCardPlantCompatibleMaterialDataService'
			};
		};

		this.getOverload = function getOverloads(overload) {
			var ovl = null;

			switch(overload) {
				case 'cardrecordfk':
					ovl = logisticCommonLayoutOverloadService.getCardRecordLookupOverload();
					break;
				case 'jobcardtemplatefk':
					ovl = logisticCommonLayoutOverloadService.getCardTemplateLookupOverload();
					break;
				case 'dispatchheaderfk':
					ovl = logisticCommonLayoutOverloadService.getDispatchHeaderLookupOverload('DispatchHeaderFk', true);
					break;
				case 'clerkfk':
					ovl = platformLayoutHelperService.provideClerkLookupOverload(true);
					break;
				case 'dispatchrecordfk':
					ovl = {
						navigator: {
							moduleName: 'logistic.dispatching'
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'logistic-dispatching-record-dialog-lookup',
								lookupOptions: {
									showClearButton: true,
									additionalFilters: [{
										'headerFk': 'DispatchHeaderFk',
										getAdditionalEntity: function () {
											var item = logisticCardDataService.getSelected();
											if (!item) {
												item = {
													'DispatchHeaderFk': null
												};
											}
											return item;
										}
									}]
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'DispatchRecord',
								displayMember: 'RecordNo',
								version: 3
							}
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'logistic-dispatching-record-dialog-lookup',
								displayMember: 'RecordNo',
								descriptionMember: 'Description',
								showClearButton: true,
								version: 3,
								lookupOptions: {
									additionalFilters: [{
										'headerFk': 'DispatchHeaderFk',
										getAdditionalEntity: function () {
											var item = logisticCardDataService.getSelected();
											if (!item) {
												item = {
													'DispatchHeaderFk': null
												};
											}
											return item;
										}
									}]
								}
							}
						}
					};
					break;
				case 'employeefk': ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'timekeepingEmployeeLookupDataService'
				}); break;
				case 'jobfk':
					ovl = platformLayoutHelperService.provideJobLookupOverload({projectFk: 'ProjectFk'});
					break;
				case 'jobcardrecordtypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.jobcardrecordtype');
					break;
				case 'jobcardstatusfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.jobcardstatus', null, {showIcon: true});
					break;
				case 'plantfk':
					ovl = platformLayoutHelperService.providePlantLookupOverload();
					break;
				case 'procurementstructurefk':
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

				case 'reservationfk':
					ovl = logisticCommonLayoutOverloadService.getResourceReservationLookupOverload('ReservationFk', false, false);
					break;
				case 'workoperationtypefk':
					ovl = resourceWotLookupConfigGenerator.provideWotLookupOverloadFilteredByPlant(true, 'PlantFk');
					break;
				case 'documenttypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.documenttype');
					break;
				case 'jobcarddoctypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.jobcarddocumenttype');
					break;
				case 'originfilename':
					ovl =  {readonly: true };
					break;
				case 'uomfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig(platformLayoutHelperService.provideUoMLookupSpecification());
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
				case 'resourcefk':
					ovl = platformLayoutHelperService.provideResourceLookupOverload();
					break;
				case 'requisitionfk':
					ovl = {
						readonly: true,
						grid: {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'resourceRequisition',
								version: 3,
								displayMember: 'Description'
							},
							width: 70
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'resource-requisition-lookup-dialog-new',
								descriptionMember: 'Description',
								displayMember: 'Code',
								showClearButton: true,
								lookupOptions:{
									defaultFilter:{resourceFk: 'ResourceFk'}
								}
							}
						}
					};
					break;
				case 'jobcardareafk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.jobcardarea',null,{
						field: 'DivisionFk',
						filterKey: 'logistic-job-card-by-division-filter',
						customIntegerProperty: 'ETM_DIVISION_FK'
					});
					break;
				case 'jobcardgroupfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.jobcardgroup',null,{
						field: 'DivisionFk',
						filterKey: 'logistic-job-card-by-division-filter',
						customIntegerProperty: 'ETM_DIVISION_FK'
					});
					break;
				case 'jobcardpriorityfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.jobcardpriority',null,{
						field: 'DivisionFk',
						filterKey: 'logistic-job-card-by-division-filter',
						customIntegerProperty: 'ETM_DIVISION_FK'
					});
					break;
				case 'sundryservicefk':
					ovl =basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'logisticSundryServiceLookupDataService'
					});
					break;
				case 'basclerkownerfk':
					ovl =platformLayoutHelperService.provideClerkLookupOverload();// true, 'BasClerkOwnerFk'
					break;
				case 'basclerkresponsiblefk':
					ovl =platformLayoutHelperService.provideClerkLookupOverload();// true, 'BasClerkResponsibleFk'
					break;
				case 'jobperformingfk':
					ovl = platformLayoutHelperService.provideJobLookupOverload();
					break;
				case 'reservationid':
					ovl = {
						navigator: {
							moduleName: 'procurement.stock'
						},
						readonly: true
					};
					break;
			}

			return ovl;
		};
	}
})(angular);

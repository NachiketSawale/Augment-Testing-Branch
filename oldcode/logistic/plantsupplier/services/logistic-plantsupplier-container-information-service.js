/*
 * $Id: logistic-plantsupplier-container-information-service.js 55501 2022-09-27 10:09:21Z winjit.nikhil.tajanpure $
 * Copyright (c) RIB Software SE
 */
(function (angular) {
	'use strict';
	var logisticPlantsupplierModule = angular.module('logistic.plantsupplier');
	/**
	 * @ngdoc service
	 * @name logisticPlantsupplierContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	logisticPlantsupplierModule.service('logisticPlantsupplierContainerInformationService', LogisticPlantsupplierContainerInformationService);
	LogisticPlantsupplierContainerInformationService.$inject = ['_', '$injector', 'platformLayoutHelperService', 'logisticPlantSupplierConstantValues', 'basicsLookupdataConfigGenerator', 'resourceCommonLayoutHelperService', 'basicsCommonComplexFormatter', 'basicsLookupdataLookupFilterService', 'logisticJobDialogLookupDataService', 'projectStockLookupDataService', 'logisticDispatchingHeaderDataService'];
	function LogisticPlantsupplierContainerInformationService(_, $injector, platformLayoutHelperService, logisticPlantSupplierConstantValues, basicsLookupdataConfigGenerator, resourceCommonLayoutHelperService, basicsCommonComplexFormatter, basicsLookupdataLookupFilterService, logisticJobDialogLookupDataService, projectStockLookupDataService, logisticDispatchingHeaderDataService) {
		let self = this;
		const guids = logisticPlantSupplierConstantValues.uuid.container;
		let dynamicConfigurations = {};
		let filters = [{
			key: 'plant-supplier-rubric-category-by-rubric-filter',
			fn: function filterCategoryByRubric(item) {
				return item.RubricFk === 105;
			}
		}, {
			key: 'logistic-plantsupply-job-by-supply-type-filter',
			serverSide: true,
			serverKey: 'logisticplantsupplyfilter',
			fn: function (entity, searchOptions) {
				if (entity) {
					searchOptions.MaterialTypeFilter = {
						IsForLogistics: true,
					};
				}
			}
		},
		{
			key: 'plant-supplier-rubric-category-lookup-filter',
			serverKey: 'rubric-category-by-rubric-company-lookup-filter',
			serverSide: true,
			fn: function () {
				return { Rubric: 105 };//105 is rubric for plant supplier.
			}
		}
		];
		basicsLookupdataLookupFilterService.registerFilter(filters);
		/* jshint -W074 */ // There is no complexity; try harder, J.S.Hint.
		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			var config = {};
			switch (guid) {
				case guids.plantSupplierList:
					config = platformLayoutHelperService.getStandardGridConfig(self.getPlantSupplierServiceInfo(), self.getPlantSupplierLayout);
					break;
				case guids.plantSupplierDetails:
					config = platformLayoutHelperService.getStandardDetailConfig(self.getPlantSupplierServiceInfo(), self.getPlantSupplierLayout);
					break;
				case guids.plantSupplyItemList:
					config = platformLayoutHelperService.getStandardGridConfig(self.getPlantSupplyItemServiceInfos(), self.getPlantSupplyItemLayout);
					break;
				case guids.plantSupplyItemDetails:
					config = platformLayoutHelperService.getStandardDetailConfig(self.getPlantSupplyItemServiceInfos(), self.getPlantSupplyItemLayout);
					break;
				default:
					config = self.hasDynamic(guid) ? dynamicConfigurations[guid] : {};
					break;
			}
			return config;
		};
		this.getPlantSupplierServiceInfo = function getPlantSupplierServiceInfo() {
			return {
				standardConfigurationService: 'logisticPlantSupplierLayoutService',
				dataServiceName: 'logisticPlantSupplierDataService',
				validationServiceName: 'logisticPlantSupplierValidationService'
			};
		};
		this.getPlantSupplierLayout = function getPlantSupplierLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'logistic.plantsupplier',
				['code', 'description', 'rubriccategoryfk', 'jobfk', 'controllingunitfk', 'projectstockfk', 'isactive']);
			res.overloads = platformLayoutHelperService.getOverloads(['rubriccategoryfk', 'jobfk', 'controllingunitfk', 'projectstockfk'], self);
			res.overloads.jobfk.displayName$tr$ = 'logistic.plantsupplier.supplierJob';

			return res;
		};

		this.getPlantSupplyItemServiceInfos = function getPlantSupplyItemServiceInfos() {
			return {
				standardConfigurationService: 'logisticPlantSupplyItemLayoutService',
				dataServiceName: 'logisticPlantSupplyItemDataService',
				validationServiceName: 'logisticPlantSupplyItemValidationService'
			};
		};

		function provideSupplyJobLookupOverload(jobPrefix) {
			return {
				navigator: {
					moduleName: 'logistic.job'
				},
				grid: {
					additionalColumnPrefix: jobPrefix,
					editor: 'lookup',
					editorOptions: {
						directive: 'logistic-supply-job-paging-lookup',
						lookupOptions: {
							additionalColumns: true,
							showClearButton: true,
							addGridColumns: [{
								id: 'description',
								field: 'DescriptionInfo',
								name: 'Description',
								name$tr$: 'cloud.common.entityDescription',
								formatter: 'translation',
								readonly: true
							}]
						}
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'logisticJob',
						displayMember: 'Code',
						version: 3
					}
				},
				detail: {
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'logistic-supply-job-paging-lookup',
						displayMember: 'Code',
						descriptionMember: 'Description',
						lookupOptions: {
							showClearButton: true
						}
					}
				}
			};
		}

		this.getPlantSupplyItemLayout = function getPlantSupplyItemLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'logistic.plantsupplier.item',
				['consumptiondate', 'materialfk', 'plantfk', 'quantity', 'price', 'plantsupplyitemstatusfk', 'jobfk', 'externalid', 'issettled']);
			res.overloads = platformLayoutHelperService.getOverloads(['materialfk', 'plantfk', 'plantsupplyitemstatusfk', 'issettled'], self);
			res.overloads.issettled = {readonly: true};
			res.overloads.jobfk = provideSupplyJobLookupOverload('logistic.plantsupplier.plantLogisticJob');
			res.overloads.jobfk.displayName$tr$ = 'logistic.plantsupplier.plantLogisticJob';

			return res;
		};

		this.getOverload = function getOverload(overload) {
			var ovl = null;
			switch (overload) {
				case 'rubriccategoryfk':
					ovl = {
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
								lookupOptions: {
									filterKey: 'plant-supplier-rubric-category-lookup-filter',
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
									filterKey: 'plant-supplier-rubric-category-lookup-filter',
									showClearButton: true
								}
							}
						}
					};
					break;
				case 'controllingunitfk':
					ovl =
						resourceCommonLayoutHelperService.provideControllingUnitOverload(
							true,
							'lgm-settlement-controllingunit-project-context-filter'
						);
					break;
				case 'jobfk':
					ovl = platformLayoutHelperService.provideJobLookupOverload();
					break;
				case 'projectstockfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'projectStockLookupDataService',
						enableCache: true,
						filter: function (item) {
							var prj = { PKey1: null, PKey2: null, PKey3: null };
							if (!item.ProjectFk) {
								prj.PKey3 = 0;
							} else {
								prj.PKey3 = item.ProjectFk;
							}
							return prj;
						}
					}
					);
					break;
				case 'plantfk':
					ovl = platformLayoutHelperService.providePlantLookupOverload();
					break;
				case 'plantsupplyitemstatusfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig(
						'basics.customize.plantsupplyitemstatus', null, {
							showIcon: true,
							imageSelectorService: 'platformStatusIconService'
						}
					);
					break;
				case 'materialfk':
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
			}
			return ovl;
		};
	}
})(angular);
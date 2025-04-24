/*
 * $Id: project-main-container-information-service.js 383850 2016-07-14 07:24:36Z zos $
 * Copyright (c) RIB Software AG
 */

(function (angular) {
	'use strict';
	var projectMainModule = angular.module('project.stock');

	/**
	 * @ngdoc service
	 * @name projectStockContainerInformationService
	 * @function
	 *
	 * @description
	 */
	projectMainModule.service('projectStockContainerInformationService', ProjectStockContainerInformationService);

	ProjectStockContainerInformationService.$inject = ['_', 'basicsLookupdataConfigGenerator', 'basicsCommonComplexFormatter', '$injector', 'platformLayoutHelperService'];

	function ProjectStockContainerInformationService(_, basicsLookupdataConfigGenerator, basicsCommonComplexFormatter, $injector, platformLayoutHelperService) {
		var self = this;

		/* jshint -W074 */ // ignore cyclomatic complexity warning
		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			var config = {};
			switch (guid) {
				case '84f41825c88a463286c9502f983b4e90': // projectStockListController
					config = self.getProjectStockServiceInfos();
					config.layout = self.getProjectStockLayout();
					config.ContainerType = 'Grid';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '82554e69247e442e82175ccd48147b81': // projectStockDetailController
					config = self.getProjectStockServiceInfos();
					config.layout = self.getProjectStockLayout();
					config.ContainerType = 'Detail';
					break;
				case '55f6ac464f67460882c719f035091290': // projectStockLocationListController
					config = self.getProjectStockLocationServiceInfos();
					config.layout = self.getProjectStockLocationLayout();
					config.ContainerType = 'Grid';
					config.listConfig = {
						initCalled: false,
						columns: [],
						parentProp: 'StockLocationFk',
						childProp: 'SubLocations'
					};
					break;
				case '90b9dd6abb7c40c1b4f8f17d8919ac88': // projectStockLocationDetailController
					config = self.getProjectStockLocationServiceInfos();
					config.layout = self.getProjectStockLocationLayout();
					config.ContainerType = 'Detail';
					break;
				case '562132b3f18e470f8eef6b9dbe5dc9d4': // projectStockMaterialListController
					config = self.getProjectStockMaterialServiceInfos();
					config.layout = self.getProjectStockMaterialLayout();
					config.ContainerType = 'Grid';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case 'ca05a162837b4e01b1416116a8a846be': // projectStockMaterialDetailController
					config = self.getProjectStockMaterialServiceInfos();
					config.layout = self.getProjectStockMaterialLayout();
					config.ContainerType = 'Detail';
					break;
			}

			return config;
		};

		this.getProjectStockServiceInfos = function getProjectStockServiceInfos() {
			return {
				standardConfigurationService: 'projectStockLayoutService',
				dataServiceName: 'projectStockDataService',
				validationServiceName: 'projectStockValidationService'
			};
		};

		this.getProjectStockLocationServiceInfos = function getProjectStockLocationServiceInfos() {
			return {
				standardConfigurationService: 'projectStockLocationLayoutService',
				dataServiceName: 'projectStockLocationDataService',
				validationServiceName: 'projectStockLocationValidationService'
			};
		};

		this.getProjectStockMaterialServiceInfos = function getProjectStockMaterialServiceInfos() {
			return {
				standardConfigurationService: 'projectStockMaterialLayoutService',
				dataServiceName: 'projectStockMaterialDataService',
				validationServiceName: 'projectStockMaterialValidationService'
			};
		};

		this.getProjectStockLayout = function getProjectStockLayout() {
			return self.getBaseLayout('project.stock.stock',
				['code', 'description', 'addressfk', 'isdefault', 'islocationmandatory', 'isprovisionallowed',
					'stockvaluationrulefk', 'stockaccountingtypefk', 'stocktypefk','currencyfk', 'clerkfk', 'controllingunitfk'],
				['projectfk', 'addressfk', 'stockvaluationrulefk', 'stockaccountingtypefk','stocktypefk', 'currencyfk',
					'clerkfk', 'controllingunitfk']);
		};

		this.getProjectStockLocationLayout = function getProjectStockLocationLayout() {
			return self.getBaseLayout('project.stock.stocklocation',
				['code', 'descriptioninfo'],
				[]);
		};

		this.getProjectStockMaterialLayout = function getProjectStockMaterialLayout() {
			return self.getBaseLayout('project.stock.stockmaterial',
				['materialcatalogfk', 'materialfk', 'minquantity', 'maxquantity',
					'provisionpercent', 'provisionperuom', 'islotmanagement', 'stocklocationfk', 'standardcost', 'loadingcostpercent','stock2materialstatusfk'
				],
				['materialcatalogfk', 'materialfk', 'stocklocationfk','stock2materialstatusfk']);
		};

		this.getBaseLayout = function getBaseLayout(fid, atts, overloads) {
			var res = {
				version: '1.0.0',
				fid: fid,
				addValidationAutomatically: true,
				addAdditionalColumns: true,
				showGrouping: true,
				groups: [
					{
						gid: 'basicData',
						attributes: atts
					},
					{
						gid: 'entityHistory',
						isHistory: true
					}
				]
			};

			res.overloads = self.getOverloads(overloads);

			return res;
		};

		this.getOverloads = function getOverloads(overloads) {
			var ovls = {};
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
			var ovl = null;

			switch (overload) {
				case 'stock2materialstatusfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.materialstatus', null, {showIcon: true});
					break;
				case 'clerkfk':
					ovl = {
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'cloud-clerk-clerk-dialog',
								descriptionMember: 'Description',
								lookupOptions: {
									showClearButton: true
								}
							},
							requiredInErrorHandling: true
						},
						grid: {
							editor: 'lookup',
							directive: 'basics-lookupdata-lookup-composite',
							editorOptions: {
								lookupDirective: 'cloud-clerk-clerk-dialog',
								lookupOptions: {
									showClearButton: true,
									displayMember: 'Code',
									addGridColumns: [{
										id: 'Description',
										field: 'Description',
										name: 'Description',
										width: 200,
										formatter: 'description',
										name$tr$: 'cloud.common.entityDescription'
									}],
									additionalColumns: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Clerk',
								displayMember: 'Code'
							}
						}
					};
					break;
				case 'addressfk':
					ovl = {
						detail: {
							type: 'directive',
							directive: 'basics-common-address-dialog',
							model: 'AddressEntity',
							options: {
								titleField: 'cloud.common.entityAddress',
								foreignKey: 'AddressFk',
								showClearButton: true
							}
						},
						grid: {
							editor: 'lookup',
							field: 'AddressEntity',
							editorOptions: {
								lookupDirective: 'basics-common-address-dialog',
								'lookupOptions': {
									foreignKey: 'AddressFk',
									titleField: 'cloud.common.entityAddress'
								}
							},
							formatter: basicsCommonComplexFormatter,
							formatterOptions: {
								displayMember: 'AddressLine'
							}
						}
					};
					break;
				case 'currencyfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsCurrencyLookupDataService',
						enableCache: true,
						readonly: true
					});
					break;
				case 'stockaccountingtypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.projectstockaccountingtype', null, {filterKey: 'live-filter'});
					break;
				case 'stocktypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.projectstocktype', null, {filterKey: 'live-filter'});
					break;
				case 'stockvaluationrulefk':
					ovl = {
						detail: {
							type: 'directive',
							directive: 'procurement-stock-stockvaluationrule-combobox',
							options: {
								displayMember: 'DescriptionInfo.Translated'
							}
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'procurement-stock-stockvaluationrule-combobox',
								lookupOptions: {
									displayMember: 'DescriptionInfo.Translated',
									filterKey: 'live-filter'
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'StockValuationRule',
								displayMember: 'DescriptionInfo.Translated'
							}
						}
					};
					break;
				case 'materialcatalogfk':
					ovl = {
						navigator: {
							moduleName: 'basics.materialcatalog'
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-material-material-catalog-lookup',
								displayMember: 'Code',
								descriptionMember: 'DescriptionInfo.Translated'
							}
						},
						grid: {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'MaterialCatalog',
								displayMember: 'Code'
							}
						},
						readonly: true
					};
					break;
				case 'materialfk':
					ovl = platformLayoutHelperService.getMaterialOverload('project-stock-material-filter');
					break;
				case 'stocklocationfk':
					ovl = platformLayoutHelperService.provideProjectStockLocationLookupOverload(null, [{
						projectFk: 'ProjectFk',
						projectFkReadOnly: true,
						getAdditionalEntity: function () {
							let prj = $injector.get('projectMainService').getSelected();
							return {'ProjectFk' : prj.Id};
						}
					}, {
						projectStockFk: 'ProjectStockFk',
						projectStockFkReadOnly: false,
						getAdditionalEntity: function () {
							let prj = $injector.get('projectStockDataService').getSelected();
							return {'ProjectStockFk' : prj.Id};
						}
					}]);
					/*
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'projectStockLocationLookupDataService',
						filter: function (item) {
							var prj;
							if (item) {
								prj = item.ProjectStockFk;
							}

							return prj;
						}
					});
*/
					break;
				case 'controllingunitfk':
					ovl = basicsLookupdataConfigGenerator.provideElaboratedLookupConfig('controlling-structure-dialog-lookup', 'controllingunit', 'Code', true, null, null);
					break;
			}

			return ovl;
		};
	}
})(angular);
/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	var projectDroppointsModule = angular.module('project.droppoints');

	/**
	 * @ngdoc service
	 * @name projectDroppointsContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	projectDroppointsModule.factory('projectDroppointsContainerInformationService',
		[
			'$injector','projectDropPointsConstantValues', 'platformLayoutHelperService', 'productionplanningCommonLayoutHelperService',
			'basicsLookupdataConfigGenerator', 'projectDropPointsAreaDataService', 'basicsLookupdataLookupFilterService',
			function (
				$injector, projectDropPointsConstantValues, platformLayoutHelperService, productionplanningCommonLayoutHelperService,
				basicsLookupdataConfigGenerator, projectDropPointsAreaDataService, basicsLookupdataLookupFilterService
			) {
				let self = this;
				let articleLookupConfig = null;
				//let service = {};
				/* jshint -W074 */ // There is no complexity; try harder, J.S.Hint.
				this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
					var config = {};
					switch (guid) {
						case projectDropPointsConstantValues.uuid.container.dropPointHeaderList://projectDropPointsAreaListController
							config = platformLayoutHelperService.getStandardGridConfig(self.getDropPointAreaServiceInfos(),self.getDropPointAreaLayout);
							break;
						case projectDropPointsConstantValues.uuid.container.dropPointHeaderDetails://projectDropPointsAreaDetailController
							config = platformLayoutHelperService.getStandardDetailConfig(self.getDropPointAreaServiceInfos(),self.getDropPointAreaLayout);
							break;
						case projectDropPointsConstantValues.uuid.container.dropPointList://projectDropPointsDropPointListController
							config = platformLayoutHelperService.getStandardGridConfig(self.getDropPointServiceInfos(),self.getDropPointLayout);
							break;
						case projectDropPointsConstantValues.uuid.container.dropPointDetails://projectDropPointsDropPointDetailController
							config = platformLayoutHelperService.getStandardDetailConfig(self.getDropPointServiceInfos(),self.getDropPointLayout);
							break;
						case projectDropPointsConstantValues.uuid.container.dropPointArticlesList://projectDropPointsDropPointArticlesListController
							config = platformLayoutHelperService.getStandardGridConfig(self.getDropPointArticlesServiceInfos(),self.getDropPointArticlesLayout);
							break;
						case projectDropPointsConstantValues.uuid.container.dropPointArticlesDetails://projectDropPointsDropPointArticlesDetailController
							config = platformLayoutHelperService.getStandardDetailConfig(self.getDropPointArticlesServiceInfos(),self.getDropPointArticlesLayout);
							break;
					}

					return config;
				};

				this.getDropPointAreaLayout = function getDropPointAreaLayout() {
					let res = platformLayoutHelperService.getSimpleBaseLayout(
						'1.0.0',
						'project.droppoints.droppointheader',
						['projectno', 'projectname', 'projectname2', 'currencyfk']);
					res.overloads = platformLayoutHelperService.getOverloads(['currencyfk'], self);
					res.overloads.currencyfk.readonly = true;
					res.overloads.projectno = { readonly: true };
					res.overloads.projectname = { readonly: true };
					res.overloads.projectname2 = { readonly: true };

					return res;
				};
				
				this.getDropPointAreaServiceInfos = function getDropPointAreaServiceInfos() {
					return {
						standardConfigurationService: 'projectDropPointsAreaLayoutService',
						dataServiceName: 'projectDropPointsAreaDataService',
						validationServiceName: 'projectDropPointsAreaValidationService'
					};
				};
				this.getDropPointLayout = function getDropPointLayout() {
					let res = platformLayoutHelperService.getSimpleBaseLayout(
						'1.0.0',
						'project.droppoints.droppoint',
						['code', 'glncode', 'droppointtypefk', 'isactive', 'hidinpubapi', 'ismanual', 'controllingunitfk', 'projectaddressfk', 'clerkrespfk', 'comment']);
					res.overloads = platformLayoutHelperService.getOverloads(['droppointtypefk', 'controllingunitfk', 'projectaddressfk', 'clerkrespfk'], self);
					return res;
				};
				this.getDropPointServiceInfos = function getDropPointServiceInfos() {
					return {
						standardConfigurationService: 'projectDropPointsDropPointLayoutService',
						dataServiceName: 'projectDropPointsDropPointDataService',
						validationServiceName: 'projectDropPointsDropPointValidationService'
					};
				};
				this.getDropPointArticlesLayout = function getDropPointArticlesLayout() {
					let res = platformLayoutHelperService.getSimpleBaseLayout(
						'1.0.0',
						'project.droppoints.droppointarticles',
						['code', 'droppointfk', 'quantity', 'comment', 'projectfk', 'articlefk', 'articletypefk']);
					res.overloads = platformLayoutHelperService.getOverloads(['droppointfk', 'code', 'quantity', 'comment', 'projectfk', 'articlefk', 'articletypefk'], self);
					return res;
				};
				this.getDropPointArticlesServiceInfos = function getDropPointArticlesServiceInfos() {
					return {
						standardConfigurationService: 'projectDropPointsDropPointArticlesLayoutService',
						dataServiceName: 'projectDropPointsDropPointArticlesDataService',
						validationServiceName: 'projectDropPointsDropPointArticlesValidationService'
					};
				};
				this.getProductLookupOverload = function getProductLookupOverload (){
					return {
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'productionplanning-common-product-lookup-new',
								lookupType: 'CommonProduct'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'CommonProduct',
								displayMember: 'DescriptionInfo.Translated',
								version: 3
							},
							width: 100
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'productionplanning-common-product-lookup-new',
								displayMember: 'Code',
								descriptionMember: 'DescriptionInfo.Translated'
							}
						},
					};
				}
				this.getArticleTypeLookupOverload = function () {
					return {
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'logistic-dispatching-record-type-lookup',
								lookupOptions: {
									filterKey: 'project-drop-point-article-type-filter',
									additionalColumns: true,
									displayMember: 'ShortKeyInfo.Translated',
									addGridColumns: [
										{
											id: 'brief',
											field: 'DescriptionInfo',
											name: 'Description',
											width: 120,
											formatter: 'translation',
											name$tr$: 'cloud.common.entityDescription'
										}
									]
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'recordtype',
								displayMember: 'ShortKeyInfo.Translated',
								dataServiceName: 'logisticDispatchingRecordTypeLookupDataService'
							}
						},
						detail: {
							type: 'directive',
							directive: 'logistic-dispatching-record-type-lookup',
							options: {
								lookupDirective: 'logistic-dispatching-record-type-lookup',
								descriptionField: 'ShortKeyInfo',
								descriptionMember: 'ShortKeyInfo.Translated',
								lookupOptions: {
									initValueField: 'ShortKeyInfo'
								}
							}
						}
					};
				}
				function assertArticleLookupConfig() {
					if(articleLookupConfig === null) {
						const constService = $injector.get('logisticDispatchingConstantValues');
						articleLookupConfig = {};

						articleLookupConfig[constService.record.type.resource] = {
							column: 'ResourceFk',
							lookup: {
								directive: 'resource-master-resource-lookup-dialog-new',
								options: {
									descriptionMember: 'DescriptionInfo.Translated',
									showClearButton: true,
									displayMember: 'Code'
								}
							}
						};
						articleLookupConfig[constService.record.type.plant] = {
							column: 'PlantFk',
							lookup: {
								directive: 'resource-equipment-plant-lookup-dialog-new',
								options: {
									descriptionMember: 'DescriptionInfo.Translated',
									showClearButton: true,
									displayMember: 'Code',
									version: 3,
									lookupType: 'equipmentPlant',
									showFilteredData: true,
									filterOnLoadFn: function (item) {
										var itemList = $injector.get('logisticDispatchingRecordDataService').getList();
										return !_.some(itemList, function (entity) {
											return entity.RecordTypeFk === plantRecordTypeId && entity.ArticleFk === item.Id && (entity.WorkOperationIsHire || entity.IsBulkPlant);
										});
									}
								}
							}
						};
						articleLookupConfig[constService.record.type.material] = {
							column: 'MaterialFk',
							lookup: {
								directive: 'basics-material-material-lookup',
								options: {
									showClearButton: true,
									displayMember: 'Code',
									filterKey: 'logistic-dispatching-record-material-filter',
									lookupType: 'MaterialCommodity',
									gridOptions: {
										disableCreateSimilarBtn: true,
										multiSelect: false
									}
								}
							}
						};
						articleLookupConfig[constService.record.type.sundryService] = {
							column: 'SundryServiceFk',
							lookup: {
								directive: 'logistic-sundry-service-lookup-dialog',
								options: {
									showClearButton: true,
									displayMember: 'Code'
								}
							}
						};
						articleLookupConfig[constService.record.type.costCode] = {
							column: 'MdcCostCodeFk',
							lookup: {
								directive: 'basics-cost-codes-lookup',
								options: {
									descriptionMember: 'DescriptionInfo.Translated',
									showClearButton: true,
									displayMember: 'Code'
								}
							}
						};
						articleLookupConfig[constService.record.type.fabricatedProduct] = {
							column: 'ProductFk',
							lookup: {
								directive: 'productionplanning-common-product-lookup',
								options: {
									descriptionMember: 'DescriptionInfo.Translated',
									'lookupType': 'CommonProduct',
									showClearButton: true,
									displayMember: 'Code'
								}
							}
						};
						articleLookupConfig[constService.record.type.loadingCost] = {
							column: 'SundryServiceLoadFk',
							lookup: {
								directive: 'logistic-sundry-service-lookup-dialog',
								options: {
									showClearButton: false,
									displayMember: 'Code'
								}
							}
						};
						articleLookupConfig[constService.record.type.loadingCostForBilling] = {
							column: 'SundryServiceLoadBillingFk',
							lookup: {
								directive: 'logistic-sundry-service-lookup-dialog',
								options: {
									showClearButton: false,
									displayMember: 'Code'
								}
							}
						};
					}

					return articleLookupConfig;
				}
				this.getArticleOverload = function getArticleOverload() {
					let lookupInfo = assertArticleLookupConfig();

					return {
						detail: {
							type: 'directive',
							directive: 'dynamic-grid-and-form-lookup',
							options: {
								isTextEditable: false,
								dependantField: 'ArticleTypeFk',
								lookupInfo: lookupInfo,
								grid: false,
								dynamicLookupMode: true,
								showClearButton: true,
							}
						},
						grid: {
							editor: 'directive',
							editorOptions: {
								directive: 'dynamic-grid-and-form-lookup',
								dependantField: 'ArticleTypeFk',
								lookupInfo: lookupInfo,
								isTextEditable: false,
								dynamicLookupMode: true,
								grid: true,
							},
							formatter: 'dynamic',
							domain: function (item, column, flag) {
								var info = lookupInfo[item.ArticleTypeFk];
								if (info) {
									var prop = info.lookup.options;
									column.formatterOptions = {
										lookupType: prop.lookupType,
										displayMember: prop.displayMember,
										dataServiceName: prop.dataServiceName,
									};
								} else {
									column.formatterOptions = null;
								}

								return flag ? 'directive' : 'lookup';
							}
						}
					};
				};

				this.getOverload = function getOverloads(overload) {
					let ovl = null;

					switch (overload) {
						case 'articletypefk':
							ovl = this.getArticleTypeLookupOverload();
							break;
						case 'articlefk':
							ovl = this.getArticleOverload();
							break;
						case 'projectfk':
							ovl = platformLayoutHelperService.provideProjectLookupOverload();
							break;
						case 'plantfk':
							ovl = platformLayoutHelperService.providePlantLookupOverload();
							break;
						case	'projectaddressfk':
							ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig(
								{
									dataServiceName: 'projectAddressesDescLookupDataService',
									filter: function (item) {
										let prj = {PKey1:null};
										if (item) {
											prj.PKey1 = projectDropPointsAreaDataService.getSelected().Id;
										}
										return prj;
									}
								});
							break;
						case 'controllingunitfk':
							ovl = $injector.get('resourceCommonLayoutHelperService').provideControllingUnitOverload(true, 'etm-plant-controllingunit-project-context-filter');//basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName: 'controllingStructureUnitLookupDataService'});//productionplanningCommonLayoutHelperService.providePrjControllingUnitLookupOverload();
							break;
						case 'mdcmaterialfk':
							ovl = platformLayoutHelperService.getMaterialOverload();
							break;
						case 'productfk':
							ovl = platformLayoutHelperService.providePpsProductLookupOverload();
							break;
						case 'clerkrespfk':
							ovl = platformLayoutHelperService.provideClerkLookupOverload();
							break;
						case 'droppointfk':
							ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'projectDropPointsLookupDataService',
								filter: function (item) {
									return  item.ProjectFk;
								}
							});
							break;
						case 'droppointtypefk':
							ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.projectdroppointtype');
							break;
						case 'currencyfk':
							ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig(platformLayoutHelperService.provideCurrencyLookupSpecification());
							break;
					}
					return ovl;
				}
				let filters = [
					{
						key: 'project-drop-point-article-type-filter',
						fn: function projectDropPointArticleTypeFilter(item) {
							return item.Id === 2 || item.Id === 3 || item.Id === 6;
						}
					}
				];
				basicsLookupdataLookupFilterService.registerFilter(filters);

				return this;
			}

	]);
})(angular);

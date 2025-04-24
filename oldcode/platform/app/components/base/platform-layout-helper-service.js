/**
 * Created by baedeker on 2017-11-09
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc factory
	 * @name cloud.platform.services:platformLayoutHelperService
	 * @description
	 * Provides methods to create layout specification for list / form from as a high level description
	 */
	angular.module('platform').service('platformLayoutHelperService', PlatformLayoutHelperService);

	PlatformLayoutHelperService.$inject = ['_', '$', '$injector'];

	function PlatformLayoutHelperService(_, $, $injector) {
		var self = this;

		this.getOverloads = function getOverloads(overloads, overloadService) {
			var overloaded = {};
			if (!!overloads && !!overloadService) {
				_.forEach(overloads, function (overload) {
					var ol = overloadService.getOverload(overload);
					if (ol) {
						overloaded[overload] = ol;
					}
				});
			}

			return overloaded;
		};

		this.getMultiValueGroup = function getMultiValueGroup(grpOpt) {
			var infix = grpOpt.infix;
			var res = {
				gid: grpOpt.groupName,
				attributes: []
			};

			_.times(grpOpt.number, function (index) {
				var add = ++index;
				res.attributes.push(grpOpt.prefix + infix + add);
				if (add === 9) {
					infix = '';
				}
			});

			return res;
		};

		this.getUserDefinedTextGroup = function getUserDefinedTextGroup(number, userGroup, prefix, infix) {
			return self.getMultiValueGroup({
				groupName: userGroup || 'userDefTextGroup',
				infix: infix,
				number: number,
				prefix: prefix || 'userdefinedtext'
			});
		};

		this.getUserDefinedIntegerGroup = function getUserDefinedIntegerGroup(number, userGroup, prefix, infix) {
			return self.getMultiValueGroup({
				groupName: userGroup || 'userDefIntegerGroup',
				infix: infix,
				number: number,
				prefix: prefix || 'userdefinedint'
			});
		};

		this.getUserDefinedNumberGroup = function getUserDefinedNumberGroup(number, userGroup, prefix, infix) {
			return self.getMultiValueGroup({
				groupName: userGroup || 'userDefNumberGroup',
				infix: infix,
				number: number,
				prefix: prefix || 'userdefinednumber'
			});
		};

		this.getUserDefinedBoolGroup = function getUserDefinedBoolGroup(number, userGroup, prefix, infix) {
			return self.getMultiValueGroup({
				groupName: userGroup || 'userDefBoolGroup',
				infix: infix,
				number: number,
				prefix: prefix || 'userdefinedbool'
			});
		};

		this.getUserDefinedDateGroup = function getUserDefinedDateGroup(number, userGroup, prefix, infix) {
			return self.getMultiValueGroup({
				groupName: userGroup || 'userDefDateGroup',
				infix: infix,
				number: number,
				prefix: prefix || 'userdefineddate'
			});
		};

		this.getGridConfig = function getGridConfig(serviceInfo, getLayoutFunc, gridConfig) {
			serviceInfo.ContainerType = 'Grid';
			serviceInfo.listConfig = gridConfig;
			if (getLayoutFunc) {
				serviceInfo.layout = getLayoutFunc();
			} else {
				var layoutService = $injector.get(serviceInfo.standardConfigurationService);
				serviceInfo.layout = layoutService.getStandardConfigForListView();
			}

			return serviceInfo;
		};

		this.getStandardGridConfig = function getStandardGridConfig(serviceInfo, getLayoutFunc) {
			return self.getGridConfig(serviceInfo, getLayoutFunc, {initCalled: false, columns: []});
		};

		this.getStandardDetailConfig = function getStandardDetailConfig(serviceInfo, getLayoutFunc) {
			serviceInfo.ContainerType = 'Detail';
			if (getLayoutFunc) {
				serviceInfo.layout = getLayoutFunc();
			} else {
				var layoutService = $injector.get(serviceInfo.standardConfigurationService);
				serviceInfo.layout = layoutService.getStandardConfigForDetailView();
			}

			return serviceInfo;
		};

		this.getBasisLayoutConfigObject = function getBasisLayoutConfigObject(version, fid, atts) {
			return {
				version: version,
				fid: fid,
				addValidationAutomatically: true,
				addAdditionalColumns: true,
				showGrouping: true,
				groups: [
					{
						gid: 'basicData',
						attributes: atts
					}
				]
			};
		};

		this.getSimpleBaseLayout = function getSimpleBaseLayout(version, fid, atts) {
			return self.getMultipleGroupsBaseLayout(version, fid, atts, []);
		};

		this.getTwoGroupsBaseLayout = function getTwoGroupsBaseLayout(version, fid, atts, secondGroup) {
			return self.getMultipleGroupsBaseLayout(version, fid, atts, [secondGroup]);
		};

		this.getThreeGroupsBaseLayout = function getThreeGroupsBaseLayout(version, fid, atts, secondGroup, thirdGroup) {
			return self.getMultipleGroupsBaseLayout(version, fid, atts, [secondGroup, thirdGroup]);
		};

		this.getFourGroupsBaseLayout = function getFourGroupsBaseLayout(version, fid, atts, secondGroup, thirdGroup, fourthGroup) {
			return self.getMultipleGroupsBaseLayout(version, fid, atts, [secondGroup, thirdGroup, fourthGroup]);
		};

		this.getFiveGroupsBaseLayout = function getFiveGroupsBaseLayout(version, fid, atts, secondGroup, thirdGroup, fourthGroup, fifthGroup) {
			return self.getMultipleGroupsBaseLayout(version, fid, atts, [secondGroup, thirdGroup, fourthGroup, fifthGroup]);
		};

		this.getSixGroupsBaseLayout = function getFiveGroupsBaseLayout(version, fid, atts, secondGroup, thirdGroup, fourthGroup, fifthGroup, sixthGroup) {
			return self.getMultipleGroupsBaseLayout(version, fid, atts, [secondGroup, thirdGroup, fourthGroup, fifthGroup, sixthGroup]);
		};

		this.getMultipleGroupsBaseLayout = function getMultipleGroupsBaseLayout(version, fid, atts, groups) {
			var res = self.getBasisLayoutConfigObject(version, fid, atts);

			_.forEach(groups, function (group) {
				if (group) {
					res.groups.push(group);
				}
			});

			res.groups.push({
				gid: 'entityHistory',
				isHistory: true
			});

			return res;
		};

		this.getMultipleGroupsBaseLayoutWithoutHistory = function getMultipleGroupsBaseLayoutWithoutHistory(version, fid, atts, groups) {
			var res = self.getBasisLayoutConfigObject(version, fid, atts);

			_.forEach(groups, function (group) {
				if (group) {
					res.groups.push(group);
				}
			});

			return res;
		};

		this.provideUoMReadOnlyLookupSpecification = function provideUoMReadOnlyLookupSpecification() {
			return {
				dataServiceName: 'basicsUnitLookupDataService',
				cacheEnable: true,
				readonly: true,
				additionalColumns: true
			};
		};

		this.provideUoMLookupSpecification = function provideUoMLookupSpecification() {
			return {
				dataServiceName: 'basicsUnitLookupDataService',
				cacheEnable: true,
				additionalColumns: true
			};
		};

		this.provideCurrencyLookupSpecification = function provideCurrencyLookupSpecification() {
			return {
				dataServiceName: 'basicsCurrencyLookupDataService',
				enableCache: true
			};
		};

		this.provideImageSelectorOverload = function provideImageSelectorOverload(imageServiceName) {
			return {
				detail: {
					options: {
						serviceName: imageServiceName
					}
				},
				grid: {
					formatterOptions: {
						serviceName: imageServiceName
					}, editorOptions: {
						serviceName: imageServiceName
					}
				}
			};
		};

		this.provideProjectLookupOverload = function provideProjectLookupOverload(filterKey, targetIdProperty) {
			return {
				navigator: {
					moduleName: 'project.main',
					targetIdProperty: _.isNil(targetIdProperty) ? 'ProjectFk' : targetIdProperty
				},
				grid: {
					editor: 'lookup',
					editorOptions: {
						directive: 'basics-lookup-data-project-project-dialog',
						lookupOptions: {
							filterKey: filterKey ? filterKey : null,
							showClearButton: true,
							addGridColumns: [
								{
									id: 'ProjectName',
									field: 'ProjectName',
									name: 'ProjectName',
									formatter: 'description',
									name$tr$: 'cloud.common.entityName'
								}
							],
							additionalColumns: true
						}
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'project',
						displayMember: 'ProjectNo',
						version: 3
					}
				},
				detail: {
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'basics-lookup-data-project-project-dialog',
						descriptionMember: 'ProjectName',
						version: 3,
						lookupOptions: {
							filterKey: filterKey ? filterKey : null,
							showClearButton: true
						}
					}
				}
			};
		};

		this.provideDocumentTypeOverload = function provideDocumentTypeOverload() {
			return {
				'grid': {
					editor: 'lookup',
					editorOptions: {
						directive: 'basics-lookupdata-table-document-type-combobox',
						lookupOptions: {
							showClearButton: true
						}
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'documentType',
						displayMember: 'Description'
					},
					width: 110
				},
				'detail': {
					'type': 'directive',
					'directive': 'basics-lookupdata-table-document-type-combobox',
					'model': 'DocumentTypeFk',
					'options': {
						descriptionMember: 'Description',
						showClearButton: true
					}
				}
			};
		};
		this.provideContactOverload = function provideContactOverload() {
			return {
				grid: {
					editor: 'lookup',
					editorOptions: {
						directive: 'business-partner-main-filtered-contact-combobox',
						lookupOptions: {
							showClearButton: true,
							filterKey: 'business-partner-contact-filter-for-activity'
						}
					},
					width: 125,
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'contact',
						displayMember: 'FullName'
					}
				},
				detail: {
					type: 'directive',
					directive: 'business-partner-main-filtered-contact-combobox',
					options: {
						initValueField: 'FullName',
						filterKey: 'business-partner-contact-filter-for-activity',
						showClearButton: true
					}
				}
			};
		};

		this.provideMaterialMultiselectOverload = function (dataService, filterKey) {
			let options = {
				showClearButton: true,
				gridOptions: {
					multiSelect: true
				},
				usageContext: dataService
			};
			if(!_.isNil(filterKey)) {
				options.filterKey = filterKey;
			}
			return {
				navigator: {
					moduleName: 'basics.material'
				},
				'detail': {
					'type': 'directive',
					'directive': 'basics-material-material-lookup',
					'options': options
				},
				'grid': {
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'MaterialCommodity',
						displayMember: 'Code'
					},
					editor: 'lookup',
					editorOptions: {
						lookupOptions: options,
						directive: 'basics-material-material-lookup',
					},
					width: 100
				}
			};
		};

		this.provideProjectLookupReadOnlyOverload = function provideProjectLookupReadOnlyOverload(targetIdProperty) {
			return {
				readonly: true,
				navigator: {
					moduleName: 'project.main',
					targetIdProperty: _.isNil(targetIdProperty) ? 'ProjectFk' : targetIdProperty
				},
				grid: {
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'project',
						displayMember: 'ProjectNo',
						version: 3
					},
					editorOptions: {
						directive: 'basics-lookup-data-project-project-dialog',
						lookupOptions: {
							additionalColumns: true,
							addGridColumns: [
								{
									id: 'ProjectName',
									field: 'ProjectName',
									name: 'ProjectName',
									formatter: 'description',
									name$tr$: 'cloud.common.entityName'
								}
							]
						}
					}
				},
				detail: {
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'basics-lookup-data-project-project-dialog',
						descriptionMember: 'ProjectName'
					}
				}
			};
		};

		this.provideJobLookupReadOnlyOverload = function provideJobLookupReadOnlyOverload() {
			return {
				readonly: true,
				grid: {
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'logisticJob',
						displayMember: 'Code',
						version: 3
					},
					editorOptions: {
						directive: 'logistic-job-paging-lookup',
						lookupOptions: {
							additionalColumns: true,
							// defaultFilter: extendFilter,
							addGridColumns: [{
								id: 'description',
								field: 'Description',
								name: 'Description',
								name$tr$: 'cloud.common.entityDescription',
								formatter: 'description',
								readonly: true
							}]
						}
					}
				},
				detail: {
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						readonly: true,
						lookupDirective: 'logistic-job-paging-lookup',
						displayMember: 'Code',
						descriptionMember: 'Description',
						showClearButton: true,
						lookupOptions: {
							showClearButton: false
						}
					}
				}
			};
		};

		this.provideJobLookupOverload = function provideJobLookupOverload(filter, filterKey, jobPrefix, descPostfix) {
			var extendFilter = _.extend(filter || {}, {activeJob: true}, {showOnlyJobsForTheCurrentDivision: true});
			return {
				navigator: {
					moduleName: 'logistic.job'
				},
				grid: {
					additionalColumnPrefix: jobPrefix,
					editor: 'lookup',
					editorOptions: {
						directive: 'logistic-job-paging-lookup',
						lookupOptions: {
							additionalColumns: true,
							showClearButton: true,
							defaultFilter: extendFilter,
							filterKey: filterKey,
							addGridColumns: [{
								id: 'description',
								additionalColumnPostfix: descPostfix,
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
						filterKey: filterKey,
						lookupDirective: 'logistic-job-paging-lookup',
						displayMember: 'Code',
						descriptionMember: 'Description',
						showClearButton: true,
						lookupOptions: {
							defaultFilter: extendFilter,
							showClearButton: true
						}
					}
				}
			};
		};

		this.provideCostCodeLookupReadOnlyOverload = function provideCostCodeLookupReadOnlyOverload() {
			return {
				readonly: true,
				detail: {
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						descriptionMember: 'DescriptionInfo.Translated'
					}
				},
				grid: {
					width: 150,
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'costcode',
						displayMember: 'Code'
					}
				}
			};
		};

		this.provideCostCodeLookupOverload = function provideCostCodeLookupOverload() {
			return {
				detail: {
					type: 'directive',
					directive: 'basics-cost-codes-lookup',
					options: {
						showClearButton: true
					}
				},
				grid: {
					editor: 'lookup',
					editorOptions: {
						directive: 'basics-cost-codes-lookup',
						lookupOptions: {
							showClearButton: true,
							displayMember: 'Code',
							additionalColumns: true,
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
						lookupType: 'costcode',
						displayMember: 'Code',
						version: 3
					}
				}
			};
		};

		this.provideSiteLookupOverload = function provideSiteLookupOverload() {
			return {
				grid: {
					editor: 'lookup',
					editorOptions: {
						directive: 'basics-site-site-lookup',
						lookupOptions: {
							showClearButton: true,
							displayMember: 'Code',
							additionalColumns: true,
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
						lookupType: 'site',
						displayMember: 'Code'
					}
				},
				detail: {
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'basics-site-site-lookup',
						displayMember: 'Code',
						descriptionMember: 'DescriptionInfo.Translated',
						showClearButton: true
					}
				}
			};
		};

		this.provideCostCodePriceVersionLookupOverload = function provideCostCodePriceVersionLookupOverload(filter) {
			return {
				grid: {
					editor: 'lookup',
					editorOptions: {
						directive: 'basics-cost-codes-price-version-lookup',
						lookupOptions: {
							filterKey: filter,
							showClearButton: true
						}
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'CostCodePriceVersion',
						displayMember: 'DescriptionInfo.Translated'
					}
				},
				detail: {
					type: 'directive',
					directive: 'basics-cost-codes-price-version-lookup',
					options: {
						descriptionMember: 'DescriptionInfo.Translated',
						filterKey: filter,
						lookupOptions: {
							showClearButton: true
						}
					}
				}
			};
		};

		this.provideCostCodePriceListLookupOverload = function provideCostCodePriceListLookupOverload() {
			return {
				detail: {
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'basics-cost-codes-price-list-lookup',
						descriptionMember: 'Rate',
						lookupOptions: {
							showClearButton: true
						}
					}
				},
				grid: {
					editor: 'lookup',
					editorOptions: {
						lookupOptions: {
							showClearButton: true
						},
						directive: 'basics-cost-codes-price-list-lookup'
					},
					width: 150,
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'CostCodesPriceList',
						displayMember: 'Rate'
					}
				}
			};
		};

		this.getMaterialOverload = function getMaterialOverload(filterKey) {
			return {
				navigator: {
					moduleName: 'basics.material'
				},
				detail: {
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'basics-material-material-lookup',
						descriptionMember: 'DescriptionInfo.Translated',
						filterKey: 'logistic-material-filter',
						lookupOptions: {
							showClearButton: true
						}
					}
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
							additionalColumns: true,
							showClearButton: true,
							filterKey: filterKey,
							addGridColumns: [{
								id: 'description',
								field: 'DescriptionInfo.Translated',
								name: 'Description',
								name$tr$: 'cloud.common.entityDescription',
								formatter: 'description',
								readonly: true
							}]
						},
						directive: 'basics-material-material-lookup'
					},
					width: 100
				}
			};
		};

		this.providePlantComponentLookupOverload = function providePlantComponentLookupOverload() {
			return {
				grid: {
					editor: 'lookup',
					editorOptions: {
						directive: 'resource-equipment-component-lookup-dialog-new',
						lookupOptions: {
							showClearButton: true,
							displayMember: 'SerialNumber',
							defaultFilter: {plantFk: 'PlantFk'},
							additionalColumns: true,
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
						lookupType: 'equipmentPlantComponent',
						displayMember: 'SerialNumber',
						version: 3
					}
				},
				detail: {
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'resource-equipment-component-lookup-dialog-new',
						displayMember: 'SerialNumber',
						descriptionMember: 'DescriptionInfo.Translated',
						showClearButton: true
					}
				}
			};
		};
		this.providePpsProductLookupOverload = function providePpsProductLookupOverload() {
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
		};

		this.providePlantLookupOverload = function providePlantLookupOverload(stateModel) {
			return {
				grid: {
					editor: 'lookup',
					editorOptions: {
						directive: 'resource-equipment-plant-lookup-dialog-new',
						lookupOptions: {
							showClearButton: true,
							displayMember: 'Code',
							additionalColumns: true,
							addGridColumns: [{
								id: 'description',
								field: 'DescriptionInfo',
								name: 'Description',
								name$tr$: 'cloud.common.entityDescription',
								formatter: 'translation',
								readonly: true
							}, {
								id: 'plantstatus',
								field: stateModel || 'PlantStatusFk',
								name: 'Status',
								name$tr$: 'cloud.common.entityStatus',
								formatter: 'lookup',
								formatterOptions: {
									lookupSimpleLookup: true,
									displayMember: 'Description',
									lookupModuleQualifier: 'basics.customize.plantstatus',
									valueMember: 'Id',
									imageSelector: 'platformStatusIconService'
								},
								readonly: true
							}]
						}
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'equipmentPlant',
						displayMember: 'Code',
						version: 3
					}
				},
				detail: {
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'resource-equipment-plant-lookup-dialog-new',
						displayMember: 'Code',
						descriptionMember: 'DescriptionInfo.Translated',
						showClearButton: true
					}
				}
			};
		};

		this.providePlantReadOnlyLookupOverload = function providePlantReadOnlyLookupOverload() {
			return {
				grid: {
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'equipmentPlant',
						displayMember: 'Code',
						version: 3
					}
				},
				detail: {
					readonly: true,
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'resource-equipment-plant-lookup-dialog-new',
						displayMember: 'Code',
						descriptionMember: 'DescriptionInfo.Translated',
						showClearButton: false
					}
				}
			};
		};

		this.provideCompanyLookupOverload = function provideCompanyLookupOverload() {
			return {
				navigator: {
					moduleName: 'basics.company'
				},
				grid: {
					editor: 'lookup',
					editorOptions: {
						directive: 'basics-company-company-lookup'
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'Company',
						displayMember: 'Code'
					},
					width: 70
				},
				detail: {
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'basics-company-company-lookup',
						displayMember: 'Code',
						descriptionMember: 'CompanyName'
					}
				}
			};
		};

		this.provideCompanyLookupReadOnlyOverload = function provideCompanyLookupReadOnlyOverload() {
			return {
				readonly: true,
				navigator: {
					moduleName: 'basics.company'
				},
				grid: {
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'Company',
						displayMember: 'Code'
					},
					width: 70
				},
				detail: {
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'basics-company-company-lookup',
						displayMember: 'Code',
						descriptionMember: 'CompanyName'
					}
				}
			};
		};

		this.provideBusinessPartnerLookupOverload = function provideBusinessPartnerLookupOverload() {
			return {
				navigator: {
					moduleName: 'businesspartner.main'
				},
				detail: {
					type: 'directive',
					directive: 'business-partner-main-business-partner-dialog',
					options: {
						initValueField: 'BusinesspartnerBpName1',
						showClearButton: true,
						IsShowBranch: true,
						mainService: 'projectMainService',
						BusinessPartnerField: 'BusinesspartnerFk',
						SubsidiaryField: 'SubsidiaryFk'
					}
				},
				grid: {
					editor: 'lookup',
					editorOptions: {
						directive: 'business-partner-main-business-partner-dialog',
						lookupOptions: {
							showClearButton: true,
							IsShowBranch: true,
							mainService: 'projectMainService',
							BusinessPartnerField: 'BusinesspartnerFk',
							SubsidiaryField: 'SubsidiaryFk'
						}
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'BusinessPartner',
						displayMember: 'BusinessPartnerName1'
					}
				}
			};
		};

		this.provideClerkLookupOverload = function provideClerkLookupOverload(showNavigator, targetIdProperty, filterKey) {
			let ovl = {
				detail: {
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'cloud-clerk-clerk-dialog',
						descriptionMember: 'Description',
						lookupOptions: {
							showClearButton: true
						}
					}
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
						lookupType: 'clerk',
						displayMember: 'Code',
						version: 3
					}
				}
			};

			if(showNavigator) {
				ovl.navigator = {
					moduleName: 'basics.clerk',
					targetIdProperty: _.isNil(targetIdProperty) ? 'ClerkFk' : targetIdProperty
				};
			}

			if(!_.isNil(filterKey)) {
				ovl.detail.options.lookupOptions.filterKey = filterKey;
				ovl.grid.editorOptions.lookupOptions.filterKey = filterKey;
			}

			return ovl;
		};

		this.provideResourceLookupOverload = function provideResourceLookupOverload(filter, filterKey) {
			return {
				grid: {
					editor: 'lookup',
					editorOptions: {
						directive: 'resource-master-resource-lookup-dialog-new',
						lookupOptions: {
							showClearButton: true,
							defaultFilter: filter,
							filterKey: filterKey,
							displayMember: 'Code',
							additionalColumns: true,
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
						lookupType: 'ResourceMasterResource',
						version: 3,
						displayMember: 'Code'
					}
				},
				detail: {
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						filterKey: filterKey,
						lookupDirective: 'resource-master-resource-lookup-dialog-new',
						descriptionMember: 'DescriptionInfo.Translated',
						displayMember: 'Code',
						showClearButton: true,
						lookupOptions: {
							defaultFilter: filter
						}
					}
				}
			};
		};

		this.provideBusinessPartnerSupplierLookupOverload = function provideBusinessPartnerSupplierLookupOverload(filter) {
			return {
				detail: {
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'business-partner-main-supplier-dialog',
						filterKey: filter,
						displayMember: 'Code',
						descriptionMember: 'Description',
						lookupOptions: {
							showClearButton: true
						}
					}
				},
				grid: {
					editor: 'lookup',
					editorOptions: {
						directive: 'business-partner-main-supplier-dialog',
						lookupOptions: {
							filterKey: filter,
							showClearButton: true,
							additionalColumns: true,
							addGridColumns: [{
								id: 'description',
								field: 'Description',
								name: 'Description',
								name$tr$: 'cloud.common.entityDescription',
								formatter: 'description',
								readonly: true
							}]
						}
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'Supplier',
						displayMember: 'Code',
						version: 3
					},
					width: 100
				}
			};
		};

		this.provideBusinessPartnerFilteredContactLookupOverload = function provideBusinessPartnerFilteredContactLookupOverload(filter) {
			return {
				detail: {
					type: 'directive',
					directive: 'business-partner-main-filtered-contact-combobox',
					options: {
						initValueField: 'FamilyName',
						filterKey: filter,
						showClearButton: true
					}
				},
				grid: {
					editor: 'lookup',
					editorOptions: {
						directive: 'business-partner-main-filtered-contact-combobox',
						lookupOptions: {
							showClearButton: true,
							filterKey: filter
						}
					},
					width: 125,
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'contact',
						displayMember: 'FamilyName'
					}
				}
			};
		};

		this.provideBusinessPartnerFilteredContactLookupDlgOverload = function provideBusinessPartnerFilteredContactLookupDlgOverload(filter) {
			return {
				navigator: {
					moduleName: 'businesspartner.contact'
				},
				detail: {
					type: 'directive',
					directive: 'business-partner-main-contact-dialog',
					options: {
						filterKey: filter,
						showClearButton: true
					}
				},
				grid: {
					editor: 'lookup',
					editorOptions: {
						directive: 'business-partner-main-contact-dialog',
						lookupOptions: {
							filterKey: filter,
							showClearButton: true
						}
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'Contact',
						displayMember: 'FullName'
					},
					width: 100
				}
			};
		};

		this.provideUserLookupDialogOverload = function provideUserLookupDialogOverload() {
			return {
				detail: {
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'usermanagement-user-user-dialog',
						descriptionMember: 'Description',
						lookupOptions: {
							showClearButton: true
						}
					}
				},
				grid: {
					editor: 'lookup',
					directive: 'basics-lookupdata-lookup-composite',
					editorOptions: {
						lookupDirective: 'usermanagement-user-user-dialog',
						lookupOptions: {
							showClearButton: true,
							displayMember: 'Name'
						}
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'User',
						displayMember: 'Name'
					}
				}
			};
		};

		this.addConfigObjToLookupConfig = function addConfigObjToLookupConfig(lookupConfig, configObj) {
			if (configObj) {
				lookupConfig.detail.options = $.extend(true, {}, lookupConfig.detail.options, configObj);
				if (lookupConfig.grid.editorOptions) {
					lookupConfig.grid.editorOptions.lookupOptions = $.extend(true, {}, lookupConfig.grid.editorOptions.lookupOptions, configObj);
				}
			}
		};

		this.provideProjectStockLocationLookupOverload = function provideProjectStockLocationLookupOverload(filter, additionalFilter){
			return {
				grid: {
					editor: 'lookup',
					editorOptions: {
						directive: 'project-stock-location-dialog-lookup',
						lookupOptions: {
							additionalColumns: true,
							showClearButton: true,
							defaultFilter: filter,
							additionalFilters: additionalFilter,
							addGridColumns: [{
								id: 'description',
								field: 'DescriptionInfo.Translated',
								name: 'Description',
								name$tr$: 'cloud.common.entityDescription',
								formatter: 'description',
								readonly: true
							}]
						}
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'ProjectStockLocation',
						displayMember: 'Code',
						version: 3
					}
				},
				detail: {
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'project-stock-location-dialog-lookup',
						displayMember: 'Code',
						descriptionMember: 'DescriptionInfo.Translated',
						showClearButton: true,
						lookupOptions: {
							defaultFilter: filter,
							additionalFilters: additionalFilter,
							showClearButton: true
						}
					}
				}
			};
		};

		this.provideProjectStockLookupOverload = function provideProjectStockLookupOverload(filter, filterKey){
			return {
				grid: {
					editor: 'lookup',
					editorOptions: {
						directive: 'project-stock-dialog-lookup',
						lookupOptions: {
							showClearButton: true,
							defaultFilter: filter,
							filterKey: filterKey,
							displayMember: 'Code',
							additionalColumns: true,
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
						lookupType: 'ProjectStock',
						version: 3,
						displayMember: 'Code'
					}
				},
				detail: {
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						filterKey: filterKey,
						lookupDirective: 'project-stock-dialog-lookup',
						descriptionMember: 'DescriptionInfo.Translated',
						displayMember: 'Code',
						showClearButton: true,
						lookupOptions: {
							defaultFilter: filter
						}
					}
				}
			};
		};

		this.provideProjectStockLocationLookupReadOnlyOverload = function provideProjectStockLocationLookupReadOnlyOverload(){
			return {
				readonly: true,
				grid: {
					editor: 'lookup',
					editorOptions: {
						directive: 'project-stock-location-dialog-lookup',
						lookupOptions: {
							additionalColumns: true,
							showClearButton: true,
							addGridColumns: [{
								id: 'description',
								field: 'DescriptionInfo.Translated',
								name: 'Description',
								name$tr$: 'cloud.common.entityDescription',
								formatter: 'description',
								readonly: true
							}]
						}
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'ProjectStockLocation',
						displayMember: 'Code',
						version: 3
					}
				},
				detail: {
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'project-stock-location-dialog-lookup',
						displayMember: 'Code',
						descriptionMember: 'DescriptionInfo.Translated',
						showClearButton: true,
						lookupOptions: {
							showClearButton: true
						}
					}
				}
			};
		};
	}
})(angular);

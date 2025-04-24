(function (angular) {
	'use strict';

	var moduleName = 'resource.master';

	function extendGrouping(gridColumns) {
		angular.forEach(gridColumns, function (column) {
			angular.extend(column, {
				grouping: {
					title: column.name$tr$,
					getter: column.field,
					aggregators: [],
					aggregateCollapsed: true
				}
			});
		});
		return gridColumns;
	}

	angular.module(moduleName).value('resourceMasterMainLayoutConfig', {
		addition: {
			grid: extendGrouping([
				{
					afterId: 'sitefk',
					id: 'siteDesc',
					field: 'SiteFk',
					name: 'Site Description',
					name$tr$: 'resource.master.siteDesc',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'Site',
						displayMember: 'DescriptionInfo.Translated',
						width: 140
					}
				},
				{
					afterId: 'companyfk',
					id: 'companyDesc',
					field: 'CompanyFk',
					name: 'Company Name',
					name$tr$: 'resource.master.companyName',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'Company',
						displayMember: 'CompanyName',
						width: 140
					}
				},
				{
					afterId: 'costcodefk',
					id: 'mdcCostCodeDesc',
					field: 'CostCodeFk',
					name: 'CostCode Description',
					name$tr$: 'resource.master.costCodeDesc',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'CostCode',
						displayMember: 'DescriptionInfo.Translated',
						width: 140
					}
				},
				/*
									 {
										  afterId: 'groupfk',
										  id: 'groupDesc',
										  field: 'GroupFk',
										  name: 'Group Description',
										  name$tr$: 'resource.master.groupDesc',
										  formatter: 'lookup',
										  formatterOptions: {
												lookupType: 'basics.customize.resourcegroup',
												displayMember: 'DescriptionInfo.Translated',
												width: 140
										  }
									 },
				*/
				{
					afterId: 'groupfk',
					id: 'groupIcon',
					field: 'GroupFk',
					name: 'Icon',
					name$tr$: 'cloud.common.entityIcon',
					formatter: 'imageselect',
					formatterOptions: {
						serviceName: 'resourceMasterGroupImageProcessor'
					}
				}
			])
		}
	});

	// master Layout
	angular.module(moduleName).factory('resourceMasterLayout', ResourceMasterLayout);
	ResourceMasterLayout.$inject = ['basicsLookupdataConfigGenerator', '$translate', '$injector', 'platformLayoutHelperService'];

	function ResourceMasterLayout(basicsLookupdataConfigGenerator, $translate, $injector, platformLayoutHelperService) {
		return {
			fid: 'resource.master.resourcemasterlayout',
			version: '1.0.0',
			showGrouping: true,
			addValidationAutomatically: true,
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['code', 'sortcode', 'descriptioninfo', 'externalcode', 'islive', 'typefk', 'kindfk', 'groupfk', 'dispatchergroupfk', 'companyfk', 'sitefk', 'calendarfk', 'itemfk', 'headercode', 'headerdescription', 'ishired', 'businesspartnerfk', 'clerkfk']
				},
				{
					gid: 'configuration',
					attributes: ['capacity', 'uombasisfk', 'uomtimefk', 'validfrom', 'validto']
				},
				{
					gid: 'Remark',
					attributes: ['remark']
				},
				{
					gid: 'userDefTextGroup',
					isUserDefText: true,
					attCount: 5,
					attName: 'userdefined',
					noInfix: true
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			overloads: {
				code:{
					navigator: {
						moduleName: 'resource.master'
					},
				},
				kindfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.resourcekind'),
				typefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'resourceTypeLookupDataService'
				}),
				businesspartnerfk: {
					detail: {
						type: 'directive',
						directive: 'business-partner-main-business-partner-dialog',
						options: {
							initValueField: 'BusinesspartnerBpName1',
							showClearButton: true
						}
					},
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'business-partner-main-business-partner-dialog'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'BusinessPartner',
							displayMember: 'BusinessPartnerName1'
						}
					}
				},
				clerkfk: platformLayoutHelperService.provideClerkLookupOverload(),
				dispatchergroupfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.logisticsdispatchergroup'),
				companyfk: {
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
							descriptionMember: 'CompanyName'
						}
					}
				},
				uombasisfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsUnitLookupDataService',
					cacheEnable: true
				}),
				uomtimefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsUnitLookupDataService',
					cacheEnable: true
				}),
				sitefk: {
					grid: {
						editor: 'lookup',
						editorOptions: {
							lookupOptions: {showClearButton: true},
							directive: 'basics-site-site-lookup'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Site',
							displayMember: 'Code'
						},
						width: 70
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupOptions: {showClearButton: true},
							lookupDirective: 'basics-site-site-lookup',
							descriptionMember: 'DescriptionInfo.Translated'
						}
					}
				},
				calendarfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'schedulingLookupCalendarDataService',
					enableCache: true
				}),
				groupfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.resourcegroup'),
				headercode: {
					readonly: true,
					navigator: {
						moduleName: $translate.instant('procurement.contract'),
						navFunc: function (options, item) {
							let naviService = $injector.get('platformModuleNavigationService');
							let navigator = naviService.getNavigator('procurement.contract');
							naviService.navigate(navigator, {Code: item.HeaderCode},'Code');
						}
					}
				},
				headerdescription: { readonly: true },
				ishired: { readonly: true },
				/*
				itemfk: {
					detail: {
						'type': 'directive',
						'directive': 'procurement-common-item-merged-lookup',
						'options': {
							showClearButton: true,
							//filterKey: 'prc-invoice-item-filter'
						}
					},
					grid: {
						editor: 'lookup',
						editorOptions: {
							lookupOptions: {
								showClearButton: true,
								filterKey: 'prc-invoice-item-filter'
							},
							directive: 'procurement-common-item-merged-lookup'
						},
						// formatter: prcItemFormatter,
						formatter: 'lookup',
						formatterOptions: {
							// create: {
							//     action: procurementInvoiceContractDataService.createOtherContracts
							// },
							lookupType: 'PrcItemMergedLookup',
							displayMember: 'Itemno',
							version: 3
						},
						width: 100
					}
				},
				*/
			}
		};
	}

})(angular);

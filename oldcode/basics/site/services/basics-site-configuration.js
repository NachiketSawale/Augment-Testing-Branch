(function (angular) {
	'use strict';

	var moduleName = 'basics.site';

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

	angular.module(moduleName).value('basicsSiteMainLayoutConfig', {
		'addition': {
			'grid': extendGrouping([
				{
					'afterId': 'clerkmgrfk',
					'id': 'managerDesc',
					'field': 'ClerkMgrFk',
					'name': 'Manager Description',
					'name$tr$': 'basics.site.MgrDesc',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'Clerk',
						displayMember: 'Description',
						width: 140
					}
				},
				{
					'afterId': 'clerkvicemgrfk',
					'id': 'viceManagerDesc',
					'field': 'ClerkVicemgrFk',
					'name': 'Vice Manager Description',
					'name$tr$': 'basics.site.ViceMgrDesc',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'Clerk',
						displayMember: 'Description',
						width: 140
					}
				}
			])
		}
	});

	//site Layout
	angular.module(moduleName).factory('basicsSiteDetailLayout', SiteDetailLayout);
	SiteDetailLayout.$inject = ['$translate', 'platformLayoutHelperService', 'basicsCustomizeStatusRuleDataService',
		'basicsSiteMainService', 'basicsLookupdataLookupFilterService', 'productionplanningCommonLayoutHelperService'];

	function SiteDetailLayout($translate, platformLayoutHelperService, statusRuleDataService,
							  basicsSiteMainService, basicsLookupdataLookupFilterService, ppCommonLayoutHelperService) {
		var filters = [
			{
				key: 'pps-item-stock-sitefk-filter',
				serverSide: false,
				fn: function (entity, selected) {
					if (entity.Id === selected.Id) {
						entity.Selectable = null;
					}
					return true;
				}
			}
		];

		basicsLookupdataLookupFilterService.registerFilter(filters);

		return {
			'fid': 'basics.site.sitedetailform',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					gid: 'baseGroup',
					attributes: ['code', 'descriptioninfo', 'addressfk', 'sitetypefk', 'clerkmgrfk', 'clerkvicemgrfk',
						'resourcefk', 'accessrightdescriptorfk', 'remark', 'islive', 'lgmjobprodareafk']
				},
				{
					gid: 'trsportConfigGroup',
					attributes: ['isdisp', 'projectadmfk', 'lgmjobadrfk', 'bassitestockfk']
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
			'overloads': {
				sitetypefk: {
					detail: {
						type: 'directive',
						directive: 'basics-site-type-combobox',
						options: {imageSelector: 'basicsSiteImageProcessor'}
					},
					grid: {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'SiteType',
							displayMember: 'DescriptionInfo.Translated',
							imageSelector: 'basicsSiteImageProcessor'
						},
						editor: 'lookup',
						editorOptions: {
							lookupField: 'SiteTypeFk',
							directive: 'basics-site-type-combobox'
						}
					}
				},
				addressfk: {
					detail: {
						type: 'directive',
						directive: 'basics-common-address-dialog',
						model: 'AddressDto',
						options: {
							titleField: 'cloud.common.address',
							foreignKey: 'AddressFk',
							showClearButton: true
						}
					},
					grid: {
						editor: 'lookup',
						editorOptions: {
							lookupDirective: 'basics-common-address-dialog',
							lookupOptions: {
								foreignKey: 'AddressFk',
								titleField: 'cloud.common.address'
							}
						},
						formatter: 'description',
						field: 'AddressDto',
						formatterOptions: {
							displayMember: 'Address'
						}
					}
				},
				clerkmgrfk: {
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
								showClearButton: true
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Clerk',
							displayMember: 'Code',
							width: 80
						}
					}
				},
				clerkvicemgrfk: {
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
								showClearButton: true
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Clerk',
							displayMember: 'Code',
							width: 80
						}
					}
				},
				resourcefk: platformLayoutHelperService.provideResourceLookupOverload(),
				isdisp: {
					grid: {
						width: 90
					}
				},
				islive: {readonly: true},
				accessrightdescriptorfk: {
					grid: {
						formatter: 'action',
						forceActionButtonRender: true,
						actionList: [{
							toolTip: function (entity, field) {
								var toolTipText = $translate.instant('basics.customize.createAccessRightDescriptor');
								if (entity && entity[field] && entity.DescriptionInfo) {
									var translatedKey = $translate.instant('basics.customize.accessrightdescriptor');
									toolTipText = translatedKey + ' (' + entity.DescriptionInfo.Description + ')'.substring(0, 205);
								}
								return toolTipText;
							},
							icon: 'control-icons ico-rights-off',
							valueIcon: 'control-icons ico-rights-on',
							callbackFn: function (entity) {
								if (!_.isNil(entity.AccessRightDescriptorFk)) {
									basicsSiteMainService.deleteAccessRightDescriptorById(entity);
								} else {
									basicsSiteMainService.createAccessRightDescriptorWithAccessMask(entity);
								}
							}
						}]
					},
					detail: {
						readonly: true
					}
				},
				'bassitestockfk': {
					grid: {
						editor: 'lookup',
						editorOptions: {
							lookupOptions: {
								showClearButton: true,
								filterKey: 'pps-item-stock-sitefk-filter',
								processDataKey: 'IsStockyard'
							},
							directive: 'basics-site-site-x-lookup'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'SiteNew',
							displayMember: 'Code',
							version: 3
						},
						width: 70
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupOptions: {
								showclearButton: true,
								version: 3,
								filterKey: 'pps-item-stock-sitefk-filter',
								processDataKey: 'IsStockyard'
							},
							lookupDirective: 'basics-site-site-x-lookup',
							descriptionMember: 'DescriptionInfo.Description'
						}
					}
				},
				'projectadmfk': platformLayoutHelperService.provideProjectLookupOverload(null, 'ProjectAdmFk'),
				'lgmjobadrfk': {
					navigator: {
						moduleName: 'logistic.job'
					},
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'logistic-job-paging-extension-lookup',
							lookupOptions: {
								displayMember: 'Code',
								showClearButton: true,
								additionalColumns: true,
								addGridColumns: [{
									field: 'Address.Address',
									id: 'address',
									name: 'Address',
									name$tr$: 'basics.common.entityAddress',
									width: 150,
									formatter: 'description'
								}],
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'logisticJobEx',
							displayMember: 'Code',
							version: 3
						}
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'logistic-job-paging-extension-lookup',
							displayMember: 'Code',
							descriptionMember: 'Address.Address',
							showClearButton: true
						}
					}
				},
				'lgmjobprodareafk':{
					navigator: {
						moduleName: 'logistic.job'
					},
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'logistic-job-paging-extension-lookup',
							lookupOptions: {
								displayMember: 'Code',
								showClearButton: true,
								additionalColumns: true,
								addGridColumns: [{
									field: 'Address.Address',
									id: 'address',
									name: 'Address',
									name$tr$: 'basics.common.entityAddress',
									width: 150,
									formatter: 'description'
								}],
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'logisticJobEx',
							displayMember: 'Code',
							version: 3
						}
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'logistic-job-paging-extension-lookup',
							displayMember: 'Code',
							descriptionMember: 'Address.Address',
							showClearButton: true
						}
					}
				}
			}
		};
	}

})(angular);
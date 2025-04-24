/**
 * Created by zwz on 9/29/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.header';

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

	//header2Contact Layout
	angular.module(moduleName).value('productionplanningHeader2BpLayoutConfig', {
		addition: {
			grid: extendGrouping([])
		}
	});

	angular.module(moduleName).factory('productionplanningHeader2BpLayout', PPSProductdescParamLayout);
	PPSProductdescParamLayout.$inject = ['basicsLookupdataConfigGenerator', 'basicsLookupdataLookupFilterService', 'basicsCommonComplexFormatter', 'basicsCommonCommunicationFormatter'];
	function PPSProductdescParamLayout(basicsLookupdataConfigGenerator, basicsLookupdataLookupFilterService, basicsCommonComplexFormatter, communicationFormatter) {
		// register lookup filters
		var filters = [{
			key: 'productionplanning-header-subsidiary-filter',
			fn: function (subsidiary, entity) {
				return (!entity.BusinessPartnerFk || entity.BusinessPartnerFk <= 0 || subsidiary.BusinessPartnerFk === entity.BusinessPartnerFk);
			}
		}];
		_.each(filters,function (filter) {
			if (!basicsLookupdataLookupFilterService.hasFilter(filter.key)) {
				basicsLookupdataLookupFilterService.registerFilter(filter);
			}
		});

		return {
			'fid': 'productionplanning.header.header2bpLayout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					gid: 'baseGroup',
					attributes: ['businesspartnerfk', 'rolefk', 'subsidiaryfk', 'telephonenumberfk', 'email', 'islive', 'remark']
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			'overloads': {
				businesspartnerfk: {
					'navigator': {
						moduleName: 'businesspartner.main',
						registerService: 'businesspartnerMainHeaderDataService'
					},
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
				rolefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('project.prj2bp.role'),
				subsidiaryfk: {
					//readonly: true,
					detail: {
						type: 'directive',
						directive: 'business-partner-main-subsidiary-lookup',
						options: {
							initValueField: 'SubsidiaryAddress',
							filterKey: 'productionplanning-header-subsidiary-filter',
							showClearButton: true,
							displayMember: 'AddressLine'
						}
					},
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'business-partner-main-subsidiary-lookup',
							lookupOptions: {
								showClearButton: true,
								filterKey: 'productionplanning-header-subsidiary-filter',
								displayMember: 'AddressLine'
							}
						},
						width: 125,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Subsidiary',
							displayMember: 'AddressLine'
						}
					}
				},

				telephonenumberfk: {
					readonly: true,
					sortable: false,
					detail: {
						type: 'directive',
						directive: 'basics-common-telephone-dialog',
						model: 'TelephoneNumber',
						options: {
							readOnly: true,
							titleField: 'cloud.common.TelephoneDialogPhoneNumber',
							foreignKey: 'TelephoneNumberFk',
							showClearButton: true
						}
					},
					grid: {
						editor: 'lookup',
						field: 'TelephoneNumber',
						editorOptions: {
							lookupDirective: 'basics-common-telephone-dialog',
							lookupOptions: {
								foreignKey: 'TelephoneNumberFk',
								titleField: 'cloud.common.TelephoneDialogPhoneNumber'
							}
						},
						formatter: basicsCommonComplexFormatter,
						formatterOptions: {
							displayMember: 'Telephone',
							domainType: 'phone'
						},
						sortable: false
					}
				},
				email: {
					readonly: true,
					sortable: false,
					grid: {
						editor: 'directive',
						editorOptions: {
							directive: 'basics-common-email-input',
							dataServiceName: 'productionplanningHeader2BpDataService'
						},
						formatter: communicationFormatter,
						formatterOptions: {
							domainType: 'email'
						},
						width: 150
					},
					detail: {
						type: 'directive',
						directive: 'basics-common-email-input',
						dataServiceName: 'productionplanningHeader2BpDataService'
					}
				}
			}
		};

	}

})(angular);

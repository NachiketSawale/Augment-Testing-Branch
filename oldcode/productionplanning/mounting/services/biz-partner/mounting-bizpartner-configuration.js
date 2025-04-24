(function () {
	'use strict';

	var moduleName = 'productionplanning.mounting';

	angular.module(moduleName).factory('productionplanningMountingReq2BizPartnerLayout', Layout);

	Layout.$inject = ['basicsLookupdataConfigGenerator', 'basicsLookupdataLookupFilterService', 'basicsCommonComplexFormatter', 'basicsCommonCommunicationFormatter'];

	function Layout(basicsLookupdataConfigGenerator, basicsLookupdataLookupFilterService, basicsCommonComplexFormatter, communicationFormatter) {
		var filters = [{
			key: 'productionplanning-mounting-subsidiary-filter',
			fn: function (subsidiary, entity) {
				return (!entity.BizPartnerFk || entity.BizPartnerFk <= 0 || subsidiary.BusinessPartnerFk === entity.BizPartnerFk);
			}
		}];

		_.each(filters, function (filter) {
			if (!basicsLookupdataLookupFilterService.hasFilter(filter.key)) {
				basicsLookupdataLookupFilterService.registerFilter(filter);
			}
		});

		var roleConfig = basicsLookupdataConfigGenerator.provideGenericLookupConfig('project.prj2bp.role');
		roleConfig.grid = _.merge(roleConfig.grid, {sortable: false});

		return {
			fid: 'productionplanning.mounting.req2bizpartnerlayout',
			version: '1.0.0',
			showGrouping: true,
			addValidationAutomatically: true,
			sortable: false,
			groups: [{
				gid: 'baseGroup',
				attributes: ['bizpartnerfk', 'rolefk', 'subsidiaryfk', 'islive', 'remarks', 'telephonenumberfk', 'email', 'sorting']
			}, {
				gid: 'entityHistory',
				isHistory: true
			}],
			overloads: {
				bizpartnerfk: {
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
						},
						sortable: false
					}
				},
				rolefk: roleConfig,
				subsidiaryfk: {
					sortable: false,
					detail: {
						type: 'directive',
						directive: 'business-partner-main-subsidiary-lookup',
						options: {
							initValueField: 'SubsidiaryAddress',
							filterKey: 'productionplanning-mounting-subsidiary-filter',
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
								filterKey: 'productionplanning-mounting-subsidiary-filter',
								displayMember: 'AddressLine'
							}
						},
						width: 125,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Subsidiary',
							displayMember: 'AddressLine'
						},
						sortable: false
					}
				},
				islive: {
					sortable: false
				},
				remarks: {
					sortable: false
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
							dataServiceName: 'productionplanningMountingReq2BizPartnerDataService'
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
						dataServiceName: 'productionplanningMountingReq2BizPartnerDataService'
					}
				},
				sorting: {
					readonly: true,
					sortable: false
				}
			}
		};
	}
})();

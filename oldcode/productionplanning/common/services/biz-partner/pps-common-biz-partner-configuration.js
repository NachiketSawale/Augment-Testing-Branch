(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';

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

	angular.module(moduleName).value('ppsCommonBizPartnerLayoutConfig', {
		addition: {
			grid: extendGrouping([])
		}
	});

	angular.module(moduleName).factory('ppsCommonBizPartnerLayout', Layout);
	Layout.$inject = ['$injector', '$translate', 'basicsLookupdataConfigGenerator', 'basicsLookupdataLookupFilterService', 'ppsCommonBizPartnerOwnerService', 'basicsCommonComplexFormatter', 'basicsCommonCommunicationFormatter'];
	function Layout($injector, $translate, basicsLookupdataConfigGenerator, basicsLookupdataLookupFilterService, ppsCommonBizPartnerOwnerService, basicsCommonComplexFormatter, communicationFormatter) {
		function createBizPartnerOptions(isForDetail){
			var createOptions = _.clone($injector.get('businessPartnerCreateOptions'));
			createOptions.creationData = function () {};

			return {
				initValueField : (isForDetail === true)? 'BusinesspartnerBpName1' : undefined,
				showClearButton: true,
				showDetailButton : true,
				detailOptions : $injector.get('businessPartnerDetailOptions'),
				showAddButton : true,
				createOptions : createOptions
			};
		}

		var filters = [{
			key: 'pps-common-subsidiary-filter',
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
			'fid': 'productionplanning.common.bizPartnerLayout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [{
				gid: 'baseGroup',
				attributes: ['businesspartnerfk', 'rolefk', 'subsidiaryfk', 'telephonenumberfk', 'email', 'islive', 'remark', 'from']
			}],
			'overloads': {
				businesspartnerfk: {
					navigator: {
						moduleName: 'businesspartner.main',
						registerService: 'businesspartnerMainHeaderDataService'
					},
					detail: {
						type: 'directive',
						directive: 'business-partner-main-business-partner-dialog',
						options: createBizPartnerOptions()
					},
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'business-partner-main-business-partner-dialog',
							lookupOptions: createBizPartnerOptions()
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
					detail: {
						type: 'directive',
						directive: 'business-partner-main-subsidiary-lookup',
						options: {
							initValueField: 'SubsidiaryAddress',
							filterKey: 'pps-common-subsidiary-filter',
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
								filterKey: 'pps-common-subsidiary-filter',
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
				from: {
					grid: {
						editor: 'select',
						editorOptions: {
							valueMember: 'value',
							displayMember: 'display',
							serviceName: 'ppsCommonBizPartnerOwnerService',
							serviceMethod: 'getItems'
							//serviceReload: true
						},
						formatter: 'select',
						formatterOptions: {
							valueMember: 'value',
							displayMember: 'display',
							serviceName: 'ppsCommonBizPartnerOwnerService',
							serviceMethod: 'getItems'
							//serviceReload: true
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

			}
		};
	}
})(angular);

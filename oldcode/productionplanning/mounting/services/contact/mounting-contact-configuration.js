(function () {
	'use strict';

	var moduleName = 'productionplanning.mounting';

	angular.module(moduleName).factory('productionplanningMountingReq2ContactLayout', Layout);

	Layout.$inject = ['$injector', 'basicsLookupdataConfigGenerator', 'basicsLookupdataLookupFilterService',
		'basicsCommonComplexFormatter', 'productionplanningMountingReq2BizPartnerDataService',
		'productionplanningMountingReq2ContactDataService', 'basicsLookupdataLookupDescriptorService', 'basicsCommonCommunicationFormatter'];

	function Layout($injector, basicsLookupdataConfigGenerator, basicsLookupdataLookupFilterService,
	                basicsCommonComplexFormatter, req2BizPartnerDataService,
	                req2ContactDataService, lookupDescriptorService, communicationFormatter) {
		var filters = [{
			key: 'productionplanning-mounting-contact-filter',
			serverSide: true,
			serverKey: 'project-main-bizpartner-contact-filter',
			fn: function (entity) {
				return {
					BusinessPartnerFk: entity.BizPartnerFk
				};
			}
		}];

		_.each(filters, function (filter) {
			if (!basicsLookupdataLookupFilterService.hasFilter(filter.key)) {
				basicsLookupdataLookupFilterService.registerFilter(filter);
			}
		});

		var contactCreateOptions = $injector.get('businessPartnerContactCreateOptions');
		contactCreateOptions.creationData = function () {
			var selectedItem = req2BizPartnerDataService.getSelected();
			if (selectedItem) {
				return {mainItemId: selectedItem.BizPartnerFk};
			}
		};

		var contactDetialOptions = $injector.get('businessPartnerContactDetailOptions');
		contactDetialOptions.onOk = function (result) {
			var needRefresh = false;
			var needRefreshFullName = false;
			var selectedItem = req2ContactDataService.getSelected();
			if (!_.isNil(selectedItem)) {
				if (selectedItem.FirstName !== result.FirstName) {
					selectedItem.FirstName = result.FirstName;
					needRefresh = true;
					needRefreshFullName = true;
				}
				if (selectedItem.FamilyName !== result.FamilyName) {
					needRefreshFullName = true;
				}
				if (selectedItem.SubsidiaryFk !== result.SubsidiaryFk) {
					selectedItem.SubsidiaryFk = result.SubsidiaryFk;
					needRefresh = true;
				}
				if (selectedItem.TelephoneNumber !== result.TelephoneNumberDescriptor) {
					selectedItem.TelephoneNumber = result.TelephoneNumberDescriptor;
					needRefresh = true;
				}
				if (selectedItem.TelephoneNumber2 !== result.TelephoneNumber2Descriptor) {
					selectedItem.TelephoneNumber2 = result.TelephoneNumber2Descriptor;
					needRefresh = true;
				}
				if (selectedItem.TelephoneNumberMobile !== result.MobileDescriptor) {
					selectedItem.TelephoneNumberMobile = result.MobileDescriptor;
					needRefresh = true;
				}
				if (selectedItem.Email !== result.Email) {
					selectedItem.Email = result.Email;
					needRefresh = true;
				}
			}

			if (needRefresh) {
				req2ContactDataService.refreshSelectedRow();
			}

			if (needRefreshFullName) {
				result.FullName = result.FirstName + ' ' + result.FamilyName;
				lookupDescriptorService.updateData('contact', [result]);
			}
		};

		var contactRoleTypeConfig = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.projectcontractroletype');
		contactRoleTypeConfig.grid = _.merge(contactRoleTypeConfig.grid, {sortable: false});

		return {
			fid: 'productionplanning.mounting.req2contactlayout',
			version: '1.0.0',
			showGrouping: true,
			addValidationAutomatically: true,
			groups: [{
				gid: 'baseGroup',
				attributes: ['contactfk', 'contactroletypefk', 'islive', 'remarks', 'firstname', 'subsidiaryfk', 'telephonenumberfk',
					'telephonenumber2fk', 'telephonenumbermobilefk', 'email', 'sorting']
			}, {
				gid: 'entityHistory',
				isHistory: true
			}],
			overloads: {
				contactfk: {
					detail: {
						type: 'directive',
						directive: 'business-partner-main-filtered-contact-combobox',
						options: {
							initValueField: 'FamilyName',
							filterKey: 'productionplanning-mounting-contact-filter',
							showClearButton: true,
							showAddButton: true,
							createOptions: contactCreateOptions,
							showDetailButton: true,
							detailOptions: contactDetialOptions
						}
					},
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'business-partner-main-filtered-contact-combobox',
							lookupOptions: {
								showClearButton: true,
								filterKey: 'productionplanning-mounting-contact-filter',
								showAddButton: true,
								createOptions: contactCreateOptions,
								showDetailButton: true,
								detailOptions: contactDetialOptions
							}
						},
						width: 125,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'contact',
							displayMember: 'FamilyName'
						},
						sortable: false
					}
				},
				contactroletypefk: contactRoleTypeConfig,
				islive: {
					sortable: false
				},
				remarks: {
					sortable: false
				},
				firstname: {
					readonly: true,
					sortable: false
				},
				subsidiaryfk: {
					readonly: true,
					detail: {
						type: 'directive',
						directive: 'business-partner-main-subsidiary-lookup',
						options: {
							initValueField: 'SubsidiaryAddress',
							filterKey: 'project-main-project-subsidiary-filter',
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
								filterKey: 'project-main-project-subsidiary-filter',
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
				telephonenumberfk: {
					readonly: true,
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
					}, grid: {
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
				telephonenumber2fk: {
					readonly: true,
					detail: {
						type: 'directive',
						directive: 'basics-common-telephone-dialog',
						model: 'TelephoneNumber2',
						options: {
							readOnly: true,
							titleField: 'businesspartner.main.telephoneNumber2',
							foreignKey: 'TelephoneNumber2Fk',
							showClearButton: true
						}
					},
					grid: {
						editor: 'lookup',
						field: 'TelephoneNumber2',
						formatter: basicsCommonComplexFormatter,
						formatterOptions: {
							displayMember: 'Telephone',
							domainType: 'phone'
						},
						sortable: false
					}
				},
				telephonenumbermobilefk: {
					readonly: true,
					detail: {
						type: 'directive',
						directive: 'basics-common-telephone-dialog',
						model: 'TelephoneNumberMobile',
						options: {
							readOnly: true,
							titleField: 'cloud.common.mobile',
							foreignKey: 'TelephoneNumberMobileFk',
							showClearButton: true
						}
					},
					grid: {
						editor: 'lookup',
						field: 'TelephoneNumberMobile',
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
							dataServiceName: 'productionplanningMountingReq2ContactDataService'
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
						dataServiceName: 'productionplanningMountingReq2ContactDataService'
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

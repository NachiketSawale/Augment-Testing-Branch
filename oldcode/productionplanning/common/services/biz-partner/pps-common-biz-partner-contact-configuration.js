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

	angular.module(moduleName).value('ppsCommonBizPartnerContactLayoutConfig', {
		addition: {
			grid: extendGrouping([])
		}
	});

	angular.module(moduleName).factory('ppsCommonBizPartnerContactLayout', Layout);
	Layout.$inject = ['basicsLookupdataConfigGenerator', 'basicsLookupdataLookupFilterService', 'basicsCommonComplexFormatter', 'basicsCommonCommunicationFormatter'];
	function Layout(basicsLookupdataConfigGenerator, lookupFilterService, basicsCommonComplexFormatter, communicationFormatter) {
		var filters = [{
			key: 'pps-common-bizpartner-contact-filter',
			serverSide: true,
			serverKey: 'project-main-bizpartner-contact-filter',
			fn: function (entity) {
				return {
					BusinessPartnerFk: entity.BusinessPartnerFk
				};
			}
		}];
		_.each(filters, function (filter) {
			if (!lookupFilterService.hasFilter(filter.key)) {
				lookupFilterService.registerFilter(filter);
			}
		});

		return {
			'fid': 'productionplanning.common.bizPartnerContactLayout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [{
				gid: 'baseGroup',
				attributes: ['contactfk', 'roletypefk', 'firstname', 'telephonenumberstring', 'telephonenumber2string', 'telephonenumbermobilestring', 'email', 'islive', 'remark']
			}
				// }, {
				// 	gid: 'entityHistory',
				// 	isHistory: true
				// }
			],
			'overloads': {
				contactfk: {
					detail: {
						type: 'directive',
						directive: 'business-partner-main-filtered-contact-combobox',
						options: {
							initValueField: 'FamilyName',
							filterKey: 'pps-common-bizpartner-contact-filter',
							showClearButton: true
						}
					},
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'business-partner-main-filtered-contact-combobox',
							lookupOptions: {
								showClearButton: true,
								filterKey: 'pps-common-bizpartner-contact-filter'
							}
						},
						width: 125,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'contact',
							displayMember: 'FamilyName'
						},
					}
				},
				roletypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.projectcontractroletype'),

				firstname: {readonly: true},
				telephonenumberstring: {readonly: true},
				telephonenumber2string: {readonly: true},
				telephonenumbermobilestring: {readonly: true},
				email: {readonly: true},


				// telephonenumberfk: {
				// 	readonly: true,
				// 	detail: {
				// 		type: 'directive',
				// 		directive: 'basics-common-telephone-dialog',
				// 		model: 'TelephoneNumber',
				// 		options: {
				// 			readOnly: true,
				// 			titleField: 'cloud.common.TelephoneDialogPhoneNumber',
				// 			foreignKey: 'TelephoneNumberFk',
				// 			showClearButton: true
				// 		}
				// 	}, grid: {
				// 		editor: 'lookup',
				// 		field: 'TelephoneNumber',
				// 		editorOptions: {
				// 			lookupDirective: 'basics-common-telephone-dialog',
				// 			lookupOptions: {
				// 				foreignKey: 'TelephoneNumberFk',
				// 				titleField: 'cloud.common.TelephoneDialogPhoneNumber'
				// 			}
				// 		},
				// 		formatter: basicsCommonComplexFormatter,
				// 		formatterOptions: {
				// 			displayMember: 'Telephone',
				// 			domainType: 'phone'
				// 		},
				// 		sortable: false
				// 	}
				// },
				// telephonenumber2fk: {
				// 	readonly: true,
				// 	detail: {
				// 		type: 'directive',
				// 		directive: 'basics-common-telephone-dialog',
				// 		model: 'TelephoneNumber2',
				// 		options: {
				// 			readOnly: true,
				// 			titleField: 'businesspartner.main.telephoneNumber2',
				// 			foreignKey: 'TelephoneNumber2Fk',
				// 			showClearButton: true
				// 		}
				// 	},
				// 	grid: {
				// 		editor: 'lookup',
				// 		field: 'TelephoneNumber2',
				// 		formatter: basicsCommonComplexFormatter,
				// 		formatterOptions: {
				// 			displayMember: 'Telephone',
				// 			domainType: 'phone'
				// 		},
				// 		sortable: false
				// 	}
				// },
				// telephonenumbermobilefk: {
				// 	readonly: true,
				// 	detail: {
				// 		type: 'directive',
				// 		directive: 'basics-common-telephone-dialog',
				// 		model: 'TelephoneNumberMobile',
				// 		options: {
				// 			readOnly: true,
				// 			titleField: 'cloud.common.mobile',
				// 			foreignKey: 'TelephoneNumberMobileFk',
				// 			showClearButton: true
				// 		}
				// 	},
				// 	grid: {
				// 		editor: 'lookup',
				// 		field: 'TelephoneNumberMobile',
				// 		formatter: basicsCommonComplexFormatter,
				// 		formatterOptions: {
				// 			displayMember: 'Telephone',
				// 			domainType: 'phone'
				// 		},
				// 		sortable: false
				// 	}
				// },

			}
		};

	}

})(angular);

/* global moment */
(function (angular) {
	'use strict';


	var moduleName = 'transportplanning.requisition';
	var RequisitionModul = angular.module(moduleName);

	RequisitionModul.factory('transportplanningRequisitionMainLayoutConfig', ['$injector', 'platformObjectHelper', '$translate',
		function ($injector, platformObjectHelper, $translate) {

			var requisition = {
				grid: [{
					afterId: 'clerkfk',
					id: 'clerkDesc',
					field: 'ClerkFk',
					name: 'Clerk Description',
					name$tr$: 'basics.clerk.clerkdesc',
					formatter: 'lookup',
					sortable: true,
					formatterOptions: {
						lookupType: 'Clerk',
						displayMember: 'Description',
						width: 140,
						version: 3
					}
				},
				// 	{
				// 	afterId: 'projectfk',
				// 	id: 'projectName',
				// 	field: 'ProjectFk',
				// 	name: 'Project Name',
				// 	name$tr$: 'cloud.common.entityProjectName',
				// 	formatter: 'lookup',
				// 	sortable: true,
				// 	formatterOptions: {
				// 		lookupType: 'Project',
				// 		displayMember: 'ProjectName',
				// 		width: 140
				// 	}
				// },
				{
					afterId: 'sitefk',
					id: 'siteDesc',
					field: 'SiteFk',
					name: 'Site-Description',
					name$tr$: 'basics.site.entityDesc',
					formatter: 'lookup',
					sortable: true,
					formatterOptions: {
						lookupType: 'SiteNew',
						displayMember: 'DescriptionInfo.Description',
						width: 140,
						version: 3
					}
				}, {
					afterId: 'plannedstart',
					id: 'dateOnly',
					field: 'PlannedStart',
					name: 'DateOnly',
					name$tr$: 'transportplanning.requisition.dateOnly',
					sortable: true,
					formatter: 'dateutc',
					grouping: {
						title: 'transportplanning.requisition.dateOnly',
						getter: 'Date',
						aggregators: [],
						aggregateCollapsed: true
					}
				}, {
					afterId: 'mntactivityfk',
					id: 'activityDesc',
					field: 'MntActivityFk',
					name: 'Activity-Description',
					name$tr$: 'productionplanning.activity.entityDesc',
					formatter: 'lookup',
					sortable: true,
					formatterOptions: {
						lookupType: 'MntActivity',
						displayMember: 'DescriptionInfo.Translated',
						width: 140,
						version: 3
					}
				}],
				detail: []
			};

			var productInfo = {
				grid: [{
					id: 'goodsInfo',
					field: 'BundleCollectionInfo.BundlesDescription',
					name: '*Goods Info',
					name$tr$: 'transportplanning.requisition.detail.statistics.entityGoodsInfo',
					sortable: true,
					editor: null,
					formatter: 'comment'
				}, {
					afterId: 'goodsInfo',
					id: 'productsCount',
					field: 'BundleCollectionInfo.ProductsCount',
					name: 'Products Count',
					name$tr$: 'transportplanning.requisition.detail.statistics.entityProductsCount',
					sortable: true,
					editor: null,
					formatter: 'decimal'
				}, {
					afterId: 'productsCount',
					id: 'productsWeightSum',
					field: 'BundleCollectionInfo.ProductsWeightSum.Value',
					name: 'Products Weight Sum',
					name$tr$: 'transportplanning.requisition.detail.statistics.entityProductsWeightSum',
					sortable: true,
					editor: null,
					formatter: 'decimal'
				}, {
					afterId: 'productsWeightSum',
					id: 'productsAreaSum',
					field: 'BundleCollectionInfo.ProductsAreaSum.Value',
					name: 'Product Area Sum',
					name$tr$: 'transportplanning.requisition.detail.statistics.entityProductsAreaSum',
					sortable: true,
					editor: null,
					formatter: 'decimal'
				}, {
					afterId: 'productsAreaSum',
					id: 'productsHeightSum',
					field: 'BundleCollectionInfo.ProductsHeightSum.Value',
					name: 'Product Height Sum',
					name$tr$: 'transportplanning.requisition.detail.statistics.entityProductsHeightSum',
					sortable: true,
					editor: null,
					formatter: 'decimal'
				}, {
					afterId: 'productsHeightSum',
					id: 'productsHeightSum uom',
					field: 'BundleCollectionInfo.ProductsHeightSum.Value',
					name: $translate.instant ('transportplanning.requisition.detail.statistics.entityProductsHeightSum') + ' [Custom Uom]',
					sortable: true,
					editor: null,
					formatter: 'convert'
				}, {
					afterId: 'productsHeightSumFt',
					id: 'productsMaxLength',
					field: 'BundleCollectionInfo.ProductsMaxLength.Value',
					name: 'Product Max Length',
					name$tr$: 'transportplanning.requisition.detail.statistics.entityProductsMaxLength',
					sortable: true,
					editor: null,
					formatter: 'decimal'
				},
				{
					afterId: 'productsMaxLength',
					id: 'productsMaxLength uom',
					field: 'BundleCollectionInfo.ProductsMaxLength.Value',
					name: $translate.instant ('transportplanning.requisition.detail.statistics.entityProductsMaxLength') + ' [Custom Uom]',
					sortable: true,
					editor: null,
					formatter: 'convert'
				},{
					afterId: 'productsMaxLengthFt',
					id: 'productsMaxWidth',
					field: 'BundleCollectionInfo.ProductsMaxWidth.Value',
					name: 'Product Max Width',
					name$tr$: 'transportplanning.requisition.detail.statistics.entityProductsMaxWidth',
					sortable: true,
					editor: null,
					formatter: 'decimal'
				},
				{
					afterId: 'productsMaxWidth',
					id: 'productsMaxWidth uom',
					field: 'BundleCollectionInfo.ProductsMaxWidth.Value',
					name: $translate.instant ('transportplanning.requisition.detail.statistics.entityProductsMaxWidth') + ' [Custom Uom]',
					sortable: true,
					editor: null,
					formatter: 'convert'
				}
				],
				detail: [{
					rid: 'goodsInfo',
					gid: 'statistics',
					model: 'BundleCollectionInfo.BundlesDescription',
					label: '*Goods Info',
					label$tr$: 'transportplanning.requisition.detail.statistics.entityGoodsInfo',
					type: 'comment',
					readonly: true
				}, {
					rid: 'productsCount',
					gid: 'statistics',
					model: 'BundleCollectionInfo.ProductsCount',
					label: 'Products Count',
					label$tr$: 'transportplanning.requisition.detail.statistics.entityProductsCount',
					type: 'decimal',
					readonly: true
				}, {
					rid: 'productsWeightSum',
					gid: 'statistics',
					model: 'BundleCollectionInfo.ProductsWeightSum.Value',
					label: 'Products Weight Sum',
					label$tr$: 'transportplanning.requisition.detail.statistics.entityProductsWeightSum',
					type: 'decimal',
					readonly: true
				}, {
					afterId: 'productsWeightSum',
					rid: 'productsAreaSum',
					gid: 'statistics',
					model: 'BundleCollectionInfo.ProductsAreaSum.Value',
					label: 'Product Area Sum',
					label$tr$: 'transportplanning.requisition.detail.statistics.entityProductsAreaSum',
					readonly: true,
					type: 'decimal'
				}, {
					afterId: 'productsAreaSum',
					rid: 'productsHeightSum',
					gid: 'statistics',
					model: 'BundleCollectionInfo.ProductsHeightSum.Value',
					label: 'Product Height Sum',
					label$tr$: 'transportplanning.requisition.detail.statistics.entityProductsHeightSum',
					readonly: true,
					type: 'decimal'
				}
				, {
					afterId: 'productsHeightSum',
					rid: 'productsHeightSum uom',
					gid: 'statistics',
					model: 'BundleCollectionInfo.ProductsHeightSum.Value',
					label: $translate.instant ('transportplanning.requisition.detail.statistics.entityProductsHeightSum') + ' [Custom Uom]',
					readonly: true,
					type: 'convert'
				}
				, {
					afterId: 'productsHeightSumFt',
					rid: 'productsMaxLength',
					gid: 'statistics',
					model: 'BundleCollectionInfo.ProductsMaxLength.Value',
					label: 'Product Max Length',
					label$tr$: 'transportplanning.requisition.detail.statistics.entityProductsMaxLength',
					readonly: true,
					type: 'decimal'
				},
				{
					afterId: 'productsMaxLength',
					rid: 'productsMaxLength uom',
					gid: 'statistics',
					model: 'BundleCollectionInfo.ProductsMaxLength.Value',
					label: $translate.instant ('transportplanning.requisition.detail.statistics.entityProductsMaxLength') + ' [Custom Uom]',
					readonly: true,
					type: 'convert'
				},
				{
					afterId: 'productsMaxLengthFt',
					rid: 'productsMaxWidth',
					gid: 'statistics',
					model: 'BundleCollectionInfo.ProductsMaxWidth.Value',
					label: 'Product Max Width',
					label$tr$: 'transportplanning.requisition.detail.statistics.entityProductsMaxWidth',
					readonly: true,
					type: 'decimal'
				}
				, {
					afterId: 'productsMaxWidth',
					rid: 'productsMaxWidth uom',
					gid: 'statistics',
					model: 'BundleCollectionInfo.ProductsMaxWidth.Value',
					label: $translate.instant ('transportplanning.requisition.detail.statistics.entityProductsMaxWidth') + ' [Custom Uom]',
					readonly: true,
					type: 'convert'
				}
				]
			};

			var deliveryInfo = {
				grid: [{
					id: 'routeCodes',
					field: 'RoutesInfo.Codes',
					name: 'Routes',
					name$tr$: 'transportplanning.transport.routeListTitle',
					sortable: true,
					editor: null,
					formatter: 'description',
					readonly: true,
					navigator: {
						moduleName: 'transportplanning.transport'
					}
				}], detail: [{
					rid: 'routeCodes',
					gid: 'deliveryGroup',
					model: 'RoutesInfo.Codes',
					label: 'Transport Routes',
					label$tr$: 'transportplanning.transport.routeListTitle',
					type: 'description',
					readonly: true,
					navigator: {
						moduleName: 'transportplanning.transport'
					}
				}]
			};

			var pickupInfo = {
				grid: {
					id: 'pickupIcon',
					field: 'IsPickup',
					name: 'Pickup Icon',
					name$tr$: 'transportplanning.requisition.pickupIcon',
					readonly: true,
					formatter: 'image',
					formatterOptions: {
						imageSelector: 'transportplanningRequisitionPickupIconService',
						tooltip: true
					}
				},
				detail: {
					rid: 'pickupIcon',
					gid: 'baseGroup',
					model: 'IsPickup',
					label: 'Pickup Icon',
					label$tr$: 'transportplanning.requisition.pickupIcon',
					readonly: true,
					type: 'imageselect',
					options: {
						useLocalIcons: true,
						tooltip: true,
						items: $injector.get('transportplanningRequisitionPickupIconService').getIcons()
					}
				}
			};

			var planningInfo = {
				grid: [{
					afterId: 'dateOnly',
					id: 'planTimeDay',
					field: 'PlannedTimeDay',
					name: '*Planned Time Day',
					name$tr$: 'transportplanning.transport.plannedTimeDay',
					sortable: true,
					editor: 'datetimeutc',
					formatter: 'datetimeutc',
					formatterOptions: {
						showWeekday: true
					},
					readonly: true,
					grouping: {
						title: 'transportplanning.requisition.planTime',
						getter: 'PlannedTime',
						aggregators: [],
						aggregateCollapsed: true
					}
				}],
				detail: []
			};

			var jobInfo = {
				grid:[{afterId: 'lgmjobfk',
				id: 'jobAddress',
				field: 'LgmJobFk',
				name: 'Job-Address',
				name$tr$: 'transportplanning.requisition.jobAddress',
				formatter: 'lookup',
				formatterOptions: {
				displayMember: 'Address.AddressLine',
					lookupType: 'logisticJobEx',
					version: 3
			},
			width: 140,
				sortable: true
				}],
				detail: []
				// detail: [{
				// 	afterId: 'lgmjobfk',
				// 	gid: 'baseGroup',
				// 	rid: 'jobAddress',
				// 	model: 'LgmJobFk',
				// 	label: 'Job-Address',
				// 	label$tr$: 'transportplanning.requisition.jobAddress',
				// 	type: 'directive',
				// 	directive: 'logistic-job-paging-extension-lookup',
				// 	options: {
				// 		displayMember: 'Address.AddressLine',
				// 		version: 3,
				// 		readOnly: true
				// 	}
				// }]
			};

			function overRideGrouping() {
				var gridColumns = _.concat([], requisition.grid, productInfo.grid, deliveryInfo.grid, pickupInfo.grid, planningInfo.grid, jobInfo.grid);
				gridColumns = _.partition(gridColumns, function (group) {
					return group.grouping;
				});
				var configuredColumns = gridColumns[0];
				var unconfiguredColumns = gridColumns[1];
				platformObjectHelper.extendGrouping(unconfiguredColumns);
				return _.concat(configuredColumns, unconfiguredColumns);
			}

			return {
				addition: {
					grid: overRideGrouping(),
					detail: _.concat([], requisition.detail, productInfo.detail, deliveryInfo.detail, pickupInfo.detail, planningInfo.detail, jobInfo.detail)
				}
			};
		}]);

	// Requisition Details
	RequisitionModul.factory('transportplanningRequisitionDetailLayout', RequisitionDetailLayout);
	RequisitionDetailLayout.$inject = ['$injector', '$q', 'transportplanningRequisitionMainService',
		'basicsCommonComplexFormatter', 'basicsLookupdataConfigGenerator', 'platformLayoutHelperService',
		'basicsLookupdataLookupFilterService', 'ppsCommonCustomColumnsServiceFactory', 'ppsUIUtilService', 'productionplanningCommonLayoutHelperService'];

	function RequisitionDetailLayout($injector, $q, transportplanningRequisitionMainService,
									 basicsCommonComplexFormatter, basicsLookupdataConfigGenerator, platformLayoutHelperService,
		basicsLookupdataLookupFilterService, customColumnsServiceFactory, ppsUIUtilService, ppsCommonLayoutHelperService) {
		// register filters
		var filters = [{
			key: 'transportplanning-requisition-sitefk-filter',
			serverSide: true,
			fn: function () {
				return {Isdisp: true};
			}
		}, {
			key: 'transportplanning-requisition-eventtype-filter',
			fn: function (item) {
				if (item) {
					return item.PpsEntityFk !== null && item.PpsEntityFk === 6 && item.IsLive;
					// "PpsEntityFK === 6" maps "Transport Requisition"
				}
				return false;
			}
		}, {
			key: 'transportplanning-requisition-resourcetype-filter',
			fn: function (item) {
				return item && item.IsTruck === true;
			}
		}];
		basicsLookupdataLookupFilterService.registerFilter(filters);

		var contactCreateOptions = $injector.get('businessPartnerContactCreateOptions');
		contactCreateOptions.creationData = function () {
			var selectedItem = transportplanningRequisitionMainService.getSelected();
			if (selectedItem) {
				return {mainItemId: selectedItem.BusinessPartnerFk};
			}
		};

		var contactDetialOptions = $injector.get('businessPartnerContactDetailOptions');

		var layout = {
			'fid': 'transportplanning.requisition',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'change': function (entity, field) {
				var dataService = $injector.get('transportplanningRequisitionMainService');
				dataService.onEntityPropertyChanged(entity, field);
			},
			'groups': [
				{
					gid: 'baseGroup',
					attributes: ['trsreqstatusfk', 'code', 'descriptioninfo', 'projectfk', 'ispickup',
						'sitefk', 'lgmjobfk', 'restypefk', 'eventtypefk', 'commenttext', 'islive', 'maxweight', 'summary']
				}, {
					gid: 'planningInfoGroup',
					attributes: ['plannedtime','plannedstart', 'plannedfinish', 'earlieststart', 'lateststart', 'earliestfinish', 'latestfinish',
						'dateshiftmode']
				}, {
					gid: 'contactsGroup',
					attributes: ['clerkfk', 'businesspartnerfk', 'contactfk']
				}, {
					gid: 'bindings',
					attributes: ['mntactivityfk']
				}, {
					gid: 'statistics',
					attributes: []
				}, {
					gid: 'deliveryGroup',
					attributes: []
				}, {
					gid: 'userDefTextGroup',
					isUserDefText: true,
					attCount: 5,
					attName: 'userdefined',
					noInfix: true
				}, {
					gid: 'entityHistory',
					isHistory: true
				}
			],
			'overloads': {
				lgmjobfk: (function () {
					var settings = ppsCommonLayoutHelperService.provideJobExtensionLookupOverload({
						projectFk: 'ProjectFk',
						jobType: 'external'
					});
					var event = [
						{
							name: 'onSelectedItemChanged',
							handler: function handleJobChanged(e, args) {
								transportplanningRequisitionMainService.handleJobChanged(args.entity, args.selectedItem);
							}
						}
					];
					settings.grid.editorOptions.lookupOptions.events = event;
					settings.detail.options.lookupOptions.events = event;
					return settings;
				})(),
				'code': {
					navigator: {
						moduleName: 'transportplanning.requisition'
					}
				},
				projectfk: platformLayoutHelperService.provideProjectLookupOverload(),
				clerkfk: platformLayoutHelperService.provideClerkLookupOverload(),
				trsreqstatusfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.transportrequisitionstatus', null, {
					showIcon: true,
					imageSelectorService: 'platformStatusSvgIconService',
					svgBackgroundColor: 'BackgroundColor',
					backgroundColorType: 'dec',
					backgroundColorLayer: [1, 2, 3, 4, 5, 6]
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
				contactfk: {
					detail: {
						type: 'directive',
						directive: 'business-partner-main-filtered-contact-combobox',
						options: {
							initValueField: 'FamilyName',
							filterKey: 'transportplanning-requisition-bizpartner-contact-filter',
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
								filterKey: 'transportplanning-requisition-bizpartner-contact-filter',
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
						}
					}
				},
				// addressfk: {
				// 	detail: {
				// 		type: 'directive',
				// 		directive: 'basics-common-address-dialog',
				// 		model: 'AddressEntity',
				// 		options: {
				// 			titleField: 'cloud.common.entityAddress',
				// 			foreignKey: 'AddressFk',
				// 			showClearButton: true
				// 		}
				// 	},
				// 	grid: {
				// 		editor: 'lookup',
				// 		field: 'AddressEntity',
				// 		editorOptions: {
				// 			lookupDirective: 'basics-common-address-dialog',
				// 			'lookupOptions': {
				// 				foreignKey: 'AddressFk',
				// 				titleField: 'cloud.common.entityAddress'
				// 			}
				// 		},
				// 		formatter: basicsCommonComplexFormatter,
				// 		formatterOptions: {
				// 			displayMember: 'AddressLine'
				// 		}
				// 	}
				// },
				sitefk: {
					grid: {
						editor: 'lookup',
						editorOptions: {
							lookupOptions: {
								showClearButton: true,
								filterKey: 'transportplanning-requisition-sitefk-filter',
								version: 3
							},
							directive: 'basics-site-site-isdisp-lookup'
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
								showClearButton: true,
								filterKey: 'transportplanning-requisition-sitefk-filter',
								version: 3
							},
							lookupDirective: 'basics-site-site-isdisp-lookup',
							descriptionMember: 'DescriptionInfo.Translated'
						}
					}
				},
				mntactivityfk: {
					navigator: {
						moduleName: 'productionplanning.activity'
					},
					grid: {
						editor: 'lookup',
						editorOptions: {
							lookupOptions: {
								showClearButton: true,
								defaultFilter: {ProjectId: 'ProjectFk'}
							},
							directive: 'productionplanning-activity-lookup-new-directive'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'MntActivity',
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
								showClearButton: true,
								defaultFilter: {ProjectId: 'ProjectFk'}
							},
							lookupDirective: 'productionplanning-activity-lookup-new-directive',
							descriptionMember: 'DescriptionInfo.Translated'
						},
						change: function (entity) {
							if (entity.Version === 0) {
								var dataServ = $injector.get('transportplanningRequisitionMainService');
								var validateServ = $injector.get('transportplanningRequisitionValidationService');
								dataServ.updateLgmJobFkForNewItem(entity, validateServ);
							}
						}
					}
				},
				restypefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'resourceTypeLookupDataService',
					filterKey: 'transportplanning-requisition-resourcetype-filter',
					navigator: {
						moduleName: 'resource.type'
					}
				}),
				eventtypefk: {
					grid: {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'EventType',
							displayMember: 'DescriptionInfo.Translated',
							version: 3
						},
						editor: 'lookup',
						editorOptions: {
							lookupField: 'EventType',
							directive: 'productionplanning-common-event-type-lookup',
							lookupOptions: {
								showClearButton: true,
								filterKey: 'transportplanning-requisition-eventtype-filter'
							}
						},
						width: 90
					},
					detail: {
						type: 'directive',
						directive: 'productionplanning-common-event-type-lookup',
						options: {
							filterKey: 'transportplanning-requisition-eventtype-filter'
						}
					}
				},
				islive: {readonly: true},
				dateshiftmode: {
					grid: {
						formatter: 'select',
						formatterOptions: {
							serviceName: 'productionplanningCommonDateShiftModeService',
							valueMember: 'Id',
							displayMember: 'Description'
						},
						editor: 'select',
						editorOptions: {
							serviceName: 'productionplanningCommonDateShiftModeService',
							valueMember: 'Id',
							displayMember: 'Description'
						},
						readonly: true
					},
					detail: {
						type: 'select',
						required: false,
						options: {
							serviceName: 'productionplanningCommonDateShiftModeService',
							valueMember: 'Id',
							displayMember: 'Description'
						}
					}
				},
				maxweight: {
					disallowNegative: true
				},
				summary: {
					readonly: true,
					grid: {
						formatter: summaryFormatter
					}, detail: {
						type: 'directive',
						directive: 'productionplanning-common-html-directive',
						options: {
							formatter: summaryFormatter
						}
					}
				},
				plannedtime : {
					id: 'plannedtime',
					bulkSupport: false,
			  }
			}
		};

		function summaryFormatter(row, cell, value, columnDef, dataContext, flag) {
			var format = '';
			if (dataContext) {
				if (flag) {
					return dataContext.AssignedBundlesAreOverweight;
				}
				switch (dataContext.AssignedBundlesAreOverweight) {
					case true:
						format += ppsUIUtilService.getIcon('type-icons ico-warning20', 'transportplanning.requisition.assignedBundlesAreOverweight');
						break;
				}
			}
			return format;
		}

		var customColumnService = customColumnsServiceFactory.getService(moduleName);
		customColumnService.setClerkRoleConfig(layout);

		return layout;
	}

})(angular);
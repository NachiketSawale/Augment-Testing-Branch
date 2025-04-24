/**
 * Created by zwz on 6/5/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';
	var module = angular.module(moduleName);

	/**
	 * @ngdoc factory
	 * @name productionplanningCommonLayoutHelperService
	 * @description
	 * Provides methods to create layout configuration for grid/detail
	 */
	module.service('productionplanningCommonLayoutHelperService', LayoutHelperService);

	LayoutHelperService.$inject = ['basicsLookupdataLookupFilterService', 'basicsLookupdataConfigGenerator'];

	function LayoutHelperService(basicsLookupdataLookupFilterService, basicsLookupdataConfigGenerator) {

		this.provideEventTypeLookupOverload = function (filterKey) {
			var overload = {
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
						displayMember: 'DescriptionInfo.Translated'
					},
					width: 90
				},
				detail: {
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'productionplanning-common-event-type-lookup',
						descriptionMember: 'DescriptionInfo.Translated'
					}
				}
			};
			if (filterKey) {
				overload.grid.editorOptions.lookupOptions = {'filterKey': filterKey};
				overload.detail.options.lookupOptions = {'filterKey': filterKey};
			}
			return overload;

		};

		this.provideMaterialLookupOverload = function (eventsOption) {
			return {
				navigator: {
					moduleName: 'basics.material'
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
							showClearButton: true,
							events: eventsOption,
							additionalColumns: true,
							addGridColumns: [{
								id: 'Description',
								field: 'DescriptionInfo.Translated',
								width: 150,
								name: 'Description',
								formatter: 'description',
								name$tr$: 'cloud.common.entityDescription'
							}],
							gridOptions: {
								disableCreateSimilarBtn: true
							}
						},
						directive: 'basics-material-material-lookup'
					},
					width: 100
				},
				detail: {
					type: 'directive',
					directive: 'basics-material-material-lookup',
					options: {
						events: eventsOption,
						showClearButton: true,
						gridOptions: {
							disableCreateSimilarBtn: true
						}
					}
				}
			};

		};

		function getProjectId(entity) {
			var projectId = -1;
			if (entity.ProjectId) {
				projectId = entity.ProjectId;
			}
			else if (entity.ProjectFk) {
				projectId = entity.ProjectFk;
			}
			else if (entity.PrjProjectFk) {
				projectId = entity.PrjProjectFk;
			}
			return projectId;
		}

		this.providePrjControllingUnitLookupOverload = function () {
			//register filter
			var filterkey = 'productionplanning-common-controlling-unit-filter';
			if (!basicsLookupdataLookupFilterService.hasFilter(filterkey)) {
				var filter = {
					key: filterkey,
					serverSide: true,
					serverKey: 'controlling.structure.prjcontrollingunit.filterkey',
					fn: function (entity) {
						return 'ProjectFk=' + getProjectId(entity);
					}
				};
				basicsLookupdataLookupFilterService.registerFilter(filter);
			}

			var addColumns = [{
				id: 'Description',
				field: 'DescriptionInfo',
				name: 'Description',
				width: 300,
				formatter: 'translation',
				name$tr$: 'cloud.common.entityDescription'
			}];

			return {
				navigator: {
					moduleName: 'controlling.structure'
				},
				detail: {
					type: 'directive',
					directive: 'controlling-Structure-Prj-Controlling-Unit-Lookup',

					options: {
						eagerLoad: true,
						showClearButton: true,
						filterKey: filterkey,
						additionalColumns: true,
						displayMember: 'Code',
						addGridColumns: addColumns
					}
				},
				grid: {
					editor: 'lookup',
					editorOptions: {
						directive: 'controlling-Structure-Prj-Controlling-Unit-Lookup',
						lookupOptions: {
							showClearButton: true,
							filterKey: filterkey,
							additionalColumns: true,
							displayMember: 'Code',
							addGridColumns: addColumns
						}
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'controllingunit',
						displayMember: 'Code'
					}
				}
			};

		};

		this.providePrjLocationLookupOverload = function () {
			return basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'projectLocationLookupDataService',
				cacheEnable: true,
				additionalColumns: true,
				filter: getProjectId,
				showClearButton: true
			});
		};

		this.provideJobExtensionLookupOverload = function provideJobExtensionLookupOverload(filter, filterKey, events) {
			var extendFilter = _.extend(filter, {activeJob: true});
			return {
				navigator: {
					moduleName: 'logistic.job'
				},
				grid: {
					editor: 'lookup',
					editorOptions: {
						directive: 'logistic-job-paging-extension-lookup',
						lookupOptions: {
							additionalColumns: true,
							showClearButton: true,
							defaultFilter: extendFilter,
							filterKey: filterKey,
							events: events,
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
						lookupType: 'logisticJobEx',
						displayMember: 'Code',
						version: 3
					}
				},
				detail: {
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						filterKey: filterKey,
						lookupDirective: 'logistic-job-paging-extension-lookup',
						displayMember: 'Code',
						descriptionMember: 'DescriptionInfo.Translated',
						showClearButton: true,
						lookupOptions: {
							defaultFilter: extendFilter,
							showClearButton: true,
							events: events
						}
					}
				}
			};
		};
	}
})(angular);


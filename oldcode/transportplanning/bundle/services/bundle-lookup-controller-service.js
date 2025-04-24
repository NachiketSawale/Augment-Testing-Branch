/**
 * Created by waz on 8/2/2018.
 */
(function (angular) {
	'use strict';
	/*global angular, _, Slick*/
	var moduleName = 'transportplanning.bundle';

	/**
	 * @summary
	 * The core logic of bundle dialog/lookup, support paging and custom filters, may extract a common service if necessary.
	 */
	angular.module(moduleName).factory('transportplanningBundleLookupControllerService', LookupConfigControllerService);
	LookupConfigControllerService.$inject = [
		'$http',
		'$translate',
		'platformGridAPI',
		'platformToolbarService',
		'platformLayoutHelperService',
		'platformFormConfigService',
		'lookupFilterDialogDataService',
		'lookupFilterDialogControllerService',
		'basicsLookupdataLookupControllerFactory',
		'basicsLookupdataLookupDescriptorService',
		'basicsLookupdataConfigGenerator',
		'basicsLookupdataLookupFilterService',
		'basicsCommonBaseDataServiceReferenceActionExtension',
		'transportplanningBundleUIStandardService',
		'transportplanningBundleStatusValidationService',
		'transportplanningBundleDocumentDataProviderFactory',
		'transportplanningBundleButtonService'];

	function LookupConfigControllerService($http,
										   $translate,
										   platformGridAPI,
										   platformToolbarService,
										   platformLayoutHelperService,
										   platformFormConfigService,
										   lookupDataServiceFactory,
										   lookupControllerService,
										   basicsLookupdataLookupControllerFactory,
										   basicsLookupdataLookupDescriptorService,
										   basicsLookupdataConfigGenerator,
										   basicsLookupdataLookupFilterService,
										   referenceActionExtension,
										   uiService,
										   statusValidationService,
										   documentDataProviderFactory,
										   buttonService) {
		var service = {
			createLookupConfig: createLookupConfig,
			initController: initController
		};
		var searchValue = '';

		function createLookupConfig(furtherFilter) {
			return {
				lookupType: 'TrsBundleLookup',
				valueMember: 'Id',
				displayMember: 'Code',
				disableDataCaching: true,
				columns: uiService.getLookupConfigForListView().columns,
				dataService: createDataProvider('aff3f99f4d274b89855a186a262f4276', furtherFilter),
				detailConfig: createFilterFormConfig(furtherFilter),
				title: 'transportplanning.bundle.assignBundle',
				uuid: 'aff3f99f4d274b89855a186a262f4276'
			};
		}

		function createDataProvider(gridId, furtherFilter) {
			var dataProvider;
			var generateRequest = function (filters, searchString) {
				// those data try to handle assign bundle to package before save in db
				var assignedToPkgBundles = _.map(referenceActionExtension.getAssignedItemsRecord('transportplanningBundleToPackage'), 'Id');
				// those data try to handle assign bundle to requisition before save in db
				var assignedToReqBundles = _.map(referenceActionExtension.getAssignedItemsRecord('transportplanningBundleToRequisition'), 'Id');
				var request = {
					Pattern: searchString ? searchString : searchValue,
					FurtherFilters: [],
					PageNumber: dataProvider.page.number,
					PageSize: dataProvider.page.size,
					AssignedToPkgBundles: assignedToPkgBundles,
					AssignedToReqBundles: assignedToReqBundles,
					AssignedBundles: dataProvider.assignedBundles
				};

				generateFurtherFilter(filters.projectId, 'Project', request.FurtherFilters);
				generateFurtherFilter(filters.siteId, 'Site', request.FurtherFilters);
				generateFurtherFilter(filters.trsPackageId, 'TrsPackage', request.FurtherFilters);
				generateFurtherFilter(filters.jobId, 'Job', request.FurtherFilters);
				generateFurtherFilter(filters.drawingId, 'Drawing', request.FurtherFilters);
				generateFurtherFilter(filters.trsRequisitionId, 'TrsRequisition', request.FurtherFilters);

				if (filters.notAssignedFlags) {
					_.each(['notAssignedToPkg', 'notAssignedToReq', 'notShipped'],function (field) {
						var tokenName = field.substring(0,1).toUpperCase()+field.substring(1);
						generateFurtherFilter(filters.notAssignedFlags[field] ? 1 : 0, tokenName, request.FurtherFilters);
					});

					if(filters.notAssignedFlags.onlyBeforeDelivery && furtherFilter.plannedDeliveryTime && furtherFilter.plannedDeliveryTime.isValid()){
						generateFurtherFilter(furtherFilter.plannedDeliveryTime, 'PlannedDeliveryTime', request.FurtherFilters);
					}
				}

				if (furtherFilter && furtherFilter.addMoreFilterFn) {
					furtherFilter.addMoreFilterFn(request);
				}
				return request;
			};
			var options = {
				httpRoute: 'transportplanning/bundle/bundle/',
				endPointRead: 'lookup',
				filterParam: {},
				dataEnvelope: 'Main',
				modifyLoadedData: function (list, data) {
					dataProvider.page.currentLength = data.itemsRetrieved;
					dataProvider.page.totalLength = data.itemsFound;
				},
				prepareFilter: generateRequest
			};
			dataProvider = lookupDataServiceFactory.createInstance(options);
			dataProvider.page = {
				number: 0,
				size: 100,
				currentLength: 0,
				totalLength: 0
			};
			dataProvider.generateRequest = generateRequest;
			dataProvider.registerSelectionChanged = function (callback) {
				platformGridAPI.events.register(gridId, 'onSelectedRowsChanged', function (e, item) {
					callback(e, item);
				});
			};
			dataProvider.unregisterSelectionChanged = function () {
				platformGridAPI.events.unregister(gridId, 'onSelectedRowsChanged');
			};
			return dataProvider;
		}

		function extendPreviewDocument(gridId, dataProvider, baseControlller) {
			var documentProvider = documentDataProviderFactory.createPreviewProvider({
				getDocument: function (ppsDocumentType) {
					if (!platformGridAPI.grids.element('id', gridId).instance) {
						return;
					}

					var entity = baseControlller.getSelectedItems()[0];
					return entity ? entity[ppsDocumentType.model] : null;
				}
			});
			_.assign(dataProvider, documentProvider);
		}

		function createFilterFormConfig(furtherFilter) {

			let checkBoxGroup = [{
				model: 'notAssignedToPkg',
				type: 'boolean',
				fill: false
			}, {
				label: '*Not assigned to requisition',
				label$tr$: 'transportplanning.bundle.notAssignedToReq',
				model: 'notAssignedToReq',
				type: 'boolean',
				fill: true
			}, {
				model: 'notShipped',
				type: 'boolean',
				label: '*Hide delivered',
				label$tr$: 'transportplanning.bundle.notShipped',
				fill: true
			}];

			if(furtherFilter && furtherFilter.plannedDeliveryTime && furtherFilter.plannedDeliveryTime.isValid() && !_.find(checkBoxGroup, {model: 'onlyBeforeDelivery'})){
				checkBoxGroup.push({
					model: 'onlyBeforeDelivery',
					type: 'boolean',
					label: '*Show Only Available',
					label$tr$: 'transportplanning.bundle.onlyBeforeDelivery',
					fill: true,
				});
			}

			return {
				fid: 'transportplanning.bundle.selectionfilter',
				version: '1.0.0',
				showGrouping: false,
				groups: [{
					gid: 'selectionfilter',
					isOpen: true,
					visible: true,
					sortOrder: 1
				}],
				rows: [
					_.assign(
						platformLayoutHelperService.provideProjectLookupOverload().detail,
						{
							gid: 'selectionfilter',
							rid: 'project',
							label: '*Project',
							label$tr$: 'cloud.common.entityProject',
							model: 'projectId',
							sortOrder: 1,
							readonly: true
						}),
					{
						gid: 'selectionfilter',
						rid: 'job',
						type: 'directive',
						label: '*Job',
						label$tr$: 'transportplanning.bundle.entityJob',
						model: 'jobId',
						directive: 'logistic-job-paging-extension-lookup',
						options: {
							lookupDirective: 'logistic-job-paging-extension-lookup',
							displayMember: 'Code',
							descriptionMember: 'DescriptionInfo.Translated',
							defaultFilter: { projectFk: 'projectId', drawingFk: 'drawingId', activeJob: true},
							showClearButton: true
						},
						sortOrder: 2,
						readonly: true
					},
					basicsLookupdataConfigGenerator.provideElaboratedLookupConfigForForm(
						'basics-site-site-isstockyard-lookup',
						'SiteNew',
						'Code',
						true,
						{
							gid: 'selectionfilter',
							rid: 'site',
							label: '*Site',
							label$tr$: 'basics.site.entitySite',
							model: 'siteId',
							sortOrder: 3
						},
						'transportplanning-bundle-lookup-dialog-site-filter'),
					basicsLookupdataConfigGenerator.provideElaboratedLookupConfigForForm(
						'transportplanning-package-lookup',
						'TrsPackage',
						'Code',
						true,
						{
							gid: 'selectionfilter',
							rid: 'package',
							label: '*Package',
							label$tr$: 'transportplanning.bundle.entityPackage',
							model: 'trsPackageId',
							sortOrder: 4
						},
						'transportplanning-bundle-lookup-dialog-package-filter'),
					{
						gid: 'selectionfilter',
						rid: 'drawing',
						type: 'directive',
						label: '*Drawing',
						label$tr$: 'productionplanning.drawing.entityDrawing',
						model: 'drawingId',
						directive: 'productionplanning-drawing-dialog-all-lookup',
						options: {
							lookupDirective: 'productionplanning-drawing-dialog-all-lookup',
							displayMember: 'Code',
							descriptionMember: 'Description',
							showClearButton: true,
							additionalFilters:[{
								getAdditionalEntity: function (entity) {
									return {projectId: entity.projectId};
								},
								projectId: 'projectId'
							}],
							lookupOptions: {
								defaultFilter: {projectId: 'projectId'}
							}
						},
						sortOrder: 5
					},
					{
						gid: 'selectionfilter',
						rid: 'trsRequisition',
						model: 'trsRequisitionId',
						sortOrder: 7,
						label$tr$: 'transportplanning.requisition.entityRequisition',
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'transportplanning-requisition-lookup-dialog',
							descriptionMember: 'DescriptionInfo.Translated',
							displayMember: 'Code',
							lookupOptions: {
								showClearButton: true,
								defaultFilter: {ProjectId: 'ProjectFk'}
							}
						}
					},
					// basicsLookupdataConfigGenerator.provideElaboratedLookupConfigForForm(
					// 	'transportplanning-requisition-lookup',
					// 	'TrsRequisition',
					// 	'Code',
					// 	true,
					// 	{
					// 		gid: 'selectionfilter',
					// 		rid: 'trsRequisition',
					// 		label: '*Transport Requisition',
					// 		label$tr$: 'transportplanning.bundle.entityRequisition',
					// 		model: 'trsRequisitionId',
					// 		sortOrder: 7
					// 	},
					// 	'transportplanning-bundle-lookup-dialog-requisition-filter'),
					{
						gid: 'selectionfilter',
						rid: 'notAssignedFlags',
						model: 'notAssignedFlags',
						type: 'composite',
						label: '*Not assigned to package',
						label$tr$: 'transportplanning.bundle.notAssignedToPkg',
						sortOrder: 8,
						composite: checkBoxGroup
					},
					{
						gid: 'selectionfilter',
						rid: 'earliestStart',
						label$tr$: 'productionplanning.common.event.earliestStart',
						type: 'datetimeutc',
						visible: true,
						readonly: true,
						sortOrder: 9,
						model: 'EarliestStart'
					},
					{
						gid: 'selectionfilter',
						rid: 'latestFinish',
						label$tr$: 'productionplanning.common.event.latestFinish',
						type: 'datetimeutc',
						visible: true,
						readonly: true,
						sortOrder: 10,
						model: 'LatestFinish'
					}
				]
			};
		}

		function setupTools($scope) {
			var toolbarItems = [];
			$scope.tools = {
				showImages: true,
				showTitles: true,
				cssClass: 'tools',
				items: toolbarItems,
				version: 1,
				initOnce: true,
				update: function () {
					platformToolbarService.ensureOverflowButton($scope.tools.items);
					$scope.tools.version += 1;
				}
			};
			buttonService.addToolsUpdateOnSelectionChange($scope, $scope.options.dataProvider);
			buttonService.extendSelectionDialogButtons($scope, $scope.options.dataProvider);
		}

		function registerLookupFilters() {
			var filters = [{
				key: 'transportplanning-bundle-lookup-dialog-package-filter',
				fn: function (packageItem, request) {
					var isPackageInPacaging = statusValidationService.isPackageInPackaging(packageItem);
					var isSameProject = packageItem.ProjectFk === request.projectId;
					return isPackageInPacaging && isSameProject;
				}
			}, {
				key: 'transportplanning-bundle-lookup-dialog-requisition-filter',
				fn: function (requisitionItem, request) {
					var isRequisitionAccepted = statusValidationService.isTrsRequisitionAccepted(requisitionItem);
					var isSameProject = requisitionItem.ProjectFk === request.projectId;
					return !isRequisitionAccepted && isSameProject;
				}
			}, {
				key: 'transportplanning-bundle-lookup-dialog-site-filter',
				serverSide: true,
				fn: function () {
					return {IsStockyard: true};
				}
			}];

			_.forEach(filters, function (filter) {
				if (!basicsLookupdataLookupFilterService.hasFilter(filter.key)) {
					basicsLookupdataLookupFilterService.registerFilter(filter);
				}
			});
		}

		function initController($scope, $modalInstance) {
			searchValue = '';
			$scope.settings.pageOptions = {
				enabled: true,
				size: 100
			};
			if (!$scope.notCreateDataProvider) {
				$scope.options.dataService = createDataProvider('aff3f99f4d274b89855a186a262f4276',
					$scope.entity
				);
			}
			$scope.options.dataProvider = $scope.options.dataService;
			$scope.onSearchInput = function (e, value) {
				searchValue = value;
			};

			var baseController = lookupControllerService.initFilterDialogController($scope, $modalInstance);

			var sOtionsDataServ = $scope.options.dataService;
			if ($scope.options.notChangeProjectByJob) {
				sOtionsDataServ.notChangeProjectByJob = true;//extend which can configure in lookupOptions
			}
			var jobRow = _.find($scope.options.detailConfig.rows, {model: 'jobId'});
			var baseChange = jobRow.change;
			jobRow.change = function (model) {
				baseChange(model);
				if ($scope.request.jobId !== null && sOtionsDataServ.notChangeProjectByJob !== true) {
					basicsLookupdataLookupDescriptorService.getItemByKey('logisticJobEx', $scope.request.jobId).then(function (data) {
						if (data && angular.isObject(data)) {
							$scope.request.projectId = data.ProjectFk;
							/* jshint -W116 */
							if (sOtionsDataServ.getSelectedFilter('projectId') !== $scope.request.projectId) {
								sOtionsDataServ.setSelectedFilter('projectId', $scope.request.projectId);
							}
						}
					});
				}

			};

			registerPaginator($scope);

			$scope.settings.inputSearchMembers = _.map($scope.options.columns, 'field');
			$scope.settings.inputSearchMembers.push('ProductCollectionInfo.EngDrawingCode');
			$scope.settings.inputSearchMembers.push('ProductCollectionInfo.EngDrawingDescription');
			$scope.settings.inputSearchMembers.push('DrawingCodeOfStack');
			$scope.settings.inputSearchMembers.push('DrawingDescriptionOfStack');
			// remark: set inputSearchMembers for fixing ticket#117799 by zwz 2021/07/19

			extendPreviewDocument($scope.options.uuid, $scope.options.dataProvider, baseController);
			setupTools($scope);
			registerLookupFilters();

			platformGridAPI.grids.element('id', 'aff3f99f4d274b89855a186a262f4276').options.editorLock = new Slick.EditorLock();

			return baseController;
		}

		function generateFurtherFilter(filterValue, filterToken, furtherFilters) {
			var futherFilter = {};
			if (filterValue) {
				furtherFilters.push({
					Token: filterToken,
					Value: filterValue
				});
			}
			return futherFilter;
		}

		function registerPaginator($scope) {
			var page = $scope.options.dataService.page;
			var paginator = {
				getPageText: function () {
					if ($scope.isLoading) {
						return 'Searching...';
					}
					var firstRetriveIndex = page.size * page.number + (page.currentLength > 0 ? 1 : 0);
					var lastRetriveIndex = page.size === page.currentLength ? page.size * (page.number + 1) : page.size * page.number + page.currentLength;
					return firstRetriveIndex + ' - ' + lastRetriveIndex + ' / ' + page.totalLength;
				},
				canPageUp: function () {
					return page.number > 0;
				},
				pageUp: function () {
					--page.number;
					$scope.search(searchValue, true);
				},
				canPageDown: function () {
					return page.totalLength > page.currentLength && page.size === page.currentLength;
				},
				pageDown: function () {
					++page.number;
					$scope.search(searchValue, true);
				}
			};
			_.extend($scope, paginator);
		}

		return service;

	}
})(angular);
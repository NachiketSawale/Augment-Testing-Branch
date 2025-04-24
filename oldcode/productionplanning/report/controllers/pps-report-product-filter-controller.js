(function () {
	'use strict';
	var moduleName = 'productionplanning.report';
	angular.module(moduleName).controller('productionplanningReportProductFilterController', ProductFilterController);
	ProductFilterController.$inject = ['$scope', '$controller', '$http', 'platformTranslateService', 'platformContainerControllerService',
		'platformGridAPI', 'productionplanningReportProductFilterDataService', 'basicsLookupdataLookupDescriptorService',
		'productionplanningProductDocumentDataProviderFactory',
		'ppsDocumentToolbarButtonExtension'];

	function ProductFilterController(
		$scope, $controller, $http, platformTranslateService, platformContainerControllerService,
		platformGridAPI, dataService, lookupDescriptorService,
		productDocumentDataProviderFactory,
		ppsDocumentToolbarButtonExtension) {

		var uuid = $scope.getContainerUUID();

		var reportStatus = _.each(_.cloneDeep(lookupDescriptorService.getData('basics.customize.ppsproductstatus')), function (status) {
			status.Description = status.DescriptionInfo.Translated;
		});

		var formConfig = {
			fid: 'productionplanning.report.product.filter',
			version: '1.0.0',
			showGrouping: false,
			groups: [{
				gid: 'filter'
			}],
			rows: [{
				gid: 'filter',
				rid: 'activity',
				label: '*Mounting Activity',
				label$tr$: 'productionplanning.activity.entityActivity',
				model: 'activityFk',
				readonly: true,
				type: 'directive',
				directive: 'basics-lookupdata-lookup-composite',
				options: {
					lookupDirective: 'productionplanning-activity-lookup-new-directive',
					descriptionMember: 'DescriptionInfo.Description'
				}
			}, {
				gid: 'filter',
				rid: 'job',
				label: '*Job',
				label$tr$: 'project.costcodes.lgmJobFk',
				type: 'directive',
				directive: 'basics-lookupdata-lookup-composite',
				model: 'jobFk',
				options: {
					lookupDirective: 'logistic-job-paging-extension-lookup',
					descriptionMember: 'DescriptionInfo.Translated',
					lookupOptions: {
						showClearButton: true
					}
				}
			}, {
				gid: 'filter',
				rid: 'drawing',
				label: '*Drawing',
				label$tr$: 'productionplanning.drawing.entityDrawing',
				type: 'directive',
				directive: 'basics-lookupdata-lookup-composite',
				model: 'drawingFk',
				options: {
					lookupDirective: 'productionplanning-drawing-lookup',
					descriptionMember: 'Description',
					lookupOptions: {
						showClearButton: true
					}
				}
			}, {
				gid: 'filter',
				rid: 'bundle',
				label: '*Bundle',
				label$tr$: 'transportplanning.bundle.entityBundle',
				type: 'directive',
				directive: 'basics-lookupdata-lookup-composite',
				model: 'bundleFk',
				options: {
					lookupDirective: 'transportplanning-bundle-lookup',
					descriptionMember: 'DescriptionInfo.Description',
					lookupOptions: {
						showClearButton: true
					}
				}
			}, {
				gid: 'filter',
				rid: 'status',
				label: '*Status',
				label$tr$: 'cloud.common.entityStatus',
				model: 'statusFks',
				type: 'directive',
				directive: 'productionplanning-common-custom-filter-value-list',
				dropboxOptions: {
					items: reportStatus,
					valueMember: 'Id',
					displayMember: 'Description'
				}
			}]
		};

		$scope.gridId = uuid;
		$scope.formOptions = {
			configure: platformTranslateService.translateFormConfig(formConfig)
		};
		$scope.entity = {
			activityFk: null,
			jobFk: null,
			drawingFk: null,
			bundleFk: null,
			statusFks: null
		};
		$scope.subcontroller = function () {
			ControllerService.$inject = ['$scope'];

			function ControllerService($scope) {
				platformContainerControllerService.initController($scope, moduleName, uuid);
			}

			return $controller(ControllerService, {
				$scope: $scope,
				platformContainerControllerService: platformContainerControllerService,
				uuid: $scope.gridId,
				platformGridAPI: platformGridAPI
			}).constructor;
		};

		var watchFilter = ['entity.activityFk', 'entity.jobFk', 'entity.drawingFk', 'entity.bundleFk', 'entity.statusFks'];
		var unregister = $scope.$watchGroup(watchFilter, function (newVal, oldVal) {
			if (newVal !== oldVal) {
				dataService.filter(newVal);
			}
		});

		var reportGridId = 'a17a58e59a944f95ae9e0c7f627c9e1a';
		platformGridAPI.events.register(reportGridId, 'onSelectedRowsChanged', onReportGridSelectedRowsChanged);

		function onReportGridSelectedRowsChanged(e, arg) {
			if (arg.rows.length > 0) {
				var selectedItem = arg.grid.getDataItem(arg.rows[0]);
				if (selectedItem) {
					clearFilter();
					var activity = lookupDescriptorService.getLookupItem('MntActivity', selectedItem.ActivityFk);
					if (!_.isNil(activity)) {
						$scope.entity.activityFk = selectedItem.ActivityFk;
						$scope.entity.jobFk = _.isNil(activity.LgmJobFk) ? '' : activity.LgmJobFk;
					} else {
						$http.get(globals.webApiBaseUrl + 'productionplanning/activity/activity/getById?activityId=' + selectedItem.ActivityFk).then(function (response) {
							if (!_.isNil(response.data)) {
								$scope.entity.activityFk = selectedItem.ActivityFk;
								$scope.entity.jobFk = _.isNil(response.data.LgmJobFk) ? '' : response.data.LgmJobFk;
							}
						});
					}
				}
			}
		}

		function clearFilter() {
			$scope.entity.activityFk = null;
			$scope.entity.jobFk = null;
			$scope.entity.drawingFk = null;
			$scope.entity.bundleFk = null;
		}

		(function extendPpsDocumentActionButtons() {
			const docTypes = productDocumentDataProviderFactory.ppsDocumentTypes;
			ppsDocumentToolbarButtonExtension.extendDocumentButtons(docTypes, $scope, dataService);
		})();

		$scope.$on('$destroy', function () {
			unregister();
			platformGridAPI.events.unregister(reportGridId, 'onSelectedRowsChanged', onReportGridSelectedRowsChanged);
		});
	}
})();
/**
 * Created by lnt
 */
(function () {
	/* global angular _ */
	'use strict';

	let moduleName = 'qto.main';

	/**
	 * @ngdoc controller
	 * @name qtoMainDetailLookupController
	 * @function
	 *
	 * @description
	 * Controller for the project lookup in the qto lines lookup view.
	 **/
	angular.module(moduleName).controller('qtoMainDetailLookupController', ['$scope', '$injector', '$translate', 'qtoMainDetailLookupFilterService', 'basicsLookupdataLookupFilterService', 'boqMainBoqTypes',
		function ($scope, $injector, $translate, qtoMainDetailLookupFilterService, basicsLookupdataLookupFilterService, boqMainBoqTypes) {

			// scope variables/ functions
			$scope.selectedItem = {};
			$scope.selectedProject = qtoMainDetailLookupFilterService.boqHeaderLookupFilter.selectedProject;
			$scope.config = {};
			$scope.config.selectConfig = {};
			$scope.boqTypeReadonly = false;
			$scope.projectReadonly = false;
			$scope.showWicGroupTree = true;

			$scope.boqTypeList = [
				{Id: boqMainBoqTypes.project, Description: $translate.instant('boq.main.projectBoq')},
				{Id: boqMainBoqTypes.package, Description: $translate.instant('boq.main.packageBoq')}
			];

			$scope.boqType = {};
			$scope.boqType.current = _.find($scope.boqTypeList, function(item) {
				let boqTypeId = (qtoMainDetailLookupFilterService.boqHeaderLookupFilter.boqType === 0) ? 2 : qtoMainDetailLookupFilterService.boqHeaderLookupFilter.boqType;
				return item.Id === boqTypeId;
			});
			qtoMainDetailLookupFilterService.boqHeaderLookupFilter.boqType = $scope.boqType.current.Id;

			$scope.config.selectConfig.rt$readonly = function () {
				return $scope.projectReadonly;
			};

			$scope.boqTypeOptions = {
				displayMember: 'Description',
				valueMember: 'Id',
				items: $scope.boqTypeList
			};

			$scope.boqTypeChanged = function boqTypeChanged(selectedBoqType, skipClearFilter) {
				if(angular.isDefined(selectedBoqType) && selectedBoqType !== null) {
					if(!skipClearFilter) {
						qtoMainDetailLookupFilterService.clearFilter();
					}

					qtoMainDetailLookupFilterService.boqHeaderLookupFilter.boqType = $scope.boqType.current.Id;
					if (selectedBoqType.Id === 1) {
						// Reset selected project for we are have selected WIC type
						setCurrentProject(null, skipClearFilter);
					}
				}
			};

			$scope.projectLookupOptions = {
				filterKey: 'boq-main-project-data-filter'
			};

			function setCurrentProject(currentProject, skipClearFilter){
				if(!skipClearFilter) {
					qtoMainDetailLookupFilterService.clearFilter(true);
				}
				$scope.selectedItem = currentProject ? currentProject.Id : null;
				qtoMainDetailLookupFilterService.setSelectedProject(currentProject);
				qtoMainDetailLookupFilterService.boqHeaderLookupFilter.projectId = currentProject ? currentProject.Id : 0;
			}

			let filterCleared = function filterCleared() {
				$scope.selectedItem = null;

				let linesLookupService = $injector.get('qtoMainLineLookupService');
				let qtoLines = linesLookupService.getList();
				if (qtoLines.length > 0){
					linesLookupService.load();
				}
			};

			qtoMainDetailLookupFilterService.filterCleared.register(filterCleared);

			let filters = [
				{
					key: 'boq-main-project-data-filter',
					serverSide: true,
					serverKey: 'boq-main-project-data-filter',
					fn: function (/* item */) {
						let projectIds = qtoMainDetailLookupFilterService.boqHeaderLookupFilter.projectIds;

						if (angular.isArray(projectIds) && projectIds.length > 0) {
							return {
								ids: projectIds
							};
						}
						return {};
					}
				}
			];

			basicsLookupdataLookupFilterService.registerFilter(filters);

			$scope.$on('$destroy', function () {
				qtoMainDetailLookupFilterService.filterCleared.unregister(filterCleared);
				basicsLookupdataLookupFilterService.unregisterFilter(filters);
				qtoMainDetailLookupFilterService.setSelectedProjectIds([]);
			});
		}
	]);
})();

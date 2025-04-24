/**
 * Created by uestuenel
 */

(function () {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module('basics.audittrail').controller('basicsAudittrailPopupFilterController',
		['$scope', 'basicsAudittrailHelperService', '$translate', '$http', 'platformRuntimeDataService', 'moment', '_', '$rootScope', 'basicsAudittrailContainerService',
			function ($scope, basicsAudittrailHelperService, $translate, $http, platformRuntimeDataService, moment, _, $rootScope, basicsAudittrailContainerService) {

				// initialize
				$scope.entity = {
					periodFilter: 1,
					container: '',
					column: '',
					action: 'A',
					startDate: moment(),
					endDate: moment(),
					user: '',
					pageNumber: 1,
					containerId: '',
					showButtonCSS: false,
					selected: false
				};

				if ($scope.modalOptions.options.MainService.getSelected()) {
					$scope.selectedEntity = $scope.modalOptions.options.MainService.getSelected();

					$scope.entity.selected = true;
					$scope.changeEntitySelected = function () {
						// $scope.entity.selected = !$scope.entity.selected;
						getSearchListForGrid();
					};
				}

				$scope.selectPeriod = {
					serviceName: 'basicsAudittrailPeriodService',
					displayMember: 'Description',
					valueMember: 'Id'
				};

				$scope.containername = $scope.modalOptions.options.ModuleName;

				$scope.getNextPage = function () {
					if ($scope.entity.pageNumber < $scope.entity.pager.lastpageno) {
						$scope.entity.pageNumber += 1;

						getSearchListForGrid();
					}
				};

				$scope.getPrevPage = function (current) {
					if ($scope.entity.pageNumber > 1) {
						$scope.entity.pageNumber -= 1;

						getSearchListForGrid();
					}
				};

				$scope.getLastPage = function () {
					$scope.entity.pageNumber = $scope.entity.pager.lastpageno;

					getSearchListForGrid();
				};

				$scope.getFirstPage = function (current) {

					$scope.entity.pageNumber = 1;

					getSearchListForGrid();
				};

				$scope.selectContainer = {
					displayMember: 'DescriptionInfo.Translated',
					valueMember: 'ContainerUuid',
					items: []
				};

				$scope.selectColumns = {
					displayMember: 'Columnname',
					valueMember: 'Columnname',
					items: [{Columnname: $translate.instant('basics.audittrail.all')}],
					serviceName: 'basicsAudittrailColumnService',
					serviceMethod: 'getColumList',
					serviceReload: true
				};

				$scope.selectAction = {
					serviceName: 'basicsAudittrailActionService',
					displayMember: 'Description',
					valueMember: 'Id'
				};

				$scope.configContainerSelect = {
					rt$readonly: function () {
						if (!$scope.entity.column || $scope.entity.column === '' || $scope.entity.container === '') {
							$scope.entity.column = $translate.instant('basics.audittrail.all');
						}
						return $scope.entity.container !== '' ? false : true;
					},
					change: true
				};

				$scope.setContainerId = function () {
					// need for columnlist
					$scope.entity.containerId = _.find($scope.selectContainer.items, ['ContainerUuid', $scope.entity.container]).Id;

					$scope.setButtonCSSClass(); // highlightbutton
				};

				$scope.changeStartEndDate = function () {
					switch ($scope.entity.periodFilter) {
						case 1:
							$scope.entity.startDate = moment();
							$scope.entity.endDate = moment();
							break;
						case 2:
							$scope.entity.startDate = moment().subtract(1, 'days');
							$scope.entity.endDate = moment().subtract(1, 'days');
							break;
						case 3:
							$scope.entity.startDate = moment().subtract(7, 'days');
							$scope.entity.endDate = moment();
							break;
						case 4:
							$scope.entity.startDate = moment().subtract(30, 'days');
							$scope.entity.endDate = moment();
							break;
					}

					$scope.setButtonCSSClass(); // highlightbutton
				};

				$scope.changedDatepicker = function () {
					// change selectbox for period in 'custom'
					$scope.entity.periodFilter = 5;

					$scope.setButtonCSSClass(); // highlightbutton
				};

				$scope.searchFn = function () {
					getSearchListForGrid();
					$scope.entity.showButtonCSS = false;
				};

				$scope.setButtonCSSClass = function () {
					$scope.entity.showButtonCSS = true;
				};

				function getSearchListForGrid() {
					$scope.entity.column = ($scope.selectColumns.items[0].Columnname === $scope.entity.column) ? '' : $scope.entity.column;
					$scope.entity.container = ($scope.entity.container === '') ? _.compact(_.uniq(_.map($scope.selectContainer.items, 'ContainerUuid'))) : $scope.entity.container;

					$scope.paramsForWebAPI = {
						DateFrom: $scope.entity.startDate,
						DateTo: $scope.entity.endDate,
						ContainerList: _.isArray($scope.entity.container) ? $scope.entity.container : [$scope.entity.container],
						ColumnList: _.isArray($scope.entity.column) ? $scope.entity.column : [$scope.entity.column],
						Action: $scope.entity.action,
						PageNumber: $scope.entity.pageNumber,
						LogOnNameContains: $scope.entity.user
					};

					$scope.paramsForWebAPI.ObjectFk = $scope.entity.selected ? getObjectFk() : null;

					basicsAudittrailHelperService.setGridDataItems($scope.paramsForWebAPI).then(function (response) {

						if (response.ItemsExist) {
							if (_.isArray($scope.entity.container)) {
								$scope.entity.container = ''; // reset for selection im dropdown
							}

							$scope.entity.pager.totalrecords = response.TotalRecords;
							$scope.entity.pager.lastpageno = response.LastPageNo;

							$scope.entity.pager.firstEnabled = response.CurrentPageNo > 1 ? false : true;

							$scope.entity.pager.prevEnabled = response.CurrentPageNo > 1 ? false : true;

							$scope.entity.pager.nextEnabled = response.CurrentPageNo < response.LastPageNo ? false : true;

							$scope.entity.pager.lastEnabled = response.CurrentPageNo < response.LastPageNo ? false : true;

							calculateStartEndIndex(response);

							$rootScope.$broadcast('startFillGridData');
						}
					});
				}

				// for the case, if a different id is needed in a module.
				function getObjectFk() {
					var toReturn = $scope.selectedEntity.Id;

					switch ($scope.modalOptions.options.ModuleName) {
						case 'basics.customize':
							toReturn = $scope.selectedEntity.Documentation.Id;

							if ($scope.modalOptions.options.MainService.getChildServices()[0] && $scope.modalOptions.options.MainService.getChildServices()[0].getSelected()) {
								$scope.paramsForWebAPI.RecordFk = $scope.modalOptions.options.MainService.getChildServices()[0].getSelected().Id;
							}
							break;

						case 'estimate.main':
							toReturn = $scope.selectedEntity.EstHeaderFk;
							$scope.paramsForWebAPI.RecordFk = $scope.selectedEntity.Id;

							break;

						case 'scheduling.main':
							toReturn = null;
							$scope.paramsForWebAPI.RecordFk = $scope.selectedEntity.Id;

							break;

					}

					return toReturn;
				}

				function calculateStartEndIndex(responseItem) {

					$scope.entity.pager.totalrecords = responseItem.TotalRecords;

					if ($scope.entity.pager.totalrecords > 0) {
						$scope.entity.pager.endIndex = (responseItem.CurrentPageNo * responseItem.PageSize);

						$scope.entity.pager.startIndex = $scope.entity.pager.endIndex - (responseItem.PageSize - 1);

						if (responseItem.TotalRecords < $scope.entity.pager.endIndex) {
							$scope.entity.pager.endIndex = responseItem.TotalRecords;
						}
					} else {
						$scope.entity.pager.startIndex = 0;
						$scope.entity.pager.endIndex = 0;
					}
				}

				// infos for the pager
				// sumPerPage: items count per page.
				$scope.entity.pager = {
					firstEnabled: true,
					nextEnabled: true,
					prevEnabled: true,
					lastEnabled: true,
					lastpageno: 0,
					totalrecords: 0,
					startIndex: 0,
					endIndex: 0,
					sumPerPage: 50
				};
				/*
		  first default call.
		  important parameter: getlist from today
		 */
				basicsAudittrailContainerService.getContainerList($scope.containername).then(function (response) {
					$scope.selectContainer.items = response;

					getSearchListForGrid();
				});

				$scope.$on('$destroy', function () {
					// basicsCharacteristicPopupGroupService.setSelected(null);
				});
			}]);
})();
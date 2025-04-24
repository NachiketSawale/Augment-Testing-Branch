(function (angular) {
	/* global globals, $ */
	'use strict';
	var moduleName = 'basics.workflow';

	angular.module(moduleName).directive('approveSimpleFilterDirective', [
		'_', '$translate', '$compile', '$templateCache', 'cloudDesktopSidebarService', 'platformModalService',
		'constructionsystemCommonFilterServiceCache',
		'constructionsystemCommonFilterDataService',
		'basicsWorkflowApproverAction',
		function (_, $translate, $compile, $templateCache, cloudDesktopSidebarService, platformModalService,
		          filterServiceCache, filterDataService, basicsWorkflowApproverAction) {

			return {
				restrict: 'A',
				scope: false,
				replace: true,
				templateUrl: globals.appBaseUrl + 'basics.workflow/templates/approve-simple-filter.html',
				controller: ['$scope', controller]
			};

			function controller($scope) {
				// get data from parent scope, get the parent servie
				var mainDataService = $scope.parentService;
				//$scope.parentServiceName = mainDataService.getServiceName();
				mainDataService = basicsWorkflowApproverAction;
				var simpleFilterService = filterServiceCache.getService('basicsworkflowApproveSimpleFilterService', $scope.parentServiceName);

				// get data from parent scope, model id may be null,
				// null is not limit the property key by the model,
				// and show all the property.
				//var currentModelId = $scope.currentModelId;

				var savedFilterList = {
					items: [],
					displayMember: 'displayName',
					valueMember: 'filterName',
					templateResult: function (item) {
						var acl = item.origin ? item.origin.accessLevel : '';
						var ico = (acl === 'System') ? (simpleFilterService.hasSysFtrWrAccess ? 'ico-search-system' : 'ico-search-system-prot')
							: (acl === 'User') ? (simpleFilterService.hasUserFtrWrAccess ? 'ico-search-user' : 'ico-search-user-prot')
								: (acl === 'Role') ? (simpleFilterService.hasRoleFtrWrAccess ? 'ico-search-role' : 'ico-search-role-prot')
									: (acl === 'New') ? 'ico-search-new' : '';
						return $('<span class="filterDefdropboxIconsLeft control-icons ' + ico + '">' + _.escape(item.text) + '</span>');
					}
				};
				var permissions = null;

				simpleFilterService.retrieveFilterPermissions().then(function (rights) {
					$scope.$evalAsync(function () {
						permissions = rights;
					});
				});
				var filterCompositeDefault = true;

				$scope.searchOptions = {
					// searchType: $scope.$parent.searchOptions.searchType,
					active: false,
					canNotEditMsg: 'Click to Active Simple Filter Container',
					dropboxOptions: savedFilterList,
					selectedItem: null,
					selectionChanged: onSelectionChanged,
					filterDataLoading: false,
					enhancedFilter: {
						currentFilterDef: null
					},
					filterRequest: {
						filterComposite: filterCompositeDefault,
						pattern: ''
					},
					headerText: $translate.instant('basics.workflow.approve.TemplateSaveTitle'),
					placeholder: $translate.instant('constructionsystem.master.placeholder'),
					onDeleteFilterBtnText: $translate.instant('basics.workflow.approve.delete'),
					onSaveFilterBtnText: $translate.instant('basics.workflow.approve.save'),
					onSaveAsFilterBtnText: $translate.instant('basics.workflow.approve.saveAs'),
					refreshBtnText: $translate.instant('basics.workflow.approve.refresh'),

					onRevertFilter: function () {
						if ($scope.$parent.onRevertFilter) {
							$scope.$parent.onRevertFilter();
							setFilterEnvironment();
						}
					},

					canRevertFilter: function () {
						return $scope.$parent.canRevertFilter && $scope.$parent.canRevertFilter();
					},

					onRefreshFilter: function () {
						simpleFilterService.refresh();
					},

					onClearSearch: function () {
						$scope.searchOptions.filterRequest.pattern = '';
						$scope.searchOptions.filterRequest.filterComposite = filterCompositeDefault;
						$scope.searchOptions.enhancedFilter.currentFilterDef = {};

						initUI('ApprovalClerkSelection');
						$scope.GetApprUI($scope, $compile, $templateCache);

						initUI('CcSelection');
						$scope.GetCcUI($scope, $compile, $templateCache);

					},
					onDeleteFilter: function () {
						onDeleteFilter();
					},
					onSaveFilter: function () {
						onSaveFilter(false);
						onSave2SelectionStatement();
					},
					onSaveAsFilter: function () {
						onSaveFilter(true);
						onSave2SelectionStatement();
					},
					onSaveAsSelectionStatement: function () {
						onSave2SelectionStatement();
					},
					canSaveOrDeleteFilter: function () {
						return $scope.searchOptions.selectedItem &&
							($scope.searchOptions.selectedItem.accessLevel !== 'New');
					},
					canSaveFilterAs: function () {
						return permissions && (permissions.u || permissions.r || permissions.g);
					}
				};

				Object.defineProperties($scope.searchOptions, {
					'selectedItemId': {
						get: function () {
							return $scope.searchOptions.selectedItem ? $scope.searchOptions.selectedItem.filterName : '';
						},
						set: function (itemFilterName) {
							$scope.searchOptions.selectedItem = _.find(simpleFilterService.availableFilterDefs, function (item) {
								return item.filterName === itemFilterName;
							});
						}
					}
				});

				function initUI(selection) {
					delete $scope.Context.ApprovalUserInfo[selection];
					$scope.Context.ApprovalUserInfo[selection] = {};
					var obj = $scope.Context.ApprovalUserInfo[selection];
					obj.NodeCount = 3;
					for (var i = 0; i < obj.NodeCount; i++) {
						var attr = 'Nodes' + i;
						obj[attr] = {};
						obj[attr].IsRole = true;
						obj[attr].SelectionType = 0;
						obj[attr].SelectedId = '';
						obj[attr].Clerks = [];
						obj[attr].Role2Clerks = [];
					}
				}

				function onSelectionChanged() {
					if (simpleFilterService.selectedFilterDefDto) { // reset previous selected item to unmodified
						simpleFilterService.selectedFilterDefDto.setModified(false);
					}

					resetByFilterDto($scope.searchOptions.selectedItem);

					if ($scope.searchOptions.selectedItem) {
						onSave2SelectionStatement();
					}
				}

				function selectFilterDto(filterDto, filter) {
					if ($scope.searchOptions.selectedItem) {
						$scope.searchOptions.selectedItem.setModified(false);
					}
					$scope.searchOptions.selectedItem = filterDto;

					resetByFilterDto(filterDto, filter);
				}

				/**
				 * set related values when the selected filter dto changed.
				 */
				function resetByFilterDto(filterDto, filter) {
					if ($scope.searchOptions.selectedItem && filterDto.filterDef) {
						var currentFilterDef = simpleFilterService.getCurrentFilterDef(filterDto);
						if ($scope.Context === undefined) {
							$scope.Context = {};
						}
						initUI('ApprovalClerkSelection');
						initUI('CcSelection');
						$scope.Context.ApprovalUserInfo = currentFilterDef.ApprovalUserInfo;
						$scope.GetApprUI($scope, $compile, $templateCache);
						$scope.GetCcUI($scope, $compile, $templateCache);
						$scope.searchOptions.filterRequest.pattern = currentFilterDef.filterText;
						$scope.searchOptions.filterRequest.filterComposite = currentFilterDef.filterComposite;
						$scope.searchOptions.selectedItem.setModified(false);
					} else if (filter) {
						$scope.searchOptions.filterRequest.filterComposite = filter.filterComposite;
						$scope.searchOptions.filterRequest.pattern = filter.filterText;
					} else {
						$scope.searchOptions.onClearSearch();
					}
				}

				function setFilterEnvironment() {
					$scope.searchOptions.active = true;
					$scope.searchOptions.filterDataLoading = true;
					$scope.searchOptions.enhancedFilter.currentFilterDef = {};

					simpleFilterService.loadFilterBaseData().then(function () {
						$scope.searchOptions.filterDataLoading = false;
						if (simpleFilterService.availableFilterDefs && simpleFilterService.availableFilterDefs.length > 0) {
							$scope.searchOptions.dropboxOptions.items = simpleFilterService.availableFilterDefs;
							selectFilterDto(simpleFilterService.selectedFilterDefDto || simpleFilterService.availableFilterDefs[0]);
						}

						$scope.searchOptions.active = true;
					}, function (errdata) {
						console.error('loadFilterBaseData failed', errdata);
					});
				}

				function onSaveFilter(isSaveAs) {
					var filterDto = {
						filterDef: {
							filterType: 'simple',
							filterComposite: $scope.searchOptions.filterRequest.filterComposite,
							filterText: $scope.searchOptions.filterRequest.pattern,
							isWorkflowApproveUserInfo: 1,
							ApprovalUserInfo: $scope.Context.ApprovalUserInfo
						}
					};

					if (isSaveAs ||
						($scope.searchOptions.selectedItem.accessLevel === 'New' && $scope.searchOptions.selectedItem)) {
						showfilterSaveDialog().then(function () {
							var filterDef = $scope.searchOptions.enhancedFilter.currentFilterDef;
							filterDto.name = filterDef.name;
							filterDto.accessLevel = filterDef.accesslevel;

							doSaveFilterDefinition();
						});
					} else {
						filterDto.name = $scope.searchOptions.selectedItem.filterName;
						filterDto.accessLevel = $scope.searchOptions.selectedItem.accessLevel;

						doSaveFilterDefinition();
					}

					function showfilterSaveDialog() {
						var dialogOption = {
							templateUrl: globals.appBaseUrl + 'cloud.desktop/templates/sidebar/filterdefinition-save-dialog.html',
							controller: 'basicWorkflowFilterSaveDialogController',
							scope: $scope  // pass parameters to dialog via current scope
						};
						return platformModalService.showDialog(dialogOption);
					}

					function doSaveFilterDefinition() {
						$scope.searchOptions.filterDataLoading = true;

						simpleFilterService.saveFilterDefinition(filterDto).then(function (addUpdatedFilterDefEntry) {
							$scope.searchOptions.filterDataLoading = false;
							selectFilterDto(addUpdatedFilterDefEntry);
						});
					}
				}

				/**
				 * collect simple filter and saved to the field 'SelectStatement' of COS Master.
				 */
				function onSave2SelectionStatement() {
					if ($scope.searchOptions.active === true) {
						var filterObj = {
							filterType: 'simple',
							filterComposite: $scope.searchOptions.filterRequest.filterComposite,
							filterText: $scope.searchOptions.filterRequest.pattern
							//selectedItem: $scope.searchOptions.selectedItem
						};
						filterDataService.setSelectedFilter($scope.parentServiceName, filterObj);
					}
				}

				function onDeleteFilter() {
					function showConfirmDeleteDialog(filterName) {
						var modalOptions = {
							headerTextKey: 'basics.workflow.approve.TemplateConfirmDeleteTitle',
							bodyTextKey: $translate.instant('basics.workflow.approve.TemplateConfirmDeleteBody', {p1: filterName}),
							showYesButton: true,
							showNoButton: true,
							iconClass: 'ico-question'
						};
						return platformModalService.showDialog(modalOptions);
					}

					var filterDto = $scope.searchOptions.selectedItem;
					if (filterDto) {
						showConfirmDeleteDialog(filterDto.filterName).then(function (result) {
							if (result.yes) {
								$scope.searchOptions.filterDataLoading = true;
								simpleFilterService.deleteFilterDefinition(filterDto).then(function (nextFilterDto) {
									$scope.searchOptions.filterDataLoading = false;
									selectFilterDto(nextFilterDto);
									onSave2SelectionStatement();
								}, function () {
									$scope.searchOptions.filterDataLoading = false;
								});
							}
						});
					}
				}

				onParentSelectionChanged();

				function onParentSelectionChanged() {
					simpleFilterService.clearSelectedFilter();
					$scope.searchOptions.onClearSearch();
					setFilterEnvironment();
				}

			}

		}
	]);
})(angular);

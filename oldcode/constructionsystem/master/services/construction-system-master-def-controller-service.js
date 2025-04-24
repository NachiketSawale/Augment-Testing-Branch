/**
 * Created by wui on 6/14/2017.
 */
/* global _,globals,$ */

(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.master';

	angular.module(moduleName).factory('constructionsystemMasterDefControllerService', [
		'$translate',
		'platformModalService',
		'constructionsystemMasterDefDataService',
		function (
			$translate,
			platformModalService,
			constructionsystemMasterDefDataService
		) {

			function init($scope, parentDataService, currentDataService) {
				var dropboxOptions = {
					items: [],
					displayMember: 'displayName',
					valueMember: 'filterName',
					templateResult: function (item) {
						var acl = item.origin ? item.origin.accessLevel : '';
						var ico = (acl === 'System') ? (constructionsystemMasterDefDataService.hasSysFtrWrAccess ? 'ico-search-system' : 'ico-search-system-prot')
							: (acl === 'User') ? (constructionsystemMasterDefDataService.hasUserFtrWrAccess ? 'ico-search-user' : 'ico-search-user-prot')
								: (acl === 'Role') ? (constructionsystemMasterDefDataService.hasRoleFtrWrAccess ? 'ico-search-role' : 'ico-search-role-prot')
									: (acl === 'New') ? 'ico-search-new'
										: '';
						return $('<span class="filterDefdropboxIconsLeft control-icons ' + ico + '">' + _.escape(item.text) + '</span>');
					}
				};

				var permissions = null;

				constructionsystemMasterDefDataService.retrievePermissions().then(function (rights) {
					$scope.$evalAsync(function () {
						permissions = rights;
					});
				});

				$scope.isLoading = false;

				$scope.searchOptions = {
					dropboxOptions: dropboxOptions,
					selectionChanged: onSelectionChanged,
					enhancedFilter: {
						currentFilterDef: ''
					},

					onDeleteFilterBtnText: $translate.instant('cloud.desktop.filterdefFooterBtnDelete'),
					onSaveFilterBtnText: $translate.instant('cloud.desktop.filterdefFooterBtnSave'),
					onSaveAsFilterBtnText: $translate.instant('cloud.desktop.filterdefFooterBtnSaveAs'),

					onClearSearch: function () {

					},
					onDeleteFilter: function () {
						onDeleteFilter();
					},
					onSaveFilter: function () {
						onSaveFilter(false);
					},
					onSaveAsFilter: function () {
						onSaveFilter(true);
					},
					canSaveOrDeleteFilter: function () {
						return constructionsystemMasterDefDataService.selectedItem &&
							constructionsystemMasterDefDataService.selectedItem.accessLevel !== 'New';
					},
					canSaveFilterAs: function () {
						return permissions && (permissions.u || permissions.r || permissions.g) && currentDataService.getDefinition();
					}
				};

				Object.defineProperties($scope.searchOptions, {
					'selectedItemId': {
						get: function () {
							return constructionsystemMasterDefDataService.selectedItem ? constructionsystemMasterDefDataService.selectedItem.filterName : '';
						},
						set: function (value) {
							var dataItem = _.find(constructionsystemMasterDefDataService.dataItems, {filterName: value});
							constructionsystemMasterDefDataService.setSelected(dataItem);
						}
					}
				});

				function onSelectionChanged() {
					var formerItem = constructionsystemMasterDefDataService.getFormer();
					var selectedItem = constructionsystemMasterDefDataService.getSelected();

					// save definition to model when change lookup selection.
					if (formerItem) {
						formerItem.filterDef = currentDataService.getDefinition();
					}
					if (selectedItem) {
						currentDataService.setDefinition(selectedItem.filterDef);
					}
				}

				function loadData() {
					$scope.isLoading = true;
					constructionsystemMasterDefDataService.load().then(function () {
						$scope.searchOptions.dropboxOptions.items = constructionsystemMasterDefDataService.dataItems;
					}, function (errdata) {
						console.error('loadFilterBaseData failed', errdata);
					}).finally(function () {
						$scope.isLoading = false;
					});
				}

				function onSaveFilter(isSaveAs) {
					var filterDto = {
						filterDef: currentDataService.getDefinition()
					};
					var selectedItem = constructionsystemMasterDefDataService.getSelected();

					$scope.searchOptions.enhancedFilter.currentFilterDef = selectedItem;

					if (isSaveAs) {
						showfilterSaveDialog().then(function () {
							filterDto.name = selectedItem.name;
							filterDto.accessLevel = selectedItem.accesslevel;
							doSaveFilterDefinition();
						}
						);
					}
					else {
						filterDto.name = selectedItem.filterName;
						filterDto.accessLevel = selectedItem.accessLevel;

						doSaveFilterDefinition();
					}

					function showfilterSaveDialog() {
						var dialogOption = {
							templateUrl: globals.appBaseUrl + 'cloud.desktop/templates/sidebar/filterdefinition-save-dialog.html',
							controller: [
								'$controller',
								'$scope',
								'$modalInstance',
								'$translate',
								'_',
								'cloudDesktopEnhancedFilterService',
								function (
									$controller,
									$scope,
									$modalInstance,
									$translate,
									_,
									cloudDesktopEnhancedFilterService) {
									$controller('cloudDesktopFilterDefinitionSaveDialogController', {
										'$scope': $scope,
										'$modalInstance': $modalInstance,
										'$translate': $translate,
										'_': _,
										'cloudDesktopEnhancedFilterService': cloudDesktopEnhancedFilterService
									});

									_.merge($scope.modalOptions, {
										headerText: $translate.instant('constructionsystem.master.templateDefSaveTitle'),
										nameLabelText: $translate.instant('constructionsystem.master.templateDefSaveNameLabel'),
										namePlaceHolder: $translate.instant('constructionsystem.master.templateDefSaveNamePlaceHolder')
									});
								}],
							scope: $scope  // pass parameters to dialog via current scope
						};
						return platformModalService.showDialog(dialogOption);
					}

					function doSaveFilterDefinition() {
						$scope.isLoading = true;
						constructionsystemMasterDefDataService.save(filterDto).then(function (addUpdatedFilterDefEntry) {
							if(addUpdatedFilterDefEntry) { // save successfully
								constructionsystemMasterDefDataService.setSelected(addUpdatedFilterDefEntry);
								currentDataService.setDefinition(addUpdatedFilterDefEntry.filterDef);
							}
						}).finally(function () {
							$scope.isLoading = false;
						});
					}
				}

				function onDeleteFilter() {
					function showConfirmDeleteDialog(filterName) {
						var modalOptions = {
							headerTextKey: 'constructionsystem.master.templateDefConfirmDeleteTitle',
							bodyTextKey: $translate.instant('constructionsystem.master.templateDefConfirmDeleteBody', {p1: filterName}),
							showYesButton: true,
							showNoButton: true,
							iconClass: 'ico-question'
						};
						return platformModalService.showDialog(modalOptions);
					}

					var filterDto = constructionsystemMasterDefDataService.getSelected();

					if (filterDto) {
						showConfirmDeleteDialog(filterDto.filterName).then(function (result) {
							if (result.yes) {
								$scope.isLoading = true;
								constructionsystemMasterDefDataService.delete(filterDto).then(function (nextFilterDto) {
									constructionsystemMasterDefDataService.setSelected(nextFilterDto);
									currentDataService.setDefinition(nextFilterDto.filterDef);
								}, function () {

								}).finally(function () {
									$scope.isLoading = false;
								});
							}
						});
					}
				}

				function onParentSelectionChanged() {
					$scope.searchOptions.onClearSearch();
					loadData();
				}

				parentDataService.registerSelectionChanged(onParentSelectionChanged);

				$scope.$on('$destroy', function () {
					parentDataService.unregisterSelectionChanged(onParentSelectionChanged);
				});

				loadData();
			}

			return {
				init: init
			};
		}
	]);

})(angular);
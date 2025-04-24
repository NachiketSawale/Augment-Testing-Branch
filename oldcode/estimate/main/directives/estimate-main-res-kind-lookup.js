/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	/* global globals, _, $ */
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).directive('estimateMainResResourceTemplateLookup',
		['$q', '$http', '$injector', 'estimateMainCommonService', 'estimateMainResResourceDialogLookupService', 'estimateMainResGroupDialogLookupService', 'keyCodes', 'BasicsLookupdataLookupDirectiveDefinition', 'estimateMainResResourceDialogListColumns', 'platformTranslateService', 'estimateMainResourceService',
			function ($q, $http, $injector, estimateMainCommonService, estimateMainResResourceDialogLookupService, estimateMainResGroupDialogLookupService, keyCodes, BasicsLookupdataLookupDirectiveDefinition, estimateMainResResourceDialogListColumns, platformTranslateService, estimateMainResourceService) {

				function gridDialogController($scope, $translate, $timeout, $modalInstance, estimateMainResResourceDialogLookupService) {
					let headerText = null, options = $scope.options;
					setDialogSettings(options);

					$scope.enableMultiSelection = false;
					$scope.instantSearch = false;

					$scope.modalOptions = {
						closeButtonText: $translate.instant('cloud.common.cancel'),
						actionButtonText: $translate.instant('cloud.common.ok'),
						refreshButtonText: $translate.instant('basics.common.button.refresh'),
						headerText: headerText,
						disableOkButton: true,

						selectedItems: [],

						ok: ok,
						close: onClose,
						refresh: refresh,

						onMultipleSelection: onMultipleSelection
					};

					$scope.search = search;
					$scope.onSearchInputKeydown = onSearchInputKeydown;
					$scope.setTools = function setTools(tools) {
						$scope.tools = tools || {};
						$scope.tools.update = function () {};
					};

					function load(callBackFunc){
						estimateMainResGroupDialogLookupService.loadAllResGroups().then(function(){
							estimateMainResResourceDialogLookupService.loadAllResResources().then(function(){
								if (angular.isFunction(callBackFunc)){
									callBackFunc();
									$('div[modal-window]').find('input:first').focus();
								}
							});
						});
					}

					function initialize() {
						estimateMainResResourceDialogLookupService.isInit(true);
						$modalInstance.opened.then(function(){
							estimateMainResResourceDialogLookupService.setList([]);
							estimateMainResGroupDialogLookupService.setSelected({}).then(function(){
								$timeout(function(){
									if ($scope.ngModel){
										$scope.searchValue = $scope.displayText;
										load(function(){
											let resource = estimateMainResResourceDialogLookupService.getResResourceById($scope.ngModel);
											if (resource && resource.Id){
												$scope.searchValue = resource[$scope.options.displayMember];

												estimateMainResGroupDialogLookupService.fireItemFiltered([resource]);

												let cat = estimateMainResGroupDialogLookupService.getItemById(resource.GroupFk);
												estimateMainResGroupDialogLookupService.expandNode(cat);
												estimateMainResGroupDialogLookupService.reloadGridExpanded();

												estimateMainResResourceDialogLookupService.setItemFilter(function (resEntity) {
													return resEntity.Id === resource.Id;
												});
												estimateMainResResourceDialogLookupService.loadAllResResources().then(function(resources){
													let resFiltered = _.filter(resources, { 'GroupFk': resource.GroupFk });
													estimateMainResResourceDialogLookupService.setList(resFiltered);
													estimateMainResResourceDialogLookupService.enableItemFilter(true);
													$timeout(function(){
														estimateMainResGroupDialogLookupService.setSelected(cat);
														estimateMainResResourceDialogLookupService.setSelected(estimateMainResResourceDialogLookupService.getItemById(resource.Id));
														estimateMainResResourceDialogLookupService.isInit(false);
													}, 90);
												});
											}else{
												$scope.searchValue = $scope.displayText;
												estimateMainResResourceDialogLookupService.isInit(false);
											}
										});
									}else{
										load(function(){
											estimateMainResGroupDialogLookupService.filterResGroups(options, $scope.entity);
											estimateMainResGroupDialogLookupService.collapseAll.fire();
											estimateMainResResourceDialogLookupService.isInit(false);
										});
									}
								}, 300);
							});
						});
					}

					function ok(result) {
						let selectedItems = $scope.enableMultiSelection ? estimateMainResResourceDialogLookupService.getMultipleSelectedItems() : estimateMainResResourceDialogLookupService.getSelectedEntities(),
							usageContext = $scope.options.usageContext,
							resourceTypeCode = 6;

						result = $.extend(result, {isOk: true, selectedItem: _.head(selectedItems) });

						if (!_.isEmpty(selectedItems) && _.size(selectedItems) > 1){
							let items = _.sortBy(selectedItems, 'Id');

							if (usageContext){
								let itemSelected = $scope.ngModel;
								if (itemSelected){
									let itemIndexToMove = _.findIndex(items, { Id: itemSelected });
									if (itemIndexToMove > 0){
										items.move(itemIndexToMove, 0);
									}
								}
								let serviceContext = $injector.get(usageContext);
								if (serviceContext && angular.isFunction(serviceContext.createItems)){
									serviceContext .createItems(resourceTypeCode, items);
								}
							}
						}
						$modalInstance.close(result);
					}

					function onClose() {
						// estimateMainResResourceDialogLookupService.setItemFilter(null);
						$modalInstance.dismiss('cancel');
					}

					function refresh() {
						$scope.modalOptions.disableOkButton = true;
						estimateMainResResourceDialogLookupService.resetMultipleSelection.fire();

						let grpSelected = estimateMainResGroupDialogLookupService.getSelected();
						let resSelected = estimateMainResResourceDialogLookupService.getSelected();

						estimateMainResResourceDialogLookupService.refresh().then(function(){
							estimateMainResGroupDialogLookupService.refresh().then(function(){

								if (resSelected && grpSelected && resSelected.GroupFk === grpSelected.Id){
									estimateMainResResourceDialogLookupService.isInit(true);

									estimateMainResGroupDialogLookupService.filterResGroups(options, $scope.entity);
									estimateMainResGroupDialogLookupService.expandNode(grpSelected);
									estimateMainResGroupDialogLookupService.reloadGridExpanded();

									estimateMainResResourceDialogLookupService.filterResResources(null, grpSelected.Id).then(function(filteredResources){
										estimateMainResResourceDialogLookupService.setList(filteredResources);
										estimateMainResResourceDialogLookupService.setItemFilter(null);
										estimateMainResResourceDialogLookupService.setSelected({}).then(function(){
											estimateMainResResourceDialogLookupService.setSelected(resSelected).then(function(){
												estimateMainResGroupDialogLookupService.setSelected(grpSelected);
												$timeout(function(){
													estimateMainResResourceDialogLookupService.isInit(false);
												}, 260);
											});
										});
									});
								}else{
									estimateMainResResourceDialogLookupService.setSelected({});
									estimateMainResResourceDialogLookupService.setList([]);
								}

							});
						});
					}

					function search(searchValue) {
						$scope.modalOptions.disableOkButton = true;
						estimateMainResResourceDialogLookupService.setIsListBySearch(true);
						estimateMainResResourceDialogLookupService.setSelected({}).then(function(){
							estimateMainResResourceDialogLookupService.search(searchValue, $scope.entity);
						});
					}

					function onSearchInputKeydown(event, searchValue) {
						if (event.keyCode === keyCodes.ENTER || $scope.instantSearch) {
							$scope.search(searchValue);
						}
					}

					function setDialogSettings(options){
						if($scope.entity && $scope.entity.EstResKindFk){
							let resKindServ = $injector.get('estimateMainResourceTypeLookupService');
							let resKind = resKindServ.getItemByResKindFk($scope.entity.EstResKindFk);
							headerText = $translate.instant('estimate.main.lookupAssignResourcesTemplate',
								{
									Target: resKind.DescriptionInfo.Translated
								});
						}else{
							headerText = $translate.instant('estimate.main.lookupAssignResourcesTemplate');
						}

						switch (options.usageContext){
							case 'estimateMainResourceService':
							case 'estimateAssembliesResourceService':
								$scope.ngModel = $scope.ngModel ? $scope.entity.ResResourceFk : null;
								break;
						}
					}

					function onMultipleSelection(enabled){
						estimateMainResResourceDialogLookupService.setMultiSelection.fire(enabled);
						$scope.enableMultiSelection = enabled;

						let selectedEntities = estimateMainResResourceDialogLookupService.getSelectedEntities();

						if (enabled){
							if (_.isEmpty(selectedEntities)){
								estimateMainResResourceDialogLookupService.resetMultipleSelection.fire();
							}
							let isEmpty = _.isEmpty(estimateMainResResourceDialogLookupService.getMultipleSelectedItems());
							$scope.modalOptions.selectedItems = isEmpty ? estimateMainResResourceDialogLookupService.getSelectedEntities() : estimateMainResResourceDialogLookupService.getMultipleSelectedItems();
							$scope.modalOptions.disableOkButton =  _.isEmpty($scope.modalOptions.selectedItems);
						}else{
							let itemToSelect = _.isEmpty(selectedEntities)? null: _.last(selectedEntities);
							if (itemToSelect){
								estimateMainResResourceDialogLookupService.deselect();
								estimateMainResResourceDialogLookupService.setSelected(itemToSelect);
							}
							estimateMainResResourceDialogLookupService.resetMultipleSelection.fire();
						}
					}

					initialize();

					$scope.$on('$destroy', function () {
						// estimateMainResResourceDialogLookupService.resetMultipleSelection.fire();
						onClose();
					});
				}

				let settings = estimateMainResResourceDialogListColumns.getStandardConfigForListView();
				if (!settings.isTranslated) {
					platformTranslateService.translateGridConfig(settings.columns);
					settings.isTranslated = true;
				}

				let list = [],
					defaults = {
						lookupType: 'estresresourcefk',
						valueMember: 'Id',
						displayMember: 'Code',
						resizeable: true,
						minWidth: '600px',
						maxWidth: '90%',
						columns: angular.copy(estimateMainResResourceDialogListColumns.getStandardConfigForListView().columns),
						dialogOptions: {
							headerText: 'Assign Templates',
							templateUrl: globals.appBaseUrl + 'estimate.main/templates/estimate-main-res-resource-template-lookup-dialog.html',
							controller: ['$scope', '$translate', '$timeout', '$modalInstance', 'estimateMainResResourceDialogLookupService', gridDialogController]
						},
						popupOptions: {
							width: 420,
							height: 300,
							templateUrl: 'grid-popup-lookup.html',
							footerTemplateUrl: 'lookup-popup-footer.html',
							controller: 'basicsLookupdataGridPopupController',
							showLastSize: true
						},
						disableDataCaching: true,
						events: [
							{
								name: 'onInitialized',
								handler: function (e, args) {
									estimateMainResResourceDialogLookupService.init(args.lookupOptions);
								}
							},
							{
								name: 'onSelectedItemChanged',
								handler: function (e, args) {
									if(!args.selectedItem) {
										return;
									}
									let selectedItem = angular.copy(args.selectedItem);
									let entity = args.entity && args.entity.Id ? args.entity: estimateMainResourceService.getSelected();
									if(entity){
										entity.ResResourceFk = selectedItem.Id;
										entity.Code = selectedItem.Code;
										entity.DescriptionInfo = selectedItem.DescriptionInfo;
										entity.BasUomFk = selectedItem.UomBasisFk;
										entity.BasCurrencyFk = selectedItem.CurrencyFk;
										entity.CostUnit = selectedItem.Rate;
									}
									let cclookupServ = $injector.get('estimateMainLookupService');
									let ccItem = cclookupServ.getEstCCById(selectedItem.CostCodeFk);
									estimateMainCommonService.setSelectedLookupItem(ccItem);
								}
							}
						]
					};

				return new BasicsLookupdataLookupDirectiveDefinition('input-base', defaults, {
					dataProvider: {
						myUniqueIdentifier: 'resResourceTemplateLookupHandler',

						getList: function getList(settings, scope) {
							return estimateMainResResourceDialogLookupService.getFilteredList(scope.entity);
						},

						getDefault: function getDefault(){
							return $q.when(_.find(list, {IsDefault: true}));
						},

						getItemByKey: function getItemByKey(value, options, scope) {
							if (scope && scope.entity && scope.entity.ResResourceFk > 0){
								return estimateMainResResourceDialogLookupService.getResResourceByIdAsync(scope.entity.ResResourceFk);
							}
							return $q.when();
						},

						getSearchList: function getSearchList(searchString, displayMember, scope, searchListSettings) {
							let defer = $q.defer();
							let searchStr = _.get(searchListSettings, 'searchString'),
								searchFunc = function (item) {
									if (displayMember === 'Code'){
										let codeLowerCase = _.isEmpty(item.Code) ? '': item.Code.toLowerCase();
										return _.includes(codeLowerCase, searchStr.toLowerCase());
									}else{
										let descriptionLowerCase = _.isEmpty(_.get(item, 'DescriptionInfo.Description')) ? '': _.get(item, 'DescriptionInfo.Description').toLowerCase();
										return _.includes(descriptionLowerCase, searchStr.toLowerCase());
									}
								};
							if (searchStr) {
								estimateMainResGroupDialogLookupService.setSelected({}).then(function(){
									estimateMainResGroupDialogLookupService.loadAllResGroups().then(function(){
										estimateMainResResourceDialogLookupService.loadAllResResources().then(function(){
											estimateMainResResourceDialogLookupService.getFilteredList(scope.entity).then(function(filteredList){
												defer.resolve(_.filter(filteredList, searchFunc));
											});
										});
									});
								});
								return defer.promise;
							} else {
								return $q.when([]);
							}
						}
					}
				});
			}
		]);

})();

(function (angular) {
	'use strict';
	/* global _ */
	var moduleName = 'constructionsystem.common';

	angular.module(moduleName).factory('constructionsystemCommonSelectionStatementCustomControllerService', [
		'$injector',
		function ($injector) {


			var service = {};
			service.initController = function ($scope) {

				// container parameter for child $scope to use.
				var parentService = $injector.get($scope.getContentValue('parentService'));
				var gridUUID = $scope.getContentValue('gridUUID');
				var limitModel = $scope.getContentValue('limitModel');
				var getModelIdMethod = $scope.getContentValue('getModelIdMethod');

				$scope.parentService = parentService;
				$scope.gridUUID = gridUUID;
				if (!gridUUID) {
					throw new Error('gridUUID is not configuration!');
				}


				// limitModel is not implement completely now.
				$scope.limitModel = false;

				if (typeof limitModel === 'boolean') {
					$scope.limitModel = limitModel;
				} else if (typeof limitModel === 'string') {
					$scope.limitModel = limitModel === 'true' ? true : false;
				} else {
					$scope.limitModel = false;
				}

				$scope.getModelIdMethod = getModelIdMethod;

				$scope.currentModelId = null;

				if ($scope.limitModel && parentService[$scope.getModelIdMethod]) {
					$scope.currentModelId = parentService[$scope.getModelIdMethod]();
				}

				// its for toolbar switch and view change
				$scope.searchOptions = {
					searchType: ''
				};

				var unWatchToolsSelected = $scope.$watch(
					function () {
						return $scope.searchOptions.searchType;
					}, function (newvalue) {
						setToolsSelected(newvalue);
					});

				function setToolsSelected(type) {
					// var currentButton = null;
					// switch (type) {
					// case 'simple':
					// currentButton = 'googleSearch';
					// break;
					// case 'property':
					// currentButton = 'propertySearch';
					// break;
					// case 'enhanced':
					// currentButton = 'enhancedSearch';
					// break;
					// case 'expert':
					// currentButton = 'expertSearch';
					// break;
					// default:
					// break;
					// }

					// setTools(currentButton);
					type = type || 'simple';
					setTools(type);
				}

				function setTools(type) {

					$scope.setTools({
						showImages: true,
						showTitles: true,
						// showSelected: true,
						// currentButton: currentButton,
						cssClass: 'tools',
						items: [
							{
								id: 'filter',
								caption: 'radio group caption',
								// must have to show toolbar correctly and used to swith toolbar dynamicly when search type changed.
								iconClass: 'filter',
								type: 'sublist',
								list: {
									cssClass: 'radio-group',
									activeValue: type,
									showTitles: true,
									items: [
										{
											id: 'googleSearch',
											caption: 'constructionsystem.common.caption.simple',
											type: 'radio',
											value: 'simple',
											cssClass: 'tlb-icons ico-sdb-search1',
											fn: function () {
												$scope.searchOptions.searchType = this.value;
											}
										},
										{
											id: 'propertySearch',
											caption: 'constructionsystem.common.caption.property',
											type: 'radio',
											value: 'property',
											cssClass: 'tlb-icons ico-sdb-search2',
											fn: function () {
												$scope.searchOptions.searchType = this.value;
											}
										},
										{
											id: 'enhancedSearch',
											caption: 'constructionsystem.common.caption.enhanced',
											type: 'radio',
											value: 'enhanced',
											cssClass: 'tlb-icons ico-criteria-search',
											fn: function () {
												$scope.searchOptions.searchType = this.value;
											}
										},
										{
											id: 'expertSearch',
											caption: 'constructionsystem.common.caption.expert',
											type: 'radio',
											value: 'expert',
											cssClass: 'tlb-icons ico-sdb-search3',
											fn: function () {
												$scope.searchOptions.searchType = this.value;
											}
										}
									]
								}
							}
						]
					});

					$scope.toolbarOption = $scope.toolbarOption || {};

					if ($scope.toolbarOption.showExecute === true) {
						$scope.tools.items.unshift({
							id: 'execute',
							caption: 'constructionsystem.common.caption.execute',
							type: 'item',
							iconClass: 'tlb-icons ico-filter',
							disabled: function () {
								return !parentService.hasSelection();
							},
							fn: function () {
								if ($scope.toolbarOption.execute && angular.isFunction($scope.toolbarOption.execute)) {
									$scope.toolbarOption.execute();
								}
							}
						});

						// $scope.tools.items.unshift({
						// id: 'd0',
						// type: 'divider',
						// isSet: true
						// });
					}
				}

				$scope.onRevertFilter = function(){
					if (parentService.hasSelection()) {
						var header = parentService.getSelected();
						if(header.OriginalSelectStatement){
							header.SelectStatement = header.OriginalSelectStatement;
						}
					}
				};

				$scope.canRevertFilter = function(){
					if (parentService.hasSelection()) {
						var header = parentService.getSelected();
						return header.SelectStatement !== header.OriginalSelectStatement;
					}
					return false;
				};

				$scope.dropDownMatcher = function dropDownMatcher(input, data) { // jshint ignore:line
					if (_.isUndefined(input.term)) {
						return data;
					}
					if (data && _.isString(data.text)) {
						if (data.text.toUpperCase().indexOf(input.term.toUpperCase()) !== -1) {
							return data;
						}
					}
					return null;
				};

				$scope.$on('$destroy', function () {
					unWatchToolsSelected();
				});


				parentService.registerSelectionChanged(onSelectionChanged);

				if (parentService.registerSelectStatementChanged) {
					parentService.registerSelectStatementChanged(onSelectionChanged);
				}

				$scope.$on('$destroy', function () {
					parentService.unregisterSelectionChanged(onSelectionChanged);
					if (parentService.unregisterSelectStatementChanged) {
						parentService.unregisterSelectStatementChanged(onSelectionChanged);
					}
				});

				onSelectionChanged();

				function onSelectionChanged() {
					if (parentService.hasSelection()) {
						var header = parentService.getSelected();
						if(angular.isUndefined(header.OriginalSelectStatement)){
							header.OriginalSelectStatement = header.SelectStatement;
						}
						if (!header.SelectStatement) {
							$scope.searchOptions.searchType = 'simple';
						} else {
							try {
								var filterDto = JSON.parse(header.SelectStatement);
								$scope.searchOptions.searchType = filterDto.filterType;
							} catch (e) {
								console.log(e);
							}

						}
					}else {
						$scope.searchOptions.searchType = 'simple';
					}
				}
			};

			return service;
		}
	]);
})(angular);
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainLineItemObjectSelStatementControllerService', [
		'$injector', '_',
		function ($injector, _) {


			let service = {};
			service.initController = function ($scope) {

				// container parameter for child $scope to use.
				let parentService = $injector.get($scope.getContentValue('parentService'));
				let gridUUID = $scope.getContentValue('gridUUID');
				let limitModel = $scope.getContentValue('limitModel');
				let getModelIdMethod = $scope.getContentValue('getModelIdMethod');

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
					searchType: 'expert'
				};

				$scope.onRevertFilter = function(){
					if (parentService.hasSelection()) {
						let header = parentService.getSelected();
						if(header.OriginalSelectStatement){
							header.ObjectSelectStatement = header.OriginalSelectStatement;
						}
					}
				};

				$scope.canRevertFilter = function(){
					if (parentService.hasSelection()) {
						let header = parentService.getSelected();
						return header.ObjectSelectStatement !== header.OriginalSelectStatement;
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
						let header = parentService.getSelected();
						if(angular.isUndefined(header.OriginalSelectStatement)){
							header.OriginalSelectStatement = header.ObjectSelectStatement;
						}
						if (!header.ObjectSelectStatement) {
							$scope.searchOptions.searchType = 'expert';
						} else {
							try {
								$scope.searchOptions.searchType =  'expert';
							} catch (e) {
								// eslint-disable-next-line no-console
								console.log(e);
							}

						}
					}else {
						$scope.searchOptions.searchType = 'expert';
					}
				}
			};

			return service;
		}
	]);
})(angular);

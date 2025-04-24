/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	let moduleName = 'estimate.project';

	/**
	 * @ngdoc controller
	 * @name projectRateBookReadonlyListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of the project ratebook entities
	 **/
	angular.module(moduleName).controller('estimateProjectRateBookListController', estimateProjectRateBookListController);

	estimateProjectRateBookListController.$inject = ['$scope', '$timeout','platformToolbarService', 'projectMainService', 'platformGridControllerService', 'estimateProjectRateBookDataService',
		'estimateProjectRateBookConfigDataService', 'platformGridAPI', 'estimateProjectRateBookConfigurationService'];
	function estimateProjectRateBookListController(
		$scope,$timeout, platformToolbarService, projectMainService, platformGridControllerService, estimateProjectRateBookDataService,
		estimateProjectRateBookConfigDataService, platformGridAPI, estimateProjectRateBookConfigurationService) {

		$scope.gridId = '37de9c2128f54ab199a62c1526b4d411';
		let isEditable = false;

		function setToolsEditable(_isEditable) {
			let project = projectMainService.getSelected();
			if(!_isEditable) {
				// check project's prjcontentfk and prjcontenttypefk
				isEditable = project && !project.PrjContentTypeFk && project.PrjContentFk;
			}
			else{
				isEditable = _isEditable;
			}

			return isEditable;
		}

		setToolsEditable();

		let isProjectConfig = false, isFirstTimeChanged = true;
		function init() {
			let project = projectMainService.getSelected();
			isProjectConfig = project && !project.PrjContentTypeFk && !!project.PrjContentFk;

			// check if closed in customizing module, if yes then reload data
			let reload = estimateProjectRateBookConfigDataService.ifClosedInCustomize();
			if(reload) {
				estimateProjectRateBookDataService.load();
				estimateProjectRateBookConfigDataService.SetIfClosedInCustomize(false);
			}
			let isInproject = estimateProjectRateBookConfigDataService.isInProject();
			if(isInproject && project) {
				let contentTypeFk = project.PrjContentTypeFk;
				if(!isProjectConfig){
					estimateProjectRateBookDataService.setThisContentTypeId(contentTypeFk);
					estimateProjectRateBookDataService.load();
				}
				estimateProjectRateBookConfigDataService.setContentTypeId(null);
			}
		}

		init();

		if(typeof $scope.setTools === 'function') {
			let toolbarItems = [
				{
					id: 't6',
					caption: 'project.main.configPerProject',
					type: 'item',
					iconClass: 'tlb-icons ico-wildcard-2',
					fn: function() {
						let project = projectMainService.getSelected();

						project.PrjContentTypeFk = null;
						projectMainService.markItemAsModified(project);
						projectMainService.gridRefresh();

						if(!isProjectConfig || isFirstTimeChanged) {
							// will copy the config data from this project content type
							estimateProjectRateBookDataService.setActivated(false);
							isFirstTimeChanged = false;
						}
						else{
							// will restore the pre config
							estimateProjectRateBookDataService.load();
						}

						isEditable = true;
						$scope.updateTools();
					},
					disabled: function () {
						// let project = projectMainService.getSelected();
						return isEditable;
					}
				}
			];

			$scope.setTools({
				showImages: true,
				showTitles: true,
				cssClass: 'tools',
				items: toolbarItems
			});
		}
		else{
			$scope.setTools = function () {

			};
		}

		if(platformGridAPI.grids.exist($scope.gridId)){
			platformGridAPI.grids.unregister($scope.gridId);
		}

		let girdConfig =  {
			initCalled: false,
			columns: [],
			parentProp: 'RateBookParentFk',
			childProp: 'RateBookChildren',
			moduleState: 'projectMainModuleState',
			gridDataPath: 'selectedMainEntity.RateBook',
			type: 'RateBook',
			skipPermissionCheck: true
		};

		platformGridControllerService.initListController($scope, estimateProjectRateBookConfigurationService, estimateProjectRateBookDataService, null, girdConfig);

		$scope.isCheckedValueChange = estimateProjectRateBookDataService.isCheckedValueChange;

		function onDataLoaded(_isInproject) {
			estimateProjectRateBookDataService.onLoaded();
			if(_isInproject) {
				estimateProjectRateBookConfigDataService.setContentTypeId(null);
			}
			updateToolsChanged();
		}

		function updateToolsChanged() {
			setToolsEditable();
			$scope.updateTools();
		}

		function onContenTypeChanged(contentTypeFk) {
			estimateProjectRateBookDataService.setThisContentTypeId(null);
			if(contentTypeFk){
				estimateProjectRateBookConfigDataService.setContentTypeId(contentTypeFk);
			}
			else{
				estimateProjectRateBookDataService.setThisContentTypeId(-1);
			}
			estimateProjectRateBookDataService.load().then(function () {
				updateToolsChanged();
				estimateProjectRateBookDataService.setThisContentTypeId(null);
			});
		}

		function onProjectCreated() {
			init();
			estimateProjectRateBookDataService.setActivated(false);
		}

		estimateProjectRateBookDataService.registerListLoaded(onDataLoaded);
		estimateProjectRateBookConfigDataService.OnContenTypeChanged.register(onContenTypeChanged);
		// projectMainService.registerListLoaded(init);
		projectMainService.registerEntityCreated(onProjectCreated);

		let isInproject = estimateProjectRateBookConfigDataService.isInProject();
		if(!isInproject){
			onDataLoaded(isInproject);
		}

		$timeout(function () {
			platformGridAPI.grids.resize($scope.gridId);
		});

		$scope.$on('$destroy', function () {
			estimateProjectRateBookDataService.unregisterListLoaded(onDataLoaded);
			projectMainService.unregisterEntityCreated(onProjectCreated);
			estimateProjectRateBookConfigDataService.OnContenTypeChanged.unregister(onContenTypeChanged);
			// projectMainService.unregisterListLoaded(init);

			estimateProjectRateBookConfigDataService.setContentTypeId(null);
			estimateProjectRateBookConfigDataService.reSetData();
			estimateProjectRateBookDataService.setThisContentTypeId(null);

			if(platformGridAPI.grids.exist($scope.gridId)){
				platformGridAPI.grids.unregister($scope.gridId);
			}
		});
	}
})();

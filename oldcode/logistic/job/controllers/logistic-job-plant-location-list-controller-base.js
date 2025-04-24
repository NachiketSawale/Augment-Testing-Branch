/*
 * $Id: logistic-job-plant-location-list-controller-base.js $
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';
	/**
	 * @ngdoc controller
	 * @name logisticJobPlantLocationListControllerBase
	 * @function
	 *
	 * @description
	 * base controller for the logistic job plant location containers. Only use this controller in combination of
	 * dataservices that are initiated by the logisticJobLocationDataServiceFactory.
	 **/
	angular.module('platform').service('logisticJobPlantLocationListControllerBase', LogisticJobPlantLocationListControllerBase);

	LogisticJobPlantLocationListControllerBase.$inject = [
		'_', '$injector', 'platformGridControllerService', 'platformDetailControllerService', 'platformContainerControllerService',
		'basicsCommonStringFormatService', 'platformTranslateService'
	];

	function LogisticJobPlantLocationListControllerBase(
		_, $injector, platformGridControllerService, platformDetailControllerService, platformContainerControllerService,
		basicsCommonStringFormatService, platformTranslateService
	) {

		let self = this;

		this.initController = function initController($scope, moduleOrModuleCoInSys, guid, modTrans, dataService) {
			platformContainerControllerService.initController($scope, moduleOrModuleCoInSys, guid, modTrans);
			if(dataService.isPagingEnabled()){
				let setStatusBarNav = function setStatusBarNav(isVisible = true) {
					let pagingInfo = dataService.getPagingInfo();
					let fieldChanges;
					isVisible = isVisible && pagingInfo.totalRec !== 0;

					// Search Form Filter Change
					if (_.isFunction($scope.getUiAddOns)) {
						var uiMgr = $scope.getUiAddOns();
						var sb = uiMgr.getStatusBar();

						fieldChanges = [
							{
								align: 'last',
								disabled: !pagingInfo.backwardEnabled,
								id: 'goToFirst',
								type: 'button',
								visible: true,
								delete: !isVisible,
								iconClass: 'tlb-icons ico-rec-first',
								cssClass: 'block-image',
								func: function () {
									dataService.loadPageFirst();
									dataService.startLoad(false);
								}
							},
							{
								align: 'last',
								disabled: !pagingInfo.backwardEnabled,
								id: 'goToPrev',
								type: 'button',
								visible: true,
								delete: !isVisible,
								iconClass: 'control-icons ico-previous',
								cssClass: 'block-image',
								func: function () {
									dataService.loadPageBackward();
									dataService.startLoad(false);
								}
							},
							{
								id: 'info',
								align: 'last',
								type: 'text',
								ellipsis: true,
								delete: !isVisible,
								value: pagingInfo.recordInfoText,
								toolTip: {
									caption:  basicsCommonStringFormatService.format(platformTranslateService.instant('logistic.job.loadLocationPagingDescription', null, true), pagingInfo.pageSize),
								}
							},{
								align: 'last',
								disabled: !pagingInfo.forwardEnabled,
								id: 'goToNext',
								type: 'button',
								visible: true,
								delete: !isVisible,
								iconClass: 'control-icons ico-next',
								cssClass: 'block-image',
								func: function () {
									dataService.loadPageForward();
									dataService.startLoad(false);
								}
							},
							{
								align: 'last',
								disabled: !pagingInfo.forwardEnabled,
								id: 'goToLast',
								type: 'button',
								visible: true,
								delete: !isVisible,
								iconClass: 'tlb-icons ico-rec-last',
								cssClass: 'block-image',
								func: function () {
									dataService.loadPageLast();
									dataService.startLoad(false);
								}
							}];

						sb.updateFields(fieldChanges);
					}
				};

				setStatusBarNav();
				dataService.registerListLoaded2(setStatusBarNav);
			}
		};
	}
})();

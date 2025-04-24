/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.main';
	/**
     * @ngdoc service
     * @name estimateMainCopySourceCopyOptionsDialogService
     * @function
     *
     * @description
     * This is the data service for Copy options dialog on Estimate Copy source container.
     */
	angular.module(moduleName).factory('estimateMainCopySourceCopyOptionsDialogService', [ '$q','$http', '$injector','$translate','PlatformMessenger',  'platformModalService','estimateMainService',
		function ($q,$http,$injector, $translate,PlatformMessenger, platformModalService,estimateMainService) {

			let currentItem = {},
				loadCompleteDataPromise = null;

			let service = {
				onCurrentItemChanged : new PlatformMessenger()
			};

			service.getCurrentItem = function (){
				return currentItem;
			};

			service.setCurrentItem = function (item){
				currentItem = item;
			};

			let loadCompleteData = function loadCompleteData(){
				if(loadCompleteDataPromise === null){
					loadCompleteDataPromise = $http.get(globals.webApiBaseUrl + 'estimate/main/copyoption/getcopyoption?estHeaderId='+currentItem.EstHeaderId);
				}
				return loadCompleteDataPromise.then(function(response){
					currentItem = response.data;
					loadCompleteDataPromise = null;
					return currentItem;
				});
			};

			service.showDialog = function showDialog() {
				let options = {
					templateUrl: globals.appBaseUrl + 'estimate.main' + '/templates/details-parameters-dialog/estimate-main-details-param-dialog.html',
					controller: 'estimateMainCopySourceCopyOptionsController',
					width: '250px',
					height: '570px',
					resizeable: true
				};

				function showConfigDialog(dialogOptions){
					platformModalService.showDialog(dialogOptions);
					let qDefer = $q.defer();
					qDefer.resolve(dialogOptions);
					return qDefer.promise;
				}

				function loadCurrentItem(headerItem) {
					if(currentItem.Version >= 0){
						showConfigDialog(options);
					}else{
						currentItem.EstHeaderId = headerItem.Id;

						loadCompleteData().then(function () {
							service.setCurrentItem(currentItem);
							showConfigDialog(options);
						});
					}
				}

				let estimateMainService = $injector.get('estimateMainService');
				if (estimateMainService.getSelectedEstHeaderId() > 0) {
					let headerItem = estimateMainService.getSelectedEstHeaderItem();
					if (headerItem && headerItem.Id) {
						loadCurrentItem(headerItem);
					}
				} else {
					let selectedEstHeaderItem = estimateMainService.getSelectedEstHeaderItem();
					let title = $translate.instant('estimate.main.copyOptions'),
						msg = $translate.instant('estimate.main.noProjectOrEstimatePinned');
					$injector.get('platformSidebarWizardCommonTasksService').assertSelection(selectedEstHeaderItem, title, msg);
				}
			};

			service.saveCopyOptions = function(copyOptionItem){
				let selectedEstHeaderItem = estimateMainService.getSelectedEstHeaderItem();
				let title = $translate.instant('estimate.main.copyOptions'),
					msg = $translate.instant('estimate.main.noProjectOrEstimatePinned');

				if ($injector.get('platformSidebarWizardCommonTasksService').assertSelection(selectedEstHeaderItem, title, msg)) {
					copyOptionItem.LiCharacteristics= copyOptionItem.hasOwnProperty('LiCharacteristics') ? copyOptionItem.LiCharacteristics : false;
					copyOptionItem.ResCharacteristics=copyOptionItem.hasOwnProperty('ResCharacteristics') ? copyOptionItem.ResCharacteristics : false;
					$http.post(globals.webApiBaseUrl + 'estimate/main/copyoption/savecopyoptions', {
						'EstHeaderId': selectedEstHeaderItem.Id,
						'EstCopyOptionData': copyOptionItem
					}).then(function (response) {
						currentItem= response.data;
					});
				}
			};

			return service;
		}
	]);
})();

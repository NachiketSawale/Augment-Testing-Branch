/**
 * Created by lav on 8/23/2018.
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc function
	 * @name sidebarWizardPropertyChangeService
	 * @function
	 * @methodOf
	 * @description Service to provide the change property function for wizard, which will tree(change the property with child)
	 */
	angular.module('basics.common').factory('sidebarWizardPropertyChangeService', sidebarWizardPropertyChangeService);

	sidebarWizardPropertyChangeService.$inject = [
		'platformModalService',
		'$translate',
		'$q',
		'platformSidebarWizardCommonTasksService',
		'_'
	];

	function sidebarWizardPropertyChangeService(
		platformModalService,
		$translate,
		$q,
		platformSidebarWizardCommonTasksService,
		_) {
		/**
		 * @ngdoc function
		 * @name provideEnableIsLiveInstance
		 * @function
		 * @methodOf sidebarWizardPropertyChangeService
		 * @description Provide enable IsLive property
		 * @param dataService
		 * @param captionTR
		 * @param codeField
		 * @param doneMsg
		 * @param nothingToDoMsg
		 * @param placeHolder
		 */
		function provideEnableIsLiveInstance(dataService, captionTR, codeField, doneMsg, nothingToDoMsg, placeHolder) {
			return provideInstance(dataService, captionTR, codeField, doneMsg, nothingToDoMsg, placeHolder, 'IsLive', true, false, 'SiteFk');
		}

		/**
		 * @ngdoc function
		 * @name provideDisableIsLiveInstance
		 * @function
		 * @methodOf sidebarWizardPropertyChangeService
		 * @description Provide disable IsLive property
		 * @param dataService
		 * @param captionTR
		 * @param codeField
		 * @param doneMsg
		 * @param nothingToDoMsg
		 * @param placeHolder
		 */
		function provideDisableIsLiveInstance(dataService, captionTR, codeField, doneMsg, nothingToDoMsg, placeHolder) {
			return provideInstance(dataService, captionTR, codeField, doneMsg, nothingToDoMsg, placeHolder, 'IsLive', false, true, false);
		}

		/**
		 * @ngdoc function
		 * @name provideInstance
		 * @function Provide change the property with targetValue
		 * @methodOf sidebarWizardPropertyChangeService
		 * @description
		 * @param dataService
		 * @param captionTR
		 * @param codeField
		 * @param doneMsg
		 * @param nothingToDoMsg
		 * @param placeHolder
		 * @param filedName
		 * @param targetValue
		 * @param cascadeChild
		 * @param cascadeParent
		 */
		function provideInstance(dataService, captionTR, codeField, doneMsg, nothingToDoMsg, placeHolder, filedName, targetValue, cascadeChild, cascadeParent) {
			return function () {
				const selectedEntities = dataService.getSelectedEntities();
				const modalOptions = {
					headerText: $translate.instant(captionTR),
					bodyText: '',
					iconClass: 'ico-info'
				};
				if (selectedEntities && selectedEntities.length > 0) {
					modalOptions.bodyText = platformSidebarWizardCommonTasksService.prepareMessageText('cloud.common.questionDisableSelection', selectedEntities, codeField, 'sel');
					const doneSelection = [];
					const notDoneSelection = [];
					let promise = $q.when({'yes': true});
					if (selectedEntities.length > 1) {
						promise = platformModalService.showYesNoDialog(modalOptions.bodyText, modalOptions.headerText, 'yes');
					}
					return promise
						.then(function (result) {
							if (result.yes) {
								let relatedItems = [];
								if (cascadeChild) {
									const mergeChild = function (items) {
										angular.forEach(items, function (sel) {
											if (!_.find(relatedItems, function (item) {
												return item === sel;
											})) {
												relatedItems.push(sel);
												if (sel.ChildItems && sel.ChildItems.length > 0) {
													mergeChild(sel.ChildItems);
												}
											}
										});
									};
									mergeChild(selectedEntities);
								}
								if (cascadeParent) {
									const mergeParent = function (items) {
										const rows = dataService.getList();
										angular.forEach(items, function (sel) {
											if (!_.find(relatedItems, function (item) {
												return item === sel;
											})) {
												relatedItems.push(sel);
											}
											if (sel[cascadeParent]) {
												const parent = _.find(rows, {Id: sel[cascadeParent]});
												if (parent) {
													mergeParent([parent]);
												}
											}
										});
									};
									mergeParent(selectedEntities);
								}
								if (!cascadeChild && !cascadeParent) {
									relatedItems = selectedEntities;
								}
								angular.forEach(relatedItems, function (sel) {
									if (sel[filedName] !== targetValue) {
										sel[filedName] = targetValue;
										dataService.markItemAsModified(sel);
										doneSelection.push(sel);
									} else {
										notDoneSelection.push(sel);
									}
								});
								dataService.gridRefresh();// has bug in markItemAsModified, so need to call gridRefresh
								if (doneSelection.length > 0) {
									modalOptions.bodyText = platformSidebarWizardCommonTasksService.prepareMessageText(doneMsg, doneSelection, codeField, placeHolder);
								}
								if (notDoneSelection.length > 0) {
									modalOptions.bodyText += platformSidebarWizardCommonTasksService.prepareMessageText(nothingToDoMsg, notDoneSelection, codeField, placeHolder);
								}
								return platformModalService.showDialog(modalOptions);
							}
						});
				} else {
					modalOptions.bodyText = platformSidebarWizardCommonTasksService.prepareMessageText('cloud.common.noCurrentSelection');
					return platformModalService.showDialog(modalOptions);
				}
			};
		}

		return {
			provideDisableIsLiveInstance: provideDisableIsLiveInstance,
			provideEnableIsLiveInstance: provideEnableIsLiveInstance,
			provideInstance: provideInstance
		};
	}
})(angular);
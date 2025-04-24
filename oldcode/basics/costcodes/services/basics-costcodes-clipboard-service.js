/*
 * $Id: basics-costcodes-clipboard-service.js 2023-05-02 winjit.deshkar $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'basics.costcodes';
	let costcodeMainModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name basicsCostCodesClipboardService
	 * @description provides drag and drop functionality for the cost codes
	 */

	costcodeMainModule.factory('basicsCostCodesClipboardService', ['$injector','$http','platformDialogService',

		function ($injector,$http,platformDialogService) {

			let service = {};

			/* jshint -W074 */
			service.doCanPaste = function doCanPaste(canPastedContent, type, selectedItem) {				
				if(canPastedContent.data.length > 0 && selectedItem !== null ){				
					if (canPastedContent.data.some(item => item === selectedItem)) {						
						return false;
					}
				}
				return true;
			};

			/**
			 * @ngdoc function
			 * @name doPaste
			 * @function
			 * @methodOf basicsCostCodesClipboardService
			 * @description move or copy the clipboard to the selected template group
			 * @param {object} selected template group selected node
			 * @returns
			 */
			service.doPaste = function doPaste(pastedContent, selectedItem) {


				platformDialogService.showYesNoDialog('basics.costcodes.dialogMsg', 'basics.costcodes.dialogTitle', 'no', undefined, undefined, {}).then(function (result) {
					if (result.yes) {
						let pastedContentIds = [];
						if(pastedContent.data.length > 0 && selectedItem !== null ){
							if (_.isUndefined(selectedItem)) {
								selectedItem = {};
								selectedItem.Id = 0;
							}
							angular.forEach(pastedContent.data, function (item) {
								pastedContentIds.push(item.Id);
							});
							$http.post(globals.webApiBaseUrl + 'basics/costcodes/saverequestcostcode?selectedItem='+selectedItem.Id,pastedContentIds).then(function (response) {
								$injector.get('basicsCostCodesMainService').addList(response.data);
								$injector.get('basicsCostCodesMainService').setSelected({}).then(function () {
									if(selectedItem.Id > 0) {
										$injector.get('basicsCostCodesMainService').setSelected(selectedItem);
									} else {
										let selItem = _.filter(response.data, function (item) {
											return _.includes(pastedContentIds, item.Id);
										});
										$injector.get('basicsCostCodesMainService').setSelected(selItem[0]);
									}
								});
							});
						}
					}
				});
			};

			return service;
		}
	]);


})(angular);
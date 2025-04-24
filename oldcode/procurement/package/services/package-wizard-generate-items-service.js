/**
 * Created by wuj on 11/19/2015.
 */

(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.package').factory('procurementPackageWizardGenerateItemsService',
		['$q', '$http', '$translate', 'platformTranslateService', 'basicsCommonGridSelectionDialogService', 'platformModalService',
			function ($q, $http, $translate, platformTranslateService,gridSelectionDialogService, platformModalService) {

				var service = {};
				service.showGenerateItemWizardDialog=function(parentService){
					var obj = {
						selector: {},
						__selectorSettings: {}
					};
					var modalOptions = {
						headerTextKey: 'procurement.package.wizard.generateItems.generateWizardTitle',
						templateUrl: globals.appBaseUrl + 'procurement.package/partials/generateItemWizardDailog.html',
						resizeable: false,
						width:'700px',
						showOKButton: true,
						value:{
							wizardName:$translate.instant('procurement.package.wizard.generateItems.generateWizardTitle'),
							entity:obj
						}
					};
					parentService.update().then(function() {
						platformModalService.showDialog(modalOptions);
					});
				};

				service.onGenerateItems = function (paramPost) {
					var httpRoute = globals.webApiBaseUrl + 'procurement/package/wizard/generatematerialitems';
					return $http.post(httpRoute,paramPost);
				};

				service.getDynamicUniqueFields = getDynamicUniqueFields;
				return service;

				// //////////////////////
				function getDynamicUniqueFields(packageInfo) {
					return $http.get(globals.webApiBaseUrl + 'basics/costgroupcat/list?projectId='+packageInfo.ProjectId);
				}
			}]);
})(angular);

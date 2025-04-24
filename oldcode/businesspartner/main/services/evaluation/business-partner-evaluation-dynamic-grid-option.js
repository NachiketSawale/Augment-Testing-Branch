/**
 * Created by chi on 5/15/2017.
 */

(function (angular) {
	'use strict';
	var moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('busiessPartnerMainEvaluationDynamicGridOption', busiessPartnerMainEvaluationDynamicGridOption);

	busiessPartnerMainEvaluationDynamicGridOption.$inject = ['businessPartnerMainEvaluationClerkType', 'globals', '$translate'];

	function busiessPartnerMainEvaluationDynamicGridOption(businessPartnerMainEvaluationClerkType, globals, $translate) {
		var service = {};
		var denyTemplate = globals.appBaseUrl + 'app/components/layoutsystem/templates/container-empty.html';
		var evalGroupDataHasRead = true;
		var evalDocumentHasRead = true;
		var evalClerkHasRead = true;
		service.getClerkInfo = getClerkInfo;
		service.getEvalGroupInfo = getEvalGroupInfo;
		service.getEvalDocumentInfo = getEvalDocumentInfo;
		service.getEvalItemInfo = getEvalItemInfo;
		service.reset = reset;
		return service;

		// ////////////////

		function getClerkInfo(clerkType, hasRead) {
			var containerCommonTitle = $translate.instant('businesspartner.main.screenEvaluationClerkDataContainerCommonTitle');
			var split = ' - ';
			clerkType = clerkType || businessPartnerMainEvaluationClerkType.EVAL;
			var serviceName = 'evaluationClerkService';
			var validationName = 'evaluationClerkValidationService';
			var uiStandardName = 'evaluationClerkUIStandardService';
			var containerUUID = '2902e129fa9c4c2d9e3f8cd1bfa6b7d8';
			var containerTitle = containerCommonTitle + split + $translate.instant('businesspartner.main.entityEvaluation');
			var controller = 'businessPartnerEvaluationClerkGridController';
			var url = globals.appBaseUrl + 'businesspartner.main/partials/screen-business-partner-evaluation-common-clerk-grid-view.html';
			var permissionName = 'EVALCLERK';
			var tempHasRead = hasRead !== null && angular.isDefined(hasRead) ? hasRead : evalClerkHasRead;
			var tempDenyTemplate = globals.appBaseUrl + 'businesspartner.main/partials/screen-business-partner-evaluation-common-clerk-empty-view.html';
			var denyController = 'businessPartnerEvaluationClerkEmptyController';

			if (clerkType === businessPartnerMainEvaluationClerkType.EVAL) {
				evalClerkHasRead = tempHasRead;
			} else if (clerkType === businessPartnerMainEvaluationClerkType.GROUP) {
				serviceName = 'evaluationGroupClerkService';
				validationName = 'evaluationGroupClerkValidationService';
				uiStandardName = 'evaluationGroupClerkUIStandardService';
				containerUUID = '7fdae404c0164283a7f0ffc8a5fcbf01';
				containerTitle = containerCommonTitle + split + $translate.instant('businesspartner.main.scrrenEvaluationClerkContainerSubTitle.evalGroupData');
				permissionName = 'EVALGROUPCLERK';
				tempHasRead = hasRead;
			} else if (clerkType === businessPartnerMainEvaluationClerkType.SUBGROUP) {
				serviceName = 'evaluationGroupClerkService';
				validationName = 'evaluationGroupClerkValidationService';
				uiStandardName = 'evaluationGroupClerkUIStandardService';
				containerUUID = 'ccdb79b7bba44c808e1173e1385554fa';
				containerTitle = containerCommonTitle + split + $translate.instant('businesspartner.main.scrrenEvaluationClerkContainerSubTitle.evalSubGroupData');
				permissionName = 'EVALSUBGROUPCLERK';
				tempHasRead = hasRead;
			} else if (clerkType !== businessPartnerMainEvaluationClerkType.EVAL) {
				throw new Error('clerkType ' + clerkType + ' is not defined.');
			}

			return {
				name: 'clerk',
				serviceName: serviceName,
				validationName: validationName,
				uiStandardName: uiStandardName,
				containerUUID: containerUUID,
				containerTitle: containerTitle,
				controller: controller,
				url: url,
				permissionName: permissionName,
				denyTemplate: tempDenyTemplate,
				hasRead: tempHasRead,
				denyController: denyController
			};
		}

		function getEvalGroupInfo(hasRead) {
			evalGroupDataHasRead = hasRead !== null && angular.isDefined(hasRead) ? hasRead : evalGroupDataHasRead;
			return {
				name: 'evalGroup',
				controller: 'businessPartnerEvaluationGroupDataController',
				url: globals.appBaseUrl + 'businesspartner.main/partials/screen-business-partner-evaluation-group-data-view.html',
				permissionName: 'EVALGROUP',
				denyTemplate: denyTemplate,
				hasRead: evalGroupDataHasRead,
				denyController: ''
			};
		}

		function getEvalDocumentInfo(hasRead) {
			evalDocumentHasRead = hasRead !== null && angular.isDefined(hasRead) ? hasRead : evalDocumentHasRead;
			return {
				name: 'evalDocument',
				controller: 'businessPartnerEvaluationDocumentDataController',
				url: globals.appBaseUrl + 'businesspartner.main/partials/screen-business-partner-evaluation-document-data-view.html',
				permissionName: 'EVAL',
				denyTemplate: denyTemplate,
				hasRead: evalDocumentHasRead,
				denyController: ''
			};
		}

		function getEvalItemInfo(hasRead) {
			return {
				name: 'evalItem',
				controller: 'businessPartnerEvaluationItemDataController',
				url: globals.appBaseUrl + 'businesspartner.main/partials/screen-business-partner-evaluation-item-data-view.html',
				permissionName: 'EVALITEM',
				denyTemplate: denyTemplate,
				hasRead: hasRead,
				denyController: ''
			};
		}

		function reset() {
			evalGroupDataHasRead = true;
			evalDocumentHasRead = true;
			evalClerkHasRead = true;
		}
	}
})(angular);
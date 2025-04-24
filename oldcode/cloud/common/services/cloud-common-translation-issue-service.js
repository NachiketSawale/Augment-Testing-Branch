/**
 * Created by aljami on 31.01.2024
 */

(function () {

	'use strict';

	angular.module('cloud.common').factory('cloudCommonTranslationIssueService', ['globals', '$http', 'platformDialogService', '$translate',
		function (globals, $http, platformDialogService, $translate) {

			let service = {};
			service.getIssues = getIssues;
			service.setCurrentIssues = setCurrentIssues;
			service.resolveIssue = resolveIssue;
			service.openIssueDialog = openIssueDialog;
			service.getCurrentIssues = getCurrentIssues;
			service.getHistory = getHistory;
			let currentIssues = [];
			return service;

			function getCurrentIssues() {
				return currentIssues;
			}

			function getIssues(itemValue, columnName, basTranslationFk){
				return $http({
					method: 'GET',
					url: globals.webApiBaseUrl + 'cloud/common/translationissue/getIssues',
					params: {'itemValue': itemValue, 'columnName': columnName, 'basTranslationFk': basTranslationFk}
				}).then(function (response) {
					let issues = [];
					if(Array.isArray(response.data)) {
						response.data.forEach(issue => {
							issues.push(issue);
						});
					}

					return issues;
				});
			}

			function getHistory(basTranslationFkList) {

				let postData = {
					BasTranslationFkList: basTranslationFkList
				};

				return $http.post(globals.webApiBaseUrl + 'cloud/common/translationissue/getHistory', postData).then(result => result.data);
			}

			function resolveIssue(issueGuid, optionGuid, basTranslationFk, itemValue, columnName) {
				let postData = {
					IssueGuid: issueGuid,
					OptionGuid: optionGuid,
					BasTranslationFk: basTranslationFk,
					ItemValue: itemValue,
					ColumnName: columnName,
				};

				return $http.post(globals.webApiBaseUrl + 'cloud/common/translationissue/performAction', postData);
			}

			function setCurrentIssues(issues) {
				currentIssues = issues;
			}

			function getIssueTabConfig(issueGuid) {
				switch (issueGuid) {
					case 'ccd81a8d96dc4bb6b222ef1858d79876':
						return {
							title: $translate.instant('cloud.common.translationIssueDialog.tabHeaderIssue'),
							content: globals.appBaseUrl + 'cloud.common/templates/cloud-common-tab-english-translation-issue.html',
							active: true
						};
					default:
						return {
							title: $translate.instant('cloud.common.translationIssueDialog.tabHeaderIssue'),
							content: globals.appBaseUrl + 'cloud.common/templates/cloud-common-tab-no-issue.html',
							active: true
						};
				}
			}

			function getDialogConfig() {
				return {
					headerText$tr$: 'cloud.common.translationIssueDialog.dialogTitle',
					bodyTemplateUrl: globals.appBaseUrl + 'cloud.common/templates/cloud-common-translation-issue-dialog.html',
					showCancelButton: true,
					showNoButton: false,
					showOkButton: false,
					resizeable: true,
					width: '700px',
					minWidth: '700px',
					height: '500px',
					value: {
						tabs: [
							{
								title: $translate.instant('cloud.common.translationIssueDialog.tabHeaderHistory'),
								content: globals.appBaseUrl + 'cloud.common/templates/cloud-common-translation-issue-tab-history.html',
								active: false
							}
						],
						keepTranslation: true,
						dataService: undefined
					},
					buttons: []
				};
			}

			function getIssueToDisplay() {
				return currentIssues.length > 0 ? currentIssues[0] : undefined;
			}

			function openIssueDialog(isInCustomizingModule, tableData) {
				let issueToDisplay = getIssueToDisplay();
				let issueTabConfig = getIssueTabConfig((issueToDisplay) ? issueToDisplay.IssueGuid : '');
				if(issueTabConfig) {
					let dialogConfig = getDialogConfig();
					dialogConfig.value.tabs.splice(0,0,issueTabConfig);
					dialogConfig.value.dataService = tableData.getService();
					dialogConfig.value.isInCustomizeModule = isInCustomizingModule;
					dialogConfig.value.data = tableData;
					return platformDialogService.showDialog(dialogConfig).then(function (response) {
						return response;
					}, function issueDialogClosed() {
						return {cancel: true};
					});
				}
			}
		}
	]);
})();
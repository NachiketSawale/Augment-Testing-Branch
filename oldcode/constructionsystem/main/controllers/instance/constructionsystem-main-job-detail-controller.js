/**
 * Created by wui on 4/11/2016.
 */

(function (angular) {
	'use strict';

	/* global globals */
	var moduleName = 'constructionsystem.main';


	angular.module(moduleName).controller('constructionSystemMainJobDetailController', [
		'$scope',
		'$http',
		'constructionSystemMainJobDataService',
		'basicsCommonFileDownloadService',
		'platformModalService',
		'constructionSystemMainInstanceService',
		function ($scope,
			$http,
			constructionSystemMainJobDataService,
			basicsCommonFileDownloadService,
			platformModalService,
			constructionSystemMainInstanceService) {

			var toolbarItems = [
				{
					id: 't-filter-off',
					caption: 'constructionsystem.main.taskBarFilter2QOff',
					type: 'item',
					iconClass: 'tlb-icons ico-filter-off',
					fn: restore,
					disabled: check(0)
				},
				{
					id: 't-filter',
					caption: 'constructionsystem.main.taskBarFilter2Q',
					type: 'dropdown-btn',
					iconClass: 'tlb-icons ico-filter',
					list: {
						showImages: false,
						cssClass: 'dropdown-menu-right',
						items: [
							{
								type: 'sublist',
								list: {
									items: [
										{
											id: 't-fit',
											caption: 'constructionsystem.main.taskBar2QFit',
											type: 'item',
											fn: load2QResult(1),
											disabled: check(1)
										}, {
											id: 't-fit-ids',
											caption: 'constructionsystem.main.taskBar2QFitIds',
											type: 'item',
											fn: load2QResult(2),
											disabled: check(2)
										},
										{
											id: 't-building-structure',
											caption: 'constructionsystem.main.taskBar2QBuildingStructure',
											type: 'item',
											fn: load2QResult(3),
											disabled: check(3)
										}, {
											id: 't-up-lift',
											caption: 'constructionsystem.main.taskBar2QUpLift',
											type: 'item',
											fn: load2QResult(4),
											disabled: check(4)
										},
										{
											id: 't-process-report',
											caption: 'constructionsystem.main.taskBar2QProcessReport',
											type: 'item',
											fn: load2QResult(5),
											disabled: check(5)
										}, {
											id: 't-result',
											caption: 'constructionsystem.main.taskBar2QResult',
											type: 'item',
											fn: load2QResult(6),
											disabled: check(6)
										},
										{
											id: 't-result-report',
											caption: 'constructionsystem.main.taskBar2QResultReport',
											type: 'item',
											fn: load2QResult(7),
											disabled: check(7)
										}
									]
								}
							}]
					}
				},
				{
					id: 'download',
					caption: 'constructionsystem.main.taskBarDownload2Q',
					type: 'item',
					iconClass: 'tlb-icons ico-download',
					fn: download2QResultZip,
					disabled: disableDownload2QResultZip
				},
				{
					id: 'inspect',
					caption: 'constructionsystem.main.taskBarInspect2Q',
					type: 'item',
					iconClass: 'tlb-icons ico-open1',
					fn: open2QInspector,
					disabled: disableDownload2QResultZip
				},
				{
					id: 'reset-uplift',
					caption: 'constructionsystem.main.taskBarResetUplift',
					type: 'item',
					iconClass: 'tlb-icons ico-reset',
					fn: resetUpliftCache,
					disabled: function () {
						return !constructionSystemMainInstanceService.getCurrentSelectedModelId();
					}
				}
			];

			$scope.model = '';

			constructionSystemMainJobDataService.registerSelectionChanged(loadLog);

			loadLog();

			$scope.$on('$destroy', function () {
				constructionSystemMainJobDataService.unregisterSelectionChanged(loadLog);
			});

			$http.get(globals.webApiBaseUrl + 'basics/common/systemoption/iskeep2qlog').then(function (res) {
				if(res.data === true){
					$scope.setTools({
						showImages: true,
						showTitles: true,
						cssClass: 'tools',
						items: toolbarItems
					});
				}
			});

			function loadLog() {
				var selected = constructionSystemMainJobDataService.getSelected();
				var resultId = constructionSystemMainJobDataService.twoQResultId;

				$scope.model = '';

				if (selected === null || selected === undefined) {
					return;
				}

				if (resultId > 0) {
					$http.get(globals.webApiBaseUrl + 'constructionsystem/main/job/twoqresult?id=' + selected.Id + '&resultId=' + resultId).then(function (response) {
						$scope.model = response.data;
					});
				}
				else {
					$http.get(globals.webApiBaseUrl + 'constructionsystem/main/job/log?id=' + selected.Id).then(function (response) {
						$scope.model = response.data;
					});
				}
			}

			function check(resultId) {
				return function () {
					return constructionSystemMainJobDataService.twoQResultId === resultId;
				};
			}

			function restore() {
				constructionSystemMainJobDataService.twoQResultId = 0;
				loadLog();
			}

			function load2QResult(resultId) {
				return function () {
					var selected = constructionSystemMainJobDataService.getSelected();

					$scope.model = '';

					if (constructionSystemMainJobDataService.twoQResultId === resultId) {
						constructionSystemMainJobDataService.twoQResultId = 0;
						loadLog();
						return;
					}

					constructionSystemMainJobDataService.twoQResultId = resultId;

					if (selected !== null && selected !== undefined) {
						$http.get(globals.webApiBaseUrl + 'constructionsystem/main/job/twoqresult?id=' + selected.Id + '&resultId=' + resultId).then(function (response) {
							$scope.model = response.data;
						});
					}
				};
			}

			function disableDownload2QResultZip() {
				var selected = constructionSystemMainJobDataService.getSelected();
				return selected === null || selected === undefined;
			}

			function download2QResultZip() {
				var selected = constructionSystemMainJobDataService.getSelected();

				if (selected === null || selected === undefined) {
					return;
				}

				$http.get(globals.webApiBaseUrl + 'constructionsystem/main/job/twoqresultdocid?id=' + selected.Id).then(function (response) {
					if (angular.isNumber(response.data)) {
						basicsCommonFileDownloadService.download(response.data);
					}
					else{
						platformModalService.showMsgBox('constructionsystem.main.msgNo2Q', 'constructionsystem.main.taskBarDownload2Q');
					}
				});
			}

			function open2QInspector() {
				var selected = constructionSystemMainJobDataService.getSelected();

				if (selected === null || selected === undefined) {
					return;
				}

				$http.get(globals.webApiBaseUrl + 'constructionsystem/main/job/twoqresultdocid?id=' + selected.Id).then(function (response) {
					if (angular.isNumber(response.data)) {
						var fileArchiveDocId = response.data;
						var url = 'qinspector://' + window.location.hostname;

						if (window.location.port) {
							url = url + ':' + window.location.port;
						}

						$http.post(globals.webApiBaseUrl + 'basics/common/document/preparedownload', {FileArchiveDocIds: fileArchiveDocId}).then(function (result) {
							url = url + globals.webApiBaseUrl + 'basics/common/document/download?security_token=' + result.data + '&id=' + fileArchiveDocId;
							window.open(url);
						});
					}
					else {
						platformModalService.showMsgBox('constructionsystem.main.msgNo2Q', 'constructionsystem.main.taskBarInspect2Q');
					}
				});
			}

			function resetUpliftCache() {
				const modelId = constructionSystemMainInstanceService.getCurrentSelectedModelId();

				if (!modelId) {
					return;
				}

				$http.get(globals.webApiBaseUrl + 'constructionsystem/main/job/clearupliftcache', {
					params: {
						modelId: modelId
					}
				}).then(res => {
					const success = res.data;
					platformModalService.showMsgBox('constructionsystem.main.' + (success ? 'msgUpliftCacheReset' : 'msgUpliftCacheNotFound'), 'constructionsystem.main.taskBarResetUplift', 'ico-info');
				});
			}
		}
	]);
})(angular);
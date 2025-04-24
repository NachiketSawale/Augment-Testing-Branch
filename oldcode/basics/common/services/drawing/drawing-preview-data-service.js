/**
 * Created by wui on 12/20/2018.
 */

(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).factory('basicsCommonDrawingPreviewDataService', ['$http', 'globals', '_', '$injector', '$timeout',
		function ($http, globals, _, $injector, $timeout) {
			const service = {};

			service.previewById = function (id) {
				if (('' + id).match(/^[0-9]+$/))
					return $http.get(globals.webApiBaseUrl + 'basics/common/document/previewdrawing?fileArchiveDocId=' + id);
				else
					return $http.get(globals.webApiBaseUrl + 'basics/common/document/previewdatengutdrawing?archiveElementId=' + id);
			};

			service.checkDocumentCanPreview = function checkDocumentCanPreview(dataService, entity, isDownload) {
				if (!entity) {
					return false;
				}
				if (entity.Url && entity.Url.length > 0) {
					return true;
				}
				const documentTypes = $injector.get('basicsLookupdataLookupDescriptorService').getData('DocumentType');
				let typeItem = _.find(documentTypes, {Id: entity.DocumentTypeFk});
				const extensionName = entity.OriginFileName ? entity.OriginFileName.split('.').pop().trim().toLowerCase() : '';

				if (!typeItem && entity.OriginFileName) {
					typeItem = _.find(documentTypes, {Extension: extensionName}) ||
						_.find(documentTypes, item => item.Extension && item.Extension.includes(extensionName));
				}
				if (typeItem && typeItem.AllowPreview) {
					return true;
				}
				return !!(entity.OriginFileName || entity.Url);
			};

			service.updateToolForPreviewInTab = function (scope) {
				if (!scope.tools) {
					return;
				}
				const previewProgram = _.find(scope.tools.items, {id: 'previewProgram'});
				if (!previewProgram || !previewProgram.list) {
					return;
				}
				const previewTabItem = _.find(previewProgram.list.items, {id: 'previewInTab'});
				if (!previewTabItem) {
					return;
				}
				previewTabItem.value = service.openPreviewInSameTab;
				scope.tools.update();
			}
			let getPreviewSameTabTimer;
			service.getPreviewSameTab = function (scope) {
				$timeout.cancel(getPreviewSameTabTimer);
				getPreviewSameTabTimer = $timeout(function () {
					$http.get(globals.webApiBaseUrl + 'basics/common/document/getdocumentdefinitions')
						.then(function (result) {
							const definitionData = _.find(result.data, {FilterName: 'OpenPreviewTab'});
							service.openPreviewInSameTab = definitionData?.FilterDef === 'true';// default false when no record
							service.updateToolForPreviewInTab(scope);
						});
				}, 1000);
			}
			service.setPreviewSameTab = function setPreviewSameTab(isSameTab) {
				const documentPreviewItem = {
					FilterName: 'OpenPreviewTab',
					AccessLevel: 'User',
					FilterDef: isSameTab
				};
				service.openPreviewInSameTab = isSameTab;
				$http.post(globals.webApiBaseUrl + 'basics/common/document/savedocumentdefinition', documentPreviewItem);
			};
			return service;
		}
	]);

})(angular);

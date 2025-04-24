/**
 * Created by lja on 2016-2-4.
 */
(function (angular) {
	'use strict';

	angular.module('documents.project').factory('documentsProjectDocumentModuleContext',
		[function () {

			// may remove to data service
			var curModuleName,
				parentService,
				columnConfig,
				title,
				fromModuleName,
				otherFilter,
				processors,
				readonly,

				// please reset in your controller when module destroy, cause the gridId is same on other containers
				setReadOnlyByMainEntity;

			function getConfig() {
				return {
					moduleName: curModuleName,
					parentService: parentService,
					columnConfig: columnConfig,
					title: title,
					fromModuleName: fromModuleName,
					otherFilter: otherFilter,
					processors: processors,
					readonly: readonly,
					setReadOnlyByMainEntity: setReadOnlyByMainEntity
				};
			}

			function setConfig(options) {
				curModuleName = options.moduleName;
				parentService = options.parentService;
				columnConfig = options.columnConfig;
				title = options.title || options.moduleName;
				fromModuleName = options.fromModuleName || options.moduleName;
				otherFilter = options.otherFilter;
				processors = options.processors;
				readonly = options.readonly;
				setReadOnlyByMainEntity = options.setReadOnlyByMainEntity;
			}

			return {
				getConfig: getConfig,
				setConfig: setConfig
			};
		}]);
})(angular);
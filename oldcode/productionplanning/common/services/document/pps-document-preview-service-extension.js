/**
 * Created by las
 */
(function () {
	'use strict';
	/* global angular, _*/
	var moduleName = 'productionplanning.common';

	angular.module(moduleName).factory('PpsCommonDocumentPreviewServiceExtension', previewExtension);

	previewExtension.$inject = ['$injector'];

	function previewExtension($injector) {

		function previewInSystemDefault() {
			return !($injector.get('transportplanningTransportUtilService').hasShowContainer('model.wdeviewer.ige', false));
		}

		return {
			previewInSystemDefault: previewInSystemDefault
		};
	}
})();

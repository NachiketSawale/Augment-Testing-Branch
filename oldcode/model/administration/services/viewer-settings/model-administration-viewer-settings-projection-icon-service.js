/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var myModule = angular.module('model.administration');

	/**
	 * @ngdoc service
	 * @name modelAdministrationViewerSettingsProjectionIconService
	 * @description Provides the list of eligible items for the viewer projection.
	 */
	myModule.service('modelAdministrationViewerSettingsProjectionIconService', ['platformIconBasisService',
		function (platformIconBasisService) {
			platformIconBasisService.setBasicPath('');

			var icons = [
				platformIconBasisService.createCssIconWithId('p', 'model.viewer.projectionPerspective', 'tlb-icons ico-view-perspective'),
				platformIconBasisService.createCssIconWithId('o', 'model.viewer.projectionOrthograph', 'tlb-icons ico-view-orthographic')
			];

			platformIconBasisService.extend(icons, this);
		}]);
})();

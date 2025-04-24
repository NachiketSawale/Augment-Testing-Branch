/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var myModule = angular.module('model.administration');

	/**
	 * @ngdoc service
	 * @name modelAdministrationViewerSettingsDefaultViewIconService
	 * @description Provides the list of eligible items for the viewer default view.
	 */
	myModule.service('modelAdministrationViewerSettingsDefaultViewIconService', ['_', 'platformIconBasisService',
		'modelViewerHoopsUtilitiesService',
		function (_, platformIconBasisService, modelViewerHoopsUtilitiesService) {
			platformIconBasisService.setBasicPath('');

			var icons = _.map(modelViewerHoopsUtilitiesService.getDefaultViews(), function (v) {
				return platformIconBasisService.createCssIconWithId(v.id, v.title, 'tlb-icons ico-view-' + v.iconId);
			});

			platformIconBasisService.extend(icons, this);
		}]);
})();

(function (angular) {

	'use strict';
	var moduleName = 'project.main';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name prjMainBoqChangeOverviewController
	 * @function
	 *
	 * @description
	 *
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angModule.controller('prjMainBoqChangeOverviewController',
		['$scope','$injector', 'platformGridControllerService', 'prjMainBoqChangeOverviewUIStandardService', 'prjMainBoqChangeOverviewService',
			'platformToolbarService',
			function ($scope,$injector, platformGridControllerService, prjMainBoqChangeOverviewUIStandardService,
				prjMainBoqChangeOverviewService,platformToolbarService) {

				var containeruuid = '39d0fd4bf4ba4cd697d3b9198b321d9b';
				var myGridConfig = {
					initCalled: false, columns: [],
					cellChangeCallBack: function cellChangeCallBack() {
					},
					type: 'prjBoqChangeOverview'
				};

				platformGridControllerService.initListController($scope, prjMainBoqChangeOverviewUIStandardService, prjMainBoqChangeOverviewService, null, myGridConfig);

				var toolItems = _.filter(platformToolbarService.getTools(containeruuid), function (item) {
					return item && item.id !== 'create' && item.id !== 'delete' && item.id !== 'createChild' && item.id !== 'd0' && item.id !== 't14' &&
						item.id !== 't199' && item.id !== 'fixbutton' && item.type !== 'overflow-btn';
				});

				platformToolbarService.removeTools(containeruuid);

				$scope.setTools({
					showImages: true,
					showTitles: true,
					cssClass: 'tools',
					items: toolItems
				});
			}
		]);
})(angular);
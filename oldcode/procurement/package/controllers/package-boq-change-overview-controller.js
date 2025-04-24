/**
 * Created by Badugula on 20.10.2020.
 */
(function (angular) {
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	'use strict';
	var moduleName = 'procurement.package';
	var angModule = angular.module(moduleName);

	/**
     * @ngdoc controller
     * @name packageBoqChangeOverviewController
     * @function
     *
     * @description
     * Controller for the  list of procurement package BoQ Change overview entities
     **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angModule.controller('packageBoqChangeOverviewController',
		['$scope','$injector', 'platformGridControllerService', 'prcPackageBoqChangeOverviewUIStandardService', 'prcPackageBoqChangeOverviewService',
			'platformToolbarService',
			function ($scope,$injector, platformGridControllerService, prcPackageBoqChangeOverviewUIStandardService,
				prcPackageBoqChangeOverviewService,platformToolbarService) {

				var containeruuid = '303ec5db40624e68a858065a0b1a6b8d';
				var myGridConfig = {
					initCalled: false, columns: [],
					cellChangeCallBack: function cellChangeCallBack() {

					},
					type: 'prcBoqChangeOverview'
				};

				platformGridControllerService.initListController($scope, prcPackageBoqChangeOverviewUIStandardService, prcPackageBoqChangeOverviewService, null, myGridConfig);

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


/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	let moduleName = 'estimate.assemblies';

	/**
	 * @ngdoc service
	 * @name estimateAssembliesViewService
	 * @function
	 * @requires $q
	 *
	 * @description
	 * data service to view Assemblies used in Assemly resources
	 */
	/* jshint -W072 */
	angular.module(moduleName).factory('estimateAssembliesViewService', [
		'$q', '$window', '$http', 'platformContextService', 'platformModalService',
		function ($q, $window, $http, platformContextService, platformModalService) {

			let service = {
				showAssembliesViewPortalDialog : showAssembliesViewPortalDialog
			};

			let winPromise = function (winAssemblyItem) {
				let defer = $q.defer();
				let companyCode = platformContextService.getApplicationValue('desktop-headerInfo').companyName.split(' ')[0];
				let roleId = platformContextService.getContext().permissionRoleId;
				let api = '#/api?module=estimate.assemblies&company=' + companyCode + '&roleid=' + roleId;
				let url = $window.location.origin + globals.appBaseUrl + api;
				$window.winEstAssemblyItem = winAssemblyItem;
				$window.selectedEntityID = winAssemblyItem.EstAssemblyCatFk;
				let win = $window.open(url, '_blank');

				if (win) {
					defer.resolve(win);
				}else {
					defer.reject('Open window failed - Please ensure that no popup-blocker is activated!');
				}
				return defer.promise;
			};

			function showAssembliesViewPortalDialog(resAssemblyItem) {
				let assemblyId = resAssemblyItem ? resAssemblyItem.EstAssemblyFk : -1;
				let headerId = resAssemblyItem ? resAssemblyItem.EstHeaderFk : -1;
				$http.get(globals.webApiBaseUrl + 'estimate/assemblies/getassembly?id=' + assemblyId +'&estHeaderFk='+ headerId).then(function(response){
					let winAssemblyItem = response ? response.data : {};
					winPromise(winAssemblyItem).then(function successFn(win) {
						win.focus();
					}, function failedFn(reason) {
						let modalOptions = {
							headerTextKey: 'estimate.assemblies.gotoAssembly',
							bodyTextKey: reason,
							showOkButton: true,
							iconClass: 'ico-warning'
						};
						platformModalService.showDialog(modalOptions);
						return;
					});
				});
			}

			return service;
		}
	]);
})(angular);

/**
 * Created by wui on 12/15/2015.
 */

(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.master';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('constructionsystemMasterScriptController', [
		'$scope',
		'constructionsystemMasterScriptDataService',
		'basicsCommonScriptControllerService',
		'constructionSystemMasterScriptArgService',
		'constructionsystemMasterDefControllerService',
		'constructionSystemMasterHeaderService',
		'constructionSystemMasterOutputDataService',
		function (
			$scope,
			constructionsystemMasterScriptDataService,
			basicsCommonScriptControllerService,
			constructionSystemMasterScriptArgService,
			constructionsystemMasterDefControllerService,
			constructionSystemMasterHeaderService,
			constructionSystemMasterOutputDataService) {

			var codeMirror;
			var options = {
				scriptId: 'construction.system.master.script',
				apiId: 'ConstructionSystem.Master',
				argService: constructionSystemMasterScriptArgService,
				trSource: 'constructionsystem.master.script',
				onInit: function (cm) {
					codeMirror = cm;
				},
				apiVersion: 2 // ClearScript engine
			};

			$scope.service = constructionsystemMasterScriptDataService;

			constructionsystemMasterDefControllerService.init($scope, constructionSystemMasterHeaderService, constructionsystemMasterScriptDataService);

			basicsCommonScriptControllerService.initController($scope, options);

			$scope.service.setContainerReadOnly($scope);

			constructionSystemMasterOutputDataService.registerSelectionChanged(onOutputSelectionChanged);

			// set cursor to location specified by output data while selecting a output item.
			function onOutputSelectionChanged() {
				if (!codeMirror) {
					return;
				}

				var output = constructionSystemMasterOutputDataService.getSelected();
				if(angular.isNumber(output.Line)){
					codeMirror.setCursor(output.Line - 1, output.Column);
					setTimeout(function () {
						codeMirror.focus();
					}, 100);
				}
			}

			var uuid = $scope.getContentValue('uuid');

			constructionsystemMasterScriptDataService.addUsingContainer(uuid);

			$scope.$on('$destroy', function () {
				constructionsystemMasterScriptDataService.removeUsingContainer(uuid);
				constructionSystemMasterOutputDataService.unregisterSelectionChanged(onOutputSelectionChanged);
			});
		}
	]);

})(angular);
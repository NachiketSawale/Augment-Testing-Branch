/**
 * Created by janas on 28.07.2015.
 */
/* global globals, _ */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainSelectEstimateHeaderDialog', ['platformModalService',
		function (platformModalService) {

			return {
				showDialog: function (allProjects, estHeaders) {

					let curEstHeaders = [];
					let projectEntity = _.filter(allProjects, {Id: estHeaders[0].PrjEstimate.PrjProjectFk})[0];

					let modalOptions = {
						templateUrl: globals.appBaseUrl + 'estimate.main/templates/select-estheader-modal.html',
						controller: ['$scope', '$translate', '$modalInstance', function ($scope, $translate, $modalInstance) {
							$scope.modalOptions = {
								actionButtonText: $translate.instant('cloud.common.ok'),
								labelProject: $translate.instant('estimate.main.selectEstHeaderDialogProject'),
								labelEstHeader: $translate.instant('estimate.main.selectEstHeaderDialogEstHeader'),
								headerText: $translate.instant('estimate.main.selectEstHeaderDialogHeaderText')
							};
							$scope.result = {
								project: projectEntity
							};
							$scope.selectPrjOptions = {
								displayMember: 'ProjectName',
								valueMember: 'Id',
								projectInfo: (allProjects.length === 1) ? allProjects[0].ProjectNo + ' - ' + allProjects[0].ProjectName : null,
								isSelectPrj: allProjects.length > 1,
								items: allProjects
							};
							$scope.projectChanged = function (prjItem) {
								curEstHeaders.length = 0;
								_.each(estHeaders, function (item) {
									if (_.get(item, 'PrjEstimate.PrjProjectFk', -1) === prjItem.Id) {
										curEstHeaders.push(item);
									}
								});
								if (curEstHeaders.length > 0) {
									$scope.result.estimateHeader = curEstHeaders[0];
								}
							};
							$scope.projectChanged(projectEntity);
							$scope.selectHeaderOptions = {
								displayMember: 'displayMember',
								valueMember: 'Id',
								items: curEstHeaders
							};
							$scope.modalOptions.ok = function () {
								$modalInstance.close({
									Ok: true,
									project: $scope.result.project,
									estHeader: $scope.result.estimateHeader
								});
							};
						}],
						width: 'max',
						maxWidth: '350px'
					};

					return platformModalService.showDialog(modalOptions);
				}
			};
		}
	]);
})(angular);

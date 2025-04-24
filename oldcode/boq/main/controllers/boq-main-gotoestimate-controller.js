(function () {
	/* global globals, _ */
	'use strict';

	const angularModule = angular.module('boq.main');

	angularModule.controller('boqMainGoToEstimateController', ['$http', '$scope', '$injector', 'boqMainService', 'platformModuleNavigationService', 'platformDialogService',
		function ($http, $scope, $injector, boqMainService, platformModuleNavigationService, platformDialogService) {

			$scope.selectedEstimateHeader = {};

			$scope.dialog.getButtonById('ok').fn = function() {
				if (Object.keys($scope.selectedEstimateHeader).length !== 0)
				{
					$scope.$close({ok: true});
					var selectedEstimateHeader = $scope.selectedEstimateHeader;
					selectedEstimateHeader.ProjectId = boqMainService.getSelectedProjectId();
					var selectedBoqItem = boqMainService.getSelected();
					platformModuleNavigationService.navigate({moduleName: 'estimate.main-line-item-from-boq'}, selectedEstimateHeader, selectedBoqItem);
				}
				else
				{
					platformDialogService.showInfoBox('boq.main.selectEstimateHeader');
				}
			};

			$scope.estimateHeaderLookupOptions = {
				events: [
					{
						name: 'onSelectedItemChanged', handler: function selectedFromEstimateHeaderChanged(e, args) {
							$scope.selectedEstimateHeader = args.selectedItem;
						}
					},
				],
				dataServiceName: 'estimateBoqHeaderService',
				displayMember: 'Code',
				valueMember: 'Id',
				lookupModuleQualifier: 'estimateBoqHeaderService',
				lookupType: 'estimateBoqHeaderService',
				showClearButton: false,
				uuid: 'fdb216eba0cb4ef2b70e490cf380a6c9',
				disableDataCaching: true,
				filterOnSearchIsFixed: true,
				isClientSearch: true,
				filter: function () {
					var filterObj = {
						ProjectId: boqMainService.getSelectedProjectId(),
						BoqHeaderId: boqMainService.getSelected().BoqHeaderFk,
						BoqItemId: boqMainService.getSelected().Id,
					};
					return filterObj;
				},
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'Description',
						field: 'DescriptionInfo.Translated',
						name: 'Description',
						formatter: 'description',
						name$tr$: 'cloud.common.entityDescription'
					},
				],
				popupOptions: {
					width: 350
				}
			};
		}
	]);

	angularModule.factory('boqMainGoToEstimateService', ['$translate', 'platformDialogService',
		function($translate, platformDialogService) {
			var service = {};

			service.start = function() {

				var template = [];
				template += '<section class="modal-body">';
				template +=    '<div data-ng-controller="boqMainGoToEstimateController">';
				template +=       '<div class="platform-form-group" style="margin-top:10px">';
				template +=          '<div class="platform-form-row">';
				template +=            '<label class="platform-form-label">{{ \'boq.main.estimateHeader\' | translate }}</label>';
				template +=	              '<div class="platform-form-col">';
				template +=               '<div class="lg-4 md-4" data-basics-lookup-data-by-custom-data-service data-ng-model="selectedEstimateHeader.Id"  data-options="estimateHeaderLookupOptions"  data-entity="estimateHeaderEntity" >';
				template +=               '</div>';
				template +=               '</div>';
				template +=          '</div>';
				template +=       '</div>';
				template +=    '</div>';
				template += '</section>';

				platformDialogService.showDialog({
					headerText$tr$: 'boq.main.goToEstimate',
					bodyTemplate: template,
					showOkButton: true,
					showCancelButton: true,
					resizeable: true,
					minHeight: '350px',
					minWidth: '350px',
				});
			};

			return service;
		}
	]);
})();

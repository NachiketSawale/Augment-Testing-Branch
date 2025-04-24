/**
 * Created by leo on 08.04.2015.
 */
(function (angular) {
/* global globals */
	'use strict';

	angular.module('scheduling.lookup').directive('schedulingActivityTemplateLookupDialog', ['$q','$http', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($q, $http, BasicsLookupdataLookupDirectiveDefinition) {

			function gridDialogController($scope, $translate, $timeout, $modalInstance, schedulingLookupActivityTemplateService) {

				// setup modal-dialog style.
				$scope.options.width = '800px';
				$scope.options.maxWidth = '90%';
				$scope.options.maxHeight = '90%';
				$scope.options.minWidth = '500px';
				$scope.options.height = '500px';

				$scope.modalOptions = {
					cancelBtnText: $translate.instant('cloud.common.cancel'),
					okBtnText: $translate.instant('cloud.common.ok'),
					headerText: $translate.instant('scheduling.main.lookupAssignTemplate'),
					defaultButton: 'ok',
					disableOkButton: true
				};
				$scope.modalOptions.ok = function () {
					var item = schedulingLookupActivityTemplateService.getSelected();
					var result = {isOk: true, selectedItem: item};
					// $modalInstance.close(result);
					$scope.$close(result);
				};
				$scope.modalOptions.close = function () {
					// $modalInstance.dismiss('cancel');
					$scope.$dismiss('cancel');
				};

				$scope.modalOptions.cancel = function () {
					// $modalInstance.dismiss('cancel');
					$scope.$dismiss('cancel');
				};

				/**
				 * @ngdoc function
				 * @name onReturnButtonPress
				 * @methodOf platform.platformModalService.controller
				 * @description click event for the default button, when 'enter' key is pressed.
				 */
				$scope.modalOptions.onReturnButtonPress = function onReturnButtonPress() {
					if (!$scope.modalOptions.disableOkButton) {
						$scope.modalOptions.ok();
					}
				};

				$scope.modalOptions.btnMouseMoveHandler = function btnMouseMoveHandler() {
					event.stopPropagation();
					event.preventDefault();
				};

				function selectionChanged(){
					var item = schedulingLookupActivityTemplateService.getSelected();
					var value = true;
					if(item && item.Id) {
						value = false;
					}
					$scope.modalOptions.disableOkButton = value;
				}

				schedulingLookupActivityTemplateService.registerSelectionChanged(selectionChanged);

				$scope.$on('$destroy', function () {
					schedulingLookupActivityTemplateService.unregisterSelectionChanged(selectionChanged);
					$scope.modalOptions.close();
					$scope.modalOptions.disableOkButton = true;
				});
			}

			var list = [];
			var defaults = {
				lookupType: 'activitytemplatefk',
				valueMember: 'Id',
				displayMember: 'Code',
				resizeable: true,
				uuid: '329d39dc19ca45e6a61f02a255e3e8f7',
				dialogOptions: {
					headerText: 'Assign Templates',
					templateUrl: globals.appBaseUrl + 'scheduling.lookup/templates/activitytemplate-lookup-dialog.html',
					controller: ['$scope', '$translate', '$timeout', '$modalInstance', 'schedulingLookupActivityTemplateService', gridDialogController]
				},
				columns:[{
					id: 'code',
					field: 'Code',
					name: 'Code',
					name$tr$: 'cloud.common.entityCode',
					readonly: true
				},
				{
					id: 'description',
					field: 'DescriptionInfo',
					name: 'Description',
					name$tr$: 'cloud.common.entityDescription',
					formatter: 'translation',
					readonly: true
				}]
			};

			function getList() {
				return $http.get(globals.webApiBaseUrl + 'scheduling/template/activitytemplate/listall').then(function (response) {
					list = response.data;
					return list;
				});
			}

			return new BasicsLookupdataLookupDirectiveDefinition('input-base', defaults, {
				dataProvider: {
					myUniqueIdentifier: 'schedulingLookupTemplateGroupHandler',
					getList: getList,
					getItemByKey: function (value) {
						if(list.length < 1) {
							return getList().then(function(response) {
								list = response;
								for (var i = 0; i < list.length; i++) {
									if (list[i].Id === value) {
										return list[i];
									}
								}
							});
						}
					},
					getSearchList: function () {
						return list;
					}
				}
			});
		}
	]);

})(angular);

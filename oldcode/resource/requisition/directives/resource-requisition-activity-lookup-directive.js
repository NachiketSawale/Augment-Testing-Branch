(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name resourceRequisitionActivityLookup
	 * @requires  $q, resourceRequisitionActivityLookupDataService
	 * @description ComboBox to select a activity template
	 */

	angular.module('resource.requisition').directive('resourceRequisitionActivityLookup', ['_', '$q', 'resourceRequisitionActivityLookupDataService', 'BasicsLookupdataLookupDirectiveDefinition',
		function (_, $q, resourceRequisitionActivityLookupDataService, BasicsLookupdataLookupDirectiveDefinition) {

			function gridDialogController($scope, $translate, $modalInstance, resourceRequisitionActivityLookupDataService, platformTranslateService, basicsLookupdataConfigGenerator) {

				var detailConfig = {
					fid: 'scheduling.main.selectionfilter',
					version: '1.0.0',
					showGrouping: false,
					groups: [
						{
							gid: 'selectionfilter',
							isOpen: true,
							visible: true,
							sortOrder: 1
						}
					],
					rows: [{
						gid: 'selectionfilter',
						rid: 'project',
						label$tr$: 'cloud.common.entityProject',
						type: 'directive',
						directive: 'basics-lookup-data-project-project-dialog',
						options: {
							showClearButton: true
						},
						model: 'projectFk',
						required: true,
						sortOrder: 1,
						change: function () {
							change('projectFk');
						}
					},
					basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
						dataServiceName: 'schedulingLookupScheduleDataService',
						desMember: 'DescriptionInfo.Translated',
						isComposite: true,
						filter: function (item) {
							return !_.isNil(item.projectFk) ? item.projectFk : -1;
						},
						showClearButton: true
					},
					{
						gid: 'selectionfilter',
						rid: 'schedule',
						label: 'Schedule',
						label$tr$: 'scheduling.schedule.entitySchedule',
						type: 'integer',
						model: 'scheduleFk',
						sortOrder: 2,
						change: function () {
							change('scheduleFk');
						},
						required: true
					})]
				};

				var entity = {};
				entity.projectFk = null;
				entity.scheduleFk = null;

				var formConfig = platformTranslateService.translateFormConfig(detailConfig);
				formConfig.dirty = function () {
					angular.noop();
				};

				function change(model) {
					resourceRequisitionActivityLookupDataService.setSelectedFilter(model, $scope.request[model], filter);
				}

				var filter = ['projectFk', 'scheduleFk'];

				$scope.formOptions = {
					configure: platformTranslateService.translateFormConfig(formConfig)
				};
				$scope.request = entity;
				//setup modal-dialog style.
				$scope.options.width = '800px';
				$scope.options.maxWidth = '90%';
				$scope.options.maxHeight = '90%';
				$scope.options.minWidth = '500px';

				$scope.modalOptions = {
					closeButtonText: $translate.instant('cloud.common.cancel'),
					actionButtonText: $translate.instant('cloud.common.ok'),
					headerText: $translate.instant('resource.requisition.lookupAssignActivity')
				};
				$scope.modalOptions.ok = function (result) {
					var item = resourceRequisitionActivityLookupDataService.getSelected();
					result = $.extend(result, {isOk: true, selectedItem: item});
					$modalInstance.close(result);
				};
				$scope.modalOptions.close = function () {
					$modalInstance.dismiss('cancel');
				};
				$scope.modalOptions.cancel = function () {
					$modalInstance.dismiss('cancel');
				};

				$scope.modalOptions.disableOkButton = true;

				function selectionChanged(item) {
					var value = true;
					if (item && item.Id) {
						value = false;
					}
					$scope.modalOptions.disableOkButton = value;
				}

				resourceRequisitionActivityLookupDataService.selectionChanged.register(selectionChanged);

				$scope.$on('$destroy', function () {
					// resourceRequisitionActivityLookupDataService.unregisterSelectionChanged(selectionChanged);
					$scope.modalOptions.close();
					$scope.modalOptions.disableOkButton = true;
				});
			}

			var defaults = {
				lookupType: 'resourceactivityfk',
				valueMember: 'Id',
				displayMember: 'Code',
				dialogOptions: {
					headerText: 'Assign Activities',
					templateUrl: globals.appBaseUrl + 'resource.requisition/templates/resource-project-schedule-activity-lookup.html',
					controller: ['$scope', '$translate', '$modalInstance', 'resourceRequisitionActivityLookupDataService', 'platformTranslateService', 'basicsLookupdataConfigGenerator', gridDialogController]
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('input-base', defaults, {
				dataProvider: {
					myUniqueIdentifier: 'resourceactivityfk',

					getList: function (options) {
						var deferred = $q.defer();

						deferred.resolve(resourceRequisitionActivityLookupDataService.getList(options));
						return deferred.promise;
					},

					getDefault: function (options) {
						return resourceRequisitionActivityLookupDataService.getDefault(options);
					},

					getItemByKey: function (value, options) {
						return resourceRequisitionActivityLookupDataService.getItemById(value, options);
					},

					getSearchList: function (options) {
						return resourceRequisitionActivityLookupDataService.getList(options);
					}
				}
			});
		}
	]);

})(angular);

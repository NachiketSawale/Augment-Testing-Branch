/**
 * Created by leo on 09.11.2017.
 */
(function (angular) {
	/* global globals */

	'use strict';

	/**
	 * @ngdoc directive
	 * @name resourceReservationLookupFilterDialog
	 * @requires $q, resourceReservationLookupDataService
	 * @description ComboBox to select a activity template
	 */

	angular.module('resource.reservation').directive('resourceReservationLookupFilterDialog', ['$q', 'resourceReservationLookupDataService', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($q, resourceReservationLookupDataService, BasicsLookupdataLookupDirectiveDefinition) {

			function gridDialogController($scope, $translate, $modalInstance, resourceReservationLookupDataService, platformTranslateService, basicsLookupdataConfigGenerator) {

				var detailConfig = {
					fid: 'resource.reservation.selectionfilter',
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
					rows: [basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
						dataServiceName: 'resourceRequisitionLookupDataService',
						cacheEnable: true,
						additionalColumns: false,
						showClearButton: true
					},
					{
						gid: 'selectionfilter',
						rid: 'requisition',
						label: 'Requisition',
						label$tr$: 'resource.requisition.entityRequisition',
						type: 'integer',
						model: 'requisitionFk',
						sortOrder: 1,
						change: function () {
							change('requisitionFk');
						}
					}),
					basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
						dataServiceName: 'resourceResourceLookupDataService',
						cacheEnable: true,
						additionalColumns: false,
						showClearButton: true
					},
					{
						gid: 'selectionfilter',
						rid: 'resource',
						label: 'Resource',
						label$tr$: 'resource.master.entityResource',
						type: 'integer',
						model: 'resourceFk',
						sortOrder: 2,
						change: function () {
							change('resourceFk');
						}
					}),
					{
						gid: 'selectionfilter',
						rid: 'reservedfrom',
						label: 'Reserved From',
						label$tr$: 'resource.reservation.entityReservedFrom',
						type: 'dateutc',
						model: 'reservedFrom',
						sortOrder: 3,
						change: function () {
							change('reservedFrom');
						}
					},
					{
						gid: 'selectionfilter',
						rid: 'reservedto',
						label: 'Reserved To',
						label$tr$: 'resource.reservation.entityReservedTo',
						type: 'dateutc',
						model: 'reservedTo',
						sortOrder: 4,
						change: function () {
							change('reservedTo');
						}
					}]
				};

				function change(model){
					resourceReservationLookupDataService.setSelectedFilter(model, $scope.request[model]);
				}
				var formConfig = platformTranslateService.translateFormConfig(detailConfig);
				formConfig.dirty = function(){
					angular.noop();
				};

				var entity = {};
				entity.requisitionFk = null;
				entity.resourceFk = null;
				entity.reservedFrom = null;
				entity.reservedTo = null;

				$scope.formOptions = {
					configure: formConfig,
					onLeaveLastRow: function(){
						resourceReservationLookupDataService.loadSelected();
						$scope.modalOptions.disableOkButton = true;}
				};
				$scope.request = entity;

				// $scope.$on('$destroy', unregister);
				// setup modal-dialog style.
				$scope.options.width = '800px';
				$scope.options.maxWidth = '90%';
				$scope.options.maxHeight = '90%';
				$scope.options.minWidth = '500px';

				$scope.modalOptions = {
					closeButtonText: $translate.instant('cloud.common.cancel'),
					actionButtonText: $translate.instant('cloud.common.ok'),
					refreshButtonText: $translate.instant('resource.reservation.refreshButtonText'),
					headerText: $translate.instant('resource.reservation.lookupAssignReservation')
				};

				$scope.modalOptions.ok = function (result) {
					var item = resourceReservationLookupDataService.getSelected();
					result = $.extend(result, {isOk: true, selectedItem: item});
					$modalInstance.close(result);
				};
				$scope.modalOptions.close = function () {
					$modalInstance.dismiss('cancel');
				};
				$scope.modalOptions.cancel = function () {
					$modalInstance.dismiss('cancel');
				};
				$scope.modalOptions.refresh = function () {
					resourceReservationLookupDataService.loadSelected();
					$scope.modalOptions.disableOkButton = true;
				};

				$scope.modalOptions.disableOkButton = true;

				function selectionChanged(item){
					var value = true;
					if(item && item.Id) {
						value = false;
					}
					$scope.modalOptions.disableOkButton = value;
				}

				resourceReservationLookupDataService.selectionChanged.register(selectionChanged);

				$scope.$on('$destroy', function () {
					$scope.modalOptions.close();
					$scope.modalOptions.disableOkButton = true;
				});
			}

			var defaults = {
				lookupType: 'resourceReservationFk',
				valueMember: 'Id',
				displayMember: 'Description',
				dialogOptions: {
					headerText: 'Assign Reservations',
					templateUrl: globals.appBaseUrl + 'resource.reservation/templates/resource-reservation-lookup-dialog.html',
					controller: ['$scope', '$translate', '$modalInstance', 'resourceReservationLookupDataService', 'platformTranslateService', 'basicsLookupdataConfigGenerator',  gridDialogController]
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('input-base', defaults, {
				dataProvider: {
					myUniqueIdentifier: 'resourceReservationFk',

					getList: function (options) {
						var deferred = $q.defer();

						deferred.resolve(resourceReservationLookupDataService.getList(options));
						return deferred.promise;
					},

					getDefault: function (options) {
						return resourceReservationLookupDataService.getDefault(options);
					},

					getItemByKey: function (value, options) {
						return resourceReservationLookupDataService.getItemById(value, options);
					},

					getSearchList: function (options) {
						return resourceReservationLookupDataService.getList(options);
					}
				}
			});
		}
	]);
})(angular);

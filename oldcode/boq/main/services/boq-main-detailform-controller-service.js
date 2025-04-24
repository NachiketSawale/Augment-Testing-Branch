/**
 * Created by bh on 19.12.2014.
 */
(function () {
	/* global _ */
	'use strict';
	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name boqMainDetailFormControllerService
	 * @function
	 *
	 * @description
	 * boqMainDetailFormControllerService is the service to initialize the mentioned controller.
	 */
	angular.module(moduleName).factory('boqMainDetailFormControllerService', ['boqMainChangeService', '$translate', 'boqMainCrbService', '$injector', 'basicsCommonDynamicConfigurationServiceFactory',
		function (boqMainChangeService, $translate, boqMainCrbService, $injector, basicsCommonDynamicConfigurationServiceFactory) {

			// The instance of the main service - to be filled with functionality below
			var service = {};

			/**
			 * @ngdoc function
			 * @name initDetailFormController
			 * @function
			 * @methodOf boqMainDetailFormControllerService
			 * @description This function handles the initialization of the boq detail form controller in whose context it is called
			 */
			/* jshint -W072 */ // many parameters because of dependency injection
			service.initDetailFormController = function initDetailFormController($scope, $timeout, platformDetailControllerService, boqMainService, boqMainValidationServiceProvider, boqMainStandardConfigurationService, boqMainTranslationService, boqMainDetailFormConfigService, boqMainCommonService/* , platformModalService */) {
				var boqMainElementValidationService = boqMainValidationServiceProvider.getInstance(boqMainService);
				boqMainStandardConfigurationService.setCurrentBoqMainService(boqMainService);
				boqMainStandardConfigurationService.isDynamicReadonlyConfig = true;
				platformDetailControllerService.initDetailController($scope, boqMainService, boqMainElementValidationService, boqMainStandardConfigurationService, boqMainTranslationService);

				// By giving the dirty funtion a new body we have the chance to react on changes of the properties displayed in the detail form.
				// By calling the oldDirty implementation we ensure that the old behavior of dirty still works.
				var oldDirty = $scope.formOptions.configure.dirty;

				$scope.formOptions.configure.dirty = function dirty(entity, field, options) {
					boqMainChangeService.reactOnChangeOfBoqItem(entity, field, boqMainService, boqMainCommonService);

					if (oldDirty) {
						oldDirty(entity, field, options);
					}
				};

				function selectedItemChanged(arg,entity) {

					let fields = [];
					fields.push({field: 'ColVal1', readonly: true});
					fields.push({field: 'ColVal2', readonly: true});
					fields.push({field: 'ColVal3', readonly: true});
					fields.push({field: 'ColVal4', readonly: true});
					fields.push({field: 'ColVal5', readonly: true});

					if (entity && (!(boqMainCommonService.isPositionType(entity.BoqLineTypeFk) || boqMainCommonService.isSurchargeItem(entity)))) {
						$injector.get('platformRuntimeDataService').readonly(entity, fields);
					}
				}

				function onBoqItemCreateSucceeded(createdBoqItem) {
					// bre:
					// This is a workaround for the not fired event 'SelectionChanged' which ensures that the data of this detail container are updated.
					// By default it is implemented in function 'platformDetailControllerService.loadCurrentItem'.
					$scope.currentItem = createdBoqItem;
				}

				boqMainService.registerSelectionChanged(selectedItemChanged);
				boqMainService.boqItemCreateSucceeded.register(onBoqItemCreateSucceeded);
				boqMainService.registerLookupFilters();

				function selectedBoqHeaderChanged() {
					refresh();
				}

				let boqMainExtendConfigurationService = boqMainService.getCommonDynamicConfigurationService();
				boqMainExtendConfigurationService.setConfigurationServiceAndValidationService(boqMainStandardConfigurationService, boqMainElementValidationService);

				boqMainService.selectedBoqHeaderChanged.register(selectedBoqHeaderChanged);

				function refresh() {
					/* jshint -W074 */ // -> no cyclomatic complexity
					$timeout(function () {
						var structure = boqMainService.getStructure();
						if (structure) {
							// update details form

							refreshDetailForDynamicColumn();

							var nameUrb1 = angular.isDefined(structure.NameUrb1) && !_.isEmpty(structure.NameUrb1) ? structure.NameUrb1 : $translate.instant('boq.main.Urb1');
							var nameUrb2 = angular.isDefined(structure.NameUrb2) && !_.isEmpty(structure.NameUrb2) ? structure.NameUrb2 : $translate.instant('boq.main.Urb2');
							var nameUrb3 = angular.isDefined(structure.NameUrb3) && !_.isEmpty(structure.NameUrb3) ? structure.NameUrb3 : $translate.instant('boq.main.Urb3');
							var nameUrb4 = angular.isDefined(structure.NameUrb4) && !_.isEmpty(structure.NameUrb4) ? structure.NameUrb4 : $translate.instant('boq.main.Urb4');
							var nameUrb5 = angular.isDefined(structure.NameUrb5) && !_.isEmpty(structure.NameUrb5) ? structure.NameUrb5 : $translate.instant('boq.main.Urb5');
							var nameUrb6 = angular.isDefined(structure.NameUrb6) && !_.isEmpty(structure.NameUrb6) ? structure.NameUrb6 : $translate.instant('boq.main.Urb6');

							var nameUserdefined1 = angular.isDefined(structure.NameUserdefined1) && !_.isEmpty(structure.NameUserdefined1) ? structure.NameUserdefined1 : $translate.instant('cloud.common.entityUserDefined') + ' 1';
							var nameUserdefined2 = angular.isDefined(structure.NameUserdefined2) && !_.isEmpty(structure.NameUserdefined2) ? structure.NameUserdefined2 : $translate.instant('cloud.common.entityUserDefined') + ' 2';
							var nameUserdefined3 = angular.isDefined(structure.NameUserdefined3) && !_.isEmpty(structure.NameUserdefined3) ? structure.NameUserdefined3 : $translate.instant('cloud.common.entityUserDefined') + ' 3';
							var nameUserdefined4 = angular.isDefined(structure.NameUserdefined4) && !_.isEmpty(structure.NameUserdefined4) ? structure.NameUserdefined4 : $translate.instant('cloud.common.entityUserDefined') + ' 4';
							var nameUserdefined5 = angular.isDefined(structure.NameUserdefined5) && !_.isEmpty(structure.NameUserdefined5) ? structure.NameUserdefined5 : $translate.instant('cloud.common.entityUserDefined') + ' 5';

							if (angular.isDefined($scope.formOptions) && ($scope.formOptions !== null) && angular.isDefined($scope.formOptions.setLabel) && _.isFunction($scope.formOptions.setLabel)) {
								$scope.formOptions.setLabel('urb1', nameUrb1);
								$scope.formOptions.setLabel('urb2', nameUrb2);
								$scope.formOptions.setLabel('urb3', nameUrb3);
								$scope.formOptions.setLabel('urb4', nameUrb4);
								$scope.formOptions.setLabel('urb5', nameUrb5);
								$scope.formOptions.setLabel('urb6', nameUrb6);
								$scope.formOptions.setLabel('userdefined1', nameUserdefined1);
								$scope.formOptions.setLabel('userdefined2', nameUserdefined2);
								$scope.formOptions.setLabel('userdefined3', nameUserdefined3);
								$scope.formOptions.setLabel('userdefined4', nameUserdefined4);
								$scope.formOptions.setLabel('userdefined5', nameUserdefined5);

								$scope.$broadcast('form-config-updated');
							}
						}
					}, 0);
				}

				// Redirect functions for create and createChild buttons to specific functions in boqMainsService
				$scope.formContainerOptions.createBtnConfig.fn = boqMainService.createNewItem;
				$scope.formContainerOptions.createChildBtnConfig.fn = boqMainService.createNewSubDivision;

				boqMainService.boqStructureReloaded.register(refresh);

				/* add costGroupService to mainService */
				if (!boqMainService.costGroupService) {
					boqMainService.costGroupService = $injector.get('boqMainCostGroupFactory').createService(boqMainService);
				}

				/* refresh the columns configuration when controller is created */
				refreshDetailForDynamicColumn();

				function refreshDetailForDynamicColumn(){
					let costGroupDetailOption = {
						scope: $scope,
						dataService: boqMainService,
						validationService: boqMainElementValidationService,
						formConfiguration: boqMainStandardConfigurationService,
						costGroupName: 'Assignments'
					};

					// refresh dynamic columns
					boqMainExtendConfigurationService.refreshDetailGridLayout($scope, {costGroupOption: costGroupDetailOption});
				}

				boqMainService.registerListLoaded(refreshDetailForDynamicColumn);

				// unregister subscription
				$scope.$on('$destroy', function () {
					boqMainService.unregisterSelectionChanged(selectedItemChanged);
					boqMainService.selectedBoqHeaderChanged.unregister(selectedBoqHeaderChanged);
					boqMainService.boqItemCreateSucceeded.unregister(onBoqItemCreateSucceeded);
					boqMainService.boqStructureReloaded.unregister(refresh);
					boqMainService.unregisterListLoaded(refreshDetailForDynamicColumn);
				});

				refresh();
			};

			return service;
		}]);
})();

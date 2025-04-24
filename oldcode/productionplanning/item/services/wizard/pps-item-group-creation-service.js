/**
 * Created by anl on 8/19/2020.
 */

(function (angular) {
	'use strict';
	/* global angular, Slick, globals, _, moment */

	var moduleName = 'productionplanning.item';

	angular.module(moduleName).service('productionplanningItemGroupCreationService', GroupCreationService);

	GroupCreationService.$inject = [
		'$q',
		'$http',
		'$injector',
		'platformTranslateService',
		'platformRuntimeDataService',
		'productionplanningItemGroupUIService',
		'productionplanningItemGroupSelectionService',
		'basicsLookupdataLookupDescriptorService'
	];

	function GroupCreationService(
		$q,
		$http,
		$injector,
		platformTranslateService,
		platformRuntimeDataService,
		groupUIService,
		groupSelectionService,
		basicsLookupdataLookupDescriptorService
	) {
		var service = {};
		var scope = {};
		var validation = false;
		var isBusy = false;
		var selectionResult = {};

		service.creationEntity = {};

		service.initialize = function initialize($scope) {
			isBusy = true;
			var creationForm = groupUIService.initCreationForm(service);
			$scope.formOptions = {
				configure: platformTranslateService.translateFormConfig(creationForm)
			};
			scope = $scope;
			service.active();
		};

		service.updateCreationForm = function updateCreationForm(entity) {
			service.creationEntity.Id = entity.Id;
			service.creationEntity.Code = entity.Code;
			service.creationEntity.LgmJobFk = entity.LgmJobFk;
			service.creationEntity.ProjectFk = entity.ProjectFk;

			service.validateUniqueCode(entity);
		};

		service.getResult = function () {
			return {
				creationEntity: service.creationEntity
			};
		};

		service.isValid = function isValid() {
			service.validateMandatoryFields();
			return validation;
		};

		service.unActive = function unActive() {
			var defer = $q.defer();
			defer.resolve(true);
			return defer.promise;
		};

		service.active = function active() {
			initData(scope).then(function (response) {
				service.validateMandatoryFields();
				isBusy = !response;
			});
		};

		function initData($scope) {
			selectionResult = groupSelectionService.getResult();
			$scope.formOptions.creationEntity = service.creationEntity = {
				Id: 1,
				Code: null,
				DescriptionInfo: {
					Modified: false,
					Translated: ''
				},
				LgmJobFk: setPreSelectedValue('LgmJobFk'),
				PPSHeaderFk: setPreSelectedValue('PPSHeaderFk'),
				MaterialGroupFk: setPreSelectedValue('MaterialGroupFk'),
				MdcMaterialFk: setPreSelectedValue('MdcMaterialFk'),
				SiteFk: setPreSelectedValue('SiteFk'),
				EngDrawingDefFk: setPreSelectedValue('EngDrawingDefFk'),
				UomFk: setPreSelectedValue('UomFk'),
				Quantity: selectionResult.selectionEntity.Quantity,
				ProjectFk: setPreSelectedValue('ProjectFk'),
			};

			var promises = [];
			promises.push(getDefaultMdcGroup(selectionResult.selectedItems));
			promises.push(service.getDefaultItemInfo(service.creationEntity.PPSHeaderFk));
			return $q.all(promises).then(function (response) {
				$scope.formOptions.creationEntity.MaterialGroupFk =
					service.creationEntity.MaterialGroupFk =
						angular.isDefined(response[0]) ? response[0] : null;
				service.updateCode($scope.formOptions.creationEntity);
			});
		}

		function setPreSelectedValue(field) {
			var ppsItems = selectionResult.selectedItems;
			if (ppsItems.length > 0) {
				var exist = _.filter(ppsItems, function (unit) {
					return unit[field] !== ppsItems[0][field];
				});
				return exist.length === 0 ? ppsItems[0][field] : null;
			}
		}

		service.validateMandatoryFields = function validateMandatoryFields() {
			validation = true;
			var mandatoryFields = ['Code', 'LgmJobFk', 'MaterialGroupFk', 'SiteFk', 'UomFk'];
			_.forEach(mandatoryFields, function (field) {
				var result = service.creationEntity[field] === null || service.creationEntity[field] === '' ? {
					valid: false,
					apply: true,
					error: 'The ' + field + ' is Mandatory',
					error$tr$: 'cloud.common.emptyOrNullValueErrorMessage'
				} : {apply: true, valid: true, error: ''};
				if (!result.valid) {
					validation = false;
				}
				if (field === 'Code' && !result.valid && service.creationEntity.__rt$data && service.creationEntity.__rt$data.errors && service.creationEntity.__rt$data.errors[field]) {
					return;
				}
				platformRuntimeDataService.applyValidationResult(result, service.creationEntity, field);
			});
		};

		service.validateUniqueCode = function validateUniqueCode(entity) {
			var postData = {Id: entity.Id, Code: entity.Code, ProjectId: entity.ProjectFk};

			$http.post(globals.webApiBaseUrl + 'productionplanning/item/isuniquecode',
				postData).then(function (response) {
				var res = {};
				if (response.data) {
					res = {apply: true, valid: true, error: ''};
				} else {
					res.valid = false;
					res.apply = true;
					res.error = 'The Code should be unique';
					res.error$tr$ = 'productionplanning.item.validation.errors.uniqCode';
				}
				platformRuntimeDataService.applyValidationResult(res, service.creationEntity, 'Code');
			});
		};

		service.getDefaultItemInfo = function getDefaultItemInfo(headerFk) {
			var creationData = {
				Id: headerFk
			};
			return $http.post(globals.webApiBaseUrl + 'productionplanning/item/create', creationData).then(function (response) {
				service.updateCreationForm(response.data);
			});
		};

		service.updateCode = function updateCode(entity) {
			if (angular.isDefined(entity.MaterialGroupFk) && angular.isDefined(entity.SiteFk)) {
				return $http.post(globals.webApiBaseUrl + 'productionplanning/item/getseqconfiginfo', {
					ppsHeaderId : entity.PPSHeaderFk,
					materialGroupId: entity.MaterialGroupFk,
					materialId: entity.MdcMaterialFk,
					siteId: entity.SiteFk
				}).then(function (response) {
					entity.Code = response.data !== null ? response.data.Code : null;
				});
			} else {
				return $q.when(false);
			}
		};

		function getDefaultMdcGroup(ppsItems) {
			var materialGroupParents = basicsLookupdataLookupDescriptorService.getData('MaterialGroupParents');
			var parentIdSet = materialGroupParents[1].Data;
			var defaultMdcGroupId;

			//find intersection for all parentIds
			var intersection = angular.isDefined(parentIdSet[ppsItems[0].MaterialGroupFk]) ?
				parentIdSet[ppsItems[0].MaterialGroupFk].concat(ppsItems[0].MaterialGroupFk) :
				[ppsItems[0].MaterialGroupFk];
			for (var i = 1; i < ppsItems.length; i++) {
				var tempIntersection = angular.isDefined(parentIdSet[ppsItems[i].MaterialGroupFk]) ?
					parentIdSet[ppsItems[i].MaterialGroupFk].concat(ppsItems[i].MaterialGroupFk) :
					[ppsItems[i].MaterialGroupFk];
				intersection = _.intersection(intersection, tempIntersection);
			}
			if (intersection.length > 0) {
				defaultMdcGroupId = _.max(intersection);
			}

			var defer = $q.defer();
			defer.resolve(defaultMdcGroupId);
			return defer.promise;
		}

		return service;
	}

})(angular);

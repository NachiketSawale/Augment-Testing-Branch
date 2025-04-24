(function () {
	/* global globals, _ */
	'use strict';

	const angularModule = angular.module('boq.main');

	angularModule.controller('boqMainCopyOptionsController', ['$http', '$scope', '$injector',
		function ($http, $scope, $injector) {
			$scope.dialog.getButtonById('ok').fn = function() {
				$scope.$close({ok: true});
				const options = $scope.dialog.modalOptions;
				if (options.isTtoBeSaved) {
					$http.post(globals.webApiBaseUrl + 'boq/main/type/savecopyoptions', { 'BoqHeaderId':options.boqHeaderId, 'BoqStructure':options.boqStructure });
				}
				else {
					// Todo-BH: It would be nice to have a check if the settings have really been changed so no unneccessary saving of the document properties is triggered.
					let boqMainDocPropertiesService = $injector.get('boqMainDocPropertiesService');
					boqMainDocPropertiesService.setModifiedDocProperties(boqMainDocPropertiesService.getSelectedDocProp());
				}
			};
		}
	]);

	angularModule.factory('boqMainCopyOptionsProviderService', ['$translate', 'platformDialogService',
		function($translate, platformDialogService) {
			var service = {};

			service.startByBoqStructure = function(boqHeaderId, boqStructure, isTtoBeSaved, isProcurementBoq, isCrbBoq, isOenBoq) {
				const options = [
					{ key: 'KeepRefNo',              enabled: !isCrbBoq && !isOenBoq },
					{ key: 'KeepQuantity',           enabled: true },
					{ key: 'KeepUnitRate',           enabled: true },
					{ key: 'KeepBudget',             enabled: !isOenBoq },
					{ key: 'AutoAtCopy',             enabled: !isCrbBoq && !isOenBoq },
					{ key: 'CopyEstimateOrAssembly', enabled: !isProcurementBoq && !isOenBoq } ];

				let template = [];
				template += '<section class="modal-body">';
				template +=    '<div data-ng-controller="boqMainCopyOptionsController">';
				template +=       '<div class="platform-form-group">';
				_.forEach(_.filter(options, 'enabled'), function(option) {
					const label = $translate.instant('boq.main.' + (option.key==='AutoAtCopy' ? 'autoInsert' : option.key));
					template +=       '<div class="platform-form-row">';
					template +=          '<div class="domain-type-boolean e2e-boq-' + option.key + ' form-control">';
					template +=             '<input type="checkbox" ng-model="' + 'dialog.modalOptions.boqStructure.'+ option.key + '" />';
					template +=             '<label>' + label + '</label>';
					template +=          '</div>';
					template +=       '</div>';
				});
				template +=       '</div>';
				template +=    '</div>';
				template += '</section>';

				platformDialogService.showDialog({
					headerText$tr$: 'boq.main.copyOptions',
					bodyTemplate: template,
					showOkButton: true,
					showCancelButton: true,
					resizeable: true,
					minHeight: '400px',
					minWidth: '400px',
					boqHeaderId: boqHeaderId,
					boqStructure: boqStructure,
					isTtoBeSaved: isTtoBeSaved
				});
			};

			service.start = function(boqMainService) {
				service.startByBoqStructure(boqMainService.getSelectedBoqHeader(), boqMainService.getBoqStructure(), true, _.startsWith(boqMainService.getServiceName(),'proc'), boqMainService.isCrbBoq(), boqMainService.isOenBoq());
			};

			service.isDisabled = function(boqMainService) {
				const boqStructure = boqMainService.getBoqStructure();
				return boqMainService.getReadOnly() || !(boqStructure && Object.prototype.hasOwnProperty.call(boqStructure, 'Id'));
			};

			return service;
		}
	]);
})();

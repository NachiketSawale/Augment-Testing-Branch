/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	let moduleName = 'qto.main';

	/**
	 * @ngdoc directive
	 * @description
	 */
	angular.module(moduleName).directive('qtoMainRebImportFileSelectionControl', ['$timeout', '$injector', '$translate', 'QtoType',
		function ($timeout, $injector, $translate, qtoType) {

			let template =
				'<div class="input-group form-control"> ' +
				'<input type="text" class="input-group-content" ng-model="entity.FileData.name" readonly="true" /> ' +
				'<span class="input-group-btn">' +
				' <button id="openRBBImportFileDialog" ng-click="onUpload()" class="btn btn-default">' +
				'<div class="control-icons ico-input-lookup lookup-ico-dialog"></div>' +
				'></button> ' +
				'</span> ' +
				'</div>';

			return {

				restrict: 'A',

				replace: false,

				scope: {
					entity: '=',
					ngModel: '=',
					options: '='
				},

				template: template,

				link: linker

			};

			function linker(scope) {
				// set scope for reb import wizard
				$injector.get('qtoMainRebImportWizardService').setCurrentScope(scope.$root);

				scope.path = globals.appBaseUrl;

				// set default message for file selection
				if (!scope.entity.FileData) {
					scope.entity.FileData = {};
					scope.entity.FileData.name = $translate.instant('qto.main.rebImport.selectQtoFile');
				}

				let fileElement = angular.element('<input type="file" />');
				AcceptFileType(fileElement, scope.entity.QtoHeader, scope.entity.IsCrbBoq);

				scope.onUpload = function () {
					fileElement.focus().click();
				};

				fileElement.bind('change', function (e) {
					let fileData = e.target.files[0];
					scope.entity.FileData = fileData;
					scope.entity.IsFileSelected = true;

					// invoke Boq side part CRBX importing
					if (fileData.name.toLowerCase().endsWith('.crbx')) {
						let selectedItem = scope.entity.QtoHeader;
						let boqTempDataService = {
							getRootBoqItem: function () {
								return {BoqHeaderFk: selectedItem.BoqHeaderFk};
							},
							getSelectedProjectId: function () {
								return selectedItem.ProjectFk;
							},
							isWicBoq: function () {
								return false;
							},
							getQtoHeaderId: function () {
								return selectedItem.Id;
							}
						};

						$injector.get('boqMainCrbSiaService').importCrbSia(boqTempDataService, fileData);
					}

					scope.$root.safeApply();

				}).bind('destroy', function () {
					fileElement.unbind('change');
				});
			}

			function AcceptFileType(fileElement, qtoHeader, isCrbBoq){
				let qtoTypeFk = qtoHeader.QtoTypeFk;
				if (isCrbBoq && (qtoTypeFk === qtoType.RebQTO || qtoTypeFk === qtoType.FreeQTO || qtoTypeFk === qtoType.OnormQTO)){
					fileElement.attr('accept', '.crbx, .xml');
				}
				else if (qtoTypeFk === qtoType.RebQTO) {
					fileElement.attr('accept', '.d11, .x31, .xml');
				}
				else {
					fileElement.attr('accept', '.xml');
				}
			}
		}]);
})(angular);

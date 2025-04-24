(function() {
	/* global globals, _ */
	'use strict';

	const boqMainModule = angular.module('boq.main');

	boqMainModule.factory('boqMainBackupService', ['platformDialogService', '$translate',
		function(platformDialogService, $translate) {
			var service = {};

			service.addBoqBackupTools = function(scope, boqHeaderContextService, boqPropertyName, httpRoutePrefix) {
				var filterButton;

				function create() {
					getRootService().updateAndExecute(function() {
						if (boqHeaderContextService.getSelected().BoqHeader.BackupSourceFk) {
							platformDialogService.showInfoBox('boq.main.Backup.CreationDisabled');
							return;
						}

						const hint = $translate.instant('boq.main.Backup.Hint');
						var bodyTemplate;
						bodyTemplate  = '<section class="modal-body">';
						bodyTemplate +=    '<div data-ng-controller="boqMainCreateBackupController">';
						bodyTemplate +=       '<label>' + hint + '</label>';
						bodyTemplate +=       '<div class="modal-wrapper" style="margin-top:20px">';
						bodyTemplate +=          '<div data-platform-form data-form-options="formOptions" entity="boqHeader"></div>';
						bodyTemplate +=       '</div>';
						bodyTemplate +=    '</div>';
						bodyTemplate += '</section>';

						var modalOptions = {
							headerText$tr$: 'boq.main.Backup.Create',
							bodyTemplate: bodyTemplate,
							showOkButton: true,
							showCancelButton: true,
							resizeable: true,
							boqHeaderContextService: boqHeaderContextService,
							boqPropertyName: boqPropertyName,
							httpRoutePrefix: httpRoutePrefix,
							selectBoq: selectBoq,
						};
						platformDialogService.showDialog(modalOptions);
					});
				}

				function restore() {
					getRootService().updateAndExecute(function() {
						if (!boqHeaderContextService.getSelected().BoqHeader.BackupSourceFk) {
							platformDialogService.showInfoBox('boq.main.Backup.RestoreDisabled');
							return;
						}

						const question = $translate.instant('boq.main.Backup.RestoreQuestion');
						var bodyTemplate;
						bodyTemplate  = '<section class="modal-body">';
						bodyTemplate +=    '<div data-ng-controller="boqMainRestoreBackupController">';
						bodyTemplate +=       '<label>' + question + '</label>';
						bodyTemplate +=    '</div>';
						bodyTemplate += '</section>';

						var modalOptions = {
							headerText$tr$: 'boq.main.Backup.Restore',
							bodyTemplate: bodyTemplate,
							showOkButton: true,
							showCancelButton: true,
							resizeable: true,
							boqHeaderContextService: boqHeaderContextService,
							httpRoutePrefix: httpRoutePrefix,
							selectBoq: selectBoq,
						};
						platformDialogService.showDialog(modalOptions);
					});
				}

				function getRootService() {
					var rootService = boqHeaderContextService;
					while (rootService.parentService()) {
						rootService = rootService.parentService();
					}
					return rootService;
				}

				function filter() {
					const currentFilterCheckValue = this.value;

					getRootService().updateAndExecute(function() {
						var currentProjectBoq = boqHeaderContextService.getSelected();
						boqHeaderContextService.setBackupFilter(currentFilterCheckValue);
						boqHeaderContextService.load().then(function() {
							boqHeaderContextService.setSelected(currentProjectBoq);
						});
					});
				}

				function selectBoq(boq) {
					filterButton.value = true;
					boqHeaderContextService.setBackupFilter(true);
					boqHeaderContextService.load().then(function() {
						boqHeaderContextService.setSelected(boq || _.maxBy(boqHeaderContextService.getList(),'Id'));
					});
				}

				function isDisabled() {
					return !_.some(boqHeaderContextService.getSelected());
				}

				filterButton = {
					id:        'filterBackups',
					caption:   'boq.main.Backup.Filter',
					type:      'check',
					iconClass: 'tlb-icons ico-filter-current-version',
					fn:        filter,
				};
				scope.addTools([
					{
						id:        'createBackup',
						caption:   'boq.main.Backup.Create',
						type:      'item',
						iconClass: 'tlb-icons ico-estimate-version-create',
						fn:        create,
						disabled:  isDisabled,
						permission:'#c'
					},
					{
						id:        'restoreBackup',
						caption:   'boq.main.Backup.Restore',
						type:      'item',
						iconClass: 'tlb-icons ico-estimate-version-restore',
						fn:        restore,
						disabled:  isDisabled,
						permission:'#c'
					},
					filterButton
				]);
			};

			return service;
		}
	]);

	boqMainModule.controller('boqMainCreateBackupController', ['$scope', '$http', '$translate', 'platformDialogService',
		function ($scope, $http, $translate, platformDialogService) {
			const boqHeaderContextService = $scope.dialog.modalOptions.boqHeaderContextService;
			const boqPropertyName         = $scope.dialog.modalOptions.boqPropertyName;
			const httpRoutePrefix         = $scope.dialog.modalOptions.httpRoutePrefix;
			const selectBoq               = $scope.dialog.modalOptions.selectBoq;

			$scope.boqHeader = { BackupDescription:'', BackupComment:'' };
			$scope.formOptions = {
				configure: {
					showGrouping: false,
					groups: [ {gid:'1'} ],
					rows: [
						{ gid:'1', rid:'1', model:'BackupDescription', type:'description', label:$translate.instant('boq.main.Backup.Description')},
						{ gid:'1', rid:'2', model:'BackupComment',     type:'comment' ,    label:$translate.instant('boq.main.Backup.Comment') }
					]
				}
			};

			$scope.dialog.getButtonById('ok').fn = function() {
				const boqId = boqHeaderContextService.getSelected()[boqPropertyName].Id;
				const postParams = '?boqId='+boqId + '&description='+$scope.boqHeader.BackupDescription + '&comment='+$scope.boqHeader.BackupComment;
				$http.post(globals.webApiBaseUrl + httpRoutePrefix + '/createbackup' + postParams).then(function(response) {
					$scope.$close({ok: true});

					response = response.data;
					if (response.HasDependentBoqs || response.QtoErrorMessage || response.DependentEstimates) {
						var infoText = $translate.instant('boq.main.Backup.CreationFailed');
						if (response.HasDependentBoqs)   { infoText += '<br>' + $translate.instant('boq.main.Backup.Boqs'); }
						if (response.QtoErrorMessage)    { infoText += '<br>' + response.QtoErrorMessage; }
						if (response.DependentEstimates) { infoText += '<br>' + $translate.instant('boq.main.Backup.Estimates') + ': ' + response.DependentEstimates; }
						platformDialogService.showMsgBox(infoText, 'cloud.common.informationDialogHeader', 'ico-info');
					}
					else {
						selectBoq();
						platformDialogService.showInfoBox('boq.main.Backup.CreationSucceeded');
					}
				});
			};
		}
	]);

	boqMainModule.controller('boqMainRestoreBackupController', ['$scope', '$http', '$translate', 'platformDialogService',
		function ($scope, $http, $translate, platformDialogService) {
			const boqHeaderContextService = $scope.dialog.modalOptions.boqHeaderContextService;
			const httpRoutePrefix         = $scope.dialog.modalOptions.httpRoutePrefix;
			const selectBoq               = $scope.dialog.modalOptions.selectBoq;

			$scope.dialog.getButtonById('ok').fn = function() {
				$scope.$close({ok: true});

				const currentBoq = boqHeaderContextService.getSelected();
				$http.post(globals.webApiBaseUrl + httpRoutePrefix + '/restorebackup' + '?boqHeaderId='+currentBoq.BoqHeader.Id).then(function(response) {
					response = response.data;
					if (response.HasDependentBoqs || response.DependentEstimates) {
						var infoText = $translate.instant('boq.main.Backup.RestoreFailed');
						if (response.HasDependentBoqs)   { infoText += '<br>' + $translate.instant('boq.main.Backup.Boqs'); }
						if (response.DependentEstimates) { infoText += '<br>' + $translate.instant('boq.main.Backup.Estimates') + ': ' + response.DependentEstimates; }
						platformDialogService.showMsgBox(infoText, 'cloud.common.informationDialogHeader', 'ico-info');
					}
					else {
						selectBoq(currentBoq);
						platformDialogService.showInfoBox('boq.main.Backup.RestoreSucceeded');
					}
				});
			};
		}
	]);
})();

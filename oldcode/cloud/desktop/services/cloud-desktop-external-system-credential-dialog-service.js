(function (angular) {
	/* global globals */
	'use strict';

	var modulemodel = 'cloud.desktop';

	/**
	 * @ngdoc service
	 * @model cloudDesktopExternalSystemCredentialService
	 */
	angular.module(modulemodel).service('cloudDesktopExternalSystemCredentialDialogService', CloudDesktopExternalSystemCredentialDialogService);

	CloudDesktopExternalSystemCredentialDialogService.$inject = ['_', '$timeout', '$http', '$translate', '$injector', 'platformModalGridConfigService', 'platformWizardDialogService',
		'platformRuntimeDataService', 'platformModalService', 'platformGridControllerService', 'cloudDesktopExternalSystemCredentialDataService', 'basicsCustomizeLookupConfigurationService'];

	function CloudDesktopExternalSystemCredentialDialogService(_, $timeout, $http, $translate, $injector, platformModalGridConfigService, platformWizardDialogService,
		platformRuntimeDataService, platformModalService, platformGridControllerService, cloudDesktopExternalSystemCredentialDataService,
		basicsCustomizeLookupConfigurationService) {

		var self = this;

		var toolBarItems = [
			{
				id: 'create',
				caption: $translate.instant('cloud.common.taskBarNewRecord'),
				iconClass: 'tlb-icons ico-rec-new',
				type: 'item',
				fn: function () {
					cloudDesktopExternalSystemCredentialDataService.create().then(function () {
						return true;
					});

				}
			},
			{
				id: 'delete',
				caption: $translate.instant('procurement.pricecomparison.moveDown'),
				iconClass: 'tlb-icons ico-rec-delete',
				type: 'item',
				fn: cloudDesktopExternalSystemCredentialDataService.deleteItem
			}
		];

		function makeUserColumnReadOnly(gridColumns) {
			var userCol = _.find(gridColumns, function (col) {
				return col.id === 'userfk';
			});

			if (!_.isNil(userCol)) {
				userCol.editor = null;
				userCol.editorOptions = null;
				userCol.readonly = true;
			}
		}

		var mainItemId;

		function provideExternalSystemGridLayout() {
			var serviceCustomizeDataType = $injector.get('basicsCustomizeTypeDataService');
			return serviceCustomizeDataType.load().then(function () {
				return basicsCustomizeLookupConfigurationService.loadLookupConfigurations().then(function () {
					var basicsCustomizeInstanceValidationProviderService = $injector.get('basicsCustomizeInstanceValidationProviderService');
					var serviceCustomizeDataTyp = serviceCustomizeDataType.getTypeByDBTableName('BAS_EXTERNALSOURCE2USER');
					mainItemId = serviceCustomizeDataTyp.Id;
					var externalSystemGridLayout = $injector.get('basicsCustomizeInstanceConfigurationService').getListConfigForTypeData(serviceCustomizeDataTyp).columns;
					var validateService = basicsCustomizeInstanceValidationProviderService.getInstanceValidationServiceFor(serviceCustomizeDataTyp);

					makeUserColumnReadOnly(externalSystemGridLayout);

					platformGridControllerService.addValidationAutomatically(externalSystemGridLayout, validateService);
					return cloudDesktopExternalSystemCredentialDataService.load().then(function (data) {
						return {
							uuid: 'fe34959d8ca54594a916e96f88fec094',
							columns: externalSystemGridLayout,
							items: data,
							tools: {
								showTitles: false,
								cssClass: 'tools',
								items: toolBarItems,
								entityCreatedEvent: cloudDesktopExternalSystemCredentialDataService.getEntityAddedEvent(),
								entityDeletedEvent: cloudDesktopExternalSystemCredentialDataService.getEntityDeletedEvent(),
								selectionAfterSortEvent: cloudDesktopExternalSystemCredentialDataService.getSelectionAfterSortEvent(),
								onSelectedRowChanged: cloudDesktopExternalSystemCredentialDataService.onSelectedRowChanged
							}
						};
					});
				});
			});
		}

		function provideExternalSystemDialogConfig() {
			return provideExternalSystemGridLayout().then(function (gridLayout) {
				return {
					title: $translate.instant('cloud.desktop.externalSystemCredential.externalSystemCredentialListStepTitle'),
					dataItems: gridLayout.items,
					getDataItems: cloudDesktopExternalSystemCredentialDataService.getItemList,
					gridConfiguration: gridLayout,
					handleOK: function handleOK(items) {
						var externalSystemCredential = {
							MainItemId: mainItemId,
							EntityData: {
								Id: mainItemId,
								ToSave: items.data,
								ToDelete: cloudDesktopExternalSystemCredentialDataService.getExternalSystemCredentialListDelete()
							}

						};
						$http.post(globals.webApiBaseUrl + 'basics/customize/entitytype/usersyscredits', externalSystemCredential)
							.then(function () {
							}, function (/* error */) {
							});
					}
				};
			});
		}

		self.editExternalSystemCredentials = function editExternalSystemCredentials() {
			return provideExternalSystemDialogConfig().then(function (modalExternalSystemCredentialsConfig) {
				platformModalGridConfigService.showDialog(modalExternalSystemCredentialsConfig);
			});

		};
	}
})(angular);

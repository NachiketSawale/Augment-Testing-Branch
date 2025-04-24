(function (angular) {
	/* global globals */
	'use strict';
	let myModule = angular.module('basics.config');

	/**
	 * @ngdoc service
	 * @name basicsConfigDataConfigurationDialogService
	 * @description provides methods, create and update DataConfiguration entities
	 */
	myModule.service('basicsConfigDataConfigurationDialogService', BasicsConfigDataConfigurationDialogService);

	BasicsConfigDataConfigurationDialogService.$inject = ['_', '$http', '$translate', 'platformModalService',
		'platformModalGridConfigService', 'platformGridControllerService', 'basicsConfigModuleTableInformationDataService',
		'basicsConfigDataConfigurationDialogDataService', 'basicsConfigMainService', 'basicsConfigDataConfigurationValidationService',
		'basicsConfigDataConfigurationDialogColumnUIService', 'platformListSelectionDialogService'];

	function BasicsConfigDataConfigurationDialogService(_, $http, $translate, platformModalService,
		platformModalGridConfigService, platformGridControllerService, basicsConfigModuleTableInformationDataService,
		basicsConfigDataConfigurationDialogDataService, basicsConfigMainService, basicsConfigDataConfigurationValidationService,
		basicsConfigDataConfigurationDialogColumnUIService,platformListSelectionDialogService) {
		let self = this;

		let toolBarItems = [
			{
				id: 'create',
				caption: $translate.instant('cloud.common.taskBarNewRecord'),
				iconClass: 'tlb-icons ico-rec-new',
				type: 'item',
				fn: function () {
					basicsConfigDataConfigurationDialogDataService.createItem();
				}
			},
			{
				id: 'delete',
				caption: $translate.instant('cloud.common.taskBarDeleteRecord'),
				iconClass: 'tlb-icons ico-rec-delete',
				type: 'item',
				fn: basicsConfigDataConfigurationDialogDataService.deleteItem
			}
		];

		function setUserColumnSize(gridColumns) {
			_.forEach(gridColumns, function (col) {
				switch (col.id) {
					case 'columnname' :
						col.width = '180';
						break;
					case 'showinwizard' :
						col.width = '110';
						break;
					case 'ismandatory' :
						col.width = '110';
						break;
					default :
						break;
				}
			});
		}

		function loadColumns() {

		}

		function provideExternalSystemGridLayout() {
			let dataConfigurationColumnGridColumns = basicsConfigDataConfigurationDialogColumnUIService.getStandardConfigForListView().columns;

			setUserColumnSize(dataConfigurationColumnGridColumns);

			platformGridControllerService.addValidationAutomatically(dataConfigurationColumnGridColumns, basicsConfigDataConfigurationValidationService);

			return {
				uuid: '4564ec0f92224c678914b55ab054a5fa',
				columns: dataConfigurationColumnGridColumns,
				items: loadColumns(),
				tools: {
					showTitles: false,
					cssClass: 'tools',
					items: toolBarItems,
					entityCreatedEvent: basicsConfigDataConfigurationDialogDataService.getEntityAddedEvent(),
					entityDeletedEvent: basicsConfigDataConfigurationDialogDataService.getEntityDeletedEvent(),
					selectionAfterSortEvent: basicsConfigDataConfigurationDialogDataService.getSelectionAfterSortEvent(),
					onSelectedRowChanged: basicsConfigDataConfigurationDialogDataService.onSelectedRowChanged
				}
			};
		}

		function provideColumnInformationConfig(entity) {
			let gridLayout = provideExternalSystemGridLayout(entity);

			return {
				title: $translate.instant('basics.config.titelDataFields'),
				dataItems: basicsConfigDataConfigurationDialogDataService.getItemList(),
				getDataItems: basicsConfigDataConfigurationDialogDataService.getItemList,
				gridConfiguration: gridLayout,
				handleOK: function handleOK() {
					basicsConfigDataConfigurationDialogDataService.storeChanges();
				}
			};
		}

		self.editExternalSystemCredentials = function editExternalSystemCredentials(entity) {
			if(!!basicsConfigModuleTableInformationDataService.getSelected() && !!basicsConfigMainService.getSelected()){
				let modalExternalSystemCredentialsConfig = provideColumnInformationConfig(entity);
				basicsConfigDataConfigurationDialogDataService.load();
				platformModalGridConfigService.showDialog(modalExternalSystemCredentialsConfig);
			}
		};

		self.openlistSelectionDialog = function openlistSelectionDialog(entity,options){
			let userConfig = {};
			if (options.selectedTitle === 'basics.config.readonlyColumns' || options.selectedTitle === 'basics.config.mandatoryColumns'){
				_.assign(userConfig, {
					sortItems: function sortSelection(l) {
						return _.sortBy(l, 'Property');
					}
				});
			}

			let internalName = basicsConfigMainService.getSelected().InternalName;
			return $http.get(globals.webApiBaseUrl + 'basics/config/entitycreation/columnsinfo?module=' + internalName + '&table=' + entity.TableName + '&moduleTableId=' + entity.Id)
				.then(function (response) {
					let item = _.find(basicsConfigModuleTableInformationDataService.getList(),{Id: response.data.TableId});
					basicsConfigModuleTableInformationDataService.setSelected(item);
					let idMember = 'Id';
					let nameMember = 'Property';

					let config = _.assign({
						dialogTitle$tr$: options.titel,
						availableTitle$tr$: 'basics.config.availableFields',
						selectedTitle$tr$: options.selectedTitle,
						showIndicator: false,
						idProperty: idMember,
						displayNameProperty: nameMember,
						allItems: options.filter(response.data.ConfigurableColumns),
						value: getVisibleItems(response.data.ConfigurableColumns, options),
						availableColumns: [{
							id: 'description',
							formatter: function availableColumnFormatter(row, cell, value, columnDef, dataContext) {
								let res = value;
								if(dataContext.MandatoryBySystem) {
									res += '<span class="required-cell"></span>';
								}
								return res;
							},
							name: 'Item',
							name$tr$: 'platform.listselection.item',
							field: nameMember,
							width: 200
						}]
					}, userConfig || {});
					return platformListSelectionDialogService.showDialog(config).then(function (result) {
						if (result.ok === true) {
							let selectConfigModuleTableInformationData = basicsConfigModuleTableInformationDataService.getSelected();
							switch (options.selectedTitle) {
								case 'basics.config.newWizardColumns': {
									selectConfigModuleTableInformationData.StringWizardModuleTableNames = '';
									_.forEach(result.value, function (item) {
										selectConfigModuleTableInformationData.StringWizardModuleTableNames = selectConfigModuleTableInformationData.StringWizardModuleTableNames + item.Column + '; ';
									});
								}
									break;
								case 'basics.config.mandatoryColumns': {
									selectConfigModuleTableInformationData.StringMandatoryModuleTableNames = '';
									_.forEach(result.value, function (item) {
										selectConfigModuleTableInformationData.StringMandatoryModuleTableNames = selectConfigModuleTableInformationData.StringMandatoryModuleTableNames + item.Column + '; ';
									});
								}
									break;
								case 'basics.config.readonlyColumns': {
									selectConfigModuleTableInformationData.StringReadOnlyModuleTableNames = '';
									_.forEach(result.value, function (item) {
										selectConfigModuleTableInformationData.StringReadOnlyModuleTableNames = selectConfigModuleTableInformationData.StringReadOnlyModuleTableNames + item.Column + '; ';
									});
								}
									break;
								default :
									break;
							}

							basicsConfigModuleTableInformationDataService.markItemAsModified(selectConfigModuleTableInformationData);
							basicsConfigModuleTableInformationDataService.gridRefresh();
							return result;
						}
					});
				},

				function (/* error */) {
				});
		};


		function getVisibleItems(ConfigurableColumns, option) {
			if (option.selectedTitle === 'basics.config.mandatoryColumns') {
				return _.filter(ConfigurableColumns, function (tile) {
					return !!tile.IsMandatory;
				});
			}

			if (option.selectedTitle === 'basics.config.readonlyColumns') {
				return _.filter(ConfigurableColumns, function (tile) {
					return !!tile.IsReadOnly;
				});
			}

			if (option.selectedTitle === 'basics.config.newWizardColumns') {
				let config = _.filter(ConfigurableColumns, function (tile) {
					return !!tile.IsWizard;
				});
				return _.sortBy(config, 'Sorting');
				// },
			}
		}

		return self;
	}
})(angular);

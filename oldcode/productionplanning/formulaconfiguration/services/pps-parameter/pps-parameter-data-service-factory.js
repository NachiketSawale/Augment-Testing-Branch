/* global globals _ */
/**
 * Created by anl on 29/4/2022.
 */

(function (angular) {
	'use strict';
	let moduleName = 'productionplanning.formulaconfiguration';
	let module = angular.module(moduleName);

	module.factory('productionplanningFormulaConfigurationParameterDataServiceFactory', ParameterDataServiceFactory);

	ParameterDataServiceFactory.$inject = ['$injector', '$http',
		'basicsCommonMandatoryProcessor',
		'basicsLookupdataLookupDescriptorService',
		'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension',
		'productionplanningCommonProductParamValidationServiceFactory',
		'ppsFormulaParameterProcessor'];

	function ParameterDataServiceFactory($injector, $http,
		basicsCommonMandatoryProcessor,
		basicsLookupdataLookupDescriptorService,
		platformDataServiceFactory,
		platformDataServiceProcessDatesBySchemeExtension,
		validationServiceFactory,
		ppsFormulaParameterProcessor) {

		let service = {};
		let serviceCache = {};

		function createNewComplete (options) {
			let productTemplateFieldName = options.parentFilter;
			var parentService = options.parentServiceName ? $injector.get(options.parentServiceName) : undefined;

			var paramServiceInfo = {
				flatLeafItem: {
					serviceName: options.serviceName,
					entityNameTranslationID: 'productionplanning.formulaconfiguration.ppsParameter.parameterEntity',
					httpCreate: {route: globals.webApiBaseUrl + 'productionplanning/formulaconfiguration/parameter/'},
					httpRead: {
						route: globals.webApiBaseUrl + 'productionplanning/formulaconfiguration/parameter/',
						endRead: 'listby'
					},
					entityRole: {
						leaf: {
							itemName: 'PpsParameter',
							parentService: parentService,
							parentFilter: 'DescriptionFk',
							filterParent: function(data) {
								let descriptionFk = -1;
								data.currentParentItem = data.parentService.getSelected();
								if (data.currentParentItem && data.currentParentItem[options.parentFilter]) {
									descriptionFk = data.currentParentItem[options.parentFilter];
								}
								return descriptionFk;
							}
						}
					},
					dataProcessor: [ppsFormulaParameterProcessor],
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								basicsLookupdataLookupDescriptorService.attachData(readData);
								let result = {
									FilterResult: readData.FilterResult,
									dtos: readData.main || []
								};
								return container.data.handleReadSucceeded(result, data);
							},
							initCreationData: function (creationData) {
								let parentItem = parentService.getSelected();
								let productDescription = _.find(basicsLookupdataLookupDescriptorService.getData('PPSProductDescriptionTiny'), {Id: parentItem[options.parentFilter]});
								if(productDescription) {
									creationData.PKey1 = angular.isDefined(productDescription.PpsFormulaVersionFk) ? productDescription.PpsFormulaVersionFk : null;
									creationData.PKey2 = productDescription.Id;
								}
							}
						}
					},
					actions: {
						create: false,
						delete: false
					},
					translation: {
						uid: options.serviceName,
						title: 'productionplanning.formulaconfiguration.ppsParameter.parameterEntity',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
						dtoScheme: {
							typeName: 'PpsParameterDto',
							moduleSubModule: 'ProductionPlanning.FormulaConfiguration',
						},
					}
				}
			};

			/* jshint -W003 */
			let container = platformDataServiceFactory.createNewComplete(paramServiceInfo);

			container.data.usesCache = false;

			container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'PpsParameterDto',
				moduleSubModule: 'ProductionPlanning.FormulaConfiguration',
				validationService: validationServiceFactory.getService({'dataService': container.service})

			});

			container.service.canRecalculate = () => {
				let parentSelected = parentService.getSelected();
				if (parentSelected){
					return !!parentSelected[productTemplateFieldName];
				}
			};

			container.service.recalculate = () => {
				const parentSelected = _.clone(parentService.getSelected());
				const productTemplateFk = parentSelected[productTemplateFieldName];
				if (parentSelected && angular.isDefined(productTemplateFk)) {
					$http.get(globals.webApiBaseUrl + 'productionplanning/common/product/listForDescription?descriptionFk=' + productTemplateFk).then(res => {
						const products = [];
						if (res && res.data && res.data.Main.length > 0) {
							products.push(...res.data.Main);
							products.forEach(item => {
								item.Check = true;
							});
						}

						const uuid = $injector.get('platformCreateUuid')();
						const dialogConfig = {
							id: uuid,
							gridId: uuid,
							resizeable: true,
							showOkButton: true,
							showCancelButton: true,
							headerText: 'Select Product(s)',
							headerText$tr$: 'productionplanning.formulaconfiguration.ppsParameter.recalculate.dialogTitle',
							dataItem: {},
							value: {},
							indicator: true,
							idProperty:'Id',
							columns: getColumnsOfProduct(),
							items: products,
							showGridFilter: true,
							customButtons: [{
								id: 'switchcheckbox',
								caption: 'Check All/Uncheck All',
								caption$tr$: 'productionplanning.formulaconfiguration.ppsParameter.recalculate.switchcheckbox',
								fn: (event, info) => switchCheckbox(uuid, info.value.items),
								disabled: info => !info.value.items || info.value.items.length === 0
							}]
						};

						$injector.get('platformGridAPI').grids.commitAllEdits();
						getRootService().updateAndExecute(() => {
							if (products.length === 0) {
								doRecalculate(productTemplateFk);
								return;
							}

							$injector.get('platformGridDialogService').showDialog(dialogConfig).then(res => {
								if (res.ok) {
									doRecalculate(productTemplateFk, getCheckedProductIds(res.value));
								}
							});
						});
					});
				}

				function doRecalculate(productTemplateFk, productIds = []) {
					const postData = {
						ProductTemplateId: productTemplateFk,
						ProductIds: productIds,
					};
					$http.post(globals.webApiBaseUrl + 'productionplanning/common/product/recalculate', postData).then(res => {
						if (res && res.data) {
							if(_.isFunction(parentService.refreshSubContainersAfterRecalculate)){
								parentService.refreshSubContainersAfterRecalculate();
								container.service.load();
							} else{
								parentService.refresh();
							}
						}
					});
				}

				function getRootService() {
					let parent = parentService;
					while (parent.parentService()) {
						parent = parent.parentService();
					}
					return parent;
				}

				function getCheckedProductIds(items) {
					return items.filter(item => item.Check).map(item => item.Id);
				}

				function switchCheckbox(uuid, items) {
					if (items.filter(i => !i.Check).length > 0) {
						items.forEach(i => i.Check = true);
					} else {
						items.forEach(i => i.Check = false);
					}
					$injector.get('platformGridAPI').grids.refresh(uuid, true);
				}

				function getColumnsOfProduct() {
					const gridColumns = _.cloneDeep($injector.get('productionplanningCommonProductUIStandardService').getStandardConfigForListView().columns);
					setColumnsReadonly();
					addCheckField();

					function addCheckField() {
						gridColumns.unshift({
							id: 'check',
							editor: 'boolean',
							formatter: 'boolean',
							name: 'Check',
							field: 'Check',
							required: true,
							sortable: true,
							width: 60
						});
					}
					function setColumnsReadonly() {
						gridColumns.forEach(col => {
							col.editor = null;
							col.editorOptions = null;
						});
					}
					return gridColumns;
				}
			};

			return container.service;
		}

		service.getOrCreateService = (options) => {
			if (!serviceCache[options.serviceName]) {
				serviceCache[options.serviceName] = createNewComplete(options);
			}
			return serviceCache[options.serviceName];
		};

		service.getServiceByName = (serviceName) => {
			if (serviceCache[serviceName]) {
				return serviceCache[serviceName];
			}
			return null;
		};

		return service;
	}
})(angular);
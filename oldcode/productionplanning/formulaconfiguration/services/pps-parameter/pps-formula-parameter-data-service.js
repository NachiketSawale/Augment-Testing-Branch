(function (angular) {
	'use strict';

	const moduleName = 'productionplanning.formulaconfiguration';

	angular.module(moduleName).factory('ppsFormulaParameterDataService', DataService);

	DataService.$inject = [
		'platformGridAPI',
		'platformDataServiceFactory',
		'basicsCommonMandatoryProcessor',
		'ppsFormulaDataService',
		'productionplanningFormulaConfigurationParameterValidationServiceFactory',
		'ppsFormulaParameterProcessor',
		'$injector',
		'ppsFormulaVersionStatus'
	];

	function DataService (
		platformGridAPI,
		platformDataServiceFactory,
		basicsCommonMandatoryProcessor,
		parentService,
		validationServiceFactory,
		ppsFormulaParameterProcessor,
		$injector,
		ppsFormulaVersionStatus) {
		let curUsingService = '',// store using service in cur module(for getSelected..)
			relativeConfigs = {},
			usingServiceChangedMessage = new Platform.Messenger(),
			selectionChangedFns ={};
		let container;
		let serviceOptions = {
			flatNodeItem: {
				module: moduleName,
				serviceName: 'ppsFormulaParameterDataService',
				entityNameTranslationID: 'productionplanning.formulaconfiguration.entityFormulaParameter',
				addValidationAutomatically: true,
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/formulaconfiguration/parameter/',
					endRead: 'listbyformulaversionorinstance',
					initReadData: function (readData) {
						let relativeSerivce = relativeConfigs[curUsingService];
						if(relativeSerivce){
							relativeSerivce = relativeSerivce.service;
							let selected = relativeSerivce.getSelected();
							if(selected && curUsingService === 'ppsFormulaInstanceDataService'){
								readData.filter = '?requestId=' + selected.Id + '&isForInstance=true';
							}
							else if(selected && curUsingService === 'ppsFormulaVersionDataService') {
								readData.filter = '?requestId=' + selected.Id + '&isForInstance=false';
							}
						}
					}
				},
				entityRole: {
					leaf: {
						itemName: 'PpsParameter',
						parentService: parentService,
						parentFilter: 'versionId',
						useIdentification: true
					}
				},
				dataProcessor: [ppsFormulaParameterProcessor,
					{processItem: function (item) {
						ppsFormulaParameterProcessor.setColumnsReadOnly(item, ['VariableName','DescriptionInfo','BasDisplayDomainFk'], !service.canCDU());
					}}],
				entitySelection: {supportsMultiSelection: true},
				presenter: {
					list: {
						initCreationData: function (creationData) {
							// Must be the VersionDataService, or the create button is disabled.
							creationData.PKey1 = relativeConfigs[curUsingService].service.getSelected().Id;
						}
					}
				},
				actions: {
					delete: true,
					create: 'flat',
					canCreateCallBackFunc: canCDFunc,
					canDeleteCallBackFunc: canCDFunc
				},
				translation: {
					uid: 'ppsFormulaParameterDataService',
					title: 'productionplanning.formulaconfiguration.entityFormulaParameter',
					columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
					dtoScheme: {
						typeName: 'PpsParameterDto',
						moduleSubModule: 'ProductionPlanning.FormulaConfiguration',
					},
				}
			}
		};

		function canCDFunc() {
			if(curUsingService !== 'ppsFormulaVersionDataService'){
				return false;
			}
			// Must be the VersionDataService, or return false above.
			if(!relativeConfigs[curUsingService].service.getSelected() || relativeConfigs[curUsingService].service.getSelected().Status !== ppsFormulaVersionStatus.new.id){
				return false;
			}
			return true;
		}

		container = platformDataServiceFactory.createNewComplete(serviceOptions);

		container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'PpsParameterDto',
			moduleSubModule: 'ProductionPlanning.FormulaConfiguration',
			validationService: validationServiceFactory.getService({'dataService': container.service})
		});

		container.data.usesCache = false;

		let service = container.service;

		service.registerRelativeSelectionChanged = function registerRelativeSelectionChanged(configs) {
			configs.forEach(function (config) {
				let leadingService = _.isString(config.serviceName) ? $injector.get(config.serviceName) : config.serviceName;

				if (leadingService) {
					relativeConfigs[config.serviceName] = config;
					relativeConfigs[config.serviceName].service = leadingService;
					selectionChangedFns[config.serviceName] = function (e, entity) {
						// this will stop capture
						if (!entity) {
							service.unloadSubEntities();
							return;
						}

						curUsingService = config.serviceName;
						container.data.doReadData(container.data);
						usingServiceChangedMessage.fire(relativeConfigs[curUsingService].title);
						// deselect item in other relative containers
						for (let serviceName of Object.keys(relativeConfigs)) {
							if (serviceName !== curUsingService) {
								const gridId = relativeConfigs[serviceName].gridId;
								platformGridAPI.items.data(gridId, platformGridAPI.items.data(gridId));
							}
						}
					};

					leadingService.registerSelectionChanged(selectionChangedFns[config.serviceName]);
				}
			});
		};


		service.unRegisterRelativeSelectionChanged = function unRegisterRelativeSelectionChanged() {
			for (let serviceName of Object.keys(relativeConfigs)) {
				var service = relativeConfigs[serviceName].service;
				service.unregisterSelectionChanged(selectionChangedFns[serviceName]);
			}
			relativeConfigs = {};
			selectionChangedFns ={};
			curUsingService = '';
		};

		service.registerServiceChangedMessage = function registerModuleChangedMessage(fn) {
			usingServiceChangedMessage.register(fn);
		};

		service.unRegisterServiceChangedMessage = function unRegisterModuleChangedMessage(fn) {
			usingServiceChangedMessage.unregister(fn);
		};

		service.canCDU = canCDFunc;

		return container.service;
	}
})(angular);
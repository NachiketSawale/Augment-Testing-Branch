/**
 * Created by anl on 8/04/2022.
 */
(function () {
	'use strict';
	/*global angular*/

	let processModule = angular.module('productionplanning.processconfiguration');

	processModule.factory('productionplanningPhaseDataServiceFactory', PhaseDataServiceFactory);

	PhaseDataServiceFactory.$inject = [
		'platformDataServiceFactory',
		'ppsProcessConfigurationPhaseProcessor',
		'productionplanningPhaseValidationServiceFactory',
		'productionplanningCommonActivityDateshiftService',
		'basicsCommonMandatoryProcessor',
		'platformDataServiceProcessDatesBySchemeExtension',
		'$http',
		'$q',
		'$injector',
		'productionplanningProcessConfigurationTranslationService'];

	function PhaseDataServiceFactory(
		platformDataServiceFactory,
		ppsProcessConfigurationPhaseProcessor,
		phaseValidationServiceFactory,
		productionplanningCommonActivityDateshiftService,
		basicsCommonMandatoryProcessor,
		platformDataServiceProcessDatesBySchemeExtension,
		$http,
		$q,
		$injector,
		productionplanningProcessConfigurationTranslationService) {

		var serviceFactroy = {};
		var serviceCache = {};

		function createNewComplete(moduleName, parentServiceName) {

			let processFk = moduleName === 'productionplanning.product' ? 'PpsProcessFk' : 'ProcessFk';

			let dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor(
				{
					typeName: 'PpsPhaseDto',
					moduleSubModule: 'Productionplanning.ProcessConfiguration',
				});

			let serviceOptions = {
				flatNodeItem: {
					module: moduleName,
					serviceName: moduleName + 'productPhaseDataService',
					entityNameTranslationID: 'productionplanning.processconfiguration.entityPhase',
					addValidationAutomatically: true,
					httpCRUD: {
						route: globals.webApiBaseUrl + 'productionplanning/processconfiguration/phase/',
						endRead: 'listbyprocess',
						initReadData: function (readData) {
							var selected = parentServiceName.getSelected();
							readData.filter = '?ProcessId=' + (selected[processFk] || 0);
						}
					},
					entityRole: {
						node: {
							itemName: 'Phase',
							parentService: parentServiceName,
							parentFilter: 'ProcessId',
							useIdentification: true
						}
					},
					dataProcessor: [ppsProcessConfigurationPhaseProcessor, {processItem: hideProductFkOfParent}, dateProcessor],
					entitySelection: {supportsMultiSelection: true},
					presenter: {
						list: {
							initCreationData: function (creationData) {
								var selected = parentServiceName.getSelected();
								creationData.PKey1 = selected[processFk];
							}
						}
					},
					actions: {
						delete: true,
						create: 'flat',
						canCreateCallBackFunc: function () {
							return !!parentServiceName.getSelected()[processFk];
						}
					},
				}
			};

			function hideProductFkOfParent(phase) {
				var selected = parentServiceName.getSelected();
				if (!_.isNil(selected) && !phase.IsInvalid && phase.PpsProductFk === selected.Id) {
					phase.PpsProductFk = null;
				}
			}

			/* jshint -W003 */
			let container = platformDataServiceFactory.createNewComplete(serviceOptions);
			let service = container.service;

			let dateShiftConfig = {
				dateshiftId: 'productionplanning.phase'
			};

			const productPhaseValidationService = new phaseValidationServiceFactory(service);

			productionplanningCommonActivityDateshiftService.registerToVirtualDateshiftService(moduleName, container, dateShiftConfig.dateshiftId);// , virtualValidationConfig);

			container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'PpsPhaseDto',
				moduleSubModule: 'Productionplanning.ProcessConfiguration',
				validationService: productPhaseValidationService
			});

			service.handleFieldChanged = function (entity, field) {
				if (field === 'IsLockedStart') {
					ppsProcessConfigurationPhaseProcessor.setColumnsReadOnly(entity, ['PlannedStart'], entity.IsLockedStart);
					service.gridRefresh();
				}
				if (field === 'IsLockedFinish') {
					ppsProcessConfigurationPhaseProcessor.setColumnsReadOnly(entity, ['PlannedFinish'], entity.IsLockedFinish);
					service.gridRefresh();
				}

				service.markItemAsModified(entity);
			};

			service.getValidationService = () => {
				return productPhaseValidationService;
			};

		// get EntityDescription (phaseType -> ppsPhases; productCode -> ppsProducts)
		service.getDateShiftMessageDescription = (phaseList) => {
			const processFks = phaseList.map(phase => phase.PpsProcessFk);
			const entityDescription = new Map();
			const ppsProcessIds = {PpsProcessIds: []};
			ppsProcessIds.PpsProcessIds = Array.from(processFks);

				 const productsByProcessFk = $http.post(globals.webApiBaseUrl + `productionplanning/common/product/getproductsbyfilter`, ppsProcessIds).then(function (response) {
					if (response.data.length > 0) {
						let processFk2ProductCode = new Map(phaseList.map(phase => [phase.Id, response.data.find(product => product.PpsProcessFk === phase.PpsProcessFk)?.Code]));
						entityDescription.set('productCode', processFk2ProductCode);
					}
					return response.data;
				});


				const phaseTypes = $injector
					.get('basicsLookupdataSimpleLookupService')
					.getList({
						valueMember: 'Id',
						displayMember: 'Description',
						lookupModuleQualifier: 'basics.customize.ppsphasetype',
					})
					.then(function (typeList) {
						let phaseId2PhaseType = new Map(phaseList.map(phase => [phase.Id, typeList.find(type => type.Id === phase.PpsPhaseTypeFk)?.Description]));
						entityDescription.set('phaseType', phaseId2PhaseType);
						return typeList;
					});

					const allPromises = [productsByProcessFk, phaseTypes];

					return $q.all(allPromises).then(() => {
						return entityDescription;
					});
		};


			return service;
		}

		serviceFactroy.getService = function getService(moduleName, parentServiceName) {
			if (!serviceCache[moduleName]) {
				serviceCache[moduleName] = createNewComplete(moduleName, parentServiceName);
			}

			return serviceCache[moduleName];
		};

		return serviceFactroy;
	}

})();
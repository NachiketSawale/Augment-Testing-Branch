/**
 * Created by hzh on 5/20/2020.
 */

(function (angular) {
	'use strict';
	var moduleName = 'cloud.desktop';

	angular.module(moduleName).factory('cloudDesktopBim360GetParamsService',
		['_', '$translate',
			function (_, $translate) {
				var service = {};

				service.getProjectType = function () {
					var projectType = [];
					_.forEach(project_type, function (item) {
						var entity = {};
						entity.Id = item.id;
						entity.name = $translate.instant(item.name$tr$);
						entity.value = item.value;
						projectType.push(entity);
					});
					return projectType;
				};

				service.getLanguage = function () {
					var lan = [];
					_.forEach(language, function (item) {
						var entity = {};
						entity.Id = item.id;
						entity.name = $translate.instant(item.name$tr$);
						entity.value = item.value;
						lan.push(entity);
					});
					return lan;
				};

				service.getActiveService = function () {
					var activeService = [];
					_.forEach(serviceType, function (item) {
						var entity = {};
						entity.Id = item.id;
						entity.name = $translate.instant(item.name$tr$);
						entity.value = item.value;
						entity.required = item.required;
						activeService.push(entity);
					});
					return activeService;
				};

				service.getContractType = function () {
					var contractType = [];
					_.forEach(contractType, function (item) {
						contractType.push(item);
					});
					return contractType;
				};

				var project_type = [
					{'id': 1, 'name$tr$': 'cloud.desktop.bim360.projectType.commercial', 'value': 'Commercial'},
					{
						'id': 2,
						'name$tr$': 'cloud.desktop.bim360.projectType.conventionCenter',
						'value': 'Convention Center'
					},
					{'id': 3, 'name$tr$': 'cloud.desktop.bim360.projectType.dataCenter', 'value': 'Data Center'},
					{'id': 4, 'name$tr$': 'cloud.desktop.bim360.projectType.hotelMotel', 'value': 'Hotel / Motel'},
					{'id': 5, 'name$tr$': 'cloud.desktop.bim360.projectType.office', 'value': 'Office'},
					{
						'id': 6,
						'name$tr$': 'cloud.desktop.bim360.projectType.parkingStructureGarage',
						'value': 'Parking Structure / Garage'
					},
					{
						'id': 7,
						'name$tr$': 'cloud.desktop.bim360.projectType.performingArts',
						'value': 'Performing Arts'
					},
					{'id': 8, 'name$tr$': 'cloud.desktop.bim360.projectType.retail', 'value': 'Retail'},
					{'id': 9, 'name$tr$': 'cloud.desktop.bim360.projectType.stadiumArena', 'value': 'Stadium/Arena'},
					{'id': 10, 'name$tr$': 'cloud.desktop.bim360.projectType.themePark', 'value': 'Theme Park'},
					{
						'id': 11,
						'name$tr$': 'cloud.desktop.bim360.projectType.warehouse',
						'value': 'Warehouse (non-manufacturing)'
					},
					{'id': 12, 'name$tr$': 'cloud.desktop.bim360.projectType.healthcare', 'value': 'Healthcare'},
					{
						'id': 13,
						'name$tr$': 'cloud.desktop.bim360.projectType.assistedLivingNursingHome',
						'value': 'Assisted Living / Nursing Home'
					},
					{'id': 14, 'name$tr$': 'cloud.desktop.bim360.projectType.hospital', 'value': 'Hospital'},
					{
						'id': 15,
						'name$tr$': 'cloud.desktop.bim360.projectType.medicalLaboratory',
						'value': 'Medical Laboratory'
					},
					{'id': 16, 'name$tr$': 'cloud.desktop.bim360.projectType.medicalOffice', 'value': 'Medical Office'},
					{
						'id': 17,
						'name$tr$': 'cloud.desktop.bim360.projectType.outPatientSurgeryCenter',
						'value': 'OutPatient Surgery Center'
					},
					{'id': 18, 'name$tr$': 'cloud.desktop.bim360.projectType.institutional', 'value': 'Institutional'},
					{'id': 19, 'name$tr$': 'cloud.desktop.bim360.projectType.courtHouse', 'value': 'Court House'},
					{'id': 20, 'name$tr$': 'cloud.desktop.bim360.projectType.dormitory', 'value': 'Dormitory'},
					{
						'id': 21,
						'name$tr$': 'cloud.desktop.bim360.projectType.educationFacility',
						'value': 'Education Facility'
					},
					{
						'id': 22,
						'name$tr$': 'cloud.desktop.bim360.projectType.governmentBuilding',
						'value': 'Government Building'
					},
					{'id': 23, 'name$tr$': 'cloud.desktop.bim360.projectType.library', 'value': 'Library'},
					{
						'id': 24,
						'name$tr$': 'cloud.desktop.bim360.projectType.militaryFacility',
						'value': 'Military Facility'
					},
					{'id': 25, 'name$tr$': 'cloud.desktop.bim360.projectType.museum', 'value': 'Museum'},
					{
						'id': 26,
						'name$tr$': 'cloud.desktop.bim360.projectType.prisonCorrectionalFacility',
						'value': 'Prison / Correctional Facility'
					},
					{
						'id': 27,
						'name$tr$': 'cloud.desktop.bim360.projectType.recreationBuilding',
						'value': 'Recreation Building'
					},
					{
						'id': 28,
						'name$tr$': 'cloud.desktop.bim360.projectType.religiousBuilding',
						'value': 'Religious Building'
					},
					{
						'id': 29,
						'name$tr$': 'cloud.desktop.bim360.projectType.researchFacilityLaboratory',
						'value': 'Research Facility / Laboratory'
					},
					{'id': 30, 'name$tr$': 'cloud.desktop.bim360.projectType.residential', 'value': 'Residential'},
					{
						'id': 31,
						'name$tr$': 'cloud.desktop.bim360.projectType.multiFamilyHousing',
						'value': 'Multi-Family Housing'
					},
					{
						'id': 32,
						'name$tr$': 'cloud.desktop.bim360.projectType.singleFamilyHousing',
						'value': 'Single-Family Housing'
					},
					{
						'id': 33,
						'name$tr$': 'cloud.desktop.bim360.projectType.infrastructure',
						'value': 'Infrastructure'
					},
					{'id': 34, 'name$tr$': 'cloud.desktop.bim360.projectType.airport', 'value': 'Airport'},
					{'id': 35, 'name$tr$': 'cloud.desktop.bim360.projectType.bridge', 'value': 'Bridge'},
					{
						'id': 36,
						'name$tr$': 'cloud.desktop.bim360.projectType.canalWaterway',
						'value': 'Canal / Waterway'
					},
					{
						'id': 37,
						'name$tr$': 'cloud.desktop.bim360.projectType.damsFloodControlReservoirs',
						'value': 'Dams / Flood Control / Reservoirs'
					},
					{
						'id': 38,
						'name$tr$': 'cloud.desktop.bim360.projectType.harborRiverDevelopment',
						'value': 'Harbor / River Development'
					},
					{'id': 39, 'name$tr$': 'cloud.desktop.bim360.projectType.rail', 'value': 'Rail'},
					{'id': 40, 'name$tr$': 'cloud.desktop.bim360.projectType.seaport', 'value': 'Seaport'},
					{
						'id': 41,
						'name$tr$': 'cloud.desktop.bim360.projectType.streetsRoadsHighways',
						'value': 'Streets / Roads / Highways'
					},
					{
						'id': 42,
						'name$tr$': 'cloud.desktop.bim360.projectType.transportationBuilding',
						'value': 'Transportation Building'
					},
					{'id': 43, 'name$tr$': 'cloud.desktop.bim360.projectType.tunnel', 'value': 'Tunnel'},
					{
						'id': 44,
						'name$tr$': 'cloud.desktop.bim360.projectType.wasteWaterSewers',
						'value': 'Waste Water / Sewers'
					},
					{'id': 45, 'name$tr$': 'cloud.desktop.bim360.projectType.waterSupply', 'value': 'Water Supply'},
					{
						'id': 46,
						'name$tr$': 'cloud.desktop.bim360.projectType.industrialEnergy',
						'value': 'Industrial & Energy'
					},
					{
						'id': 47,
						'name$tr$': 'cloud.desktop.bim360.projectType.manufacturingFactory',
						'value': 'Manufacturing / Factory'
					},
					{'id': 48, 'name$tr$': 'cloud.desktop.bim360.projectType.oilGas', 'value': 'Oil & Gas'},
					{'id': 49, 'name$tr$': 'cloud.desktop.bim360.projectType.plant', 'value': 'Plant'},
					{'id': 50, 'name$tr$': 'cloud.desktop.bim360.projectType.powerPlant', 'value': 'Power Plant'},
					{'id': 51, 'name$tr$': 'cloud.desktop.bim360.projectType.solarFar', 'value': 'Solar Far'},
					{'id': 52, 'name$tr$': 'cloud.desktop.bim360.projectType.utilities', 'value': 'Utilities'},
					{'id': 53, 'name$tr$': 'cloud.desktop.bim360.projectType.windFarm', 'value': 'Wind Farm'},
					{
						'id': 54,
						'name$tr$': 'cloud.desktop.bim360.projectType.sampleProjects',
						'value': 'Sample Projects'
					},
					{
						'id': 55,
						'name$tr$': 'cloud.desktop.bim360.projectType.demonstrationProject',
						'value': 'Demonstration Project'
					},
					{
						'id': 56,
						'name$tr$': 'cloud.desktop.bim360.projectType.templateProject',
						'value': 'Template Project'
					},
					{
						'id': 57,
						'name$tr$': 'cloud.desktop.bim360.projectType.trainingProject',
						'value': 'Training Project'
					}
				];

				var language = [
					{id: 1, name$tr$: 'cloud.desktop.bim360.language.english', value: 'en'},
					{id: 2, name$tr$: 'cloud.desktop.bim360.language.german', value: 'de'}
				];

				var serviceType = [
					{id: 1, name$tr$: 'cloud.desktop.bim360.serviceType.field', value: 'field', required: '1'},
					{id: 2, name$tr$: 'cloud.desktop.bim360.serviceType.glue', value: 'glue'},
					{
						id: 3,
						name$tr$: 'cloud.desktop.bim360.serviceType.doc_manager',
						value: 'doc_manager',
						required: '1'
					},
					{id: 4, name$tr$: 'cloud.desktop.bim360.serviceType.collab', value: 'collab'},
					{id: 5, name$tr$: 'cloud.desktop.bim360.serviceType.pm', value: 'pm'},
					{id: 6, name$tr$: 'cloud.desktop.bim360.serviceType.fng', value: 'fng', required: '1'},
					{id: 7, name$tr$: 'cloud.desktop.bim360.serviceType.gng', value: 'gng'}
				];

				var contractType = [
					{
						key: 'Construction Management (CM) at Risk',
						value: 'Construction contract is of type CM at Risk'
					},
					{key: 'Design-Bid', value: 'Construction contract is design-build type'},
					{key: 'Design-Bid-Build', value: 'Construction contract is design-bid-build type'},
					{key: 'Design-Build-Operate', value: 'Construction contract is design-build-operate type'},
					{key: 'IPD', value: 'Construction contract is integrated project delivery type'}
				];

				return service;
			}]);
})(angular);

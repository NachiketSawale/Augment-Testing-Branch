/**
 * created by saa.mik 14.09.2021
 */
(function (angular) {
	'use strict';

	var moduleName = 'platform';

	angular.module(moduleName).service('platformPlanningBoardLabelConfigService', PlatformPlanningBoardLabelConfigService);

	PlatformPlanningBoardLabelConfigService.$inject = ['basicsUnitLookupDataService'];

	function PlatformPlanningBoardLabelConfigService(basicsUnitLookupDataService) {
		var service = this;

		service.setTextLabelDropDowns = (labelInputs) => {
			labelInputs.main = {
				gid: '2',
				rid: 'mainInfoLabel',
				label: 'Main Label',
				label$tr$: 'platform.planningboard.mainLabelText',
				type: 'text',
				model: 'mainInfoLabel',
				visible: true,
				sortOrder: 2
			};
			labelInputs.info1 = {
				gid: '2',
				rid: 'info1Label',
				label: 'Info Label 1',
				// label$tr$: 'platform.planningboard.showInfo1Text',
				type: 'text',
				model: 'info1Label',
				visible: true,
				sortOrder: 4
			};
			labelInputs.info2 = {
				gid: '2',
				rid: 'info2Label',
				label: 'Info Label 2',
				// label$tr$: 'platform.planningboard.showInfo2Text',
				type: 'text',
				model: 'info2Label',
				visible: true,
				sortOrder: 6
			};
			labelInputs.info3 = {
				gid: '2',
				rid: 'info3Label',
				label: 'Info Label 3',
				// label$tr$: 'platform.planningboard.showInfo3Text',
				type: 'text',
				model: 'info3Label',
				visible: true,
				sortOrder: 8
			};
		};

		service.setDirectiveLabelDropDowns = (labelInputs, labelLookupServiceName) => {
			labelInputs.main = {
				gid: '2',
				rid: 'mainInfoLabel',
				label: 'Main Label',
				label$tr$: 'platform.planningboard.mainLabelText',
				type: 'directive',
				directive: 'basics-lookup-data-by-custom-data-service',
				options: {
					dataServiceName: labelLookupServiceName,
					disableDataCaching: true,
					displayMember: 'NodePath',
					isTextEditable: true,
					lookupModuleQualifier: labelLookupServiceName,
					lookupType: labelLookupServiceName,
					showClearButton: true,
					valueMember: 'NodePath',
					columns: [
						{
							id: 'NodePath',
							field: 'SymbolPath',
							name: 'SymbolPath',
							formatter: 'ASCIISymbolPath',
							name$tr$: 'cloud.common.entityDescription',
							width: 150,
						},
					],
					uuid: 'edecf107103f4b2ea72a511e5e2f915c'
				},
				model: 'mainInfoLabel',
				visible: true,
				sortOrder: 2
			};
			labelInputs.info1 = {
				gid: '2',
				rid: 'info1Label',
				label: 'Info Label 1',
				// label$tr$: 'platform.planningboard.showInfo1Text',
				type: 'directive',
				directive: 'basics-lookup-data-by-custom-data-service',
				options: {
					dataServiceName: labelLookupServiceName,
					disableDataCaching: true,
					displayMember: 'NodePath',
					isTextEditable: true,
					lookupModuleQualifier: labelLookupServiceName,
					lookupType: labelLookupServiceName,
					showClearButton: true,
					valueMember: 'NodePath',
					columns: [
						{
							id: 'NodePath',
							field: 'SymbolPath',
							name: 'SymbolPath',
							formatter: 'ASCIISymbolPath',
							name$tr$: 'cloud.common.entityDescription',
							width: 150,
						},
					],
					uuid: '0df065ae301742f6977707834777e568'

				},
				model: 'info1Label',
				visible: true,

				sortOrder: 4
			};
			labelInputs.info2 = {
				gid: '2',
				rid: 'info2Label',
				label: 'Info Label 2',
				// label$tr$: 'platform.planningboard.showInfo2Text',
				type: 'directive',
				directive: 'basics-lookup-data-by-custom-data-service',
				options: {
					dataServiceName: labelLookupServiceName,
					disableDataCaching: true,
					displayMember: 'NodePath',
					isTextEditable: true,
					lookupModuleQualifier: labelLookupServiceName,
					lookupType: labelLookupServiceName,
					showClearButton: true,
					valueMember: 'NodePath',
					columns: [
						{
							id: 'NodePath',
							field: 'SymbolPath',
							name: 'SymbolPath',
							formatter: 'SymbolPath',
							name$tr$: 'cloud.common.entityDescription',
							width: 150,
						},
					],
					uuid: '0df065ae301742f6977707852777e568'
				},
				model: 'info2Label',
				visible: true,
				sortOrder: 6
			};
			labelInputs.info3 = {
				gid: '2',
				rid: 'info3Label',
				label: 'Info Label 3',
				// label$tr$: 'platform.planningboard.showInfo3Text',
				type: 'directive',
				directive: 'basics-lookup-data-by-custom-data-service',
				options: {
					dataServiceName: labelLookupServiceName,
					disableDataCaching: true,
					displayMember: 'NodePath',
					isTextEditable: true,
					lookupModuleQualifier: labelLookupServiceName,
					lookupType: labelLookupServiceName,
					showClearButton: true,
					valueMember: 'NodePath',
					columns: [
						{
							id: 'NodePath',
							field: 'SymbolPath',
							name: 'SymbolPath',
							formatter: 'SymbolPath',
							name$tr$: 'cloud.common.entityDescription',
							width: 150,
						},
					],
					uuid: '0df065ae301742f6977707812677e568'
				},
				model: 'info3Label',
				visible: true,
				sortOrder: 8
			};
		};

		service.getTextLineOfType = (assignment, property, isMainInfoLabel = false,mapService) =>{
			let result = '';
			if(isJson(property)){
				let finalProperty =  JSON.parse(property);

				let finalInfoField = getPropertiesInfo(finalProperty,assignment,mapService);

				if(finalInfoField.length > 0){
					finalInfoField.forEach(element => {
						if(element.match(/\{|\}/gi)){
							element = element.replace(/\{|\}/gi, '');
							if(/(.*)uom(.*)fk/.test(element.toLowerCase()) && assignment.hasOwnProperty(element)){
								let uom =  basicsUnitLookupDataService.getItemById(assignment[element],{
									'lookupType': 'Uom',
									'dataServiceName': 'basicsUnitLookupDataService'});
								uom = uom ? uom.Unit : '';
								result = result + uom;

							}else if(/(.*):(.*)./.test(element.toLowerCase())){
								let elementValue = getPhaseRequimentsProperty(assignment,element, mapService);
								result = result + elementValue;
							}else{
								let elementValue = mapService.infoField(assignment, element);
								elementValue = elementValue === null ? '' : elementValue;
								result = result + elementValue;
							}
						}else{
							result = result + element;
						}
					});
				}
			}else if(isMainInfoLabel){
				result = mapService.infoField(assignment, property) === '' ? mapService.description(assignment) : mapService.infoField(assignment, property);
			}else{
				result = mapService.infoField(assignment, property);
			}

			return result;
		};

		function isJson(str) {
			str = typeof str !== 'string' ? JSON.stringify(str) : str;
			if (str.startsWith('{')) {
				try {
					str = JSON.parse(str);
				} catch (e) {
					return false;
				}
				if (typeof str === 'object' && str !== null && Object.keys(str).length > 0) {
					return true;
				}
			}
			return false;
		}

		function getPropertiesInfo(finalProperty, assignment,mapService) {
			let result = [];
			if(finalProperty && assignment){
				if(_.isFunction(mapService.assignmentTypeDescription) && mapService.assignmentTypeDescription(assignment) &&  finalProperty[Object.keys(finalProperty).find((key) => key.toLowerCase() === (mapService.assignmentTypeDescription(assignment)).toLowerCase())]){
					result = finalProperty[Object.keys(finalProperty).find((key) => key.toLowerCase() === (mapService.assignmentTypeDescription(assignment)).toLowerCase())];
				}else{
					result = finalProperty[Object.keys(finalProperty).find((key) => key.toLowerCase() === 'Default'.toLowerCase())];
				}
			}

			if(typeof result === 'undefined'){
				result = [];
			}
			return result;
		}

		function getPhaseRequimentsProperty(assignment, property,mapService){
			if(/[.]/.test(property.toLowerCase())){
				let properties = property.split('.');
				if(properties.length ===  2){
					let val = (_.isFunction(mapService.valueToSelectedAggregation))? mapService.valueToSelectedAggregation(assignment, properties[0],properties[1]) : '';
					return val;
				}
			}else{
				return;
			}
		}

		return service;
	}
})(angular);
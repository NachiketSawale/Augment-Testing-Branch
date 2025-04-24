/**
 * Created by baf on 18.03.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.cardtemplate';

	/**
	 * @ngdoc service
	 * @name logisticCardTemplateConstantValues
	 * @function
	 *
	 * @description
	 * logisticCardTemplateConstantValues provides definitions and constants frequently used in logistic cardTemplate module
	 */
	angular.module(moduleName).value('logisticCardTemplateConstantValues', {
		schemes: {
			cardTemplate: {typeName: 'JobCardTemplateDto', moduleSubModule: 'Logistic.CardTemplate'},
			cardTemplateActivity: {typeName: 'JobCardActivityTemplateDto', moduleSubModule: 'Logistic.CardTemplate'},
			cardTemplateRecord: {typeName: 'JobCardRecordTemplateDto', moduleSubModule: 'Logistic.CardTemplate'},
			cardTemplateDocument: {typeName: 'JobCardTemplateDocumentDto', moduleSubModule: 'Logistic.CardTemplate'}
		},
		uuid: {
			container: {
				cardTemplateList: 'e0fffc91d92b4bdda85c9f39679f417c',
				cardTemplateDetails: '29cad0ea85ce4611b194e118fb0c350f',
				cardTemplateActivityList: '0df6e4b981e146648d61eced666a6619',
				cardTemplateActivityDetails: 'ef003b81dcd2411a8bad42476fb2bf87',
				cardTemplateRecordList: '8614a7a865cb43628c4056226bf5ca52',
				cardTemplateRecordDetails: 'c392eb6e54564b0da8a27a4e67876ea2',
				cardTemplateDocumentList: 'da8c50f95eab426ea365f50e28794eb6',
				cardTemplateDocumentDetails: '125101fddb83457a95064b25bb7ff6d0'
			}
		},
		type: {
			plant: 1,
			material: 2,
			sundryService: 3
		}
	});
})(angular);

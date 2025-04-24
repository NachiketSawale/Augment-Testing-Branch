/**
 * Created by chi on 2/24/2021.
 */

(function(angular) {
	'use strict';

	var moduleName = 'procurement.rfq';
	angular.module(moduleName).factory('procurementRfqDocumentForSendRfqDetailLayout', procurementRfqDocumentForSendRfqDetailLayout);

	procurementRfqDocumentForSendRfqDetailLayout.$inject = ['basicsLookupdataConfigGenerator'];

	function procurementRfqDocumentForSendRfqDetailLayout(basicsLookupdataConfigGenerator) {
		return {
			'fid': 'procurement.rfq.document.for.send.rfq.detailform',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					'gid': 'setting',
					'attributes': ['documenttype', 'documentstatusfk', 'documentdescription', 'documentoriginalfilename']
				}
			],
			'translationInfos': {
				'extraModules': [moduleName],
				'extraWords': {
					DocumentType: {location: moduleName, identifier: 'documentForSendRfq.type', initial: 'Type'},
					DocumentStatusFk: {
						location: moduleName,
						identifier: 'documentForSendRfq.status',
						initial: 'Status'
					},
					DocumentDescription: {
						location: moduleName,
						identifier: 'documentForSendRfq.description',
						initial: 'Description'
					},
					DocumentOriginalFileName: {
						location: moduleName,
						identifier: 'documentForSendRfq.originalFileName',
						initial: 'Original File Name'
					}
				}
			},
			'overloads': {
				documentstatusfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('documents.project.documentstatus', null, {
					customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK',
					field: 'RubricCategoryFk',
					showIcon: true
				})
			}
		};
	}

})(angular);
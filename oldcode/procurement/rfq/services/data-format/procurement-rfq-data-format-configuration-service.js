/**
 * Created by chi on 2/23/2021.
 */

(function(angular) {
	'use strict';

	var moduleName = 'procurement.rfq';
	angular.module(moduleName).value('procurementRfqDataFormatDetailLayout', {
		'fid': 'procurement.rfq.data.format.detailform',
		'version': '1.0.0',
		'showGrouping': true,
		'addValidationAutomatically': true,
		'groups': [
			{
				'gid': 'setting',
				'attributes': ['dataformat']
			}
		],
		'translationInfos': {
			'extraModules': [moduleName],
			'extraWords': {
				DataFormat: {location: moduleName, identifier: 'dataFormatSetting.dataFormat', initial: 'Data Format'}
			}
		},
		'overloads': {}
	});

})(angular);
/**
 * Created by mik on 08/11/2021.
 */
/* global moment */
(function () {
	'use strict';

	function ppsCommonFieldSequenceGridColumnConstant () {
		return [
			{
				id: 'Code',
				field: 'Code',
				name: 'Code',
				name$tr$: 'cloud.common.entityCode',
				formatter: 'code',
				width: 70
			}, {
				id: 'FieldSequence',
				field: 'fieldSequence',
				name: 'FieldSequence*',
				name$tr$: 'productionplanning.common.fieldSequence',
				formatter: 'number',
				width: 20,
				readonly: true
			}, {
				id: 'start',
				name: 'Start*',
				name$tr$: 'productionplanning.common.start',
				formatter: 'description',
				field: 'start',
				width: 50,
				sortOrder: 3
			}, {
				id: 'time',
				name: 'Time',
				name$tr$: 'productionplanning.common.time',
				editor: 'durationsec',
				formatter: function (row, cell, value) {
					return (moment.isMoment(value)) ? value.format('HH:mm') : ' ';
				},
				options: {
					format: 'HH:mm',
					returnValue: 'moment'
				},
				field: 'time',
				width: 55,
				sortOrder: 4,
				readonly: false
			}, {
				id: 'weight',
				name: 'Weight*',
				name$tr$: 'productionplanning.common.weight',
				formatter: 'integer',
				domain: 'integer',
				field: 'weight',
				width: 50,
				sortOrder: 5,
				readonly: true
			}
		];
	}

	angular.module('platform').constant('ppsCommonFieldSequenceGridColumnConstant', ppsCommonFieldSequenceGridColumnConstant());
})();
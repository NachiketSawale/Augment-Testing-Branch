(function () {

	'use strict';

	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name
	 * @function
	 *
	 * @description
	 *
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('boqMainSelectGroupsLayoutService', [
		'basicsLookupdataConfigGenerator',
		function (basicsLookupdataConfigGenerator) {

			var layout = {
				fid: 'boq.main',
				version: '0.1.0',
				addValidationAutomatically: true,
				showGrouping: true,
				groups: [
					{
						gid: 'BasicData',
						attributes: ['_selected', 'basitemtypefk', 'basitemtype2fk', 'agn', 'aan', 'reference', 'briefinfo']
						// attributes: ['wicnumber', 'boqlinetypefk', 'boqdivisiontypefk', 'reference', 'reference2', 'externalcode', 'designdescriptionno', 'briefinfo', 'basuomfk', 'externaluom', 'bpdagreementfk']
					}
				],
				'overloads': {

					'basitemtypefk': angular.extend(basicsLookupdataConfigGenerator.provideGenericLookupConfig(
						'basics.lookup.boqitemtype', 'Description'), {readonly: true}),

					'basitemtype2fk': basicsLookupdataConfigGenerator.provideGenericLookupConfig(
						'basics.lookup.boqitemtype2',
						'Description'),

					'agn': {
						'readonly': true
					},

					'reference': {
						'readonly': true
					},

					'briefinfo': {
						'readonly': true
					}
				}
			};

			return {
				getLayout: function () {
					return layout;
				}
			};

		}]);

})(angular);


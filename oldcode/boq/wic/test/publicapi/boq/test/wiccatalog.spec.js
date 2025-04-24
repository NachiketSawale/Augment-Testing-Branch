(function () {
	/* jshint -W097 */
	/* jshint -W098 */
	/* jshint -W106 */
	/* jshint -W117 */
	/* globals globalRequire, describe, it */

	'use strict';

	describe('Import WicCatalog', function () {

		var util = globalRequire.util;

		this.timeout(60000);
		var url = '/boq/publicapi/wic/putwiccatalogs';
		var jsonFile = './boq/test/testdata/put-01-wic-catalog.json';

		it('should save the WicCatalogs successfully', function (done) {
			util.requireData(jsonFile).then(function (data) {
				var request = Object.assign({}, data, {canOverwrite: true});
				util.post(url, request).then(function () {
					done();
				}, function (err) {
					done(err);
				});
			}, function (err) {
				done(err);
			});
		});
	});
})();

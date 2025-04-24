(function () {
	/* jshint -W097 */
	/* jshint -W098 */
	/* jshint -W106 */
	/* jshint -W117 */

	'use strict';
	/* globals require, describe, it */

	var path = require('path');

	var util = require(path.resolve('./common/util'));

	describe('WIC BoQ', function () {
		this.timeout(60000);

		it('Put WIC Boqs successfully', function (done) {
			var filePath = './boq/test/testdata/put-02-wic-boq.json';
			var url = 'boq/publicapi/wic/';
			util.requireData(filePath).then(function (data) {
				util.post(url + 'putwicboqs', data).then(function () {
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

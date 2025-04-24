(function () {
	/* jshint -W097 */
	/* jshint -W098 */
	/* jshint -W106 */
	/* jshint -W117 */
	/* globals require, describe, it */

	'use strict';

	var path = require('path');

	var util = require(path.resolve('./common/util'));

	describe('WIC BoQ Item', function () {
		this.timeout(60000);
		it('Put WIC Boq Items successfully', function (done) {
			var filePath = './boq/test/testdata/put-03-wic-boq-item.json';
			var url = 'boq/publicapi/wic/';
			util.requireData(filePath).then(function (data) {
				util.post(url + 'putwicboqitems', data).then(function () {
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

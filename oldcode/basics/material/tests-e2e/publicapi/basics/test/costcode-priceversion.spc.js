/**
 * Created by lhu on 5/31/2017.
 */


describe('Test Public API - CostCode Price Version', function () {

    var util = globalRequire.util;
    var should = globalRequire.should;
    var baseApiUrl = 'basics/publicapi/costcode/versions/';

    describe('Check Price Version', function () {

        it('Check Get Price Version', function (done) {
            this.timeout(60000);
            // return util.requireData('./basics/test/testdata/get-costcode-priceversions.json').then(function (data) {
            //     return util.post(baseApiUrl + 'getcostcodepriceversions', data);
            // });
            util.requireData('./basics/test/testdata/get-costcode-priceversions.json').then(function (data) {
                util.post(baseApiUrl + 'getcostcodepriceversions', data).then(function (res) {
                    (res).should.be.ok();
                    done();
                }, function (err) {
                    done(err);
                });
            }, function (err) {
                done(err);
            });
        });

        it('Check Put Price Version', function () {
            this.timeout(60000);
            return util.requireData('./basics/test/testdata/put-costcode-priceversions.json').then(function (data) {
                return util.post(baseApiUrl + 'putcostcodepriceversions', data);
            });

        });

        it('Check Get Price  List Record', function (done) {
            this.timeout(60000);
            // return util.requireData('./basics/test/testdata/get-costcode-pricelistrecords.json').then(function (data) {
            //     return util.post(baseApiUrl + 'getcostcodepricelistrecords', data);
            // });
            util.requireData('./basics/test/testdata/get-costcode-pricelistrecords.json').then(function (data) {
                util.post(baseApiUrl + 'getcostcodepricelistrecords', data).then(function (res) {
                    (res).should.be.ok();
                    done();
                }, function (err) {
                    done(err);
                });
            }, function (err) {
                done(err);
            });
        });

        it('Check Put Price List Record', function () {
            this.timeout(60000);
            return util.requireData('./basics/test/testdata/put-costcode-pricelistrecords.json').then(function (data) {
                return util.post(baseApiUrl + 'putcostcodepricelistrecords', data);
            });
        });

    });
});
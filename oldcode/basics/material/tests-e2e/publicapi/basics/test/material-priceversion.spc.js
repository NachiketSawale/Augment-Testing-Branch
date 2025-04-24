/**
 * Created by lhu on 5/31/2017.
 */


describe('Test Public API - Material Price Version', function () {

    var util = globalRequire.util;
    var should = globalRequire.should;
    var baseApiUrl = 'basics/publicapi/material/';

    describe('Check Material Price Version', function () {

        it('Check Get Material Price Version', function (done) {
             this.timeout(60000);

            util.requireData('./basics/test/testdata/get-material-priceversions.json').then(function (data) {
                util.post(baseApiUrl + 'getmaterialpriceversions', data).then(function (res) {
                    (res).should.be.ok();
                    done();
                }, function (err) {
                    done(err);
                });
            }, function (err) {
                done(err);
            });
        })

        it('Check Put Material Price Version', function () {
            this.timeout(600000);
            var PriceList="testV2";
            var materialCatalog="001";
            var now=1;
           return  util.requireData('./basics/test/testdata/put-material-priceversions.json').then(function (data) {

                // for(var i=0;i<data.materialPriceVersions.length;i++){
                //     var item=data.materialPriceVersions[i];
                //     if(item&&item.descriptionInfo) {
                //         item.descriptionInfo.description = "Test Material Version A-"+ now++;
                //     }
                //     item.PriceList=PriceList;
                //     item.materialCatalog=materialCatalog;
                // }

               return  util.post(baseApiUrl + 'putmaterialpriceversions', data);
            });

        });


        it('Check Get Material Price List', function (done) {
            this.timeout(60000);

            util.requireData('./basics/test/testdata/get-material-pricelist.json').then(function (data) {
                util.post(baseApiUrl + 'getmaterialpricelist', data).then(function (res) {
                    (res).should.be.ok();
                    done();
                }, function (err) {
                    done(err);
                });
            }, function (err) {
                done(err);
            });
        });
    });
});
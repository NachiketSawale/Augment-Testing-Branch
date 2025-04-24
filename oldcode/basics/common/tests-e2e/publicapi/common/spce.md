# TOC

- [Do Login](#do-login)
- [Do Public API Test2](#do-public-api-test2)
- [Do Public API Test0](#do-public-api-test0)
- [Do Public API Test1](#do-public-api-test1)
  <a name=""></a>

<a name="do-login"></a>

# Do Login

login success.

```js
globals.authorization.should.be.a('string');
done();
```

<a name="do-public-api-test2"></a>

# Do Public API Test2

1、Get Data By beforeEach Method Success.

```js
//expect(myResult).to.be.an('object');
should.exist(myResult);
//expect(myResult.basicInfo.id).to.be.equal(50);
myResult.basicInfo.id.should.equal(50);
done();
```

2、getBpDetailById, id=50; It Must Has Result.

```js
var getBpDetailById = {CompanyCode: "903", Id: 50};
apicall.call('businesspartner/publicapi/contact/getBpDetailById', globals, getBpDetailById, function (res) {
	expect(res).to.be.an('object');
	done();
});
```

3、getBpDetailById, id=50; It Must Return Data Id is 50.

```js
var getBpDetailById = {CompanyCode: "903", Id: 50};
apicall.call('businesspartner/publicapi/contact/getBpDetailById', globals, getBpDetailById, function (res) {
	expect(res.basicInfo.id).to.be.equal(50);
	done();
});
```

<a name="do-public-api-test0"></a>

# Do Public API Test0

1、Get Data By beforeEach Method Success.

```js
//expect(myResult).to.be.an('object');
should.exist(myResult);
//expect(myResult.basicInfo.id).to.be.equal(50);
myResult.basicInfo.id.should.equal(50);
done();
```

2、getBpDetailById, id=50; It Must Has Result.

```js
var getBpDetailById = {CompanyCode: "903", Id: 50};
apicall.call('businesspartner/publicapi/contact/getBpDetailById', globals, getBpDetailById, function (res) {
	expect(res).to.be.an('object');
	done();
});
```

3、getBpDetailById, id=50; It Must Return Data Id is 50.

```js
var getBpDetailById = {CompanyCode: "903", Id: 50};
apicall.call('businesspartner/publicapi/contact/getBpDetailById', globals, getBpDetailById, function (res) {
	expect(res.basicInfo.id).to.be.equal(50);
	done();
});
```

<a name="do-public-api-test1"></a>

# Do Public API Test1

2、getBpDetailById, id=50; It Must Has Result.

```js
var getBpDetailById = {CompanyCode: "903", Id: 50};
apicall.call('businesspartner/publicapi/contact/getBpDetailById', globals, getBpDetailById, function (res) {
	expect(res).to.be.an('object');
	done();
});
```

3、getBpDetailById, id=50; It Must Return Data Id is 50.

```js
var getBpDetailById = {CompanyCode: "903", Id: 50};
apicall.call('businesspartner/publicapi/contact/getBpDetailById', globals, getBpDetailById, function (res) {
	expect(res.basicInfo.id).to.be.equal(50);
	done();
});
```


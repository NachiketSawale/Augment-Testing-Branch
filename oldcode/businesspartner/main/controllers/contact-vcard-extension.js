/**
 * Created by reimer on 14.10.2015.
 */

(function (angular) {

	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_,VCF */
	var moduleName = 'businesspartner.main';

	/**
	 * @ngdoc service
	 * @name businessPartnerMainVcardExtension
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('businessPartnerMainVcardExtension', ['$q', 'basicsCommonTelephoneService',

		function ($q, telephoneService) {

			var service = {};

			service.addVcardSupport = function addVcardSupport($scope, dataService, photoService) {

				$scope.fileDropped = function (file) {

					if ($scope.canDrop() && file.length === 1) {
						var reader = new FileReader();
						reader.onload = function () {
							// convert utf-8 (without bom) coded byte-array to a javascript string
							var s = String.fromCharCode.apply(null, new Uint8Array(reader.result));
							$scope.vCardDropped(s);
						};
						reader.readAsArrayBuffer(file[0]);
					}
				};

				$scope.canDrop = function () {
					return dataService.canCreate();
				};

				// only process vcards
				$scope.allowedFiles = ['text/x-vcard'];

				var vCard = {};
				var telephone = {};
				var telephone2 = {};
				var mobilephone = {};
				var telefax = {};

				$scope.vCardDropped = function vCardDropped(content) {

					if (dataService.canCreate()) {

						// parse vCard content
						VCF.parse(content, function (vc) {// jshint ignore:line
							vCard = vc;
						});
						var promises = [];
						// create new entities for telephone-numbers
						if (Object.prototype.hasOwnProperty.call(vCard, 'tel')) {
							if (vCard.tel.length > 0) {
								const telList = _.filter(vCard.tel, item => item.type.indexOf('WORK') > -1 || item.type.indexOf('CELL') > -1 || (item.type.indexOf('VOICE') > -1 && item.type.length > 1) || item.type.indexOf('FAX') > -1);
								const workTel = _.filter(telList, item => item.type.indexOf('WORK') > -1 && (item.type.indexOf('VOICE') > -1 || item.type.length === 1));
								const faxTel = _.filter(telList, item => item.type.indexOf('FAX') > -1);
								_.forEach(telList, function (item) {
									const typeList = item.type;
									promises.push(telephoneService.create(item.value).then(function (dto) {
										if (typeList.indexOf('WORK') > -1 && (typeList.indexOf('VOICE') > -1 || typeList.length === 1)) {
											if (workTel[0].value === item.value) {
												telephone = dto;
											} else {
												telephone2 = dto;
											}
										} else if (typeList[0] === 'CELL' || typeList.indexOf('CELL') > -1) {
											mobilephone = dto;
										} else if (typeList.indexOf('FAX') > -1) {
											if (faxTel[0].value === item.value) {
												telefax = dto;
											}
										}
									}));
								});
							}
						}

						if (promises.length === 0) {
							dataService.createItem();
						} else {
							$q.all(promises).then(function () {
								promises = [];
								dataService.createItem();
							});
						}
					}
				};

				// append created contact entity
				var onEntityCreated = function onEntityCreated(p1, newData) {

					if (!_.isEmpty(vCard)) {

						// var test = JSON.stringify(vCard);
						// "{\"fn\":\"Erika Mustermann\",\"n\":{\"family-name\":[\"Mustermann\"],\"given-name\":[\"Erika\"]},\"photo\":\"http://commons.wikimedia.org/wiki/File:Erika_Mustermann_2010.jpg\",\"tel\":[{\"type\":[\"work\",\"voice\"],\"value\":\"tel:+49-221-9999123\"},{\"type\":[\"home\",\"voice\"],\"value\":\"tel:+49-221-1234567\"}],\"email\":[{\"value\":\"erika@mustermann.de\"}],\"title\":[\"Oberleutnant\"],\"org\":[{\"organization-name\":\"Wikipedia\"}],\"rev\":\"2014-03-01T22:11:10.000Z\"}"

						if (Object.prototype.hasOwnProperty.call(vCard.n, 'given-name'))
						{
							newData.FirstName = vCard.n['given-name'][0];
						}
						if (Object.prototype.hasOwnProperty.call(vCard.n, 'family-name'))
						{
							newData.FamilyName = vCard.n['family-name'][0];
						}
						// eslint-disable-next-line no-prototype-builtins
						if (vCard.hasOwnProperty('email') && vCard.email.length > 0) {
							newData.Email = vCard.email[0].value;
						}

						if (!_.isEmpty(telephone)) {

							newData.TelephoneNumberDescriptor = telephone;
							newData.TelephonePattern = telephone.Telephone;
						}
						if (!_.isEmpty(telephone2)) {

							newData.TelephoneNumber2Descriptor = telephone2;
							newData.Telephone2Pattern = telephone2.Telephone;
						}
						if (!_.isEmpty(mobilephone)) {

							newData.MobileDescriptor = mobilephone;
							newData.MobilePattern = mobilephone.Telephone;
						}
						if (!_.isEmpty(telefax)) {

							newData.TeleFaxDescriptor = telefax;
							newData.TelefaxPattern = telefax.Telephone;
						}

						// load vCard photo
						/** @namespace vCard.photo */
						if (vCard.photo) {

							var photoContent = vCard.photo;
							photoService.createItem().then(function (photoEntity) {
								photoEntity.Blob.Content = photoContent;
							});
						}

					}
					vCard = {};
					telephone = {};
					telephone2 = {};
					mobilephone={};
					telefax={};

				};
				dataService.registerEntityCreated(onEntityCreated);

				// un-register on destroy
				$scope.$on('$destroy', function () {
					dataService.unregisterEntityCreated(onEntityCreated);
					// photoService.unregisterEntityCreated(onPhotoCreated);
				});

			};

			return service;

		}]);
})(angular);


/**
 * Created by reimer on 14.10.2015.
 */

(function (angular) {

	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,VCF,_ */

	let moduleName = 'businesspartner.contact';

	/**
	 * @ngdoc service
	 * @name businessPartnerContactVcardExtension
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('businessPartnerContactVcardExtension', ['$q', 'basicsCommonTelephoneService',

		function ($q, telephoneService) {

			let service = {};

			service.addVcardSupport = function addVcardSupport($scope, dataService, photoService) {

				$scope.fileDropped = function (file) {

					if ($scope.canDrop() && file.length === 1) {
						let reader = new FileReader();
						reader.onload = function () {
							// convert utf-8 (without bom) coded byte-array to a javascript string
							let s = String.fromCharCode.apply(null, new Uint8Array(reader.result));
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

				let vCard = {};
				let telephone = {};
				let telephone2 = {};

				$scope.vCardDropped = function vCardDropped(content) {

					if (dataService.canCreate()) {

						// parse vCard content
						VCF.parse(content, function (vc) {// jshint ignore:line
							vCard = vc;
						});

						let promises = [];

						// create new entities for telephone-numbers
						if (Object.prototype.hasOwnProperty.call(vCard, 'tel')) {
							if (vCard.tel.length > 0) {
								promises.push(telephoneService.create(vCard.tel[0].value).then(function (dto) {
									telephone = dto;
								})
								);
							}
							if (vCard.tel.length > 1) {
								promises.push(telephoneService.create(vCard.tel[1].value).then(function (dto) {
									telephone2 = dto;
								})
								);
							}
						}

						if (promises.length === 0) {
							dataService.createItem();
						} else {
							$q.all(promises).then(function () {
								dataService.createItem();
							});
						}
					}
				};

				// append created contact entity
				let onEntityCreated = function onEntityCreated(p1, newData) {

					if (!_.isEmpty(vCard)) {

						// var test = JSON.stringify(vCard);
						// "{\"fn\":\"Erika Mustermann\",\"n\":{\"family-name\":[\"Mustermann\"],\"given-name\":[\"Erika\"]},\"photo\":\"http://commons.wikimedia.org/wiki/File:Erika_Mustermann_2010.jpg\",\"tel\":[{\"type\":[\"work\",\"voice\"],\"value\":\"tel:+49-221-9999123\"},{\"type\":[\"home\",\"voice\"],\"value\":\"tel:+49-221-1234567\"}],\"email\":[{\"value\":\"erika@mustermann.de\"}],\"title\":[\"Oberleutnant\"],\"org\":[{\"organization-name\":\"Wikipedia\"}],\"rev\":\"2014-03-01T22:11:10.000Z\"}"

						newData.FirstName = vCard.n['given-name'][0];
						newData.FamilyName = vCard.n['family-name'][0];
						if (Object.prototype.hasOwnProperty.call(vCard, 'email') && vCard.email.length > 0) {
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

						// load vCard photo
						/** @namespace vCard.photo */
						if (vCard.photo) {

							let photoContent = vCard.photo;
							photoService.createItem().then(function (photoEntity) {
								photoEntity.Blob.Content = photoContent;
							});
						}

					}
					vCard = {};
				};
				dataService.registerEntityCreated(onEntityCreated);

				// // get assigned default values for the new main entity
				// var onPhotoCreated = function onPhotoCreated(p1, newData) {
				// if (photoContent) {
				// // newData.ContactFk = newContactId;
				// newData.Blob.Content = vCard.photo;
				// photoContent = null;
				// }
				// };
				// photoService.registerEntityCreated(onPhotoCreated);

				// un-register on destroy
				$scope.$on('$destroy', function () {
					dataService.unregisterEntityCreated(onEntityCreated);
					// photoService.unregisterEntityCreated(onPhotoCreated);
				});

			};

			return service;

		}]);
})(angular);


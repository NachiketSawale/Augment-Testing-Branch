((angular => {
	'use strict';

	angular.module('platform').service('genericWizardCharacteristicsService', service);

	service.$inject = ['_', '$http', 'BasicsCommonDateProcessor', 'basicsCharacteristicDataServiceFactory', 'basicsCharacteristicTypeHelperService'];

	function service(_, $http, DateProcessor, characteristicDataServiceFactory, helper) {
		var self = this;

		self.completeDto = {CharacteristicDataToSave: [], MainItemId: 0};
		self.dependendService = null;

		self.getDomainByType = function getDomainByType(type) {
			var domain;
			switch (type) {
				case 1:
					domain = 'boolean';
					break;
				case 2:
					domain = 'description';
					break;
				case 3:
					domain = 'integer';
					break;
				case 4:
					domain = 'percent';
					break;
				case 5:
					domain = 'money';
					break;
				case 6:
					domain = 'quantity';
					break;
				case 7:
					domain = 'date';
					break;
				case 8:
					domain = 'datetime';
					break;
			}
			return domain;
		};

		self.getBindingProp = function (domain) {
			var binding;
			switch (domain) {
				case 'boolean':
					binding = 'ValueBool';
					break;
				case 'description':
					binding = 'ValueText';
					break;
				case 'integer':
					binding = 'ValueNumber';
					break;
				case 'percent':
					binding = 'ValueNumber';
					break;
				case 'money':
					binding = 'ValueNumber';
					break;
				case 'quantity':
					binding = 'ValueNumber';
					break;
				case 'date':
					binding = 'ValueDate';
					break;
				case 'datetime':
					binding = 'ValueDate';
					break;
			}
			return binding;
		};

		self.getCharacsFromCodeList = function getCharacsFromCodeList(codeList) {
			return $http.post(globals.webApiBaseUrl + 'basics/characteristic/characteristic/getcharacteristicbycodes', codeList).then(function (result) {
				var list = result.data;
				_.each(list, function (charac) {
					charac.domain = self.getDomainByType(charac.CharacteristicTypeFk);
				});
				return list;
			});
		};

		self.getSectionFromSectionName = function getSectionFromSectionName(sectionName) {
			return $http.get(globals.webApiBaseUrl + 'basics/characteristic/section/list').then(function (result) {
				var list = result.data;
				return _.find(list, function (section) {
					return section.SectionName === sectionName;
				});
			});
		};

		self.createOrReadCharacValues = function createCharacValuesIfNeeded(sectionId, characList, mainItemId) {

			return $http.post(globals.webApiBaseUrl + 'basics/characteristic/data/createMany',
				{
					mainItemId: mainItemId,
					sectionId: sectionId,
					characFks: _.map(characList, function (charac) {
						return charac.Id;
					})
				}
			).then(function (result) {
				var characs = result.data;
				_.each(characs, function (characValue) {
					new DateProcessor(['ValueDate']).processItem(characValue);
				});
				return result.data;
			});
		};

		self.markItemAsModified = function service(characValue, mainItemId) {
			var found = _.find(self.completeDto.CharacteristicDataToSave, function (saved) {
				return saved.Id === characValue.Id;
			});
			if (!found) {
				self.completeDto.CharacteristicDataToSave.push(characValue);
				self.completeDto.MainItemId = mainItemId;
			}
		};

		self.update = function () {
			_.each(self.completeDto.CharacteristicDataToSave, function (charac) {
				var domain = self.getDomainByType(charac.CharacteristicTypeFk);
				var prop = self.getBindingProp(domain);
				charac.ValueText = helper.convertValue(charac[prop], charac.CharacteristicTypeFk);
				new DateProcessor(['ValueDate']).revertProcessItem(charac);
			});
			return $http.post(globals.webApiBaseUrl + 'basics/characteristic/data/update', self.completeDto).then(function update() {
				if (self.dependendService) {
					self.dependendService.load();
				}
				self.reset();
			});
		};

		self.reset = function reset() {
			self.completeDto = {CharacteristicDataToSave: [], MainItemId: 0};
			self.dependendService = null;
		};

		self.setDependendService = function setDependendService(service) {
			self.dependendService = service;
		};

	}
})(angular));

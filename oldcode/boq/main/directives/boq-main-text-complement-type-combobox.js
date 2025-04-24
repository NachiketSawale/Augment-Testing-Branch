(function (angular) {

	'use strict';

	var moduleName = 'boq.main';

	angular.module(moduleName).directive('boqMainTextComplementCombobox', ['$q', 'BasicsLookupdataLookupDirectiveDefinition', '$translate', 'platformTranslateService',

		function ($q, BasicsLookupdataLookupDirectiveDefinition, $translate, platformTranslateService) {

			platformTranslateService.registerModule(moduleName);

			var defaults = {
				lookupType: 'boqMainTextComplementTypes',
				valueMember: 'Id',
				displayMember: 'Description'
			};

			function getTranslatedComplementTypes() {
				var result = [];
				result.push({Id: 0,     Description: $translate.instant('boq.main.ComplTypeBidder')});
				result.push({Id: 1,     Description: $translate.instant('boq.main.ComplTypeClient')});
				result.push({Id: 'al',  Description: $translate.instant('boq.main.oen.uicontainer.textComplement.al')});
				result.push({Id: 'bl',  Description: $translate.instant('boq.main.oen.uicontainer.textComplement.bl')});
				result.push({Id: 'blo', Description: $translate.instant('boq.main.oen.uicontainer.textComplement.blo')});
				return result;
			}

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: {

					getList: function () {

						var deferred = $q.defer();
						deferred.resolve(getTranslatedComplementTypes());
						return deferred.promise;
					},

					getItemByKey: function (value) {

						function searchId(id) {
							var item = {};
							var list = getTranslatedComplementTypes();
							for (var i = 0; i < list.length; i++) {
								if (list[i].Id === id) {
									item = list[i];
									break;
								}
							}
							return item;
						}

						var deferred = $q.defer();
						deferred.resolve(searchId(value));
						return deferred.promise;
					}
				}
			});

		}
	]);

})(angular);

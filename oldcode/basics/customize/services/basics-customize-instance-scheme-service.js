/**
 * Created by Frank Baedeker on 27.04.2015.
 */
(function () {
	'use strict';
	var moduleName = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name basicsCustomizeInstanceSchemeService
	 * @function
	 *
	 * @description
	 *
	 * Generates a scheme information object for a given type out of the instance property definition
	 */
	angular.module(moduleName).service('basicsCustomizeInstanceSchemeService', BasicsCustomizeInstanceSchemeService);

	BasicsCustomizeInstanceSchemeService.$inject = ['_'];

	function BasicsCustomizeInstanceSchemeService(_) {
		this.getSchemaForType = function getSchemaForType(selType) {
			var res = {};

			if (selType) {
				_.forEach(selType.Properties, function (prop) {
					if (prop.Name !== 'Id' || (prop.IsVisible && prop.IsReadonly)) {
						res[prop.Name] = {domain: prop.Domain};
						res[prop.Name].mandatory = prop.Required;
						if(prop.NeedsStringLengthAttribute) {
							res[prop.Name].maxlen = prop.MaxLength;
							res[prop.Name].domainmaxlen = prop.MaxLength;
						}
					}
				});
			}

			return res;
		};
	}

})();

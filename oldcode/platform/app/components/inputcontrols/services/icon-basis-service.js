/**
 * Created by Alisch on 2015-12-09
 */

(function (angular) {
	'use strict';

	var moduleName = 'platform';

	/**
	 * @ngdoc service
	 * @name cloud.platform.services:platformIconBasisService
	 * @description
	 * Basis functionality for image selectors
	 */
	angular.module(moduleName).service('platformIconBasisService',
		['_', '$log', '$translate',

			function (_, $log, $translate) {
				var basicPath;
				var self = this;

				/**
				 * @ngdoc function
				 * @name Icon
				 * @function
				 * @methodOf platform.platformIconBasisService
				 * @description icon object
				 * @param { int } id The id of the icon. When undefined a Id will automatically generated.
				 * @param { string } translationKey To show a translated string
				 * @param { string } replaceText The text which will be inserted in the basicPath. When no basicPath is set the replaceText only is used for the path or css class of the icon.
				 * @param { string } type The type of icon
				 * @return { object } the icon object
				 */
				var Icon = function Icon(id, translationKey, replaceText, type) {
					this.id = id;
					this.text = $translate.instant(translationKey);
					var resText;

					if (basicPath) {
						resText = basicPath;
						if (replaceText) {
							resText = resText.replace(/%%replace%%/, replaceText);
						}
					} else {
						resText = replaceText;
					}

					this.res = resText;

					this.type = type;
				};

				/**
				 * @ngdoc function
				 * @name createUrlIcon
				 * @function
				 * @methodOf platform.platformIconBasisService
				 * @description Creates a new icon object
				 * @param { string } replaceText The text which will be inserted in the basicPath. When no basicPath is set the replaceText only is used for the path of the icon.
				 * @param { string } translationKey To show a translated string
				 * @return { object } The icon object
				 */
				this.createUrlIcon = function createUrlIcon(translationKey, replaceText) {
					return new Icon(undefined, translationKey, replaceText, 'url');
				};

				/**
				 * @ngdoc function
				 * @name createUrlIconWithId
				 * @function
				 * @methodOf platform.platformIconBasisService
				 * @description Creates a new icon object
				 * @param { int } id The id of the icon
				 * @param { string } translationKey to show a translated string
				 * @param { string } replaceText The text which will be inserted in the basicPath. When no basicPath is set the replaceText is only used for the path of the icon.
				 * @return { object } the icon object
				 */
				this.createUrlIconWithId = function createUrlIconWithId(id, translationKey, replaceText) {
					return new Icon(id, translationKey, replaceText, 'url');
				};

				/**
				 * @ngdoc function
				 * @name createCssIcon
				 * @function
				 * @methodOf platform.platformIconBasisService
				 * @description Creates a new icon object
				 * @param { string } replaceText The text which will be inserted in the basicPath. When no basicPath is set the replaceText is only used for the css class of the icon.
				 * @param { string } translationKey To show a translated string
				 * @return { object } the icon object
				 */
				this.createCssIcon = function createCssIcon(translationKey, replaceText) {
					return new Icon(undefined, translationKey, replaceText, 'css');
				};

				/**
				 * @ngdoc function
				 * @name createSvgIcon
				 * @function
				 * @methodOf platform.platformIconBasisService
				 * @description Creates a new icon object
				 * @param { string } replaceText The text which will be inserted in the basicPath. When no basicPath is set the replaceText is only used for the css class of the icon.
				 * @param { string } translationKey To show a translated string
				 * @return { object } the svg icon object
				 */
				this.createSvgIcon = function createSvgIcon(translationKey, replaceText) {
					return new Icon(undefined, translationKey, replaceText, 'svg');
				};

				/**
				 * @ngdoc function
				 * @name createCssIconWithId
				 * @function
				 * @methodOf platform.platformIconBasisService
				 * @description Creates a new icon object
				 * @param { int } id The id of the icon
				 * @param { string } translationKey To show a translated string
				 * @param { string } replaceText The text which will be inserted in the basicPath. When no basicPath is set the replaceText is only used for the css class of the icon.
				 * @return { object } the icon object
				 */
				this.createCssIconWithId = function createCssIconWithId(id, translationKey, replaceText) {
					return new Icon(id, translationKey, replaceText, 'css');
				};

				/**
				 * @ngdoc function
				 * @name setBasicPath
				 * @function
				 * @methodOf platform.platformIconBasisService
				 * @description Set the path in the basis service to generate icon URLs. The %%index%% string will be replaced by icon id.
				 * @param { string } path The Path
				 * @example
				 * platformIconBasisService.setBasicPath(globals.appBaseUrl + 'cloud.style/content/images/status-icons.svg#ico-status%%index%%');
				 */
				this.setBasicPath = function setBasicPath(path) {
					basicPath = path;
				};

				/**
				 * @ngdoc function
				 * @name extend
				 * @function
				 * @methodOf platform.platformIconBasisService
				 * @description Extends the handed over service by basic functions
				 * @param {array} icons An array with icon objects
				 * @param {array} iconMemberName Defines the name of the property of the item which contains the id of the icon. This param is optional. Default Values are 'icon' and 'Icon'.
				 * @param {object} service The service which should be extended
				 */
				this.extend = function extend(icons, service, iconMemberName) {
					if (!_.isEmpty(icons)) {
						var isIdToReplace = _.isUndefined(icons[0].id);
						var id = 0;

						for (var i = 0; i < icons.length; i++) {
							var icon = icons[i];

							// Insert ID in Icons, when missing. For that the order in array is used.
							if (isIdToReplace) {
								id++;
								icon.id = id;
							}

							// Replace %%index%% string in icon.res with id of the icon
							icon.res = icon.res.replace(/%%index%%/, _.padStart(icon.id, 2, '0'));
						}
					}

					self.addInterface(icons, service, iconMemberName);
				};

				this.addInterface = function addInterface(icons, service, iconMemberName) {
					var icoProperty = iconMemberName;

					service.setPropName = function setPropName(name) {
						icoProperty = name;
					};

					/**
					 * @ngdoc function
					 * @name getImageResById
					 * @function
					 * @methodOf platform.platformIconBasisService
					 * @description get the specified icon url via icon id.
					 * @param {int} id indicates the identifier of image
					 * @return {string} image res, for example css, svg class or the URL
					 */
					service.getImageResById = function getImageResById(id) {
						if (_.isUndefined(icons)) {
							$log.error('There are no icons defined in the image selector service.');
							return '';
						}

						if (angular.isUndefined(id) || id === null) {
							$log.error('The parameter <id> is necessary to use this function.');
							return '';
						}
						var icon = this.getItemById(id);

						if (_.isNull(icon) || angular.isUndefined(icon)) {
							$log.error('The key "' + id + '" doesn\'t exists.');
							return '';
						}

						return icon.res;
					};

					/**
					 * @ngdoc function
					 * @name isCss
					 * @function
					 * @methodOf platform.platformIconBasisService
					 * @description Indicates whether the icons are with css, svg or url classes
					 * @return {boolean} true when css classes, false when URL or SVG
					 */
					service.isCss = function isCss() {
						if (_.isUndefined(icons)) {
							$log.error('There are no icons defined.');
							return false;
						}

						// just check the first element in icons
						return !_.isEmpty(icons) && icons[0].hasOwnProperty('type') && icons[0].type === 'css';
					};

					/**
					 * @ngdoc function
					 * @name getIconType
					 * @function
					 * @methodOf platform.platformIconBasisService
					 * @description Get the specified type of icons
					 * @return {boolean} returns a string with either 'url', 'svg' or 'css' depending on icons type
					 */
					service.getIconType = () => {
						return !_.isEmpty(icons) && icons[0].hasOwnProperty('type') ? icons[0].type : '';
					};

					/**
					 * @ngdoc function
					 * @name select
					 * @function
					 * @methodOf platform.platformIconBasisService
					 * @description get the specified icon url via icon id. Just for the compatibility to the old services
					 * @param {object} item indicates the identifier of image
					 * @return {string} image resource, that means css, svg class or URL
					 */
					service.select = function select(item) {
						var id = _.get(item, icoProperty) || _.get(item, 'Icon') || _.get(item, 'icon');
						return _.isNull(id) || _.isUndefined(id) ? '' : this.getImageResById(id);
					};

					/**
					 * @ngdoc function
					 * @name getItems
					 * @function
					 * @methodOf platform.platformIconBasisService
					 * @description get all specified icons
					 * @return {Array} Array of icon objects.
					 */
					service.getItems = function getItems() {
						return _.map(icons, function (item) {
							return {id: item.id, text: item.text, res: item.res};
						});
					};

					/**
					 * @ngdoc function
					 * @name getItemById
					 * @function
					 * @methodOf platform.platformIconBasisService
					 * @description gets icon object by given id
					 * @param {number} id of icon
					 * @return {object} icon objects.
					 */
					service.getItemById = function getItemById(id) {
						return _.find(icons, {id: id}) || '';
					};
				};

				this.combine = function combine(service, sourceServices) {
					var icons = [];
					var id = 1;
					_.forEach(sourceServices, function (sourceService) {
						var srcIcons = sourceService.getItems();
						_.forEach(srcIcons, function (icon) {
							icon.id = id;
							icons.push(icon);
							++id;
						});
					});

					self.addInterface(icons, service);
				};
			}]);
})(angular);




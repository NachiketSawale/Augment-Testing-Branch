/**
 * Created by reimer on 28.06.2017
 */

(function () {

	'use strict';

	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name
	 * @function
	 *
	 * @description
	 *
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('boqMainGaebHelperService', ['$q',
		'$translate',
		function ($q,
			$translate) {

			var service = {};
			var _formatList = [
				{id: 0, name: 'GAEB_90', pattern: '.d', description$tr$: 'boq.main.gaeb90'},
				{id: 1, name: 'GAEB_2000', pattern: '.p', description$tr$: 'boq.main.gaeb2000'},
				{id: 2, name: 'GAEB_XML', pattern: '.x', description$tr$: 'boq.main.gaebXML'}
			];

			var _selectionType = [
				{id:0, name: 'Complete_BoQ_Document', description$tr$: 'boq.main.completeBoQDocument'},
				{id:1, name: 'BoQ_Area', description$tr$: 'boq.main.boqArea'}
			];

			var _typeList = [
				{id: 0, phase: '81', description$tr$: 'boq.main.gaebFile81'},
				{id: 1, phase: '82', description$tr$: 'boq.main.gaebFile82'},
				{id: 2, phase: '83', description$tr$: 'boq.main.gaebFile83'},
				{id: 3, phase: '84', description$tr$: 'boq.main.gaebFile84'},
				{id: 4, phase: '85', description$tr$: 'boq.main.gaebFile85'},
				{id: 5, phase: '86', description$tr$: 'boq.main.gaebFile86'}
			];

			var translateList = function (list) {
				for (var i = 0; i < list.length; i++) {
					list[i].description = $translate.instant(list[i].description$tr$);
				}
				return list;
			};

			service.getGaebFormatsAsync = function () {
				return $q.when(translateList(_formatList));
			};

			service.getGaebFormatByKeyAsync = function (id) {
				return service.getGaebFormatsAsync().then(function (data) {
					var item = {};
					for (var i = 0; i < data.length; i++) {
						if (data[i].id === id) {
							item = data[i];
							break;
						}
					}
					return item;
				});
			};

			service.getGaebSelectionTypeAsync = function () {
				return $q.when(translateList(_selectionType));
			};

			service.getGaebSelectionTypeByKeyAsync = function (id) {
				return service.getGaebSelectionTypeAsync().then(function (data) {
					var item = {};
					for (var i = 0; i < data.length; i++) {
						if (data[i].id === id) {
							item = data[i];
							break;
						}
					}
					return item;
				});
			};

			service.getGaebFormatId = function (ext) {
				for (var i = 0; i < _formatList.length; i++) {
					// if (ext.startsWith(_formatList[i].pattern)) { --> does not work on IE11????????
					if (('.' + ext.toLowerCase()).indexOf(_formatList[i].pattern) !== -1) {
						return _formatList[i].id;
					}
				}
				return null;
			};

			service.getGaebTypeId = function (ext) {
				for (var i = 0; i < _typeList.length; i++) {
					// if (ext.endsWith(_typeList[i].phase)) { --> does not work on IE11????????
					var l = _typeList[i].phase.length;
					if (ext.substr(-l, l) === _typeList[i].phase) {
						return _typeList[i].id;
					}
				}
				return null;
			};

			service.getSelectionTypeId = function (type) {
				for (var i = 0; i < _selectionType.length; i++) {
					if (type === _selectionType[i].name) {
						return _selectionType[i].id;
					}
				}
				return null;
			};

			service.getVersionByGaebFormatId = function (gaebFormatId) {
				for (var i = 0; i < _formatList.length; i++) {
					if (gaebFormatId === _formatList[i].id) {
						return _formatList[i].name;
					}
				}
				return null;
			};

			service.getFormatByGaebTypeId = function (gaebTypeId) {
				for (var i = 0; i < _typeList.length; i++) {
					if (gaebTypeId === _typeList[i].id) {
						return _typeList[i].phase;
					}
				}
				return null;
			};
			service.getGaebPhaseByExt = function (ext) {

				var id = service.getGaebTypeId(ext);
				return _typeList[id].phase;
			};

			service.getGaebExt = function (formatId, typeId) {
				var ext = '';
				for (var i = 0; i < _formatList.length; i++) {
					if (formatId === _formatList[i].id) {
						ext = _formatList[i].pattern;
						break;
					}
				}
				for (var z = 0; z < _typeList.length; z++) {
					if (typeId === _typeList[z].id) {
						ext = ext + _typeList[z].phase;
						break;
					}
				}
				return ext;
			};

			service.getGaebExtensionsAsync = function () {
				return $q.when(translateList(_typeList));
			};

			service.getAllGaebExt = function () {
				var result = [];
				for (var i = 0; i < _formatList.length; i++) {
					for (var z = 0; z < _typeList.length; z++) {
						result.push(_formatList[i].pattern + _typeList[z].phase);
					}
				}
				result.push('.ribx81');
				result.push('.ribx83');    // not really gaeb!
				return result;
			};

			service.getAllowedGaebExt = function (wizardParam) {

				var allowedExtensions = wizardParam.AllowedGaebExtensions && wizardParam.AllowedGaebExtensions.trim().replace('*', '') !== '' ?
					wizardParam.AllowedGaebExtensions.split(',') : service.getAllGaebExt();
				return allowedExtensions.map(function (ext) {
					return '.' + ext.trim().replace('.', '');
				}); // ensure that ext starts with a dot!
			};

			service.getFileExt = function (filename) {
				return filename.substring(filename.lastIndexOf('.') + 1, filename.length) || filename;
			};

			service.validateFileExt = function (filename, allowedExt) {

				var fileExt = '.' + service.getFileExt(filename).toLowerCase();
				if (allowedExt.findIndex(function (item) {
					return fileExt === item.toLowerCase();
				}) === -1) {
					return {error: true, message: 'File extension ' + fileExt + ' is NOT accepted!'};
				} else {
					return {error: false, message: ''};
				}
			};

			return service;

		}
	]);
})(angular);

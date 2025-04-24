/*
 * $Id: platform-id-utils-service.js 573965 2020-01-20 12:19:22Z haagf $
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform.platformIdUtilsService
	 * @function
	 *
	 * @description Provides utility routines to handle (simple and compound) IDs and sets thereof. This is the
	 *              complement of the server-side RIB.Visual.Platform.Common.IdentificationDataCompressor class.
	 */
	angular.module('platform').factory('platformIdUtilsService', ['_',
		function (_) {
			var service = {};

			function IdCollector(throwOnError) {
				this._throwOnError = throwOnError;
				this._ids = [];
				this._currentIdCmps = [];
				this._nextIdLevelIndex = null;
				this._currentIdText = '';
				this._idRangeStarted = false;
			}

			IdCollector.prototype.setIdLevelIndex = function (levelIndex) {
				this._appendRemainingId();
				this._nextIdLevelIndex = levelIndex;
			};

			IdCollector.prototype.appendIdText = function (text) {
				this._currentIdText += text;
			};

			IdCollector.prototype._appendRemainingId = function () {
				var currentId = parseInt(this._currentIdText, 16);
				if (_.isInteger(currentId)) {
					this._storeIdComponent(currentId);
					this._currentIdText = '';
				}
			};

			IdCollector.prototype._createId = function () {
				return {
					PKey3: this._currentIdCmps[3],
					PKey2: this._currentIdCmps[2],
					PKey1: this._currentIdCmps[1],
					Id: this._currentIdCmps[0]
				};
			};

			IdCollector.prototype._storeIdComponent = function (newId) {
				if (_.isInteger(this._nextIdLevelIndex)) {
					if ((this._nextIdLevelIndex === 0) && this._idRangeStarted) {
						var that = this;
						_.range(this._currentIdCmps[0] + 1, newId + 1).forEach(function (id) {
							that._currentIdCmps[0] = id;
							that._ids.push(that._createId());
						});
						this._idRangeStarted = false;
					} else {
						this._currentIdCmps[this._nextIdLevelIndex] = newId;

						if (this._nextIdLevelIndex === 0) {
							this._ids.push(this._createId());
						}
					}
				}
			};

			IdCollector.prototype.startIdRange = function () {
				this._appendRemainingId();
				if (this._nextIdLevelIndex !== 0) {
					return;
				}

				this._idRangeStarted = true;
			};

			IdCollector.prototype.finalizeIds = function () {
				this._appendRemainingId();
				return _.uniqWith(this._ids, function areIdsEqual(a, b) {
					return (a.PKey3 === b.PKey3) && (a.PKey2 === b.PKey2) && (a.PKey1 === b.PKey1) && (a.Id === b.Id);
				});
			};

			/**
			 * @ngdoc function
			 * @name parseCompressedIdentificationData
			 * @function
			 * @methodOf platformIdUtilsService
			 * @description Parses a set of IdentificationData records from a compressed string.
			 * @param {String} data The compressed ID string.
			 * @param {Boolean} failOnError Indicates whether an exception should be thrown upon parsing errors.
			 * @returns {Array<Object>>} An array with any detected IDs.
			 */
			service.parseCompressedIdentificationData = function (data, failOnError) {
				if (!_.isString(data) || _.isEmpty(data)) {
					return [];
				}

				var result = new IdCollector(failOnError);

				for (var i = 0; i < data.length; i++) {
					var ch = data.charAt(i);

					switch (ch) {
						case '§':
							result.setIdLevelIndex(3);
							break;
						case '$':
							result.setIdLevelIndex(2);
							break;
						case '/':
							result.setIdLevelIndex(1);
							break;
						case ':':
							result.setIdLevelIndex(0);
							break;
						case '0':
						case '1':
						case '2':
						case '3':
						case '4':
						case '5':
						case '6':
						case '7':
						case '8':
						case '9':
						case 'a':
						case 'b':
						case 'c':
						case 'd':
						case 'e':
						case 'f':
						case 'A':
						case 'B':
						case 'C':
						case 'D':
						case 'E':
						case 'F':
							result.appendIdText(ch);
							break;
						case '_':
							result.startIdRange();
							break;
						default:
							if (failOnError) {
								throw new Error('Invalid character "' + ch + '" in string "' + data + '".');
							}
							break;
					}
				}

				return result.finalizeIds();
			};

			/**
			 * @ngdoc function
			 * @name compressIdentificationData
			 * @function
			 * @methodOf platformIdUtilsService
			 * @description Transforms an array of IdentificationData records into a compressed string.
			 * @param {Array<Object>} ids The IDs to compress.
			 * @returns {String} A space-saving representation of the IDs.
			 */
			service.compressIdentificationData = function (ids) {
				var result = '';
				if (ids) {
					var pkey3Groups = _.groupBy(ids, function (id) {
						return _.isInteger(id.PKey3) ? id.PKey3 : '_';
					});
					Object.keys(pkey3Groups).forEach(function (pkey3) {
						var pkey3int = parseInt(pkey3);
						if (_.isInteger(pkey3int)) {
							result += '§' + pkey3int.toString(16);
						}
						var gPKey3 = pkey3Groups[pkey3];

						var pkey2Groups = _.groupBy(gPKey3, function (id) {
							return _.isInteger(id.PKey2) ? id.PKey2 : '_';
						});
						Object.keys(pkey2Groups).forEach(function (pkey2) {
							var pkey2int = parseInt(pkey2);
							if (_.isInteger(pkey2int)) {
								result += '$' + pkey2int.toString(16);
							}
							var gPKey2 = pkey2Groups[pkey2];

							var pkey1Groups = _.groupBy(gPKey2, function (id) {
								return _.isInteger(id.PKey1) ? id.PKey1 : '_';
							});
							Object.keys(pkey1Groups).forEach(function (pkey1) {
								var pkey1int = parseInt(pkey1);
								if (_.isInteger(pkey1int)) {
									result += '/' + pkey1int.toString(16);
								}
								var gPKey1 = pkey1Groups[pkey1];

								var prevId = null;
								var rangeStarted = false;
								_.sortedUniq(_.orderBy(_.map(gPKey1, function (id) {
									return id.Id;
								}))).forEach(function (id) {
									if (prevId !== id) {
										if (prevId === id - 1) {
											if (!rangeStarted) {
												result += '_';
												rangeStarted = true;
											}
										} else {
											if (rangeStarted) {
												rangeStarted = false;
												result += prevId.toString(16);
											}
											result += ':' + id.toString(16);
										}
										prevId = id;
									}
								});
								if (rangeStarted) {
									result += prevId.toString(16);
								}
							});
						});
					});
				}
				return result;
			};

			return service;
		}]);
})();
/**
 * Created by wri on 5/24/2017.
 */
(function (angular) {
	'use strict';

	var moduleName = 'boq.main';
	angular.module(moduleName).factory('boqMainTextOutPutConfigService',
		['boqMainTextGridService',
			function (boqMainTextGridService) {

				var service = {}, arrayTexts = [], outputItems = [];
				var lowerOrUpper = {};
				Object.defineProperties(lowerOrUpper, {
					lower: {
						value: 97,
						writable: false
					},
					upper: {
						value: 65,
						writable: false
					}
				});
				angular.extend(service, {
					getTextConfiguration: getTextConfiguration
				});

				function TextConfigStrDirector(tree) {
					this.build = function (textConfigStrBuilder) {
						arrayTexts = [];
						outputItems = [];
						if (tree && tree.length > 0) {
							textConfigStrBuilder.buildNumbering(tree);
							textConfigStrBuilder.buildCombination();
							textConfigStrBuilder.buildSplit();
						}
					};
					this.getResult = function () {
						var result = '';
						for (var i = 0; i < arrayTexts.length; i++) {
							result += arrayTexts[i];
						}
						return result;
					};
				}

				function TextConfigStrBuilder() {
					this.buildSplit = function () {
						setSplit();
					};
					this.buildCombination = function () {
						setCombination();
					};
					this.buildNumbering = function (tree) {
						setNumbering(tree);
					};
				}

				function setSplit() {
					if (boqMainTextGridService.getSelectedSplitId()) {
						switch (boqMainTextGridService.getSelectedSplitId()) {
							case 1 :
								setWithLinefeed();
								break;
							case 2 :
								setWithComma();
								break;
							case 3 :
								setWithCommaAndRoundBracket();
								break;
							default :
								break;
						}
					}
				}

				function setCombination() {
					if (boqMainTextGridService.getSelectedCombinationId()) {
						switch (boqMainTextGridService.getSelectedCombinationId()) {
							case 1 :
								setDesNDetailNPostfix();
								break;
							case 2 :
								setDesNPostfix();
								break;
							case 3 :
								setDetailNPostfix();
								break;
							default :
								break;
						}
					}
				}

				function setNumbering(tree) {
					if (boqMainTextGridService.getSelectedNumberingId()) {
						switch (boqMainTextGridService.getSelectedNumberingId()) {
							case 1 :
								setDigit(tree, '');
								break;
							case 2 :
								setLowercase(tree, '');
								break;
							case 3 :
								setUppercase(tree, '');
								break;
							case 4 :
								setNone(tree);
								break;
							default :
								break;
						}
					}
				}

				function setWithLinefeed() {
					for (var i = 0; i < arrayTexts.length; i++) {
						arrayTexts[i] = arrayTexts[i] + '\n';
					}
				}

				function setWithComma() {
					for (var i = 0; i < arrayTexts.length; i++) {
						arrayTexts[i] = arrayTexts[i] + ',';
					}
					arrayTexts[i - 1] = arrayTexts[i - 1].substring(0, arrayTexts[i - 1].lastIndexOf(','));
				}

				function setWithCommaAndRoundBracket() {
					for (var i = 0; i < arrayTexts.length; i++) {
						if (i === 0) {
							arrayTexts[i] = '(' + arrayTexts[i];
						}
						if (i === arrayTexts.length - 1) {
							arrayTexts[i] = arrayTexts[i] + ')';
						}
						arrayTexts[i] = arrayTexts[i] + ',';
					}
					arrayTexts[i - 1] = arrayTexts[i - 1].substring(0, arrayTexts[i - 1].lastIndexOf(','));
				}

				function setDesNDetailNPostfix() {
					for (var i = 0; i < arrayTexts.length; i++) {
						arrayTexts[i] = arrayTexts[i] + boqMainTextGridService.getConfigCaption(outputItems[i]) + ':' + boqMainTextGridService.getConfigBody(outputItems[i]) + boqMainTextGridService.getConfigTail(outputItems[i]);
					}
				}

				function setDesNPostfix() {
					for (var i = 0; i < arrayTexts.length; i++) {
						arrayTexts[i] = arrayTexts[i] + boqMainTextGridService.getConfigCaption(outputItems[i]) + boqMainTextGridService.getConfigTail(outputItems[i]);
					}
				}

				function setDetailNPostfix() {
					for (var i = 0; i < arrayTexts.length; i++) {
						arrayTexts[i] = arrayTexts[i] + boqMainTextGridService.getConfigBody(outputItems[i]) + boqMainTextGridService.getConfigTail(outputItems[i]);
					}
				}

				function setDigit(tree, preidentifier) {
					var identifier = 0;
					angular.forEach(tree, function (item) {
						if (boqMainTextGridService.getIsOutput(item)) {
							identifier++;
							arrayTexts.push(preidentifier + identifier + '.');
							outputItems.push(item);
							if (item.BoqTextConfigGroups !== null) {
								preidentifier = preidentifier + identifier + '.';
								setDigit(item.BoqTextConfigGroups, preidentifier);
								preidentifier = preidentifier.substring(0, preidentifier.lastIndexOf('.') - 1);
							}
						}
					});
				}

				function setLowercase(tree, preidentifier) {
					var identifier = 0;
					angular.forEach(tree, function (item) {
						if (boqMainTextGridService.getIsOutput(item)) {
							identifier++;
							arrayTexts.push(preidentifier + transformAsciitoAlpIdentifier(identifier - 1, lowerOrUpper.lower) + '.');
							outputItems.push(item);
							if (item.BoqTextConfigGroups !== null) {
								preidentifier = preidentifier + transformAsciitoAlpIdentifier(identifier - 1, lowerOrUpper.lower) + '.';
								setLowercase(item.BoqTextConfigGroups, preidentifier);
								preidentifier = preidentifier.substring(0, preidentifier.lastIndexOf('.') - 1);
							}
						}
					});
				}

				function setUppercase(tree, preidentifier) {
					var identifier = 0;
					angular.forEach(tree, function (item) {
						if (boqMainTextGridService.getIsOutput(item)) {
							identifier++;
							arrayTexts.push(preidentifier + transformAsciitoAlpIdentifier(identifier - 1, lowerOrUpper.upper) + '.');
							outputItems.push(item);
							if (item.BoqTextConfigGroups !== null) {
								preidentifier = preidentifier + transformAsciitoAlpIdentifier(identifier - 1, lowerOrUpper.upper) + '.';
								setUppercase(item.BoqTextConfigGroups, preidentifier);
								preidentifier = preidentifier.substring(0, preidentifier.lastIndexOf('.') - 1);
							}
						}
					});
				}

				function setNone(tree) {
					angular.forEach(tree, function (item) {
						if (boqMainTextGridService.getIsOutput(item)) {
							arrayTexts.push('');
							outputItems.push(item);
							if (item.BoqTextConfigGroups !== null) {
								setNone(item.BoqTextConfigGroups);
							}
						}
					});
				}

				function transformAsciitoAlpIdentifier(ascii, lowOrUp) {
					var quotient = ascii, count = 0, remainder = [], result = '';
					if (quotient >= 0 && quotient <= 25) {
						remainder.push(quotient % 26);
					} else {
						do {
							if (++count === 1) {
								remainder.push(quotient % 26);
							} else {
								remainder.push(quotient % 26 - 1);
							}
							quotient = Math.floor(quotient / 26);
						} while (quotient > 0);
					}
					// if remainder has zero except unit digit
					for (var i = 0; i < remainder.length; i++) {
						if (remainder[i] === -1 && i !== remainder.length) {
							remainder[i] = 25;
							remove(remainder, i + 1);
						}
					}
					// remainder hasn't zero except unit digit
					for (var j = 0; j < remainder.length; j++) {
						result += String.fromCharCode(lowOrUp + remainder[remainder.length - j - 1]);
					}

					return result;
				}

				function remove(array, index) {
					if (index <= (array.length - 1)) {
						for (var i = index; i < array.length; i++) {
							array[i] = array[i + 1];
						}
					} else {
						throw new Error('exceed the largest index!');
					}
					array.length = array.length - 1;
					return array;
				}

				function getTextConfiguration(tree) {
					var builder = new TextConfigStrBuilder();
					var director = new TextConfigStrDirector(tree);
					director.build(builder);
					return director.getResult();
				}

				return service;
			}]);
})(angular);

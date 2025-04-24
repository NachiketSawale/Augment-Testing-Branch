(function () {
	'use strict';
	var moduleName = 'basics.common';
	angular.module(moduleName).factory('basicsCommonUnitFormatterService',
		['basicsCommonFormatterHelper', 'platformDomainService', '$sanitize', 'basicsUnitLookupDataService', '$q', 'math', 'accounting', 'platformLanguageService', 'platformContextService', '_',
			function (basicsCommonFormatterHelper, platformDomainService, $sanitize, basicsUnitLookupDataService, $q, math, accounting, platformLanguageService, platformContextService, _) {

				const service = this;
				const culture = platformContextService.culture();
				const cultureInfo = platformLanguageService.getLanguageInfo(culture);

				// function getClosestFraction(value, tol, excludeWhole) {
				// tol = math.inv(tol);
				// const originalValue = value;
				// let iteration = 0;
				// let denominator = 1, lastD = 0, numerator;
				// while (iteration < 20) {
				// value = 1 / (value - math.floor(value));
				// var _d = denominator;
				// denominator = math.floor(denominator * value + lastD);
				// lastD = _d;
				// numerator = math.ceil(originalValue * denominator);
				// if (math.abs(numerator / denominator - originalValue) < tol) {
				// break;
				// }
				// iteration++;
				// }
				// var result = numerator + '/' + denominator;
				// if (excludeWhole) {
				// // normalize fraction
				// if (numerator > denominator) {
				// result = math.floor(numerator / denominator) + ' ' + (numerator % denominator) + '/' + denominator;
				// }
				// }
				// return result;
				// }

				function getClosestImperialFraction(value, tol, excludeWhole) {
					var originalValue = value;
					var denominator = tol;
					var numerator = math.round(originalValue * denominator);
					while (denominator >= 1 && (numerator / 2) % 1 === 0) {
						denominator /= 2;
						numerator /= 2;
					}

					var result = numerator + '/' + denominator;
					if (excludeWhole) {
						// normalize fraction
						if (numerator > denominator) {
							result = math.floor(numerator / denominator) + ' ' + (numerator % denominator) + '/' + denominator;
						}
					}
					return result;
				}

				function getFraction(value, tolerance, excludeWhole) {
					// var preciseFractionDenominator = math.fraction(value).d;
					return getClosestImperialFraction(value, tolerance, excludeWhole);
					// return (preciseFractionDenominator <= tolerance) ? math.fraction(value).toFraction(excludeWhole) : getClosestFraction(value, tolerance, excludeWhole);
				}

				// function getDecimals(value, precision, excludeZero) {
				// value = math.multiply(value,math.pow(10, precision));
				// var decimalLength = math.string(value).length;
				// var result = '';
				// if (decimalLength > 0) {
				// for (var i = 0; i < (precision-decimalLength); i++) {
				// result += '0';
				// }
				// }
				// if (excludeZero) {
				// var iteration = 0;
				// while (iteration < precision) {
				// var lesserValue = math.divide(value, 10);
				// if (math.round(lesserValue, 12) !== math.floor(lesserValue)) {
				// break;
				// }
				// value = lesserValue;
				// iteration++;
				// }
				// }
				// result += math.round(value);
				// return result;
				// }

				function getDigits(isFraction, value, excludeWhole, columnDef, dataContext) {
					// rounding errors
					value = math.round(value, 12);
					var result = '';
					var domain = columnDef.domain;
					if (_.isFunction(columnDef.domain)) {
						domain = columnDef.domain(dataContext);
					}
					var domainInfo = platformDomainService.loadDomain(domain);
					var precision = (columnDef.formatterOptions && columnDef.formatterOptions.decimalPlaces) || (columnDef.editorOptions && columnDef.editorOptions.decimalPlaces) || domainInfo.precision;

					if (isFraction) {
						var integer = math.floor(value);
						var decimals = math.round((value - math.floor(value)), 12);
						var tolerance = math.pow(2, precision);

						if (integer > 0 || isFraction === false || decimals === 0) {
							result = result + accounting.formatNumber(integer, 0, cultureInfo.numeric.thousand, cultureInfo.numeric.decimal);
						}
						if (decimals > (1 / (tolerance * 2))) {
							if (integer > 0) {
								result += ' ';
							}
							result += getFraction(decimals, tolerance, excludeWhole);
						}
					} else {
						result = accounting.formatNumber(value, precision, cultureInfo.numeric.thousand, cultureInfo.numeric.decimal);
					}
					return result !== '' ? result : '0';
				}

				service.convertUnit = function convertUnit(value, formerUnit, unit) {
					try {
						return math.round(math.unit(value, formerUnit).to(unit).toNumber(), 6);
					} catch (e) {
						return value;
					}
				};

				function getFloat(numberString) {
					var number;
					// delete all unknown characters
					numberString = numberString.replace(/[^0-9\s/:]/g, '');
					// remove all superfluous spaces
					while (/\s/.test(numberString.charAt(0))) {
						numberString = numberString.substr(1);
					}
					// if result contains fraction
					if (numberString.search(/[/:]/g) !== -1) {
						// replace colon with slashes
						numberString = numberString.replace(/:/g, '/');
						numberString = numberString.replace(/[,.]/g, '');
						try {
							number = math.fraction(numberString).valueOf();
						} catch (e) {
							numberString = numberString.replace(/\//g, '');
							number = accounting.unformat(numberString, cultureInfo.numeric.decimal);
						}
					}
					// else parse in the known way, like numeric values
					else if (numberString.search(/[,.]/g) !== -1) {
						var split = numberString.replace(/,/g, cultureInfo.numeric.decimal).replace(/\./g, cultureInfo.numeric.decimal).split(cultureInfo.numeric.decimal);
						var last = split.pop();
						numberString = split.length ? split.join('').concat(cultureInfo.numeric.decimal, last) : last;
						number = accounting.unformat(numberString, cultureInfo.numeric.decimal);
					} else {
						number = accounting.unformat(numberString, cultureInfo.numeric.decimal);
					}
					return number;
				}

				function replaceAlternatives(viewValue, domainInfo) {
					var collection = domainInfo.alternativeUnits.slice();
					collection.unshift(domainInfo.destinationUnit);
					collection = _.unzip(collection);
					_.each(collection, function (alt) {
						var original = alt[0];
						alt.shift();
						var replacableRegex = new RegExp(alt.join('|'), 'g');
						viewValue = viewValue.replace(replacableRegex, original);
					});
					return viewValue;
				}

				service.simpleParser = function simpleParser(viewValue, definition, dataContext) {
					var modelValue = getFloat(viewValue);
					if (definition.uom) {
						var uomItem = fetchUom(definition.uom);
						var originalUomItem = fetchUom(service.detectUom(definition.field, dataContext));
						modelValue = service.lookupUomConverter(modelValue, uomItem, originalUomItem);
					}
					return modelValue;
				};

				service.unitParser = function unitParser(viewValue, domainInfo) {
					if (domainInfo.alternativeUnits) {
						viewValue = replaceAlternatives(viewValue, domainInfo);
					}
					var destUnits = domainInfo.destinationUnit;
					var originalUnit = domainInfo.baseUnit;
					var remainingString = viewValue;
					var parts = [];
					_.each(destUnits, function (unit) {
						// split
						var splitAtUnit = remainingString.split(unit);
						var element;
						// if successful split
						if (splitAtUnit.length > 1) {
							element = splitAtUnit[0];
							splitAtUnit.shift();
						}
						remainingString = splitAtUnit.join();
						if (element) {
							// parse as float
							if (splitAtUnit) {
								element = getFloat(element) + unit;
							}
							// parse as unit
							element = math.unit(element);
							// add to parts
							parts.push(element);
						}
					});
					var sum = parts.length > 0 ? math.sum(parts) : math.unit(math.bignumber(getFloat(viewValue)), destUnits[0]);
					sum = sum.to(originalUnit).toNumber();
					return sum ? math.round(sum, 12) : 0;
				};

				service.simpleUomFormatter = function simpleUomFormatter(value, columnDef, dataContext, isFraction) {
					if (_.isUndefined(dataContext) || dataContext === null) {
						return value;
					}
					var result = getDigits(isFraction, value, true, columnDef, dataContext);
					return result ? $sanitize(result) : '';
				};

				service.lookupUomConverter = function lookupUomConverter(value, uomItem, foreignUomItem, defaultFactor) {
					if (_.isUndefined(foreignUomItem) || (_.isUndefined(uomItem) && defaultFactor === 0)) {
						return value;
					}
					var factor = _.isUndefined(uomItem) ? defaultFactor : uomItem.Factor / foreignUomItem.Factor;
					return value * factor;
				};

				service.unitFormatter = function unitFormatter(value, columnDef, dataContext) {
					if (_.isUndefined(dataContext) || dataContext === null) {
						return value;
					}
					var options = platformDomainService.loadDomain(columnDef.domain);

					var srcUnit = options.baseUnit;
					var destUnit = options.destinationUnit;
					var bigValue = math.bignumber(value);
					var convertedValue = math.unit(bigValue, srcUnit);
					var impSplit = convertedValue.splitUnit(destUnit);
					var cnt = 0;
					var result = '';
					_.each(impSplit, function addToResult(u) {
						var first = (cnt === 0);
						var last = (cnt === (impSplit.length - 1));
						var uName = u.units[0].prefix.name + u.units[0].unit.name;
						result = result + (result === '' ? '' : ' ');
						result = result + ((u.to(uName).toNumber() > 0 || value === 0 && first) ? (getDigits(options.isFraction, u.to(uName).toNumber(), last, columnDef, dataContext) + uName) : '');
						cnt++;
					});

					// format with '/"
					result = result.replace(/ft/g, '\'');
					result = result.replace(/in/g, '"');

					return result ? result : '';
				};

				service.returnLookupSettings = function returnLookupSettings() {
					return {
						lookupType: 'basicsUnitLookupDataService',
						dataServiceName: 'basicsUnitLookupDataService'
					};
				};

				service.detectUom = function detectUom(name, data) {
					let result = undefined;
					const lcName = name.toLowerCase();
					// look for uom with the same name
					_.each(data, function (value, key) {
						var lcKey = key.toLowerCase();
						if (lcKey.includes(lcName) && lcKey.includes('uom')) {
							result = value;
						}
					});
					// look for uom in general
					if (_.isUndefined(result)) {
						_.each(data, function (value, key) {
							var lcKey = key.toLowerCase();
							if (lcKey === 'uomfk') {
								result = value;
							}
						});
					}
					return result;
				};

				function fetchUom(value) {
					var uomOpt = service.returnLookupSettings();
					return basicsUnitLookupDataService.getItemById(value, uomOpt);
				}

				service.fetchUomAsync = function fetchUomAsync(columnDef, dataContext) {
					var deferred = $q.defer();
					var uomVal = service.detectUom(columnDef.field, dataContext);
					var uomOpt = service.returnLookupSettings();
					deferred.resolve(
						basicsUnitLookupDataService.getItemByIdAsync(uomVal, uomOpt)
							.then(function (uomItem) {
								if (uomItem) {
									return uomItem;
								}
							})
					);
					return deferred.promise;
				};

				service.uomBranch = function uomBranch(value, columnDef, dataContext, uomItem) {
					if (_.isUndefined(uomItem)) {
						var uomVal = service.detectUom(columnDef.field, dataContext);
						uomItem = fetchUom(uomVal);
					}

					let defaultFactor = 0;
					if (_.isUndefined(uomItem)) {
						if(_.has(columnDef, 'weightsourceuomfactor') && _.has(dataContext, 'WeightSourceUomFk') && dataContext.WeightSourceUomFk){
							uomItem = fetchUom(dataContext.WeightSourceUomFk);
							defaultFactor = columnDef.weightsourceuomfactor;
						}

						if(_.has(columnDef, 'areasourceuomfactor') && _.has(dataContext, 'AreaSourceUomFk') && dataContext.AreaSourceUomFk){
							uomItem = fetchUom(dataContext.AreaSourceUomFk);
							defaultFactor = columnDef.areasourceuomfactor;
						}
					}

					var options = platformDomainService.loadDomain(columnDef.domain);
					if (options.baseUnit) {
						return service.unitFormatter(value, columnDef, dataContext);
					} else {
						if (columnDef.uom) {
							var foreignUomItem = fetchUom(columnDef.uom);
							value = service.lookupUomConverter(value, uomItem, foreignUomItem, defaultFactor);
						}
						var isFraction = columnDef.fraction || false;
						return service.simpleUomFormatter(value, columnDef, dataContext, isFraction);
					}
				};

				service.uomParseBranch = function uomBranch(viewValue, definition, dataContext) {
					var domainInfo = platformDomainService.loadDomain(definition.domain);
					if (domainInfo.baseUnit) {
						return service.unitParser(viewValue, domainInfo);
					} else {
						return service.simpleParser(viewValue, definition, dataContext);
					}
				};

				return service;
			}]);
})(angular);

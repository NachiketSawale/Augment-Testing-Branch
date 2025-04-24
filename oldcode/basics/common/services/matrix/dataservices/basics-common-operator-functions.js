(function () {

	'use strict';

	const moduleName = 'basics.common';
	const basics = angular.module(moduleName);
	const serviceName = 'basicsCommonOperatorFunctionsService';
	basics.factory(serviceName, ['$q', '_', 'platformObjectHelper', 'moment', '$injector', '$translate', 'math', 'platformTranslateService', 'platformDomainService',
		function ($q, _, objectHelper, moment, $injector, $translate, math, platformTranslateService, platformDomainService) {
			const datePattern = 'YYYY-MM-DD';
			const parameters = {
				identifier: ['PropertyIdentifier'],
				compare1: ['PropertyIdentifier', 'CompareValue1'],
				compare2: ['PropertyIdentifier', 'CompareValue1', 'CompareValue2'],
				compare3: ['PropertyIdentifier', 'CompareProperty1'],
				compare4: ['PropertyIdentifier', 'CompareProperty1', 'CompareValue1'],
				compare5: ['PropertyIdentifier', 'CompareProperty2'],
				validIndices: [1, 2]
			};

			// mapping for Bas-Operators
			let operators;
			// make sure translation table of platform is loaded
			platformTranslateService.registerModule('app', true).then(function () {
				operators = [
					{
						id: 1,
						fn: function (propertyIdentifier, compareValue1) {
							return propertyIdentifier && compareValue1;
						},
						parameters: [],
						placeholder: {
							CompareValue1: $translate.instant('platform.bulkEditor.allMustMatch')
						}
					},
					{
						id: 2,
						fn: function (propertyIdentifier, compareValue1) {
							return propertyIdentifier || compareValue1;
						},
						parameters: parameters.compare1,
						placeholder: {
							CompareValue1: $translate.instant('platform.bulkEditor.anyMustMatch')
						}
					},
					{
						id: 3,
						fn: function (propertyIdentifier, compareValue1) {
							if (moment.isMoment(propertyIdentifier) && moment.isMoment(compareValue1)) {
								return propertyIdentifier.format(datePattern) === compareValue1.format(datePattern);
							}
						},
						parameters: parameters.compare1,
						placeholder: {
							CompareValue1: $translate.instant('platform.bulkEditor.compareDate')
						}
					},
					{
						id: 4,
						fn: function (propertyIdentifier, compareValue1) {
							if (moment.isMoment(propertyIdentifier) && moment.isMoment(compareValue1)) {
								return propertyIdentifier.format(datePattern) !== compareValue1.format(datePattern);
							}
						},
						parameters: parameters.compare1,
						placeholder: {
							CompareValue1: $translate.instant('platform.bulkEditor.compareDate')
						}
					},
					{
						id: 5,
						fn: function (propertyIdentifier, compareValue1) {
							if (moment.isMoment(propertyIdentifier) && moment.isMoment(compareValue1)) {
								const mValue = moment(propertyIdentifier.format(datePattern));
								const cValue = moment(compareValue1.format(datePattern));
								return mValue.isBefore(cValue);
							}
						},
						parameters: parameters.compare1,
						placeholder: {
							CompareValue1: $translate.instant('platform.bulkEditor.compareDate')
						}
					},
					{
						id: 6,
						fn: function (propertyIdentifier, compareValue1) {
							if (moment.isMoment(propertyIdentifier) && moment.isMoment(compareValue1)) {
								const mValue = moment(propertyIdentifier.format(datePattern));
								const cValue = moment(compareValue1.format(datePattern));
								return mValue.isAfter(cValue);
							}
						},
						parameters: parameters.compare1,
						placeholder: {
							CompareValue1: $translate.instant('platform.bulkEditor.compareDate')
						}
					},
					{
						id: 7,
						fn: function (propertyIdentifier) {
							return propertyIdentifier === true;
						},
						parameters: parameters.identifier
					},
					{
						id: 8,
						fn: function (propertyIdentifier) {
							return propertyIdentifier === false;
						},
						parameters: parameters.identifier
					},
					{
						id: 9,
						fn: function (propertyIdentifier, compareValue1) {
							return propertyIdentifier > compareValue1;
						},
						parameters: parameters.compare1,
						placeholder: {
							CompareValue1: $translate.instant('platform.bulkEditor.compareValue')
						}
					},
					{
						id: 10,
						fn: function (propertyIdentifier, compareValue1) {
							return propertyIdentifier < compareValue1;
						},
						parameters: parameters.compare1,
						placeholder: {
							CompareValue1: $translate.instant('platform.bulkEditor.compareValue')
						}
					},
					{
						id: 11,
						fn: function (propertyIdentifier, compareValue1) {
							return propertyIdentifier === compareValue1;
						},
						parameters: parameters.compare1,
						placeholder: {
							CompareValue1: $translate.instant('platform.bulkEditor.compareValue')
						}
					},
					{
						id: 12,
						fn: function (propertyIdentifier, compareValue1) {
							if (objectHelper.isSet(propertyIdentifier) && objectHelper.isSet(compareValue1)) {
								return propertyIdentifier.indexOf(compareValue1) > -1;
							}
						},
						parameters: parameters.compare1,
						placeholder: {
							CompareValue1: $translate.instant('platform.bulkEditor.substring')
						}
					},
					{
						id: 13,
						fn: function (propertyIdentifier, compareValue1) {
							if (objectHelper.isSet(propertyIdentifier) && objectHelper.isSet(compareValue1)) {
								return propertyIdentifier.startsWith(compareValue1);
							}
						},
						parameters: parameters.compare1,
						placeholder: {
							CompareValue1: $translate.instant('platform.bulkEditor.substring')
						}
					},
					{
						id: 14,
						fn: function (propertyIdentifier, compareValue1) {
							if (objectHelper.isSet(propertyIdentifier) && objectHelper.isSet(compareValue1)) {
								return _.endsWith(propertyIdentifier, compareValue1);
							}
						},
						parameters: parameters.compare1,
						placeholder: {
							CompareValue1: $translate.instant('platform.bulkEditor.substring')
						}
					},
					{
						id: 15,
						fn: function (propertyIdentifier, compareValue1) {
							if (objectHelper.isSet(propertyIdentifier) && objectHelper.isSet(compareValue1)) {
								return propertyIdentifier.toUpperCase() === compareValue1.toUpperCase();
							}
						},
						parameters: parameters.compare1,
						placeholder: {
							CompareValue1: $translate.instant('platform.bulkEditor.string')
						}
					},
					{
						id: 16,
						fn: function (propertyIdentifier, compareValue1) {
							return propertyIdentifier < compareValue1;
						},
						parameters: parameters.compare1,
						placeholder: {
							CompareValue1: $translate.instant('platform.bulkEditor.compareValue')
						}
					},
					{
						id: 17,
						fn: function (propertyIdentifier, compareValue1) {
							return propertyIdentifier > compareValue1;
						},
						parameters: parameters.compare1,
						placeholder: {
							CompareValue1: $translate.instant('platform.bulkEditor.compareValue')
						}
					},
					{
						id: 18,
						fn: function (propertyIdentifier, compareValue1) {
							return propertyIdentifier === compareValue1;
						},
						parameters: parameters.compare1,
						placeholder: {
							CompareValue1: $translate.instant('platform.bulkEditor.compareValue')
						}
					},
					{
						// isAfterProperty
						id: 19,
						fn: function (propertyIdentifier, compareProperty1) {
							if (moment.isMoment(propertyIdentifier) && moment.isMoment(compareProperty1)) {
								const mValue = moment(propertyIdentifier.format(datePattern));
								const cValue = moment(compareProperty1.format(datePattern));
								return mValue.isAfter(cValue);
							}
						},
						parameters: parameters.compare3,
						placeholder: {
							CompareValue1: $translate.instant('platform.bulkEditor.compareField')
						}
					},
					{
						// isBeforeProperty
						id: 20,
						fn: function (propertyIdentifier, compareProperty1) {
							if (moment.isMoment(propertyIdentifier) && moment.isMoment(compareProperty1)) {
								const mValue = moment(propertyIdentifier.format(datePattern));
								const cValue = moment(compareProperty1.format(datePattern));
								return mValue.isBefore(cValue);
							}
						},
						parameters: parameters.compare3,
						placeholder: {
							CompareValue1: $translate.instant('platform.bulkEditor.compareField')
						}
					},
					{
						// isBetween 2 User Date Inputs
						id: 21,
						fn: function (propertyIdentifier, compareValue1, compareValue2) {
							if (moment.isMoment(propertyIdentifier) && moment.isMoment(compareValue1) && moment.isMoment(compareValue2)) {
								const mValue = moment(propertyIdentifier.format(datePattern));
								compareValue1 = moment(compareValue1.format(datePattern));
								compareValue2 = moment(compareValue2.format(datePattern));
								return mValue.isAfter(compareValue1) && mValue.isBefore(compareValue2);
							}
						},
						parameters: parameters.compare2,
						placeholder: {
							CompareValue1: $translate.instant('platform.bulkEditor.compareStart'),
							CompareValue2: $translate.instant('platform.bulkEditor.compareEnd'),
						}
					},
					{
						// Is After Date Field with Days
						id: 22,
						inputDomain: 'integer',
						fn: function (propertyIdentifier, compareProperty1, compareValue1) {
							if (moment.isMoment(propertyIdentifier) && moment.isMoment(compareProperty1) && !isNaN(compareValue1)) {
								const mValue = moment(propertyIdentifier.format(datePattern));
								compareProperty1 = moment(compareProperty1.format(datePattern));
								compareProperty1.add(compareValue1, 'days');
								return mValue.isAfter(compareProperty1);
							}
						},
						parameters: parameters.compare4,
						placeholder: {
							CompareValue1: $translate.instant('platform.bulkEditor.numberOfDays')
						}
					},
					{
						// Is Before Date Field with Days
						id: 23,
						inputDomain: 'integer',
						fn: function (propertyIdentifier, compareProperty1, compareValue1) {
							if (moment.isMoment(propertyIdentifier) && moment.isMoment(compareProperty1) && !isNaN(compareValue1)) {
								const mValue = moment(propertyIdentifier.format(datePattern));
								compareProperty1 = moment(compareProperty1.format(datePattern));
								compareProperty1.add(compareValue1, 'days');
								return mValue.isBefore(compareProperty1);
							}
						},
						parameters: parameters.compare4,
						placeholder: {
							CompareValue1: $translate.instant('platform.bulkEditor.numberOfDays')
						}
					},
					{
						// Is Property Between 2 Integer Values
						id: 24,
						fn: function (propertyIdentifier, compareValue1, compareValue2) {
							if (objectHelper.isSet(propertyIdentifier, compareValue1, compareValue2)) {
								return propertyIdentifier > compareValue1 && propertyIdentifier < compareValue2;
							}
						},
						parameters: parameters.compare2,
						placeholder: {
							CompareValue1: $translate.instant('platform.bulkEditor.compareStart'),
							CompareValue2: $translate.instant('platform.bulkEditor.compareEnd')
						}
					},
					{
						// Is Property Between 2 Float Values
						id: 25,
						fn: function (propertyIdentifier, compareValue1, compareValue2) {
							if (objectHelper.isSet(propertyIdentifier, compareValue1, compareValue2)) {
								return propertyIdentifier > compareValue1 && propertyIdentifier < compareValue2;
							}
						},
						parameters: parameters.compare2,
						placeholder: {
							CompareValue1: $translate.instant('platform.bulkEditor.compareStart'),
							CompareValue2: $translate.instant('platform.bulkEditor.compareEnd')
						}
					},
					{
						// Lookup has Value
						id: 45,
						fn: function (propertyIdentifier, compareValue1) {
							return propertyIdentifier === compareValue1;
						},
						parameters: parameters.compare1,
						placeholder: {
							CompareValue5: $translate.instant('platform.bulkEditor.compareValue')
						}
					},

					// ///////////////////
					// CHANGE OPERATORS//
					// ///////////////////

					{
						// Set Date Field to any Value
						id: 26,
						fn: function (entity, propertyIdentifier, valueToSet) {
							if (objectHelper.isSet(entity, propertyIdentifier, valueToSet)) {
								if (!moment.isMoment(valueToSet)) {
									valueToSet = moment.utc(valueToSet);
								}
								if (!_.get(entity, propertyIdentifier) || !moment.isMoment(_.get(entity, propertyIdentifier))) {
									_.set(entity, propertyIdentifier, moment.utc(valueToSet.year() + '-' + valueToSet.month() + '-' + valueToSet.date()));
								}

								_.get(entity, propertyIdentifier).set({
									'year': valueToSet.year(),
									'month': valueToSet.month(),
									'date': valueToSet.date()
								});
							}
						},
						parameters: parameters.compare1,
						placeholder: {
							CompareValue1: $translate.instant('platform.bulkEditor.newDateValue')
						}
					},
					{
						// Set Integer Field to any Value
						id: 27,
						fn: function (entity, propertyIdentifier, valueToSet) {
							if (objectHelper.isSet(entity, propertyIdentifier, valueToSet)) {
								entity[propertyIdentifier] = valueToSet;
							}
						},
						parameters: parameters.compare1,
						placeholder: {
							CompareValue1: $translate.instant('platform.bulkEditor.newNumberValue')
						}
					},
					{
						// Set String Field to any Value
						id: 28,
						fn: function (entity, propertyIdentifier, valueToSet) {
							if (objectHelper.isSet(entity, propertyIdentifier, valueToSet)) {
								entity[propertyIdentifier] = valueToSet;
							}
						},
						parameters: parameters.compare1,
						placeholder: {
							CompareValue1: $translate.instant('platform.bulkEditor.newTextValue')
						}
					},
					{
						// Set Bool to false
						id: 29,
						fn: function (entity, propertyIdentifier) {
							if (objectHelper.isSet(entity, propertyIdentifier)) {
								_.set(entity, propertyIdentifier, false);
							}
						},
						parameters: parameters.identifier,
					},
					{
						// Set Bool to True
						id: 30,
						fn: function (entity, propertyIdentifier) {
							if (objectHelper.isSet(entity, propertyIdentifier)) {
								_.set(entity, propertyIdentifier, true);
							}
						},
						parameters: parameters.identifier,
					},
					{
						// Set Lookup Item
						id: 31,
						fn: function (entity, propertyIdentifier, valueToSet) {
							if (objectHelper.isSet(entity, propertyIdentifier, valueToSet)) {
								entity[propertyIdentifier] = valueToSet;
							}
						},
						parameters: parameters.compare1,
						placeholder: {
							CompareValue1: $translate.instant('platform.bulkEditor.newSelection')
						}
					},
					{
						// Set Decimal Value
						id: 32,
						fn: function (entity, propertyIdentifier, valueToSet) {
							if (objectHelper.isSet(entity, propertyIdentifier, valueToSet)) {
								entity[propertyIdentifier] = valueToSet;
							}
						},
						parameters: parameters.compare1,
						placeholder: {
							CompareValue1: $translate.instant('platform.bulkEditor.newDecimalValue')
						}
					},
					{
						// Set Email Value
						id: 33,
						fn: function (entity, propertyIdentifier, valueToSet) {
							if (objectHelper.isSet(entity, propertyIdentifier, valueToSet)) {
								entity[propertyIdentifier] = valueToSet;
							}
						},
						parameters: parameters.compare1,
						placeholder: {
							CompareValue1: $translate.instant('platform.bulkEditor.newEmailValue')
						}
					},
					{
						// Set Description Info Translated Value
						id: 34,
						fn: function (entity, propertyIdentifier, translatedObjectOrString) {
							if (objectHelper.isSet(entity, propertyIdentifier, translatedObjectOrString)) {
								objectHelper.setValue(entity, propertyIdentifier + '.Translated', translatedObjectOrString.Translated ? translatedObjectOrString.Translated : translatedObjectOrString);
								objectHelper.setValue(entity, propertyIdentifier + '.Modified', true);
							}
						},
						parameters: parameters.compare1,
						placeholder: {
							CompareValue1: $translate.instant('platform.bulkEditor.newTextValue')
						}
					},
					{
						// Append Text
						id: 35,
						fn: function (entity, propertyIdentifier, textValue) {
							if (objectHelper.isSet(entity, propertyIdentifier, textValue)) {
								entity[propertyIdentifier] = entity[propertyIdentifier] ? entity[propertyIdentifier] + textValue : '' + textValue;
							}
						},
						parameters: parameters.compare1,
						placeholder: {
							CompareValue1: $translate.instant('platform.bulkEditor.appendText')
						}
					},
					{
						// Prepend Text
						id: 36,
						fn: function (entity, propertyIdentifier, textValue) {
							if (objectHelper.isSet(entity, propertyIdentifier, textValue)) {
								entity[propertyIdentifier] = entity[propertyIdentifier] ? textValue + entity[propertyIdentifier] : textValue + '';
							}
						},
						parameters: parameters.compare1,
						placeholder: {
							CompareValue1: $translate.instant('platform.bulkEditor.prependText')
						}
					},
					{
						// In-/Decrease Int By Percent for Integer with rounding
						id: 37,
						fn: function (entity, propertyIdentifier, percentIntValue) {
							if (objectHelper.isSet(entity, propertyIdentifier, percentIntValue)) {
								const entityValue = entity[propertyIdentifier];
								if (_.isNumber(entityValue) && _.isNumber(percentIntValue)) {
									entity[propertyIdentifier] = math.round((entityValue / 100) * (100 + percentIntValue));
								}
							}
						},
						inputDomain: 'percent',
						parameters: parameters.compare1,
						placeholder: {
							CompareValue1: $translate.instant('platform.bulkEditor.percentValue')
						}
					},
					{
						// Plus / Minus Int
						id: 38,
						fn: function (entity, propertyIdentifier, value) {
							if (objectHelper.isSet(entity, propertyIdentifier, value)) {
								entity[propertyIdentifier] = math.add(entity[propertyIdentifier], value);
							}
						},
						parameters: parameters.compare1,
						placeholder: {
							CompareValue1: $translate.instant('platform.bulkEditor.value')
						}
					},
					{
						// In-/Decrease Int By Percent for Decimal without rounding
						id: 39,
						fn: function (entity, propertyIdentifier, percentIntValue) {
							if (objectHelper.isSet(entity, propertyIdentifier, percentIntValue)) {
								const entityValue = entity[propertyIdentifier];
								if (_.isNumber(entityValue) && _.isNumber(percentIntValue)) {
									entity[propertyIdentifier] = (entityValue / 100) * (100 + percentIntValue);
									const ruleEditorService = $injector.get('basicsCommonRuleEditorService');
									const domainInfo = platformDomainService.loadDomain(ruleEditorService.getDtoPropDomain(propertyIdentifier));
									if (domainInfo.precision) {
										entity[propertyIdentifier] = math.round(entity[propertyIdentifier], domainInfo.precision);
									}
								}
							}
						},
						inputDomain: 'percent',
						parameters: parameters.compare1,
						placeholder: {
							CompareValue1: $translate.instant('platform.bulkEditor.percentValue')
						}
					},
					{
						// Plus / Minus Decimal
						id: 40,
						fn: function (entity, propertyIdentifier, value) {
							if (objectHelper.isSet(entity, propertyIdentifier, value)) {
								entity[propertyIdentifier] = math.add(entity[propertyIdentifier], value);
							}
						},
						parameters: parameters.compare1,
						placeholder: {
							CompareValue1: $translate.instant('platform.bulkEditor.value')
						}
					},
					{
						// Set String Empty
						id: 41,
						fn: function (entity, propertyIdentifier) {
							if (objectHelper.isSet(entity, propertyIdentifier)) {
								entity[propertyIdentifier] = '';
							}
						},
						parameters: parameters.identifier
					},
					{
						// Add Days
						id: 42,
						fn: function (entity, propertyIdentifier, days) {
							if (moment.isMoment(entity[propertyIdentifier]) && !isNaN(days)) {
								entity[propertyIdentifier] = entity[propertyIdentifier].add(days, 'days');
							}
						},
						inputDomain: 'integer',
						parameters: parameters.compare1,
						placeholder: {
							CompareValue1: $translate.instant('platform.bulkEditor.numberOfDays')
						}
					},
					{
						// Set Today
						id: 43,
						fn: function (entity, propertyIdentifier) {
							if (objectHelper.isSet(entity, propertyIdentifier)) {
								const today = moment();
								if (!_.get(entity, propertyIdentifier) || !moment.isMoment(_.get(entity, propertyIdentifier))) {
									_.set(entity, propertyIdentifier, moment.utc(today.year() + '-' + today.month() + '-' + today.date()));
								}
								entity[propertyIdentifier].set({
									'year': today.year(),
									'month': today.month(),
									'date': today.date()
								});
							}
						},
						parameters: parameters.identifier
					},
					{
						// Set ImageSelect Item
						id: 44,
						fn: function (entity, propertyIdentifier, valueToSet) {
							if (objectHelper.isSet(entity, propertyIdentifier, valueToSet)) {
								entity[propertyIdentifier] = valueToSet;
							}
						},
						parameters: parameters.compare1,
						placeholder: {
							CompareValue1: $translate.instant('platform.bulkEditor.newSelection')
						}
					},
					{
						// Remove Integer Value
						id: 46,
						fn: function (entity, propertyIdentifier) {
							if (objectHelper.isSet(entity, propertyIdentifier)) {
								entity[propertyIdentifier] = 0;
							}
						},
						parameters: parameters.identifier
					},
					{
						// Remove Decimal Value
						id: 47,
						fn: function (entity, propertyIdentifier) {
							if (objectHelper.isSet(entity, propertyIdentifier)) {
								entity[propertyIdentifier] = 0;
							}
						},
						parameters: parameters.identifier
					},
					{
						// Remove Lookup Value
						id: 48,
						fn: function (entity, propertyIdentifier) {
							if (objectHelper.isSet(entity, propertyIdentifier)) {
								entity[propertyIdentifier] = null;
							}
						},
						parameters: parameters.identifier,
						nullAbleRequired: true
					},
					{
						// Remove Date Value
						id: 49,
						fn: function (entity, propertyIdentifier) {
							if (objectHelper.isSet(entity, propertyIdentifier)) {
								entity[propertyIdentifier] = null;
							}
						},
						parameters: parameters.identifier
					},
					{
						// Find and Replace
						id: 50,
						fn: function (entity, propertyIdentifier, valueToFind, valueToSet) {
							if (objectHelper.isSet(entity, propertyIdentifier)) {
								let propToChange = entity[propertyIdentifier];
								if (!objectHelper.isSet(propToChange)) {
									propToChange = '';
								}
								if (!objectHelper.isSet(valueToFind)) {
									valueToFind = '';
								}
								if (!objectHelper.isSet(valueToSet)) {
									valueToSet = '';
								}
								if (propToChange.includes(valueToFind) && !(valueToFind === '' && propToChange !== '')) {
									valueToFind = _.escapeRegExp(valueToFind);
									entity[propertyIdentifier] = propToChange.replace(new RegExp(valueToFind, 'g'), valueToSet);
								}
							}
						},
						parameters: parameters.compare2,
						placeholder: {
							CompareValue1: $translate.instant('platform.bulkEditor.valueToReplace'),
							CompareValue2: $translate.instant('platform.bulkEditor.newTextValue')
						}
					},
					{
						// Set Color Field to any Value
						id: 51,
						fn: function (entity, propertyIdentifier, valueToSet) {
							if (objectHelper.isSet(entity, propertyIdentifier, valueToSet)) {
								entity[propertyIdentifier] = valueToSet;
							}
						},
						parameters: parameters.compare1,
						placeholder: {
							CompareValue1: $translate.instant('platform.bulkEditor.newColorValue')
						}
					},
					{
						// Set Date Time Field to any Value
						id: 52,
						fn: function (entity, propertyIdentifier, valueToSet) {
							if (objectHelper.isSet(entity, propertyIdentifier, valueToSet)) {
								if (!moment.isMoment(valueToSet)) {
									valueToSet = moment.utc(valueToSet);
								}
								if (!_.get(entity, propertyIdentifier) || !moment.isMoment(_.get(entity, propertyIdentifier))) {
									_.set(entity, propertyIdentifier, moment.utc(valueToSet.year() + '-' + valueToSet.month() + '-' + valueToSet.date() + valueToSet.hour() + ':' + valueToSet.minute()));
								}

								_.get(entity, propertyIdentifier).set({
									'year': valueToSet.year(),
									'month': valueToSet.month(),
									'date': valueToSet.date(),
									'hour': valueToSet.hour(),
									'minute': valueToSet.minute()
								});
							}
						},
						parameters: parameters.compare1,
						placeholder: {
							CompareValue1: $translate.instant('platform.bulkEditor.newDateValue')
						}
					},
					{
						// Add Days for Datetime UTC
						id: 53,
						fn: function (entity, propertyIdentifier, days) {
							if (moment.isMoment(entity[propertyIdentifier]) && !isNaN(days)) {
								entity[propertyIdentifier] = entity[propertyIdentifier].add(days, 'days');
							}
						},
						inputDomain: 'integer',
						parameters: parameters.compare1,
						placeholder: {
							CompareValue1: $translate.instant('platform.bulkEditor.numberOfDays')
						}
					},
					{
						// Set Today for Datetime UTC
						id: 54,
						fn: function (entity, propertyIdentifier) {
							if (objectHelper.isSet(entity, propertyIdentifier)) {
								const today = moment();
								if (!_.get(entity, propertyIdentifier) || !moment.isMoment(_.get(entity, propertyIdentifier))) {
									_.set(entity, propertyIdentifier, moment.utc(today.year() + '-' + today.month() + '-' + today.date()));
								}
								entity[propertyIdentifier].set({
									'year': today.year(),
									'month': today.month(),
									'date': today.date()
								});
							}
						},
						parameters: parameters.identifier
					},
					{
						// Remove Datetime UTC Value
						id: 55,
						fn: function (entity, propertyIdentifier) {
							if (objectHelper.isSet(entity, propertyIdentifier)) {
								entity[propertyIdentifier] = null;
							}
						},
						parameters: parameters.identifier
					},
					{
						// Set Time Field to any Value
						id: 56,
						fn: function (entity, propertyIdentifier, valueToSet) {
							if (objectHelper.isSet(entity, propertyIdentifier, valueToSet)) {
								if (!moment.isMoment(valueToSet)) {
									valueToSet = moment.utc(valueToSet);
								}
								if (!_.get(entity, propertyIdentifier) || !moment.isMoment(_.get(entity, propertyIdentifier))) {
									_.set(entity, propertyIdentifier, moment.utc(valueToSet.hour() + ':' + valueToSet.minute()));
								}

								_.get(entity, propertyIdentifier).set({
									'hour': valueToSet.hour(),
									'minute': valueToSet.minute()
								});
							}
						},
						parameters: parameters.compare1,
						placeholder: {
							CompareValue1: $translate.instant('platform.bulkEditor.newTimeValue')
						}
					},
					{
						// Remove time UTC Value
						id: 57,
						fn: function (entity, propertyIdentifier) {
							if (objectHelper.isSet(entity, propertyIdentifier)) {
								entity[propertyIdentifier] = null;
							}
						},
						parameters: parameters.identifier
					},
					{
						// Remove translation id
						id: 58,
						fn: function (entity, propertyIdentifier) {
							if (objectHelper.isSet(entity, propertyIdentifier)) {
								objectHelper.setValue(entity, propertyIdentifier + '.DescriptionTr', null);
								objectHelper.setValue(entity, propertyIdentifier + '.Modified', true);
							}
						},
						parameters: parameters.identifier
					}
				];
			});

			const service = {
				getOperatorFunctionById: function (id) {
					const functionObject = _.find(operators, {id: id});
					return functionObject ? functionObject.fn : _.noop;
				},
				getOperatorItemById: function (id) {
					return _.find(operators, {id: id});
				},
				getRequiredFunctionParameterValues: function (condition, entity) {
					const reqProps = service.getOperatorItemById(condition.OperatorFk).parameters;
					const parameterValues = [];
					_.each(reqProps, function (prop, index) {
						const basicsCommonRuleEditorService = $injector.get('basicsCommonRuleEditorService');
						const mgr = basicsCommonRuleEditorService.getInstance(condition);
						// only CompareValue1 & 2 dont need to be looked up
						if (!prop.startsWith('CompareValue')) {
							const propName = mgr.getDtoPropName(_.get(condition, mgr.getPropertyOperandPath(index)));
							prop = entity[propName];
						} else {
							// just get the value
							prop = _.get(condition, mgr.getLiteralOperandPath(condition, index));
						}
						parameterValues.push(prop);
					});
					return parameterValues;
				},
				getRequiredValue: function (condition, index) {
					if (!_.find(parameters.validIndices, function (i) {
						return i === index;
					})) {
						throw new Error('Index has no valid Value.');
					}
					const opItem = service.getOperatorItemById(condition.OperatorFk);
					if (opItem && (opItem.parameters.length > index)) {
						const reqProp = opItem.parameters[index];
						const basicsCommonRuleEditorService = $injector.get('basicsCommonRuleEditorService');
						const mgr = basicsCommonRuleEditorService.getInstance(condition);
						if (reqProp.startsWith('CompareValue')) {
							return _.get(condition, mgr.getLiteralOperandPath(condition, index));
						} else {
							return _.get(condition, mgr.getPropertyOperandPath(index));
						}
					}
				},
				getParamNamesByFunctionId: function (id) {
					const operator = service.getOperatorItemById(id);
					return operator ? operator.parameters : [];
				},
				extendOperators: function (operator) {
					if (operator) {
						const existOperator = _.find(operators, {id: operator.id});
						if (!existOperator) {
							operators.push(operator);
						}
					}
				},
				removeOperatorById: function (id) {
					const existOperator = _.find(operators, {id: id});
					if (existOperator) {
						_.remove(operators, function (item) {
							return item.id === id;
						});
					}
				}
			};

			return service;
		}]);
})(angular);

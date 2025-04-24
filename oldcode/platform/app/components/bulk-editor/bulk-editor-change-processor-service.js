(function (angular) {
    'use strict';

    // noinspection JSValidateTypes
    angular.module('platform').service('platformBulkEditorChangeProcessorService', PlatformBulkEditorChangeProcessorService);

    PlatformBulkEditorChangeProcessorService.$inject = ['_', '$q', 'basicsCommonRuleEditorService', 'platformObjectHelper', 'basicsCommonOperatorFunctionsService', 'platformRuntimeDataService', 'platformDataValidationService', 'platformBulkEditorConfigurationService', 'platformDomainService', 'moment', 'platformBulkEditorRuleCreatorService'];

    function PlatformBulkEditorChangeProcessorService(_, $q, ruleEditorService, objectHelper, operatorService, runtimeDataService, platformDataValidationService, configService, platformDomainService, moment, platformBulkEditorRuleCreatorService) {
        var self = this;

        self.runChanges = function (validationService, itemService, bulkConfig) {
            var promiseList = [];
            var config = ruleEditorService.getConfig();
            var configuredRules = configService.lastActiveConfig;
            var affectedEntities = bulkConfig.headlessOption ? bulkConfig.headlessOption.entities : config.AffectedEntities;
            if (bulkConfig.headlessOption) {
                configuredRules = platformBulkEditorRuleCreatorService.getRuleForType(bulkConfig.headlessOption);
            }
            if (_.isEmpty(affectedEntities)) {
                throw new Error('affectedEntities are empty');
            }

            if (_.isEmpty(bulkConfig.headlessOption) || _.isEmpty(bulkConfig.headlessOption.valuesToBePasted)) {
                _.each(affectedEntities, function runChangesLoopFn(entity) {
                    // processItem returns the promise of $q.all()
                    promiseList.push(processItem(configuredRules, entity, validationService, itemService, bulkConfig));
                });
            } else {
                let pasteIndex = 0;
                _.each(affectedEntities, function runChangesLoopFn(entity) {
                    // processItem returns the promise of $q.all()
                    let pasteValue = _.isArray(bulkConfig.headlessOption.valuesToBePasted) && (pasteIndex < bulkConfig.headlessOption.valuesToBePasted.length) ? bulkConfig.headlessOption.valuesToBePasted[pasteIndex] : null;
                    if (objectHelper.isSet(pasteValue)) {
                        bulkConfig.headlessOption.pasteValue = pasteValue;
                        configuredRules = platformBulkEditorRuleCreatorService.getRuleForType(bulkConfig.headlessOption);
                        promiseList.push(processItem(configuredRules, entity, validationService, itemService, bulkConfig));
                        pasteIndex++;
                    }
                });
            }
            return $q.all(promiseList);
        };

        function processItem(configuredRules, entity, validationService, itemService, bulkConfig) {
            var promiseList = [];
            validationService = validationService ? validationService : {};
            var rules = configuredRules && configuredRules.BulkGroup[0] && configuredRules.BulkGroup[0][0] && configuredRules.BulkGroup[0][0].Children ? configuredRules.BulkGroup[0][0].Children : null;

            if (rules) {
                _.each(rules, function processItemLoopFn(rule) {
                    if (objectHelper.isSet(rule, rule.OperatorFk, rule.Operands[0], entity)) {
                        var defer = $q.defer();
                        promiseList.push(defer.promise);
                        // value for validation
                        var processedValue = null;
                        var processedValue2 = null;
                        // flag for deny changes again
                        var alreadyChanged = false;
                        var propName = rule.Operands[0].NamedProperty.FieldName;
                        var propToChange = ruleEditorService.getDtoPropName(propName);
                        var propDomain = ruleEditorService.getDtoPropDomain(propName);
                        var operator = operatorService.getOperatorItemById(rule.OperatorFk);
                        var operatorFunction = operator.fn;
                        // simulate change on clone get the calculated value
                        var clonedEntity = _.cloneDeep(entity);
                        // to detect changes on entity
                        var originEntity = _.cloneDeep(entity);
                        var originValue = entity[propToChange];
                        // get required value(s)
                        var requiredValue = operatorService.getRequiredValue(rule, 1);
                        var requiredValue2 = operatorService.getRequiredValue(rule, 2);
                        var valueFromCondition = objectHelper.isSet(requiredValue) ? requiredValue : null;
                        var valueFromCondition2 = objectHelper.isSet(requiredValue2) ? requiredValue2 : null;

                        // process value
                        applyChanges(operatorFunction, itemService, clonedEntity, originEntity, propToChange, valueFromCondition, valueFromCondition2, true);
                        processedValue = clonedEntity[propToChange];
                        var changeObject = createChangeObject(originEntity, false, propToChange, processedValue, processedValue2);

                        if (!_.isEmpty(processedValue) && !isValidAgainstRegex(processedValue, propDomain)) {
                            changeObject.isChanged = false;
                            changeObject.validationResult = {error$tr$: 'platform.bulkEditor.maxLengthError'};
                            defer.resolve(changeObject);
                            // when processedValue does not match the regex-pattern, no further validation makes sense.
                            return;
                        }

                        // determine validation Functions
                        var syncValidationFn = validationService['validate' + propToChange + 'ForBulkConfig'] ? validationService['validate' + propToChange + 'ForBulkConfig'] : validationService['validate' + propToChange];
                        var asyncValidationFn = validationService['asyncValidate' + propToChange + 'ForBulkConfig'] ? validationService['asyncValidate' + propToChange + 'ForBulkConfig'] : validationService['asyncValidate' + propToChange];

                        var syncValidationResult = true;

                        if (syncValidationFn) {
                            var validationResult = syncValidationFn(entity, processedValue, propToChange, true);
                            syncValidationResult = validationResult === true || (_.isObject(validationResult) && validationResult.valid === true);
                            if (originValue !== entity[propToChange]) {
                                entity[propToChange] = originValue;
                            }
                            // for all those validationFn which dont return anything, apply
                            if (syncValidationResult || _.isUndefined(validationResult)) {
                                changeObject = applyChanges(operatorFunction, itemService, entity, originEntity, propToChange, valueFromCondition, valueFromCondition2, false);
                            } else {
                                changeObject.isChanged = false;
                            }
                            if (changeObject.isChanged === false) {
                                removeFromValidationService(entity, propToChange, validationService, itemService);
                            } else {
                                alreadyChanged = true;
                            }
                            changeObject.validationResult = validationResult;
                        }
                        // call asyncValidationMethod when sync != fail,or sync is just not there
                        if (asyncValidationFn && syncValidationResult && !bulkConfig.serverSide) {
                            asyncValidationFn(entity, processedValue, propToChange, null, true).then(function (validationResult) {
                                changeObject = createChangeObject(originEntity, false, propToChange, processedValue);
                                // dont apply changes again -> alreadyChanged
                                if (((validationResult === true || (_.isObject(validationResult) && validationResult.valid === true)) || _.isUndefined(validationResult)) && !alreadyChanged) {
                                    changeObject = applyChanges(operatorFunction, itemService, entity, originEntity, propToChange, valueFromCondition, valueFromCondition2, false);
                                } else if (((validationResult === true || (_.isObject(validationResult) && validationResult.valid === true)) || _.isUndefined(validationResult)) && alreadyChanged) {
                                    changeObject.isChanged = true;
                                } else {
                                    // set the origin value
                                    entity[propToChange] = originValue;
                                    changeObject.isChanged = false;
                                    itemService.gridRefresh();
                                }
                                if (changeObject.isChanged === false) {
                                    removeFromValidationService(entity, propToChange, validationService, itemService);
                                }
                                changeObject.asyncValidationResult = validationResult;
                                defer.resolve(changeObject);
                            });
                        } else if ((!asyncValidationFn && syncValidationFn) || syncValidationFn && !syncValidationResult) {
                            // resolve with the syncResult when there is no asyncValidation or when async was not called cause sync already failed
                            defer.resolve(changeObject);
                        }
                        // when there is no validationMethod for that prop, apply instantly
                        else if (!syncValidationFn && !asyncValidationFn && !alreadyChanged) {
                            defer.resolve(applyChanges(operatorFunction, itemService, entity, originEntity, propToChange, valueFromCondition, valueFromCondition2, false));
                        } else if (syncValidationResult && bulkConfig.serverSide && !alreadyChanged) {
                            defer.resolve(applyChanges(operatorFunction, itemService, entity, originEntity, propToChange, valueFromCondition, valueFromCondition2, false));
                        } else if (alreadyChanged) {
                            defer.resolve(changeObject);
                        }
                    }
                });
            }
            return $q.all(promiseList);
        }

        function applyChanges(operatorFunction, itemService, entity, originEntity, propToChange, conditionValue, conditionValue2, simulate) {
            const changeObject = createChangeObject(originEntity, false, propToChange, conditionValue, conditionValue2);
            // check if prop is readonly
            if (!runtimeDataService.isReadonly(entity, propToChange)) {
                // apply the changes
                operatorFunction(entity, propToChange, conditionValue, conditionValue2);
                changeObject.desiredValue = _.get(entity, propToChange);
                if (!_.isEqual(entity, originEntity)) {
                    // something changed
                    if (!simulate) {
                        if (_.isFunction(itemService.reactOnChangeOfItem)) {
                            itemService.reactOnChangeOfItem(entity, propToChange, true);
                        }
                        itemService.markItemAsModified(entity);
                    }
                    changeObject.isChanged = true;
                } else {
                    // nothing changed by the operatorFunction, so the value is already assigned
                    changeObject.valueAlreadyAssigned = true;
                }
            } else {
                changeObject.isReadonly = true;
            }
            return changeObject;
        }

        function removeFromValidationService(entity, model, validationService, dataService) {
            platformDataValidationService.removeFromErrorList(entity, model, validationService, dataService);
        }

        function isValidAgainstRegex(valueToSet, domain) {
            const domainInfoObject = platformDomainService.loadDomain(domain);

            if (!_.isEmpty(domainInfoObject.regex)) {
                let stringValue = valueToSet + '';

                if (domain.includes('date') && moment.isMoment(valueToSet)) {
                    stringValue = valueToSet.format(domainInfoObject.format);
                }

                const match = stringValue.match(domainInfoObject.regex);

                return match && match.length > 0;
            }
            return true;
        }

        function createChangeObject(entity, changed, propToChange, value, value2) {
            return {
                id: entity.Id,// bulkOptions.getId(entity) json.str
                entityDisplayMember: entity.Code ? entity.Code :
                    entity.ProjectNo ? entity.ProjectNo :
                        (entity.DescriptionInfo && entity.DescriptionInfo.Translated) ? entity.DescriptionInfo.Translated :
                            entity.Description ? entity.Description : entity.Id,
                isChanged: changed,
                affectedProperty: propToChange,
                propertyDisplayMember: ruleEditorService.getColumnDisplayName(propToChange),
                desiredValue: value,
                desiredValue2: value2,
                isReadonly: false,
                valueAlreadyAssigned: false,
                validationResult: '',
                asyncValidationResult: ''
            };
        }
    }
})(angular);

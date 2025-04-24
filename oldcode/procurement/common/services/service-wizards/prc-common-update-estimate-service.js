/**
 * Created by wul on 8/7/2018.
 */

(function (angular) {
    'use strict';

    let moduleName = 'procurement.common';
    /* jshint -W072 */
    angular.module(moduleName).factory('prcCommonUpdateEstimateService', prcCommonUpdateEstimateService);

    prcCommonUpdateEstimateService.$inject = ['_', 'globals', '$http', '$translate', '$injector', 'platformContextService', 'platformLanguageService'];

    function prcCommonUpdateEstimateService(_, globals, $http, $translate, $injector, platformContextService, platformLanguageService) {
        let service = {};
        let isHasPrcItem = true;
        let isHasPrcBoq = true;

        service.generateScope = function (scope, modelType) {
            let updateEstimeCommonOptionProfileService = $injector.get('updateEstimeCommonOptionProfileService');
            updateEstimeCommonOptionProfileService.load();
            scope.serviceoptions1 = {
                service: $injector.get('updateEstimeCommonOptionProfileService')
            };

            function onSelectOptionItemChanged() {
                let profile = updateEstimeCommonOptionProfileService.getSelectedItem();
                if (profile) {
                    scope.UpdateOptions.optionProfile = updateEstimeCommonOptionProfileService.getDescription(profile);
                    let propertyconfig = profile.PropertyConfig;
                    if (propertyconfig) {
                        let optionItem = JSON.parse(propertyconfig);
                        doOptionSetting(scope, optionItem);
                    } else {
                        doOptionSetting(scope, null);
                    }
                }
            }

            function doOptionSetting(scope, optionItem) {
                scope.UpdateOptions.LinkToPrcBoq = optionItem ? optionItem.LinkToPrcBoq : true;
                scope.UpdateOptions.UpdateBoqResouce2subitem = optionItem ? optionItem.UpdateBoqResouce2subitem : false;
                scope.UpdateOptions.CreateBoqLineItem = optionItem ? optionItem.CreateBoqLineItem : true;
                scope.UpdateOptions.CreateProjectBoq = optionItem ? optionItem.CreateProjectBoq : false;
                scope.UpdateOptions.TransferNewBoqBudget = optionItem ? optionItem.TransferNewBoqBudget : false;
                scope.UpdateOptions.CreateBoqResouce2subitem = optionItem ? optionItem.CreateBoqResouce2subitem : false;

                scope.UpdateOptions.LinkToPrcItem = optionItem ? optionItem.LinkToPrcItem : true;
                scope.UpdateOptions.OverWriteOldResource = optionItem ? optionItem.OverWriteOldResource : true;
                scope.UpdateOptions.CreateItemLineItem = optionItem ? optionItem.CreateItemLineItem : true;
                scope.UpdateOptions.UpdateGeneratedJob = optionItem? optionItem.UpdateGeneratedJob:false;
					 scope.UpdateOptions.BoqUpdateType = optionItem && optionItem.BoqUpdateType? optionItem.BoqUpdateType:'1';
					 scope.UpdateOptions.PrcItemUpdateType = optionItem && optionItem.PrcItemUpdateType? optionItem.PrcItemUpdateType:'1';
            }

            updateEstimeCommonOptionProfileService.selectItemChanged.register(onSelectOptionItemChanged);

            let cultureInfo = platformLanguageService.getLanguageInfo(platformContextService.culture());
            let numberDecimal = cultureInfo.numeric.decimal;

            scope.UpdateOptions = {
                Factor: '1.000',
                FactorUi: '1' + numberDecimal + '000',
                JobCodeTemplate: '',
                JobDescriptionTemplate: '',
                UpdateGeneratedJob: false,
                HasProject: true,
                EstHeaderId: 0,
                ProjectId: 0,
                OverWriteOldResource: true,
                LinkToPrcBoq: true,
                LinkToPrcItem: true,
                CreateBoqLineItem: true,
                CreateItemLineItem: true,
                CreateProjectBoq: false,
                ShowUpdateOption: true,
                TransferNewBoqBudget: false,
                CreateBoqResouce2subitem: false,
                UpdateBoqResouce2subitem: false,
                ShowPrcBoq: true,
                ShowPrcItem: true,
	            BoqUpdateType: '1',
	            PrcItemUpdateType: '1'
            };

            scope.UpdateOptions.ShowPrcBoq = isHasPrcBoq;
            scope.UpdateOptions.ShowPrcItem = isHasPrcItem;

            scope.xFactorHasErr = false;

            scope.CodeTemplateError = '';
            scope.CodeTemplateHasError = 'none';

            scope.$watch('UpdateOptions.JobCodeTemplate', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    scope.CodeTemplateError = checkJobCodeTemplate(newVal);
                    scope.CodeTemplateHasError = scope.CodeTemplateError === '' ? 'none' : '';
                }
            });

            scope.factorChange = function () {
                let factor = scope.UpdateOptions.FactorUi;
                if (!factor || factor === '') {
                    scope.UpdateOptions.FactorUi = '1' + numberDecimal + '000';
                }
                let regStr = '^[-+]?\\d+(\\' + numberDecimal + '\\d+)?$';
                let regex = new RegExp(regStr, 'ig');
                if (!regex.test(factor)) {
                    scope.xFactorHasErr = true;
                    return;
                } else {
                    scope.xFactorHasErr = false;
                }

                if (factor.indexOf(numberDecimal) < 0) {
                    factor = factor + numberDecimal + '000';
                } else {
                    let idx = factor.lastIndexOf(numberDecimal);
                    let rightPart = factor.substr(idx, factor.length - idx - 1);
                    let i = 3 - rightPart.length;
                    while (i > 0) {
                        factor = factor + '0';
                        i--;
                    }
                }

                scope.UpdateOptions.FactorUi = factor;
                scope.UpdateOptions.Factor = factor.replace(numberDecimal, '.');
            };

            scope.codeTemplatetip = 'procurement.common.wizard.updateEstimate.codeTemplateTooltip';

            scope.UpdateOptions.modelType = modelType;
            let projectFk = 0;
            switch (modelType) {
                case 'Package':
                    var currtPackage = $injector.get('procurementPackageDataService').getSelected() || $injector.get('basicsWorkflowWizardContextService').getContext().entity;
                    projectFk = currtPackage ? currtPackage.ProjectFk : 0;
                    scope.UpdateOptions.ShowUpdateOption = true;
                    scope.UpdateOptions.Update = true;
                    break;
                case 'Quote':
                    var currtQuote = $injector.get('procurementQuoteHeaderDataService').getSelected();
                    projectFk = currtQuote ? currtQuote.ProjectFk : 0;
                    scope.UpdateOptions.ShowUpdateOption = true;
                    scope.UpdateOptions.Update = true;
                    break;
                case 'Contract':
                    var currtContract = $injector.get('procurementContractHeaderDataService').getSelected();
                    projectFk = currtContract ? currtContract.ProjectFk : 0;
                    scope.UpdateOptions.ShowUpdateOption = true;
                    scope.UpdateOptions.Update = true;
                    break;
                case 'Requisition':
                    var currtRequisition = $injector.get('procurementRequisitionHeaderDataService').getSelected();
                    projectFk = currtRequisition ? currtRequisition.ProjectFk : 0;
                    scope.UpdateOptions.ShowUpdateOption = true;
                    scope.UpdateOptions.Update = true;
                    break;
                case 'PriceComparison':
                    var currtPriceComparison = $injector.get('procurementPriceComparisonMainService').getSelected();
                    projectFk = currtPriceComparison ? currtPriceComparison.ProjectFk : 0;
                    scope.UpdateOptions.ShowUpdateOption = true;
                    scope.UpdateOptions.Update = true;
                    break;
                case 'Pes':
                    var currentPes = $injector.get('procurementPesHeaderService').getSelected();
                    projectFk = currentPes ? currentPes.ProjectFk : 0;
                    scope.UpdateOptions.ShowUpdateOption = false;
                    scope.UpdateOptions.Update = false;
                    break;
            }
            scope.needEstHeaderLookUp = true;
            scope.UpdateOptions.ProjectId = projectFk;
            scope.currEstHeaderDesc = '';
            $http.post(globals.webApiBaseUrl + 'estimate/project/list', {projectFk: projectFk}).then(function (response) {
                if (response && response.data && response.data.length > 0) {
                    response.data = _.filter(response.data, function (item) {
                        return item.EstHeader.IsActive && !item.IsGCOrder && !item.EstHeader.EstHeaderVersionFk;
                    });
                }
                response.data =_.sortBy(response.data, function(item) { return item.EstHeader.Code; });
                if (response && response.data && response.data.length > 0) {
                    scope.showEstHeaderLookUp = '';
                    scope.needEstHeaderLookUp = true;
                    _.filter(response.data, function (item) {
                        if (!item.EstHeader.IsGCOrder) { //filter out GCC estheader
                            scope.estHeaderOptions.items.push({
                                Id: item.EstHeader.Id,
                                Code: item.EstHeader.Code,
                                Description: item.EstHeader.DescriptionInfo.Translated ? item.EstHeader.DescriptionInfo.Translated : ''
                            });
                        }
                    });
                    if (scope.estHeaderOptions.items && scope.estHeaderOptions.items.length >= 1) {
                        scope.UpdateOptions.EstHeaderId = scope.estHeaderOptions.items[0].Id;
                        scope.currEstHeaderDesc = scope.estHeaderOptions.items[0].Description;
                    }
                } else {
                    scope.showEstHeaderLookUp = 'none';
                    scope.needEstHeaderLookUp = false;
                    scope.UpdateOptions.HasProject = false;
                }
            });

            scope.estHeaderOptions = {
                displayMember: 'Description',
                valueMember: 'Id',
                items: []
            };

            // scope.$watch('UpdateOptions.Update', function (newValue /* , oldValue */) {
            //    scope.UpdateOptions.LinkToPrcBoq = scope.UpdateOptions.LinkToPrcItem = scope.UpdateOptions.OverWriteOldResource = newValue;
            //    scope.UpdateOptions.UpdateBoqResouce2subitem = false;
            // });

            // scope.$watch('UpdateOptions.LinkToPrcItem', function (newValue /* , oldValue */) {
            //    scope.UpdateOptions.OverWriteOldResource = !!newValue;
            // });

            scope.onUpdateLinkToPrcItem = function () {
                scope.UpdateOptions.OverWriteOldResource = !!scope.UpdateOptions.LinkToPrcItem;
            };

            scope.onUpdateLinkToPrcBoq = function () {
                scope.UpdateOptions.UpdateBoqResouce2subitem = false;
            };

            // scope.$watch('UpdateOptions.LinkToPrcBoq', function ( /* , oldValue */) {
            //    scope.UpdateOptions.UpdateBoqResouce2subitem = false;
            // });

            // scope.$watch('UpdateOptions.Create', function (newValue /* , oldValue */) {
            //    scope.showEstHeaderLookUp = newValue ? '' : 'none';
            //    scope.UpdateOptions.CreateBoqLineItem = scope.UpdateOptions.CreateItemLineItem = newValue; // scope.UpdateOptions.CreateProjectBoq = newValue;
            //    scope.UpdateOptions.CreateProjectBoq = false;
            //    scope.UpdateOptions.TransferNewBoqBudget = false;
            //    scope.UpdateOptions.CreateBoqResouce2subitem = false;
            // });

            scope.onUpdateCreateBoqLineItem = function () {
                scope.UpdateOptions.CreateProjectBoq = false;
                scope.UpdateOptions.TransferNewBoqBudget = false;
                scope.UpdateOptions.CreateBoqResouce2subitem = false;
            };

            // scope.$watch('UpdateOptions.CreateBoqLineItem', function ( /* , oldValue */) {
            //    scope.UpdateOptions.CreateProjectBoq = false;
            //    scope.UpdateOptions.TransferNewBoqBudget = false;
            //    scope.UpdateOptions.CreateBoqResouce2subitem = false;
            // });

            scope.showOkButtom = function () {
                scope.UpdateOptions.Create = scope.UpdateOptions.CreateItemLineItem || scope.UpdateOptions.CreateBoqLineItem;
                if (scope.UpdateOptions.Create && !scope.UpdateOptions.EstHeaderId) {
                    return false;
                }

                return !!scope.CodeTemplateHasError && !scope.xFactorHasErr &&
                    (!scope.UpdateOptions.Create || !scope.needEstHeaderLookUp || scope.UpdateOptions.EstHeaderId) &&
                    (hasCreateOperator() || hasUpdateOperator());
            };

            function hasCreateOperator() {
                if (!scope.UpdateOptions.Create) {
                    return false;
                }

                return scope.UpdateOptions.CreateItemLineItem || scope.UpdateOptions.CreateBoqLineItem;
            }

            function hasUpdateOperator() {
                return scope.UpdateOptions.LinkToPrcItem || scope.UpdateOptions.LinkToPrcBoq;
            }

            scope.estHeaderChange = function () {
                _.forEach(scope.estHeaderOptions.items, function (item) {
                    if (item.Id === scope.UpdateOptions.EstHeaderId) {
                        scope.currEstHeaderDesc = item.Description;
                    }
                });
            };

            scope.showUpdateGroup = true;
            scope.showCreateGroup = true;
            scope.showPrcStructure = true;
            scope.showAdvanceGroup = false;
            scope.toggleOpen = function (n) {
                if (n === 0) {
                    scope.showUpdateGroup = !scope.showUpdateGroup;
                }

                if (n === 1) {
                    scope.showCreateGroup = !scope.showCreateGroup;
                }

                if (n === 2) {
                    scope.showPrcStructure = !scope.showPrcStructure;
                }

                if (n === 3) {
                    scope.showAdvanceGroup = !scope.showAdvanceGroup;
                }

            };

            scope.$on('$destroy', function () {
                updateEstimeCommonOptionProfileService.selectItemChanged.unregister(onSelectOptionItemChanged);
            });

        };

        service.setUpdateOptionValue = function (scope, jobCodeTempate, jobCodeDesc/* , showUpdateQuantities */) {
            scope.UpdateOptions.JobCodeTemplate = jobCodeTempate;
            scope.UpdateOptions.JobDescriptionTemplate = jobCodeDesc;
            scope.UpdateOptions.ShowUpdateQuantities = 'none'; // response.data.ShowUpdateQuantities ? '' : 'none';
        };

        service.setUsingPrcStructures = function (scope) {
            let list = $injector.get('prcCommonUpdateEstimatePrcStructureDataSerivce').getfilterList();

            if (_.find(list, function (item) {
                if (item.__rt$data && item.__rt$data.errors && item.__rt$data.errors.CostCodeFk && item.__rt$data.errors.CostCodeFk.error) {
                    return true;
                }
            })) {
                return {
                    valid: false,
                    msg: $translate.instant('procurement.common.wizard.updateEstimate.prcStructureNoCostCode')
                };
            }

            scope.UpdateOptions.PrcStructures = list;
            return {
                valid: true
            };
        };

        function checkJobCodeTemplate(code) {
            if (code === null || code === '') {
                return 'procurement.package.jobTemplateEmpty';
            }

            if (code.replace(/\[(.*?)]/g, '').length > 16) {
                return 'procurement.package.jobTemplateTooLong';
            }

            let matches = code.match(/\((.*?)\)/g);

            if (matches !== null && matches.length > 0) {
                let length = 0;
                for (let i = 0; i < matches.length; i++) {
                    let match = matches[i];
                    match = match.replace('(', '').replace(')', '');
                    if ((/^\d+-\d+$/g).test(match)) {
                        length += match.split('-')[1] - match.split('-')[0] + 1;
                    }
                    if ((/^\d+,\d+$/g).test(match)) {
                        length += 2;
                    }
                    if ((/^\d+$/g).test(match)) {
                        length += 1;
                    }
                }

                if (length + code.replace(/\[(.*?)]/g, '').length > 16) {
                    return 'procurement.package.jobTemplateTooLong';
                }
            }

            return '';
        }

        service.setIsHasPrcItem = function setIsHasPrcItem(flag) {
            isHasPrcItem = flag;
        };

        service.setIsHasPrcBoq = function (flag) {
            isHasPrcBoq = flag;
        };

        return service;
    }
})(angular);

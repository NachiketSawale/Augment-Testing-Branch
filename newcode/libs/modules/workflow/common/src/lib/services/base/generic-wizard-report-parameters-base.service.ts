/*
 * Copyright(c) RIB Software GmbH
 */

import { IReportParameter, PlatformConfigurationService, PlatformHttpService } from '@libs/platform/common';
import { ReportContainerInput } from '../../models/injection-token/generic-wizard-injection-tokens';
import { GenericWizardConfigService } from './generic-wizard-config.service';
import { GenericWizardUseCaseUuid } from '../../models/enum/generic-wizard-use-case-uuid.enum';
import { RfqBidderWizardContainers } from '../../configuration/rfq-bidder/enum/rfq-bidder-containers.enum';
import { IGenericWizardReportEntity } from '../../configuration/rfq-bidder/types/generic-wizard-report-entity.interface';
import { assign, find, isNil, isNumber, isString, toLower } from 'lodash';
import { IReportParameterEntity } from '@libs/basics/reporting';
import { GenericWizardReportParameter } from '../../configuration/rfq-bidder/types/generic-wizard-report-parameter-entity.interface';
import { ContractConfirmWizardContainers } from '../../configuration/contract-confirm/enum/contract-confirm-containers.enum';

export type ReportPlaceholder = Record<string, string | number | undefined | (() => number)>;

export abstract class GenericWizardReportParametersServiceBase {

    private readonly _httpService: PlatformHttpService;
    private readonly _wizardService;
    private readonly _platformConfigurationService;

    public constructor(
        httpService: PlatformHttpService,
        wizardService: GenericWizardConfigService,
        platformConfigurationService: PlatformConfigurationService
    ) {
        this._httpService = httpService;
        this._wizardService = wizardService;
        this._platformConfigurationService = platformConfigurationService;

        this.defaultPlaceholders = {
            CompanyID: this._platformConfigurationService.signedInClientId,
            Link: '""',
            UserID: this._platformConfigurationService.loggedInUserId,
            PreviewUICulture: `"${this._platformConfigurationService.defaultUiLanguageId}"`,
            UI_Language: `"${this._platformConfigurationService.defaultUiLanguageId}"`
        };
    }

    private defaultPlaceholders: ReportPlaceholder = {};
    protected placeholders: ReportPlaceholder = {};

    /**
     * This function prepares the report parameters for each report.
     * @param inputParam contains the uuid and moduleName of current container.
     */
    public async prepareReportParameters(reportList: IGenericWizardReportEntity[]) {
        const inputParam = this.getReportContainerInputs();
        if (reportList && reportList.length > 0) {
            // Prepare parameters for each report in the list
            await Promise.all(
                reportList.map(async (report) => {
                    const params = await this.getReportParameters(report.Id, inputParam.moduleName);

                    const reportParams: GenericWizardReportParameter[] = [];
                    report.ReportParameterEntities?.forEach(paramEntity => this.prepareReportParams(reportParams, params, paramEntity));
                    report.parameters = reportParams.filter(param => param.isVisible);
                    const visibleNames = report.parameters.map(param => param.name);
                    report.hiddenParameters = reportParams.filter(param => !visibleNames.includes(param.name));
                })
            );
        }
    }

    /**
     * returns report parameters of current report.
     * Todo :- "loadReportParameters" from report-sidebar.service could be used but needs parameter modifications.
     * @param reportId
     * @param moduleName
     * @returns
     */
    private async getReportParameters(reportId: number, moduleName: string) {
        return await this._httpService.get<IReportParameter[]>('basics/reporting/sidebar/parameters', { params: { id: reportId, module: moduleName } });
    }

    private prepareReportParams(reportParams: GenericWizardReportParameter[], params: IReportParameter[], paramEntity: IReportParameterEntity) {
        if (paramEntity.ParameterName !== null) {
            const paramData = params.find(param => toLower(param.parameterName) === toLower(paramEntity.ParameterName!));
            if (paramData) {
                const parameter: GenericWizardReportParameter = {
                    context: paramData.context,
                    DataType: paramEntity.DataType || paramData.dataType,
                    Description: paramEntity.DescriptionInfo?.Description || paramData.name,
                    Id: paramEntity.Id,
                    Name: paramEntity.ParameterName || paramData.parameterName,
                    values: paramData.values || [],
                    isVisible: paramEntity.IsVisible && (paramData.context === 0 || paramData.context === 10) //The report parameters with context as 0 or 10 are report parameters with type as parameter. Only these are displayed.
                };
                parameter.dataType = parameter.DataType;
                parameter.defaultValue = !isNil(paramData.defaultValue) ? paramData.defaultValue : null;
                parameter.name = parameter.Description || parameter.Name;

                this.replaceAutoPlaceholders(parameter);
                this.addActualDataType(parameter);

                reportParams.push(parameter);
            }
        }
    }

    /**
     * Provides information to specify current report container is a part of which wizard implementation.
     * @returns container uuid and module name.
     */
    private getReportContainerInputs(): ReportContainerInput {
        const instanceId = this._wizardService.getWizardInstanceUuid();
        if (instanceId === GenericWizardUseCaseUuid.ContractConfirm) {
            return {
                moduleName: 'Procurement.Contract',
                containerUuid: ContractConfirmWizardContainers.CONTRACT_CONFIRM_REPORT
            };
        } else {
            return {
                moduleName: 'Procurement.RfQ',
                containerUuid: RfqBidderWizardContainers.RFQ_BIDDER_Report
            };
        }
    }

    private replaceAutoPlaceholders(parameter: GenericWizardReportParameter) {
        const lowerCaseParamName = toLower(parameter.Name).replace('module_', '');
        const allPlaceholders = assign({}, this.defaultPlaceholders, this.placeholders);
        const key = find(Object.keys(allPlaceholders), key => key.toLowerCase() === lowerCaseParamName);
        if (key) {
            let placeholder = allPlaceholders[key];
            if (placeholder) {
                if (typeof placeholder === 'function') {
                    placeholder = placeholder();
                }
                parameter.defaultValue = placeholder || parameter.defaultValue;
            }
        }
    }

    private addActualDataType(parameter: GenericWizardReportParameter) {
        if (parameter.DataType === 'System.Int32') {
            parameter.actualDataType = 'int';
            if (isString(parameter.defaultValue)) {
                parameter.actualDataType = 'intAsString';
            }
        }

        if (parameter.DataType === 'System.Boolean') {
            parameter.actualDataType = 'bool';
            if (isString(parameter.defaultValue)) {
                const defVal = parameter.defaultValue;
                if (defVal === 'true') {
                    parameter.defaultValue = true;
                    parameter.actualDataType = 'boolInString';
                } else if (defVal === 'false') {
                    parameter.defaultValue = false;
                    parameter.actualDataType = 'boolInString';
                } else {
                    parameter.defaultValue = parseInt(defVal);
                    parameter.actualDataType = 'intInStringAsBool';
                }
            }

            if (isNumber(parameter.defaultValue)) {
                parameter.defaultValue = !!parameter.defaultValue;
            }
        }
    }
}
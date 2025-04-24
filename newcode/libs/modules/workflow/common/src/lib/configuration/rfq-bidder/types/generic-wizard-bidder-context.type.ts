/*
 * Copyright(c) RIB Software GmbH
 */

import { ExcelProperties } from '../../../models/types/generic-wizard-excel-properties.type';
import { RfqBidderDataFormat } from './rfq-bidder-data-format.type';
import { IGenericWizardReportEntity } from './generic-wizard-report-entity.interface';
import { RfqBidders } from './rfq-bidders.type';
import { Boq, BoqListComplete as BoqComplete, ReqHeaders } from './bidder-requisition-info.type';
import { ShortParameterType } from './generic-wizard-short-parameter.type';

export type GenericWizardBaseContext = {
    startEntityId: number,
    CommunicationChannel: number | undefined,
    SelectedBodyLetter: number,
    SelectedBodyLetterParameters?: ShortParameterType[] | null,
    ReportList: IGenericWizardReportEntity[],
    DocumentList: (string | number | Record<number, string> | undefined)[],
    ExcelProperties: ExcelProperties,
    StartingClerk: {
        ID: number,
        DESCRIPTION: string,
        Email: string
    },
    Subject?: string,
    DefaultSubject?: string,
    SendAsBCC: boolean,
    SendFromMe: boolean,
    Sender: string,
    GenerateSafeLink: boolean,
    DisableDataFormatExport: boolean,
    ReplyToClerk: boolean,
    DisableZipping: boolean,
    LinkAndAttachment: boolean,
    FileNameFromDescription: boolean,
    AdditionalEmailForBCC: string,
    selectedDataFormat: RfqBidderDataFormat[],
    Url: string,
    Lang: string,
    fileList: (string | number | Record<number, string> | undefined)[],
    CompanyId?: number,
    errorList: object[],
    materialExportRequested?: RfqBidderDataFormat,
    attachments: object[],
    HasReqVariantAssignedInPage: boolean, // if some bidder has "hasReqVariantAssigned" true, this is true
    wizardInstanceId?: number,
    reportFileNaming: string,
    exportFileNaming: string,
    BoqList: Boq[],
    reqHeadersList?: ReqHeaders[], 
    BoqListComplete?: BoqComplete[],
    requiredRequisitions?: ReqHeaders[]
}

export type RfqBidderContext = GenericWizardBaseContext & {
    Bidder: RfqBidders
};

export type ContractConfirmContext = GenericWizardBaseContext & {
    BusinessPartner: RfqBidders
};
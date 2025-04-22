/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { EntityInfo } from '@libs/ui/business-base';
import {prefixAllTranslationKeys, Translatable } from '@libs/platform/common';
import {FieldType } from '@libs/ui/common';
import { EntityDomainType,IEntitySchemaId } from '@libs/platform/data-access';
import { IPrcCommonAccrualEntity } from '../model/entities/prc-common-accrual-entity.interface';
import { ProcurementCommonAccrualFormBehavior } from '../behaviors/procurement-common-accrual-form-behavior.service';
import { ProcurementCommonAccrualGridBehavior } from '../behaviors/procurement-common-accrual-grid-behavior.service';


@Injectable({
  providedIn: 'root',
})

/**
 * Procurement common Accrual entity info factory Service
 */
export class ProcurementCommonAccrualEntityInfoFactoryService {
   
    /**
	 *Create method for procurement accrual entity info for different modules
    */
     public static create(config: {
        /**
		 * Grid Title.
		 */
        gridTitle : Translatable,
        /**
		 * Form Title.
		 */
        formTitle : Translatable;
        /**
		 * container uuid.
		 */
        containerUuid : string;
        /**
		 * Data Service.
		 */
        dataService: object;
        /**
		 * Dto SchemaId.
		 */
        dtoSchemeId: IEntitySchemaId | undefined;
        /**
		 * main module name.
		 */
        mainModule: string | undefined;
        /**
		 * Permission uuid.
		 */
        permissionUuid: string;
        /**
		 * container uuid.
		 */
        schema: string;
     }  
     ): EntityInfo {
    return EntityInfo.create<IPrcCommonAccrualEntity>({
      grid: {
        title: config.gridTitle,
        behavior: ctx => ctx.injector.get(ProcurementCommonAccrualGridBehavior),
      },
      form: {
        title: config.formTitle,
        behavior: ctx => ctx.injector.get(ProcurementCommonAccrualFormBehavior),
        containerUuid: config.containerUuid,
      },
      dataService: ctx => ctx.injector.get(config.dataService),
      dtoSchemeId: config.dtoSchemeId,
      permissionUuid: config.permissionUuid,
      entitySchema: {
        schema: config.schema || 'IPrcCommonAccrualEntity', // check 
        properties: {
          DateEffective: { domain: EntityDomainType.Date, mandatory: true },
          CompanyTransactionFk: { domain: EntityDomainType.Description, mandatory: true },
        },
 
        additionalProperties: {
            'CompanyTransaction.CompanyTransheaderFk': { domain: EntityDomainType.Integer, mandatory: false },
            'CompanyTransaction.Currency': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.PostingDate': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.DocumentType': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.VoucherNumber': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.VoucherDate': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.Account': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.OffsetAccount': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.PostingNarritive': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.Amount': { domain: EntityDomainType.Integer, mandatory: false },
            'CompanyTransaction.AmountOc': { domain: EntityDomainType.Integer, mandatory: false },
            'CompanyTransaction.Quantity': { domain: EntityDomainType.Integer, mandatory: false },
            'CompanyTransaction.ControllingUnitCode': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.ControllingUnitAssign01': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.ControllingUnitAssign01Desc': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.ControllingUnitAssign02': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.ControllingUnitAssign02Desc': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.ControllingUnitAssign03': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.ControllingUnitAssign03Desc': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.ControllingUnitAssign04': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.ControllingUnitAssign04Desc': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.ControllingUnitAssign05': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.ControllingUnitAssign05Desc': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.ControllingUnitAssign06': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.ControllingUnitAssign06Desc': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.ControllingUnitAssign07': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.ControllingUnitAssign07Desc': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.ControllingUnitAssign08': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.ControllingUnitAssign08Desc': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.ControllingUnitAssign09': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.ControllingUnitAssign09Desc': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.ControllingUnitAssign10': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.ControllingUnitAssign10Desc': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.OffsetContUnitCode': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.OffsetContUnitAssign01': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.OffsetContUnitAssign01Desc': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.OffsetContUnitAssign02': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.OffsetContUnitAssign02Desc': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.OffsetContUnitAssign03': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.OffsetContUnitAssign03Desc': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.OffsetContUnitAssign04': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.OffsetContUnitAssign04Desc': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.OffsetContUnitAssign05': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.OffsetContUnitAssign05Desc': { domain: EntityDomainType.Description, mandatory: true },
            'CompanyTransaction.OffsetContUnitAssign06': { domain: EntityDomainType.Description, mandatory: true },
            'CompanyTransaction.OffsetContUnitAssign06Desc': { domain: EntityDomainType.Description, mandatory: true },
            'CompanyTransaction.OffsetContUnitAssign07': { domain: EntityDomainType.Description, mandatory: true },
            'CompanyTransaction.OffsetContUnitAssign07Desc': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.OffsetContUnitAssign08': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.OffsetContUnitAssign08Desc': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.OffsetContUnitAssign09': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.OffsetContUnitAssign09Desc': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.OffsetContUnitAssign10': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.OffsetContUnitAssign10Desc': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.NominalDimension': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.NominalDimension2': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.NominalDimension3': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.TaxCode': { domain: EntityDomainType.Description, mandatory: false },
            'CompanyTransaction.PostingArea': { domain: EntityDomainType.Integer, mandatory: false },
        },
        mainModule: config.mainModule,
      },
      layoutConfiguration: {
        groups: [
            {
                gid: 'baseGroup',
                title: {
                    key: 'cloud.common.entityProperties',
                    text: 'Basic Data',
                },
                attributes: [
                    'DateEffective', 'CompanyTransactionFk',
                ],
                additionalAttributes:[
                    'CompanyTransaction.CompanyTransheaderFk', 
                    'CompanyTransaction.Currency', 
                    'CompanyTransaction.PostingDate', 
                    'CompanyTransaction.DocumentType', 
                    'CompanyTransaction.VoucherNumber', 
                    'CompanyTransaction.VoucherDate', 
                    'CompanyTransaction.Account', 
                    'CompanyTransaction.OffsetAccount', 
                    'CompanyTransaction.PostingNarritive', 
                    'CompanyTransaction.Amount', 
                    'CompanyTransaction.AmountOc', 
                    'CompanyTransaction.Quantity', 
                    'CompanyTransaction.ControllingUnitCode', 
                    'CompanyTransaction.ControllingUnitAssign01',
                    'CompanyTransaction.ControllingUnitAssign01Desc', 
                    'CompanyTransaction.ControllingUnitAssign02', 
                    'CompanyTransaction.ControllingUnitAssign02Desc', 
                    'CompanyTransaction.ControllingUnitAssign03',
                    'CompanyTransaction.ControllingUnitAssign03Desc', 
                    'CompanyTransaction.ControllingUnitAssign04', 
                    'CompanyTransaction.ControllingUnitAssign04Desc',
                    'CompanyTransaction.ControllingUnitAssign05',
                    'CompanyTransaction.ControllingUnitAssign05Desc',
                    'CompanyTransaction.ControllingUnitAssign06', 
                    'CompanyTransaction.ControllingUnitAssign06Desc', 
                    'CompanyTransaction.ControllingUnitAssign07', 
                    'CompanyTransaction.ControllingUnitAssign07Desc', 
                    'CompanyTransaction.ControllingUnitAssign08', 
                    'CompanyTransaction.ControllingUnitAssign08Desc',                                 
                    'CompanyTransaction.ControllingUnitAssign09', 
                    'CompanyTransaction.ControllingUnitAssign09Desc', 
                    'CompanyTransaction.ControllingUnitAssign10',
                    'CompanyTransaction.ControllingUnitAssign10Desc',
                    'CompanyTransaction.OffsetContUnitCode',
                    'CompanyTransaction.OffsetContUnitAssign01',
                    'CompanyTransaction.OffsetContUnitAssign01Desc',
                    'CompanyTransaction.OffsetContUnitAssign02',
                    'CompanyTransaction.OffsetContUnitAssign02Desc',
                    'CompanyTransaction.OffsetContUnitAssign02',
                    'CompanyTransaction.OffsetContUnitAssign02Desc',
                    'CompanyTransaction.OffsetContUnitAssign02',
                    'CompanyTransaction.OffsetContUnitAssign03Desc',
                    'CompanyTransaction.OffsetContUnitAssign03',
                    'CompanyTransaction.OffsetContUnitAssign04Desc',
                    'CompanyTransaction.OffsetContUnitAssign04',
                    'CompanyTransaction.OffsetContUnitAssign05Desc',
                    'CompanyTransaction.OffsetContUnitAssign05',
                    'CompanyTransaction.OffsetContUnitAssign06Desc',
                    'CompanyTransaction.OffsetContUnitAssign06',
                    'CompanyTransaction.OffsetContUnitAssign07Desc',
                    'CompanyTransaction.OffsetContUnitAssign07',
                    'CompanyTransaction.OffsetContUnitAssign08',
                    'CompanyTransaction.OffsetContUnitAssign08Desc',
                    'CompanyTransaction.OffsetContUnitAssign09',
                    'CompanyTransaction.OffsetContUnitAssign09Desc',
                    'CompanyTransaction.OffsetContUnitAssign10',
                    'CompanyTransaction.OffsetContUnitAssign10Desc',
                    'CompanyTransaction.NominalDimension', 
                    'CompanyTransaction.NominalDimension2', 
                    'CompanyTransaction.NominalDimension3',
                    'CompanyTransaction.TaxCode',
                    'CompanyTransaction.PostingArea'
                ]
            },
           
        ],
        overloads: {
            DateEffective: {
                readonly: true,
                type: FieldType.DateUtc
            },
            CompanyTransactionFk: {
                readonly: true,                            
            },
              
        },
        additionalOverloads:{
            'CompanyTransaction.CompanyTransheaderFk' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.Currency' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.PostingDate' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.DocumentType' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.VoucherNumber' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.VoucherDate' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.Account' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.OffsetAccount' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.PostingNarritive' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.Amount' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.AmountOc' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.Quantity' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.ControllingUnitCode' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.ControllingUnitAssign01' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.ControllingUnitAssign01Desc' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.ControllingUnitAssign02' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.ControllingUnitAssign02Desc' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.ControllingUnitAssign03' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.ControllingUnitAssign03Desc' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.ControllingUnitAssign04' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.ControllingUnitAssign04Desc' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.ControllingUnitAssign05' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.ControllingUnitAssign05Desc' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.ControllingUnitAssign06' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.ControllingUnitAssign06Desc' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.ControllingUnitAssign07' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.ControllingUnitAssign07Desc' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.ControllingUnitAssign08' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.ControllingUnitAssign08Desc' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.ControllingUnitAssign09' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.ControllingUnitAssign09Desc' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.ControllingUnitAssign10' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.ControllingUnitAssign10Desc' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.OffsetContUnitCode' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.OffsetContUnitAssign01' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.OffsetContUnitAssign01Desc' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.OffsetContUnitAssign02' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.OffsetContUnitAssign02Desc' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.OffsetContUnitAssign03' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.OffsetContUnitAssign03Desc' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.OffsetContUnitAssign04' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.OffsetContUnitAssign04Desc' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.OffsetContUnitAssign05' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.OffsetContUnitAssign05Desc' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.OffsetContUnitAssign06' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.OffsetContUnitAssign06Desc' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.OffsetContUnitAssign07' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.OffsetContUnitAssign07Desc' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.OffsetContUnitAssign08' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.OffsetContUnitAssign08Desc' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.OffsetContUnitAssign09' : {
                type: FieldType.Description,					    
            },
            'CompanyTransaction.OffsetContUnitAssign09Desc' : {
                type: FieldType.Description,					    
            },
            'CompanyTransaction.OffsetContUnitAssign10' : {
                type: FieldType.Description,					    
            },
            'CompanyTransaction.OffsetContUnitAssign10Desc' : {
                type: FieldType.Description,					    
            },
            'CompanyTransaction.NominalDimension' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.NominalDimension2' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.NominalDimension3' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.TaxCode' : {
            type: FieldType.Description,					    
            },
            'CompanyTransaction.PostingArea' : {
            type: FieldType.Description,					    
            },
        },
        
        labels: {
            ...prefixAllTranslationKeys('procurement.pes.', {
                'DateEffective': {
                    key: 'entityDateEffective',
                },
                'CompanyTransactionFk': {
                    key: 'entityCompanyTransactionFk',
                },
                'CompanyTransaction.CompanyTransheaderFk': {
                    key: 'transaction.transHeader',
                },
                'CompanyTransaction.Currency': {
                    key: 'transaction.currency',
                },
                'CompanyTransaction.PostingDate': {
                    key: 'transaction.postingDate',
                },
                //TODO: In Angular JS FileType
                'CompanyTransaction.DocumentType': {
                    key: 'transaction.documentType',
                },
                'CompanyTransaction.VoucherNumber': {
                    key: 'transaction.voucherNumber',
                },
                'CompanyTransaction.VoucherDate': {
                    key: 'transaction.voucherDate',
                },
                'CompanyTransaction.Account': {
                    key: 'transaction.account',
                },
                'CompanyTransaction.OffsetAccount': {
                    key: 'transaction.offsetAccount',
                },
                'CompanyTransaction.PostingNarritive': {
                    key: 'transaction.postingNarritive',
                },
                'CompanyTransaction.Amount': {
                    key: 'transaction.amount',
                },
                'CompanyTransaction.AmountOc': {
                    key: 'transaction.amountOc',
                },
                'CompanyTransaction.Quantity': {
                    key: 'transaction.quantity',
                },
                'CompanyTransaction.ControllingUnitCode': {
                    key: 'transaction.controllingUnitCode',
                },
                'CompanyTransaction.ControllingUnitAssign01': {
                    key: 'transaction.controllingUnitAssign01',
                },
                'CompanyTransaction.ControllingUnitAssign01Desc': {
                    key: 'transaction.controllingUnitAssign01Desc',
                },
                'CompanyTransaction.ControllingUnitAssign02': {
                    key: 'transaction.controllingUnitAssign02',
                },
                'CompanyTransaction.ControllingUnitAssign02Desc': {
                    key: 'transaction.controllingUnitAssign02Desc',
                },
                'CompanyTransaction.ControllingUnitAssign03': {
                    key: 'transaction.controllingUnitAssign03',
                },
                'CompanyTransaction.ControllingUnitAssign03Desc': {
                    key: 'transaction.controllingUnitAssign03Desc',
                },
                'CompanyTransaction.ControllingUnitAssign04': {
                    key: 'transaction.controllingUnitAssign04',
                },
                'CompanyTransaction.ControllingUnitAssign04Desc': {
                    key: 'transaction.controllingUnitAssign04Desc',
                },
                'CompanyTransaction.ControllingUnitAssign05': {
                    key: 'transaction.controllingUnitAssign05',
                },
                'CompanyTransaction.ControllingUnitAssign05Desc': {
                    key: 'transaction.controllingUnitAssign05Desc',
                },
                'CompanyTransaction.ControllingUnitAssign06': {
                    key: 'transaction.controllingUnitAssign06',
                },
                'CompanyTransaction.ControllingUnitAssign06Desc': {
                    key: 'transaction.controllingUnitAssign06Desc',
                },
                'CompanyTransaction.ControllingUnitAssign07': {
                    key: 'transaction.controllingUnitAssign07',
                },
                'CompanyTransaction.ControllingUnitAssign07Desc': {
                    key: 'transaction.controllingUnitAssign07Desc',
                },
                'CompanyTransaction.ControllingUnitAssign08': {
                    key: 'transaction.controllingUnitAssign08',
                },
                'CompanyTransaction.ControllingUnitAssign08Desc': {
                    key: 'transaction.controllingUnitAssign08Desc',
                },
                'CompanyTransaction.ControllingUnitAssign09': {
                    key: 'transaction.controllingUnitAssign09',
                },
                'CompanyTransaction.ControllingUnitAssign09Desc': {
                    key: 'transaction.controllingUnitAssign09Desc',
                },
                'CompanyTransaction.ControllingUnitAssign10': {
                    key: 'transaction.controllingUnitAssign10',
                },
                'CompanyTransaction.ControllingUnitAssign10Desc': {
                    key: 'transaction.controllingUnitAssign10Desc',
                },
                'CompanyTransaction.OffsetContUnitCode': {
                    key: 'transaction.offsetContUnitCode',
                },
                'CompanyTransaction.OffsetContUnitAssign01': {
                    key: 'transaction.offsetContUnitAssign01',
                },
                'CompanyTransaction.OffsetContUnitAssign01Desc': {
                    key: 'transaction.offsetContUnitAssign01Desc',
                },
                'CompanyTransaction.OffsetContUnitAssign02': {
                    key: 'transaction.offsetContUnitAssign02',
                },
                'CompanyTransaction.OffsetContUnitAssign02Desc': {
                    key: 'transaction.offsetContUnitAssign02Desc',
                },
                'CompanyTransaction.OffsetContUnitAssign03': {
                    key: 'transaction.offsetContUnitAssign03',
                },
                'CompanyTransaction.OffsetContUnitAssign03Desc': {
                    key: 'transaction.offsetContUnitAssign03Desc',
                },
                'CompanyTransaction.OffsetContUnitAssign04': {
                    key: 'transaction.offsetContUnitAssign04',
                },
                'CompanyTransaction.OffsetContUnitAssign04Desc': {
                    key: 'transaction.offsetContUnitAssign04Desc',
                },
                'CompanyTransaction.OffsetContUnitAssign05': {
                    key: 'transaction.offsetContUnitAssign05',
                },
                'CompanyTransaction.OffsetContUnitAssign05Desc': {
                    key: 'transaction.offsetContUnitAssign05Desc',
                },
                'CompanyTransaction.OffsetContUnitAssign06': {
                    key: 'transaction.offsetContUnitAssign06',
                },
                'CompanyTransaction.OffsetContUnitAssign06Desc': {
                    key: 'transaction.offsetContUnitAssign06Desc',
                },
                'CompanyTransaction.OffsetContUnitAssign07': {
                    key: 'transaction.offsetContUnitAssign07',
                },
                'CompanyTransaction.OffsetContUnitAssign07Desc': {
                    key: 'transaction.offsetContUnitAssign07Desc',
                },
                'CompanyTransaction.OffsetContUnitAssign08': {
                    key: 'transaction.offsetContUnitAssign08',
                },
                'CompanyTransaction.OffsetContUnitAssign08Desc': {
                    key: 'transaction.offsetContUnitAssign08Desc',
                },
                'CompanyTransaction.OffsetContUnitAssign09': {
                    key: 'transaction.offsetContUnitAssign09',
                },
                'CompanyTransaction.OffsetContUnitAssign09Desc': {
                    key: 'transaction.offsetContUnitAssign09Desc',
                },
                'CompanyTransaction.OffsetContUnitAssign10': {
                    key: 'transaction.offsetContUnitAssign10',
                },
                'CompanyTransaction.OffsetContUnitAssign10Desc': {
                    key: 'transaction.offsetContUnitAssign10Desc',
                },
                'CompanyTransaction.NominalDimension': {
                    key: 'transaction.nominalDimension',
                },
                'CompanyTransaction.NominalDimension2': {
                    key: 'transaction.nominalDimension2',
                },
                'CompanyTransaction.NominalDimension3': {
                    key: 'transaction.nominalDimension3',
                },
                'CompanyTransaction.TaxCode': {
                    key: 'transaction.taxCode',
                },
                'CompanyTransaction.PostingArea': {
                    key: 'transaction.postingArea',
                },
                                       
            }),
            
        },
      },
    });
  }
}
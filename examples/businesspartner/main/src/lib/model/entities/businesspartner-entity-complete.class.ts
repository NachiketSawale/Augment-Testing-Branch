/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import {
	IContactEntity,
	IBusinessPartnerEntity,
	IEvaluationEntity,
	ScreenEvaluationCompleteEntity,
	ICustomerEntity,
	IBusinessPartner2PrcStructureEntity,
	ISupplierEntity,
	IPhotoEntity,
	IEvaluationDocumentEntity,
	ISubsidiaryEntity
} from '@libs/businesspartner/interfaces';
import {IContactEntityComplete} from '@libs/businesspartner/common';
import { SupplierEntityComplete } from './supplier-entity-complete.class';
import {CustomerEntityComplete} from './customer-entity-complete.class';

/**
 * Business Partner complete which holds modification to save
 */
export class BusinessPartnerEntityComplete implements CompleteIdentification<IBusinessPartnerEntity> {
	public MainItemId: number = 0;
	public BusinessPartners: IBusinessPartnerEntity[] | null = [];
	public SubsidiaryToSave: ISubsidiaryEntity[] = [];
	public SubsidiaryToDelete: ISubsidiaryEntity[] = [];
	public ContactToSave: IContactEntityComplete[] = [];
	public ContactToDelete: IContactEntity[] = [];
	public PhotoToSave: IPhotoEntity[] = [];
	public PhotoToDelete: IPhotoEntity[] = [];
	public BusinessPartner2PrcStructureToSave: IBusinessPartner2PrcStructureEntity[] = [];
	public BusinessPartner2PrcStructureToDelete: IBusinessPartner2PrcStructureEntity[] = [];
	public SupplierCompleteToSave: SupplierEntityComplete[] = [];
	public SupplierToDelete: ISupplierEntity[] = [];
	public BpdBankToSave: ISupplierEntity[] = [];
	public BpdBankToDelete: ISupplierEntity[] = [];
	public CustomerCompleteToSave: CustomerEntityComplete[] = [];
	public CustomerToDelete: ICustomerEntity[] = [];
	public BusinessPartnerEvaluationToDelete: IEvaluationEntity[] = [];
	public BusinessPartnerEvaluationToSave: ScreenEvaluationCompleteEntity[] = [];
	public EvaluationDocumentToSave: IEvaluationDocumentEntity[] = [];
	public EvaluationDocumentToDelete: IEvaluationDocumentEntity[] = [];
}
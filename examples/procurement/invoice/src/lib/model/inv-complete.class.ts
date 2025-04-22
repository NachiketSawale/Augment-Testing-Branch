/*
 * Copyright(c) RIB Software GmbH
 */

import { IInvBillingSchemaEntity } from './entities/inv-billing-schema-entity.interface';
import { IInvAccountAssignmentEntity } from './entities/inv-account-assignment-entity.interface';
import { IInvHeaderEntity } from './entities/inv-header-entity.interface';
import { InvOtherComplete } from './inv-other-complete.class';
import { IInvPaymentEntity } from './entities/inv-payment-entity.interface';
import { IInvRejectEntity } from './entities/inv-reject-entity.interface';
import { InvRejectComplete } from './inv-reject-complete.class';
import { InvSalesTaxComplete } from './inv-sales-tax-complete.class';
import { InvTransactionComplete } from './inv-transaction-complete.class';
import { IInvValidationEntity } from './entities/inv-validation-entity.interface';
import { IInvOtherEntity } from './entities/inv-other-entity.interface';
import { CompleteIdentification } from '@libs/platform/common';
import { IPrcGeneralsEntity, IPrcPackage2ExtBidderEntity } from '@libs/procurement/common';
import { IInv2ContractEntity, IInvHeader2InvHeaderEntity, IInvTransactionEntity } from './entities';
import { Inv2ContractComplete } from './inv-2-contract-complete.class';
import { IInv2PESEntity } from './entities/inv-2-pes-entity.interface';
import { IPrcCertificateEntity } from '@libs/procurement/interfaces';

export class InvComplete implements CompleteIdentification<IInvHeaderEntity> {
	/*
	 * ApprovalDataToDelete
	 * todo - not sure where this entity comes from
	 */
	//public ApprovalDataToDelete?: IApprovalDataEntity[] | null = [];

	/*
	 * ApprovalDataToSave
	 */
	//public ApprovalDataToSave?: IApprovalDataEntity[] | null = [];

	/*
	 * BillingSchemaToDelete
	 */
	public BillingSchemaToDelete?: IInvBillingSchemaEntity[] | null = [];

	/*
	 * BillingSchemaToSave
	 */
	public BillingSchemaToSave?: IInvBillingSchemaEntity[] | null = [];

	/*
	 * CalculateErrorMesssage
	 */
	public CalculateErrorMesssage?: string | null = '';

	/*
	 * CertificateToDelete
	 * todo - not sure where this entity comes from
	 */
	//public CertificateToDelete?: ICertificateEntity[] | null = [];

	/*
	 * CertificateToSave
	 */
	//public CertificateToSave?: ICertificateEntity[] | null = [];

	/*
	 * CommentDataToSave
	 * todo - not sure where this entity comes from
	 */
	//public CommentDataToSave?: ICommentDataEntity[] | null = [];

	/*
	 * InvAccountAssignmentDtoToDelete
	 */
	public InvAccountAssignmentDtoToDelete?: IInvAccountAssignmentEntity[] | null = [];

	/*
	 * InvAccountAssignmentDtoToSave
	 */
	public InvAccountAssignmentDtoToSave?: IInvAccountAssignmentEntity[] | null = [];

	/*
	 * InvCertificateToDelete
	 */
	public InvCertificateToDelete?: IPrcCertificateEntity[] | null = [];

	/*
	 * InvCertificateToSave
	 */
	public InvCertificateToSave?: IPrcCertificateEntity[] | null = [];

	/*
	 * InvContractToDelete
	 */
	public InvContractToDelete?: IInv2ContractEntity[] | null = [];

	/*
	 * InvContractToSave
	 */
	public InvContractToSave?: Inv2ContractComplete[] | null = [];

	/*
	 * InvGeneralsToDelete
	 */
	public InvGeneralsToDelete?: IPrcGeneralsEntity[] | null = [];

	/*
	 * InvGeneralsToSave
	 */
	public InvGeneralsToSave?: IPrcGeneralsEntity[] | null = [];

	/*
	 * InvHeader
	 */
	public InvHeader?: IInvHeaderEntity | null;

	/*
	 * InvHeader2InvHeaderToDelete
	 */
	public InvHeader2InvHeaderToDelete?: IInvHeader2InvHeaderEntity[] | null = [];

	/*
	 * InvHeader2InvHeaderToSave
	 */
	public InvHeader2InvHeaderToSave?: IInvHeader2InvHeaderEntity[] | null = [];

	/*
	 * InvHeaders
	 */
	public InvHeaders?: IInvHeaderEntity[] | null = [];

	/*
	 * InvOtherToDelete
	 */
	public InvOtherToDelete?: IInvOtherEntity[] | null = [];

	/*
	 * InvOtherToSave
	 */
	public InvOtherToSave?: InvOtherComplete[] | null = [];

	/*
	 * InvPaymentToDelete
	 */
	public InvPaymentToDelete?: IInvPaymentEntity[] | null = [];

	/*
	 * InvPaymentToSave
	 */
	public InvPaymentToSave?: IInvPaymentEntity[] | null = [];

	/*
	 * InvPesToDelete
	 */
	public InvPesToDelete?: IInv2PESEntity[] | null = [];

	/*
	 * InvPesToSave
	 */
	public InvPesToSave?: IInv2PESEntity[] | null = [];

	/*
	 * InvRejectToDelete
	 */
	public InvRejectToDelete?: IInvRejectEntity[] | null = [];

	/*
	 * InvRejectToSave
	 */
	public InvRejectToSave?: InvRejectComplete[] | null = [];

	/*
	 * InvSalesTaxToSave
	 */
	public InvSalesTaxToSave?: InvSalesTaxComplete[] | null = [];

	/*
	 * InvTransactionToSave
	 */
	public InvTransactionToSave?: InvTransactionComplete[] | null = [];

	/*
 * InvTransactionDelete
 */
	public InvTransactionDelete?: IInvTransactionEntity[] | null = [];

	/*
	 * InvValidationToDelete
	 */
	public InvValidationToDelete?: IInvValidationEntity[] | null = [];

	/*
	 * InvValidationToSave
	 */
	public InvValidationToSave?: IInvValidationEntity[] | null = [];

	/*
	 * MainItemId
	 */
	public MainItemId: number = 0;

	/*
	 * NotEqualWarn
	 */
	public NotEqualWarn: boolean = true;

	/*
	 * PrcPackage2ExtBidderToDelete
	 */
	public PrcPackage2ExtBidderToDelete?: IPrcPackage2ExtBidderEntity[] | null = [];

	/*
	 * PrcPackage2ExtBidderToSave
	 */
	public PrcPackage2ExtBidderToSave?: IPrcPackage2ExtBidderEntity[] | null = [];

	/*
	 * StocktransactionSaveError
	 */
	public StocktransactionSaveError: boolean = true;


}

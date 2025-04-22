/*
 * Copyright(c) RIB Software GmbH
 */

import { IInvAccountAssignmentEntity } from './inv-account-assignment-entity.interface';
import { IInvBillingSchemaEntity } from './inv-billing-schema-entity.interface';
import { IInvCertificateEntity } from './inv-certificate-entity.interface';
import { IInvGeneralsEntity } from './inv-generals-entity.interface';
import { IInvHeaderApprovalEntity } from './inv-header-approval-entity.interface';
import { IInvOtherEntity } from './inv-other-entity.interface';
import { IInvPaymentEntity } from './inv-payment-entity.interface';
import { IInvRejectEntity } from './inv-reject-entity.interface';
import { IInvTransactionEntity } from './inv-transaction-entity.interface';
import { IInvTransactionIcEntity } from './inv-transaction-ic-entity.interface';
import { IInvValidationEntity } from './inv-validation-entity.interface';
import { IEntityBase } from '@libs/platform/common';
import { IInvStatusEntity } from './inv-status-entity.interface';
import { IInvHeader2InvHeaderEntity } from './inv-header-2-inv-header-entity.interface';

export interface IInvHeaderEntityGenerated extends IEntityBase {
	/*
	 * AccountAssignments
	 */
	AccountAssignments?: IInvAccountAssignmentEntity[] | null;

	/*
	 * AmountDiscount
	 */
	AmountDiscount: number;

	/*
	 * AmountDiscountBasis
	 */
	AmountDiscountBasis: number;

	/*
	 * AmountDiscountBasisOc
	 */
	AmountDiscountBasisOc: number;

	/*
	 * AmountDiscountOc
	 */
	AmountDiscountOc: number;

	/*
	 * AmountGross
	 */
	AmountGross: number;

	/*
	 * AmountGrossBalance
	 */
	AmountGrossBalance: number;

	/*
	 * AmountGrossBalanceOc
	 */
	AmountGrossBalanceOc: number;

	/*
	 * AmountGrossContract
	 */
	AmountGrossContract: number;

	/*
	 * AmountGrossContractOc
	 */
	AmountGrossContractOc: number;

	/*
	 * AmountGrossOc
	 */
	AmountGrossOc: number;

	/*
	 * AmountGrossOcReconciliation
	 */
	AmountGrossOcReconciliation: number;

	/*
	 * AmountGrossOther
	 */
	AmountGrossOther: number;

	/*
	 * AmountGrossOtherOc
	 */
	AmountGrossOtherOc: number;

	/*
	 * AmountGrossPes
	 */
	AmountGrossPes: number;

	/*
	 * AmountGrossPesOc
	 */
	AmountGrossPesOc: number;

	/*
	 * AmountGrossReconciliation
	 */
	AmountGrossReconciliation: number;

	/*
	 * AmountGrossReject
	 */
	AmountGrossReject: number;

	/*
	 * AmountGrossRejectOc
	 */
	AmountGrossRejectOc: number;

	/*
	 * AmountNet
	 */
	AmountNet: number;

	/*
	 * AmountNetBalance
	 */
	AmountNetBalance: number;

	/*
	 * AmountNetBalanceOc
	 */
	AmountNetBalanceOc: number;

	/*
	 * AmountNetContract
	 */
	AmountNetContract: number;

	/*
	 * AmountNetContractOc
	 */
	AmountNetContractOc: number;

	/*
	 * AmountNetOc
	 */
	AmountNetOc: number;

	/*
	 * AmountNetOcReconciliation
	 */
	AmountNetOcReconciliation: number;

	/*
	 * AmountNetOther
	 */
	AmountNetOther: number;

	/*
	 * AmountNetOtherOc
	 */
	AmountNetOtherOc: number;

	/*
	 * AmountNetPes
	 */
	AmountNetPes: number;

	/*
	 * AmountNetPesOc
	 */
	AmountNetPesOc: number;

	/*
	 * AmountNetReconciliation
	 */
	AmountNetReconciliation: number;

	/*
	 * AmountNetReject
	 */
	AmountNetReject: number;

	/*
	 * AmountNetRejectOc
	 */
	AmountNetRejectOc: number;

	/*
	 * AmountVat
	 */
	AmountVat: number;

	/*
	 * AmountVatBalance
	 */
	AmountVatBalance: number;

	/*
	 * AmountVatBalanceOc
	 */
	AmountVatBalanceOc: number;

	/*
	 * AmountVatContract
	 */
	AmountVatContract: number;

	/*
	 * AmountVatContractOc
	 */
	AmountVatContractOc: number;

	/*
	 * AmountVatOc
	 */
	AmountVatOc: number;

	/*
	 * AmountVatOcReconciliation
	 */
	AmountVatOcReconciliation: number;

	/*
	 * AmountVatOther
	 */
	AmountVatOther: number;

	/*
	 * AmountVatOtherOc
	 */
	AmountVatOtherOc: number;

	/*
	 * AmountVatPes
	 */
	AmountVatPes: number;

	/*
	 * AmountVatPesOc
	 */
	AmountVatPesOc: number;

	/*
	 * AmountVatReconciliation
	 */
	AmountVatReconciliation: number;

	/*
	 * AmountVatReject
	 */
	AmountVatReject: number;

	/*
	 * AmountVatRejectOc
	 */
	AmountVatRejectOc: number;

	/*
	 * BankFk
	 */
	BankFk?: number | null;

	/*
	 * BasAccassignAccountFk
	 */
	BasAccassignAccountFk?: number | null;

	/*
	 * BasAccassignBusinessFk
	 */
	BasAccassignBusinessFk?: number | null;

	/*
	 * BasAccassignConTypeFk
	 */
	BasAccassignConTypeFk?: number | null;

	/*
	 * BasAccassignControlFk
	 */
	BasAccassignControlFk?: number | null;

	/*
	 * BasPaymentMethodFk
	 */
	BasPaymentMethodFk?: number | null;

	/**
	 * BilHeaderIcFk
	 */
	BilHeaderIcFk?: number | null;

	/*
	 * BillSchemeIsChained
	 */
	BillSchemeIsChained: boolean;

	/*
	 * BillingSchemaFk
	 */
	BillingSchemaFk: number;

	/*
	 * BillingSchemas
	 */
	BillingSchemas?: IInvBillingSchemaEntity[] | null;

	/*
	 * BpdBankTypeFk
	 */
	BpdBankTypeFk?: number | null;

	/*
	 * BpdVatGroupFk
	 */
	BpdVatGroupFk?: number | null;

	/*
	 * BusinessPartnerFk
	 */
	BusinessPartnerFk?: number | null;

	/*
	 * BusinessPostingGroupFk
	 */
	BusinessPostingGroupFk?: number | null;

	/*
	 * ClerkPrcFk
	 */
	ClerkPrcFk?: number | null;

	/*
	 * ClerkReqFk
	 */
	ClerkReqFk?: number | null;

	/*
	 * ClerkWfeFk
	 */
	ClerkWfeFk?: number | null;

	/*
	 * Code
	 */
	Code: string;

	/*
	 * CompanyDeferalTypeFk
	 */
	CompanyDeferalTypeFk?: number | null;

	/*
	 * CompanyFk
	 */
	CompanyFk: number;

	/**
	 * CompanyIcCreditorFk
	 */
	CompanyIcCreditorFk?: number | null;

	/*
	 * ConHeaderFk
	 */
	ConHeaderFk?: number | null;

	/*
	 * ConStatusFk
	 */
	ConStatusFk: number;

	/*
	 * ContactFk
	 */
	ContactFk?: number | null;

	/*
	 * ContractChangeOrder
	 */
	ContractChangeOrder: number;

	/*
	 * ContractChangeOrderGross
	 */
	ContractChangeOrderGross: number;

	/*
	 * ContractOrderDate
	 */
	ContractOrderDate?: Date | string | null;

	/*
	 * ContractTotal
	 */
	ContractTotal: number;

	/*
	 * ContractTotalGross
	 */
	ContractTotalGross: number;

	/*
	 * ControllingUnitFk
	 */
	ControllingUnitFk?: number | null;

	/*
	 * CurrencyFk
	 */
	CurrencyFk: number;

	/*
	 * DateDeferalStart
	 */
	DateDeferalStart?: Date | string | null;

	/*
	 * DateDelivered
	 */
	DateDelivered?: Date | string | null;

	/*
	 * DateDeliveredFrom
	 */
	DateDeliveredFrom?: Date | string | null;

	/*
	 * DateDiscount
	 */
	DateDiscount?: Date | string | null;

	/*
	 * DateInvoiced
	 */
	DateInvoiced: Date | string;

	/*
	 * DateNetPayable
	 */
	DateNetPayable?: Date | string | null;

	/*
	 * DatePosted
	 */
	DatePosted?: Date | string | null;

	/*
	 * DateReceived
	 */
	DateReceived: Date | string;

	/*
	 * DealWithRateUpdateLater
	 */
	DealWithRateUpdateLater?: boolean | null;

	/*
	 * Description
	 */
	Description?: string | null;

	/*
	 * DocumentNo
	 */
	DocumentNo?: string | null;

	/*
	 * ExchangeRate
	 */
	ExchangeRate: number;

	/*
	 * FromBillingSchemaFinalTotal
	 */
	FromBillingSchemaFinalTotal: number;

	/*
	 * FromBillingSchemaFinalTotalOc
	 */
	FromBillingSchemaFinalTotalOc: number;

	/*
	 * FromBillingSchemaGross
	 */
	FromBillingSchemaGross: number;

	/*
	 * FromBillingSchemaGrossOc
	 */
	FromBillingSchemaGrossOc: number;

	/*
	 * FromBillingSchemaNet
	 */
	FromBillingSchemaNet: number;

	/*
	 * FromBillingSchemaNetOc
	 */
	FromBillingSchemaNetOc: number;

	/*
	 * FromBillingSchemaVat
	 */
	FromBillingSchemaVat: number;

	/*
	 * FromBillingSchemaVatOc
	 */
	FromBillingSchemaVatOc: number;

	/*
	 * FromPaymentTotalPayment
	 */
	FromPaymentTotalPayment: number;

	/*
	 * FromPaymentTotalPaymentDiscount
	 */
	FromPaymentTotalPaymentDiscount: number;

	/*
	 * GrossPercent
	 */
	GrossPercent?: string | null;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * InvCertificateEntities
	 */
	InvCertificateEntities?: IInvCertificateEntity[] | null;

	/*
	 * InvCertificates
	 */
	InvCertificates?: IInvCertificateEntity[] | null;

	/*
	 * InvGenerals
	 */
	InvGenerals?: IInvGeneralsEntity[] | null;

	/*
	 * InvGroupFk
	 */
	InvGroupFk: number;

	/*
	 * InvHeader2InvHeaders
	 */
	InvHeader2InvHeaders?: IInvHeader2InvHeaderEntity[] | null;

	/*
	 * InvHeaderapprovalEntities
	 */
	InvHeaderapprovalEntities?: IInvHeaderApprovalEntity[] | null;

	/*
	 * InvOthers
	 */
	InvOthers?: IInvOtherEntity[] | null;

	/*
	 * InvPaymentEntities
	 */
	InvPaymentEntities?: IInvPaymentEntity[] | null;

	/*
	 * InvRejects
	 */
	InvRejects?: IInvRejectEntity[] | null;

	/*
	 * InvStatusEntity
	 */
	InvStatusEntity?: IInvStatusEntity | null;

	/*
	 * InvStatusFk
	 */
	InvStatusFk: number;

	/*
	 * InvTransactionEntities
	 */
	InvTransactionEntities?: IInvTransactionEntity[] | null;

	/*
	 * InvTransactionIcEntities
	 */
	InvTransactionIcEntities?: IInvTransactionIcEntity[] | null;

	/*
	 * InvTypeFk
	 */
	InvTypeFk: number;

	/*
	 * InvValidations
	 */
	InvValidations?: IInvValidationEntity[] | null;

	/*
	 * Invoiced
	 */
	Invoiced: number;

	/*
	 * InvoicedGross
	 */
	InvoicedGross: number;

	/*
	 * IsInvAccountChangeable
	 */
	IsInvAccountChangeable: boolean;

	/*
	 * IsProtectedAllFields
	 */
	IsProtectedAllFields: boolean;

	/*
	 * PaymentHint
	 */
	PaymentHint?: string | null;

	/*
	 * PaymentTermFk
	 */
	PaymentTermFk?: number | null;

	/*
	 * Percent
	 */
	Percent?: string | null;

	/*
	 * PercentDiscount
	 */
	PercentDiscount: number;

	/*
	 * PermissionObjectInfo
	 */
	PermissionObjectInfo?: string | null;

	/*
	 * PesHeaderFk
	 */
	PesHeaderFk?: number | null;

	/*
	 * PrcConfigurationFk
	 */
	PrcConfigurationFk: number;

	/*
	 * PrcPackageFk
	 */
	PrcPackageFk?: number | null;

	/*
	 * PrcStructureFk
	 */
	PrcStructureFk?: number | null;

	/*
	 * ProgressId
	 */
	ProgressId: number;

	/*
	 * ProjectFk
	 */
	ProjectFk?: number | null;

	/*
	 * ProjectStatusFk
	 */
	ProjectStatusFk?: number | null;

	/*
	 * ReconcilationHint
	 */
	ReconcilationHint?: string | null;

	/*
	 * Reference
	 */
	Reference?: string | null;

	/*
	 * ReferenceStructured
	 */
	ReferenceStructured?: string | null;

	/*
	 * RejectionRemark
	 */
	RejectionRemark?: string | null;

	/*
	 * Remark
	 */
	Remark?: string | null;

	/*
	 * RubricCategoryFk
	 */
	RubricCategoryFk: number;

	/*
	 * SalesTaxMethodFk
	 */
	SalesTaxMethodFk: number;

	/*
	 * SearchPattern
	 */
	SearchPattern?: string | null;

	/*
	 * SubsidiaryFk
	 */
	SubsidiaryFk?: number | null;

	/*
	 * SupplierFk
	 */
	SupplierFk?: number | null;

	/*
	 * TaxCodeFk
	 */
	TaxCodeFk: number;

	/*
	 * TotalPerformedGross
	 */
	TotalPerformedGross: number;

	/*
	 * TotalPerformedNet
	 */
	TotalPerformedNet: number;

	/*
	 * UserDefinedDate01
	 */
	UserDefinedDate01?: Date | string | null;

	/*
	 * UserDefinedDate02
	 */
	UserDefinedDate02?: Date | string | null;

	/*
	 * UserDefinedDate03
	 */
	UserDefinedDate03?: Date | string | null;

	/*
	 * UserDefinedMoney01
	 */
	UserDefinedMoney01: number;

	/*
	 * UserDefinedMoney02
	 */
	UserDefinedMoney02: number;

	/*
	 * UserDefinedMoney03
	 */
	UserDefinedMoney03: number;

	/*
	 * UserDefinedMoney04
	 */
	UserDefinedMoney04: number;

	/*
	 * UserDefinedMoney05
	 */
	UserDefinedMoney05: number;

	/*
	 * Userdefined1
	 */
	Userdefined1?: string | null;

	/*
	 * Userdefined2
	 */
	Userdefined2?: string | null;

	/*
	 * Userdefined3
	 */
	Userdefined3?: string | null;

	/*
	 * Userdefined4
	 */
	Userdefined4?: string | null;

	/*
	 * Userdefined5
	 */
	Userdefined5?: string | null;

	/*
	 * conCompanyCurrency
	 */
	conCompanyCurrency?: string | null;

	/*
	 * conHeaderCurrency
	 */
	conHeaderCurrency?: string | null;

	/*
	 * conTotalAmount
	 */
	conTotalAmount: number;

	/*
	 * conTotalAmountOc
	 */
	conTotalAmountOc: number;

	/*
	 * conTotalNet
	 */
	conTotalNet: number;

	/*
	 * conTotalNetOc
	 */
	conTotalNetOc: number;

	/*
	 * conTotalPercent
	 */
	conTotalPercent: number;

	/*
	 * invCompanyCurrency
	 */
	invCompanyCurrency?: string | null;

	/*
	 * invHeaderCurrency
	 */
	invHeaderCurrency?: string | null;

	/*
	 * invoiceTotalAmount
	 */
	invoiceTotalAmount: number;

	/*
	 * invoiceTotalAmountOc
	 */
	invoiceTotalAmountOc: number;

	/*
	 * invoiceTotalNet
	 */
	invoiceTotalNet: number;

	/*
	 * invoiceTotalNetOc
	 */
	invoiceTotalNetOc: number;

	/*
	 * invoiceTotalPercent
	 */
	invoiceTotalPercent: number;

	/*
	 * previousInvCompanyCurrency
	 */
	previousInvCompanyCurrency?: string | null;

	/*
	 * previousInvHeaderCurrency
	 */
	previousInvHeaderCurrency?: string | null;

	/*
	 * previousInvoiceAmount
	 */
	previousInvoiceAmount: number;

	/*
	 * previousInvoiceAmountOc
	 */
	previousInvoiceAmountOc: number;

	/*
	 * previousInvoiceNet
	 */
	previousInvoiceNet: number;

	/*
	 * previousInvoiceNetOc
	 */
	previousInvoiceNetOc: number;
}

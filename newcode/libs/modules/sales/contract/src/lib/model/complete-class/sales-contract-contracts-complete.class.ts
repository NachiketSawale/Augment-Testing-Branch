import { CompleteIdentification } from '@libs/platform/common';
import { ISharedMandatoryDeadlinesEntity } from '@libs/sales/shared';
import { ICharacteristicDataEntity } from '@libs/basics/interfaces';
import { IBillHeaderEntity } from '../entities/bill-header-entity.interface';
import { IWipHeaderEntity } from '../entities/wip-header-entity.interface';
import { IOrdValidationEntity, IOrdWarrantyEntity, IOrdTransactionEntity,IOrdCertificateEntity, IOrdPaymentScheduleEntity, IOrdMilestoneEntity, IOrdHeaderEntity, IOrdBoqCompositeEntity, IOrdAdvanceEntity, IGeneralsEntity, IDocumentEntity } from '@libs/sales/interfaces';

export class SalesContractContractsComplete implements CompleteIdentification<IOrdHeaderEntity>{

	public MainItemId: number  = 0;

	public OrdHeaders: IOrdHeaderEntity[] | null = [];

	public GeneralsToSave: IGeneralsEntity[] | null = [];
	public GeneralsToDelete: IGeneralsEntity[] | null = [];

	public OrdMilestoneToSave: IOrdMilestoneEntity[] | null = [];
	public OrdMilestoneToDelete: IOrdMilestoneEntity[] | null = [];

	public OrdWarrantyToSave: IOrdWarrantyEntity[] | null = [];
	public OrdWarrantyToDelete: IOrdWarrantyEntity[] | null = [];

	public OrdMandatoryDeadlineToSave: ISharedMandatoryDeadlinesEntity[] | null = [];
	public OrdMandatoryDeadlineToDelete: ISharedMandatoryDeadlinesEntity[] | null = [];

	public OrdCertificateToSave: IOrdCertificateEntity[] | null = [];
	public OrdCertificateToDelete: IOrdCertificateEntity[] | null = [];

	public BilHeaderToSave: IBillHeaderEntity[] | null = [];
	public BilHeaderToDelete: IBillHeaderEntity[] | null = [];

	public WipHeaderToSave: IWipHeaderEntity[] | null = [];
	public WipHeaderToDelete: IWipHeaderEntity[] | null = [];

	public OrdAdvanceToSave: IOrdAdvanceEntity[] | null = [];
	public OrdAdvanceToDelete: IOrdAdvanceEntity[] | null = [];

	public OrdValidationToSave: IOrdValidationEntity[] | null = [];
	public OrdValidationToDelete: IOrdValidationEntity[] | null = [];

	public DocumentsToSave: IDocumentEntity[] | null = [];
	public DocumentsToDelete: IDocumentEntity[] | null = [];

  public OrdBoqCompositeToSave:   IOrdBoqCompositeEntity[] | null = [];
  public OrdBoqCompositeToDelete: IOrdBoqCompositeEntity[] | null = [];

	public OrdPaymentScheduleToSave: IOrdPaymentScheduleEntity[] | null = [];
	public OrdPaymentScheduleToDelete: IOrdPaymentScheduleEntity[] | null = [];

	public OrdTransactionsToSave: IOrdTransactionEntity[] | null = [];
	public OrdTransactionsToDelete: IOrdTransactionEntity[] | null = [];

	public CharacteristicDataToSave: ICharacteristicDataEntity[] | null = [];
	public CharacteristicDataToDelete: ICharacteristicDataEntity[] | null = [];
}

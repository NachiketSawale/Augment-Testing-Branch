/*
 * Copyright(c) RIB Software GmbH
 */
import { CompleteIdentification } from '@libs/platform/common';
import { IBilHeaderEntity, IDocumentEntity, IPaymentEntity } from '@libs/sales/interfaces';

export class BilHeaderComplete implements CompleteIdentification<IBilHeaderEntity>{

  /**
   * MainItemId
   */
  public MainItemId: number = 0;

  /**
   * Datas
   */
  public Datas: IBilHeaderEntity[] | null = [];

  /**
   * BilHeader
   */
  public BilHeader?: IBilHeaderEntity | null;

  /**
   * BilBlobsToDelete
   */
  //public BilBlobsToDelete?: ISalesBlobEntity[] | null = [];

  /**
   * BilBlobsToSave
   */
  //public BilBlobsToSave?: ISalesBlobEntity[] | null = [];

  /**
   * BilBoqCompositeToDelete
   */
  //public BilBoqCompositeToDelete?: IBilBoqCompositeEntity[] | null = [];

  /**
   * BilBoqCompositeToSave
   */
  //public BilBoqCompositeToSave?: IBilBoqCompositeEntity[] | null = [];

  /**
   * BilClobsToDelete
   */
  //public BilClobsToDelete?: ISalesClobEntity[] | null = [];

  /**
   * BilClobsToSave
   */
  //public BilClobsToSave?: ISalesClobEntity[] | null = [];

  /**
   * BilItemToDelete
   */
  //public BilItemToDelete?: IItemEntity[] | null = [];

  /**
   * BilItemToSave
   */
  //public BilItemToSave?: BilItemComplete[] | null = [];

  /**
   * BilPaymentToDelete
   */
  public BilPaymentToDelete?: IPaymentEntity[] | null = [];

  /**
   * BilPaymentToSave
   */
  public BilPaymentToSave?: IPaymentEntity[] | null = [];

  /**
   * BilTransactionToSave
   */
  //public BilTransactionToSave?: TransactionComplete[] | null = [];

  /**
   * Bill2WipToDelete
   */
  //public Bill2WipToDelete?: IBil2WipEntity[] | null = [];

  /**
   * Bill2WipToSave
   */
  //public Bill2WipToSave?: IBil2WipEntity[] | null = [];

  /**
   * BillingSchemaToDelete
   */
  //public BillingSchemaToDelete?: IBillingschemaEntity[] | null = [];

  /**
   * BillingSchemaToSave
   */
  //public BillingSchemaToSave?: IBillingschemaEntity[] | null = [];

  /**
   * BoqItemToDelete
   */
  //public BoqItemToDelete?: IIIdentifyable[] | null = [];

  /**
   * BoqItemToSave
   */
  //public BoqItemToSave?: IIIdentifyable[] | null = [];

  /**
   * ClerkDataToDelete
   */
  //public ClerkDataToDelete?: IClerkDataEntity[] | null = [];

  /**
   * ClerkDataToSave
   */
  //public ClerkDataToSave?: IClerkDataEntity[] | null = [];

  /**
   * CommentDataToSave
   */
  //public CommentDataToSave?: ICommentDataEntity[] | null = [];

  /**
   * DocumentsToDelete
   */
  //public DocumentsToDelete?: IDocumentEntity[] | null = [];

  /**
   * DocumentsToSave
   */
  public DocumentsToSave?: IDocumentEntity[] | null = [];

  /**
   * EntitiesCount
   */
  //public EntitiesCount: number;

  /**
   * EstLineItemToSave
   */
  //public EstLineItemToSave?: ISalesLineItemQuantityEntity[] | null = [];

  /**
   * GeneralsToDelete
   */
  //public GeneralsToDelete?: IGeneralsEntity[] | null = [];

  /**
   * GeneralsToSave
   */
  //public GeneralsToSave?: IGeneralsEntity[] | null = [];

  

  /**
   * SalesHeaderblobToDelete
   */
  //public SalesHeaderblobToDelete?: ISalesHeaderblobEntity[] | null = [];

  /**
   * SalesHeaderblobToSave
   */
  //public SalesHeaderblobToSave?: ISalesHeaderblobEntity[] | null = [];
}

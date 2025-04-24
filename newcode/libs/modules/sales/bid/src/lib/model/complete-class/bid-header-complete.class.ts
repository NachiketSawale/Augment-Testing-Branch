/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IBidHeaderEntity, IBidCertificateEntity, IBidBoqCompositeEntity, IGeneralsEntity, IBidMilestoneEntity } from '@libs/sales/interfaces';
export class BidHeaderComplete implements CompleteIdentification<IBidHeaderEntity>{

  public MainItemId: number = 0;

  /**
   * EntitiesCount
   */
  public EntitiesCount: number  = 0;
  
  public BidHeader: IBidHeaderEntity | null = null;

  /**
   * BidCertificateToDelete
   */
  public BidCertificateToDelete?: IBidCertificateEntity[] | null = [];

  /**
   * BidCertificateToSave
   */
  public BidCertificateToSave?: IBidCertificateEntity[] | null = [];

  /**
   * BidBlobsToDelete
   */
  //public BidBlobsToDelete?: ISalesBlobEntity[] | null = [];

  /**
   * BidBlobsToSave
   */
  //public BidBlobsToSave?: ISalesBlobEntity[] | null = [];

  /**
   * BidBoqCompositeToDelete
   */
  public BidBoqCompositeToDelete?: IBidBoqCompositeEntity[] | null = [];

  /**
   * BidBoqCompositeToSave
   */
  public BidBoqCompositeToSave?: IBidBoqCompositeEntity[] | null = [];

  

  /**
   * BidClobsToDelete
   */
  //public BidClobsToDelete?: ISalesClobEntity[] | null = [];

  /**
   * BidClobsToSave
   */
  //public BidClobsToSave?: ISalesClobEntity[] | null = [];

  /**
   * BidMilestoneToDelete
   */
  public BidMilestoneToDelete?: IBidMilestoneEntity[] | null = [];

  /**
   * BidMilestoneToSave
   */
  public BidMilestoneToSave?: IBidMilestoneEntity[] | null = [];

  /**
   * BidWarrantyToDelete
   */
  //public BidWarrantyToDelete?: IBidWarrantyEntity[] | null = [];

  /**
   * BidWarrantyToSave
   */
  //public BidWarrantyToSave?: IBidWarrantyEntity[] | null = [];

  /**
   * BillingSchemaToDelete
   */
  //public BillingSchemaToDelete?: IBidBillingschemaEntity[] | null = [];

  /**
   * BillingSchemaToSave
   */
  //public BillingSchemaToSave?: IBidBillingschemaEntity[] | null = [];

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
  //public DocumentsToSave?: IDocumentEntity[] | null = [];

  /**
   * GeneralsToDelete
   */
  public GeneralsToDelete?: IGeneralsEntity[] | null = [];

  /**
   * GeneralsToSave
   */
  public GeneralsToSave?: IGeneralsEntity[] | null = [];

  /**
   * MainItemId
   */
  //public MainItemId: number;

  /**
   * OrdMandatoryDeadlineToDelete
   */
  //public OrdMandatoryDeadlineToDelete?: IOrdMandatoryDeadlineEntity[] | null = [];

  /**
   * OrdMandatoryDeadlineToSave
   */
  //public OrdMandatoryDeadlineToSave?: IOrdMandatoryDeadlineEntity[] | null = [];

  /**
   * SalesHeaderblobToDelete
   */
  //public SalesHeaderblobToDelete?: ISalesHeaderblobEntity[] | null = [];

  /**
   * SalesHeaderblobToSave
   */
  //public SalesHeaderblobToSave?: ISalesHeaderblobEntity[] | null = [];
}

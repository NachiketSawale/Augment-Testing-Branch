/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { CompleteIdentification } from '@libs/platform/common';
import { ICertificateEntity } from '@libs/resource/interfaces';
import { IOrdCertificateEntity, IOrdMilestoneEntity, IOrdPaymentScheduleEntity, IOrdWarrantyEntity, IOrdHeaderEntity, IOrdBoqCompositeEntity, IOrdBillingschemaEntity, IOrdAdvanceEntity, IGeneralsEntity, IDocumentEntity } from '@libs/sales/interfaces';

export class OrdHeaderComplete implements CompleteIdentification<IOrdHeaderEntity>{

 /*
  * BillingSchemaToDelete
  */
  public BillingSchemaToDelete!: IOrdBillingschemaEntity[] | null;

 /*
  * BillingSchemaToSave
  */
  public BillingSchemaToSave!: IOrdBillingschemaEntity[] | null;

 /*
  * BoqItemToDelete
  */
  //public BoqItemToDelete!: IIIdentifyable[] | null;

 /*
  * BoqItemToSave
  */
  //public BoqItemToSave!: IIIdentifyable[] | null;

 /*
  * CertificateToDelete
  */
  public CertificateToDelete!: ICertificateEntity[] | null;

 /*
  * CertificateToSave
  */
  public CertificateToSave!: ICertificateEntity[] | null;

 /*
  * ClerkDataToDelete
  */
  //public ClerkDataToDelete!: IClerkDataEntity[] | null;

 /*
  * ClerkDataToSave
  */
  //public ClerkDataToSave!: IClerkDataEntity[] | null;

 /*
  * CommentDataToSave
  */
  //public CommentDataToSave!: ICommentDataEntity[] | null;

 /*
  * DocumentsToDelete
  */
  public DocumentsToDelete!: IDocumentEntity[] | null;

 /*
  * DocumentsToSave
  */
  public DocumentsToSave!: IDocumentEntity[] | null;

 /*
  * EntitiesCount
  */
  public EntitiesCount!: number | null;

 /*
  * GeneralsToDelete
  */
  public GeneralsToDelete!: IGeneralsEntity[] | null;

 /*
  * GeneralsToSave
  */
  public GeneralsToSave!: IGeneralsEntity[] | null;

 /*
  * MainItemId
  */
  public MainItemId!: number | null;

 /*
  * OrdAdvanceToDelete
  */
  public OrdAdvanceToDelete!: IOrdAdvanceEntity[] | null;

 /*
  * OrdAdvanceToSave
  */
  public OrdAdvanceToSave!: IOrdAdvanceEntity[] | null;

 /*
  * OrdBlobsToDelete
  */
  //public OrdBlobsToDelete!: ISalesBlobEntity[] | null;

 /*
  * OrdBlobsToSave
  */
  //public OrdBlobsToSave!: ISalesBlobEntity[] | null;

 /*
  * OrdBoqCompositeToDelete
  */
  public OrdBoqCompositeToDelete!: IOrdBoqCompositeEntity[] | null;

 /*
  * OrdBoqCompositeToSave
  */
  public OrdBoqCompositeToSave!: IOrdBoqCompositeEntity[] | null;

 /*
  * OrdCertificateToDelete
  */
  public OrdCertificateToDelete!: IOrdCertificateEntity[] | null;

 /*
  * OrdCertificateToSave
  */
  public OrdCertificateToSave!: IOrdCertificateEntity[] | null;

 /*
  * OrdClobsToDelete
  */
  //public OrdClobsToDelete!: ISalesClobEntity[] | null;

 /*
  * OrdClobsToSave
  */
  //public OrdClobsToSave!: ISalesClobEntity[] | null;

 /*
  * OrdHeader
  */
  public OrdHeader!: IOrdHeaderEntity | null;

 /*
  * OrdMandatoryDeadlineToDelete
  */
  //public OrdMandatoryDeadlineToDelete!: IOrdMandatoryDeadlineEntity[] | null;

 /*
  * OrdMandatoryDeadlineToSave
  */
 // public OrdMandatoryDeadlineToSave!: IOrdMandatoryDeadlineEntity[] | null;

 /*
  * OrdMilestoneToDelete
  */
  public OrdMilestoneToDelete!: IOrdMilestoneEntity[] | null;

 /*
  * OrdMilestoneToSave
  */
  public OrdMilestoneToSave!: IOrdMilestoneEntity[] | null;

 /*
  * OrdPaymentScheduleToDelete
  */
  public OrdPaymentScheduleToDelete!: IOrdPaymentScheduleEntity[] | null;

 /*
  * OrdPaymentScheduleToSave
  */
  public OrdPaymentScheduleToSave!: IOrdPaymentScheduleEntity[] | null;

 /*
  * OrdWarrantyToDelete
  */
  public OrdWarrantyToDelete!: IOrdWarrantyEntity[] | null;

 /*
  * OrdWarrantyToSave
  */
  public OrdWarrantyToSave!: IOrdWarrantyEntity[] | null;

 /*
  * PPSHeaderToDelete
  */
  //public PPSHeaderToDelete!: IIIdentifyable[] | null;

 /*
  * PPSHeaderToSave
  */
  //public PPSHeaderToSave!: IIIdentifyable[] | null;

 /*
  * SalesHeaderblobToDelete
  */
  //public SalesHeaderblobToDelete!: ISalesHeaderblobEntity[] | null;

 /*
  * SalesHeaderblobToSave
  */
  //public SalesHeaderblobToSave!: ISalesHeaderblobEntity[] | null;
}

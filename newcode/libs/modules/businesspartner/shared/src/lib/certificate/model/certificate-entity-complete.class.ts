/*
 * Copyright(c) RIB Software GmbH
 */

import { ICertificate2subsidiaryEntity, ICertificateEntity, ICertificateReminderEntity } from '@libs/businesspartner/interfaces';
import { CompleteIdentification } from '@libs/platform/common';

export class CertificateEntityComplete implements CompleteIdentification<ICertificateEntity> {
	/**
	   * Certificate
	   */
	  public Certificate?: ICertificateEntity | null;
	
	  /**
	   * Certificate2SubsidiaryToDelete
	   */
	  public Certificate2SubsidiaryToDelete?: ICertificate2subsidiaryEntity[] | null = [];
	
	  /**
	   * Certificate2SubsidiaryToSave
	   */
	  public Certificate2SubsidiaryToSave?: ICertificate2subsidiaryEntity[] | null = [];
	
	  /**
	   * CertificateReminderToDelete
	   */
	  public CertificateReminderToDelete?: ICertificateReminderEntity[] | null = [];
	
	  /**
	   * CertificateReminderToSave
	   */
	  public CertificateReminderToSave?: ICertificateReminderEntity[] | null = [];
	
	  /**
	   * Certificates
	   */
	  public Certificates?: ICertificateEntity[] | null = [];
	
	  /**
	   * EntitiesCount
	   */
	  public EntitiesCount: number = 0;
	
	  /**
	   * Id
	   */
	  public Id: number = 0;
	 
	  /**
	   * MainItemId
	   */
	  public MainItemId: number = 0;
}
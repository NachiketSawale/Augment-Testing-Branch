/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject, OnInit } from '@angular/core';
import { IPrcRfqEmailFaxRecipient } from '../../model/entities/prc-rfq-email-fax-recipient.interface';
import { ColumnDef, FieldType, IGridConfiguration } from '@libs/ui/common';
import { ProcurementRfqSendEmailOrFaxService } from '../../wizards/procurement-rfq-send-email-or-fax.service';

/**
 * Procurement RFQ Email Fax Recipient Component
 */
@Component({
  selector: 'procurement-rfq-email-fax-recipient',
  templateUrl: './procurement-rfq-email-fax-recipient.component.html',
  styleUrl: './procurement-rfq-email-fax-recipient.component.css'
})
export class ProcurementRfqEmailFaxRecipientComponent implements OnInit{
  public parentService = inject(ProcurementRfqSendEmailOrFaxService);
  public configuration!: IGridConfiguration<IPrcRfqEmailFaxRecipient>;

  public constructor() {
    this.loadRecipients();
  }

  /**
   * Loads the data into the grid on component initialization
   */
   public ngOnInit(): void {
    this.initializeGrid([]);
  }
  /**
   * Load recipients from the service and initialize the grid
   */
  private loadRecipients(): void {
    this.parentService.getCommunicationList().then((selection) => {
      const items = selection && selection.length > 0 ? this.getList(selection) : [];
      this.initializeGrid(items);
    });
  }

  /**
   * Initialize Grid
   * @param {IPrcRfqEmailFaxRecipient[]} items Email Recipient info
   */
  private initializeGrid(items: IPrcRfqEmailFaxRecipient[]): void {
    this.configuration = {
      uuid: 'a5b49ee2ecbf42a4b950dc998852bf7c',
      columns: this.getColumnDefs(),
      items,
    };
  }

  /**
   * Get column definitions for the grid
   * @returns {ColumnDef<IPrcRfqEmailFaxRecipient>[]} Column definitions
   */
  private getColumnDefs(): ColumnDef<IPrcRfqEmailFaxRecipient>[] {
    return [
      {
        id: 'isTo',
        label: { key: 'procurement.rfq.bidder.isTo', text: 'Select All' },
        type: FieldType.Boolean,
        model: 'IsTo',
        sortable: false,
        visible: true
      },
      {
        id: 'businessPartnerName1',
        label: { key: 'procurement.rfq.rfqBusinessPartnerBPName1', text: 'Company Name' },
        type: FieldType.Description,
        model: 'BusinessPartnerName1',
        sortable: false,
        visible: true
      },
      {
        id: 'firstName',
        label: { key: 'procurement.rfq.rfqBusinessPartnerContactFirstName', text: 'Contact First Name' },
        type: FieldType.Description,
        model: 'FirstName',
        sortable: false,
        visible: true
      },
      {
        id: 'lastName',
        label: { key: 'procurement.rfq.rfqBusinessPartnerContactLastName', text: 'Contact Last Name' },
        type: FieldType.Description,
        model: 'LastName',
        sortable: false,
        visible: true
      },
      {
        id: 'to',
        label: { key: 'procurement.rfq.rfqBusinessPartnerContactEmail', text: 'Contact Email' },
        type: FieldType.Description,
        model: 'To',
        sortable: false,
        visible: true
      },
      {
        id: 'isCC',
        label: { key: 'procurement.rfq.bidder.isCc', text: 'CC' },
        type: FieldType.Boolean,
        model: 'IsCc',
        sortable: false,
        visible: true
      },
      {
        id: 'cc',
        label: { key: 'procurement.rfq.bidder.cCEmail', text: 'CC Company Email' },
        type: FieldType.Description,
        model: 'Cc',
        sortable: false,
        visible: true
      },
      {
        id: 'contactremarks',
        label: { key: 'procurement.rfq.bidder.contactRemarks', text: 'Contact Remarks' },
        type: FieldType.Description,
        model: 'Contactremarks',
        sortable: false,
        visible: true
      }
    ];
  }

  /**
   * Get the list of email recipients
   * @param {IPrcRfqEmailFaxRecipient[]} selection Selection data for recipients
   * @returns {IPrcRfqEmailFaxRecipient[]} List of recipients
   */
  public getList(selection: IPrcRfqEmailFaxRecipient[]): IPrcRfqEmailFaxRecipient[] {
    return selection.map((item, index) => ({
      Id: index,
      BusinessPartnerName1: item.BusinessPartnerName1,
      BusinessPartnerId: item.BusinessPartnerId,
      FirstName: item.FirstName,
      LastName: item.LastName,
      To: item.To,
      Cc: item.Cc,
      IsTo: item.IsTo,
      IsCc: item.IsCc,
    }));
  }
}
/*
 * Copyright(c) RIB Software GmbH
 */
import {Component, inject} from '@angular/core';
import {createLookup, FieldType, getCustomDialogDataToken, IFormConfig} from '@libs/ui/common';
import { BasicsSharedAddressDialogComponent, createFormDialogLookupProvider, BasicsSharedClerkLookupService, BasicsSharedProcurementStructureLookupService, BasicsShareControllingUnitLookupService } from '@libs/basics/shared';
import {ProcurementTicketSystemCartItemService} from '../../services/cart-item.service';
import {IAddressEntity} from '@libs/ui/map';
import {ISubmitEntity} from '../../model/interfaces/submit-entity.interface';
import { ProjectSharedLookupService } from '@libs/project/shared';

/**
 * place order form
 */
@Component({
  selector: 'procurement-ticket-system-place-order-form',
  templateUrl: './place-order-form.component.html',
  styleUrls: ['./place-order-form.component.scss']
})
export class ProcurementTicketSystemPlaceOrderFormComponent {

  /**
   * cart Item Service
   */
  public cartItemService = inject(ProcurementTicketSystemCartItemService);

  /**
   * create Place Order View Config
   */
  private createPlaceOrderViewConfig(): IFormConfig<ISubmitEntity> {
    return {
      showGrouping: false,
      groups: [
        {
          groupId: 'basicData'
        }
      ],
      rows: [{
        groupId: 'basicData',
        id: 'description',
        model: 'Description',
        label: {
          text: 'Description',
          key: 'cloud.common.entityDescription'
        },
        type: FieldType.Description,
        sortOrder: 1,
        readonly: false,
        required: true
      }, {
        groupId: 'basicData',
        id: 'projectFK',
        model: 'ProjectFK',
        label: {
          text: 'Project',
          key: 'procurement.ticketsystem.submitDialog.Project'
        },
        type: FieldType.Lookup,
        lookupOptions: createLookup({
          dataServiceToken: ProjectSharedLookupService,
          showDescription: true,
          displayMember: 'ProjectName',
          descriptionMember: 'ProjectName'
        }),
        sortOrder: 2,
        readonly: false,
        required: true
      }, {
        groupId: 'basicData',
        id: 'addressFK',
        model: 'AddressFK',
        label: {
          text: 'Delivery Address',
          key: 'cloud.common.entityDeliveryAddress'
        },
        type: FieldType.CustomComponent,
        componentType: BasicsSharedAddressDialogComponent,
        providers: createFormDialogLookupProvider({
          objectKey: 'Address1',
        }),
        sortOrder: 3,
        readonly: false
      }, {
        groupId: 'basicData',
        id: 'structureFK',
        model: 'StructureFK',
        label: {
          text: 'Proc.Structure',
          key: 'procurement.ticketsystem.submitDialog.structure'
        },
        type: FieldType.Lookup,
        lookupOptions: createLookup({
          dataServiceToken: BasicsSharedProcurementStructureLookupService,
          descriptionMember: 'DescriptionInfo.Description',
          showDescription: true,
          showClearButton: true
        }),
        sortOrder: 4,
        readonly: false
      }, {
        groupId: 'basicData',
        id: 'clerkFK',
        model: 'ClerkFK',
        label: {
          text: 'Requisition Owner',
          key: 'procurement.ticketsystem.submitDialog.owner'
        },
        type: FieldType.Lookup,
        lookupOptions: createLookup({
          dataServiceToken: BasicsSharedClerkLookupService,
          showDescription: true,
          descriptionMember: 'Description',
          showClearButton: true
        }),
        sortOrder: 5,
        readonly: false
      }, {
        groupId: 'basicData',
        id: 'clerkResponsibleFK',
        model: 'ClerkResponsibleFK',
        label: {
          text: 'Responsible',
          key: 'procurement.ticketsystem.submitDialog.Responsible'
        },
        type: FieldType.Lookup,
        lookupOptions: createLookup({
          dataServiceToken: BasicsSharedClerkLookupService,
          showDescription: true,
          descriptionMember: 'Description',
          showClearButton: true
        }),
        sortOrder: 6,
        readonly: false
      }, {
        groupId: 'basicData',
        id: 'controllingUnitFk',
        model: 'ControllingUnitFk',
        label: {
          text: 'Controlling Unit',
          key: 'procurement.ticketsystem.submitDialog.entityCtrlCode'
        },
        type: FieldType.Lookup,
        lookupOptions: createLookup({
          dataServiceToken: BasicsShareControllingUnitLookupService,
          showDescription: true,
          descriptionMember: 'Description',
          showClearButton: true
        }),
        sortOrder: 7,
        readonly: false
      }, {
        groupId: 'basicData',
        id: 'remark',
        model: 'Remark',
        label: {
          text: 'Remark',
          key: 'procurement.ticketsystem.submitDialog.Remark'
        },
        type: FieldType.Remark,
        sortOrder: 8,
        readonly: false
      }
      ]
    };
  }

  /**
   * form default value
   */
  public entity: ISubmitEntity = {
    ProjectFK: -1,
    StructureFK: -1,
    Groups: [],
    CreateSeparateContractForEachItem: true
  };

  /**
   * get dialog Wrapper
   */
  private readonly dialogWrapper = inject(getCustomDialogDataToken<ISubmitEntity, ProcurementTicketSystemPlaceOrderFormComponent>());

  /**
   * get form Config
   */
  public get formConfig(): IFormConfig<ISubmitEntity> {
    return this.createPlaceOrderViewConfig();
  }

  /**
   * init data from dialog
   */
  public ngOnInit() {
	  if (!this.dialogWrapper) {
		  return;
	  }
	  const requestSubmitCartEntity = this.dialogWrapper.value as ISubmitEntity;
	  this.cartItemService.loadSubmitCart(requestSubmitCartEntity.ProjectFK, requestSubmitCartEntity.StructureFK).subscribe(submitCartEntity => {
		  this.entity = submitCartEntity as ISubmitEntity;
		  this.entity.PriceConditions = this.entity.PriceConditions ?? [];
		  this.entity.PriceListConditions = this.entity.PriceListConditions ?? [];
		  if (!this.entity.Groups || this.entity.Groups.length === 0) {
			  this.entity.Groups = requestSubmitCartEntity.Groups;
		  }
		  if (!this.entity.CompanyId || this.entity.CompanyId === 0) {
			  this.entity.CompanyId = requestSubmitCartEntity.CompanyId;
		  }
		  this.entity.hasContract = requestSubmitCartEntity.hasContract;
		  this.dialogWrapper.value = this.entity;
		  this.cartItemService.getAddressByProject(this.entity.ProjectFK).subscribe(addressEntity => {
			  const address = addressEntity as IAddressEntity;
			  this.entity.AddressFK = address.Id;
		  });
	  });
  }
}

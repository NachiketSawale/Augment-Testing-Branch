import { Component, Inject, OnInit } from '@angular/core';
import { IBusinessPartnerAddressEntity } from '@libs/businesspartner/interfaces';
import { FieldType, GridComponent, IGridConfiguration } from '@libs/ui/common';
import { IAddressEntity } from '@libs/ui/map';

@Component({
	selector: 'businesspartner-main-convert-address-to-geo-coordinate',
	templateUrl: './convert-address-to-geo-coordinate.component.html',
	styleUrls: ['./convert-address-to-geo-coordinate.component.scss']
})
export class BusinesspartnerMainConvertAddressToGeoCoordinateComponent extends GridComponent<IBusinessPartnerAddressEntity> implements OnInit{

	public constructor(@Inject('listdata') public bpAddress : IBusinessPartnerAddressEntity[]) {
		super();
	}

	public showMap:string = 'none';
	public gridConfig!: IGridConfiguration<IBusinessPartnerAddressEntity>;
	public geoCoordinateList:IBusinessPartnerAddressEntity[] = [];
	public mapEntity!: IAddressEntity;
	public currentItem = {
		convertOnlyEmpty: true,
		isConverted: false,
		convertIsStart: false,
		addresses: Array<string>
	};

	public getOkText() {
		return this.currentItem.isConverted ? 'basics.common.button.close' : 'basics.common.ok';
	}

	public ngOnInit(): void {
		//TODO: can't be assigned
		// this.mapEntity = this.geoCoordinateList[0].Address as IAddressEntity;
		this.updateGrid();
	}

	public updateGrid(){
		this.gridConfig =  {
			uuid: 'daf1d414c0484e16a53f1d3aa6fe2c19',
			columns: [
				{
					type: FieldType.Description,
					id: 'Status',
					required: true,
					model: 'Status',
					label: {
						text: 'Status',
						key: 'cloud.common.entityStatus',
					},
					visible: true,
					sortable: true,
				},
				{
					type: FieldType.Description,
					id: 'Message',
					required: true,
					model: 'Message',
					label: {
						text: 'Error Message',
						key: 'cloud.common.errorMessage',
					},
					visible: true,
					sortable: true,
				},
				{
					id: 'BpName',
					type: FieldType.Description,
					model: 'BpName',
					label: {
						text: 'BP Name',
						key: 'businesspartner.main.name1'
					},
					width: 120,
					visible: true,
					sortable: true,
				},
				{
					id: 'SubsidiaryDescription',
					model: 'SubsidiaryDescription',
					label: {
						text: 'Subsidiary Description',
						key: 'cloud.common.entitySubsidiaryDescription'
					},
					type: FieldType.Description,
					width: 120,
					visible: true,
					sortable: true,
				},
				{
					id: 'Address',
					model: 'Address',
					label: {
						key: 'cloud.common.entityAddress',
						text: 'Address'
					},
					type: FieldType.Description,
					visible: true,
					sortable: true,
				},
				{
					id: 'Longitude',
					model: 'Address.longitude',
					label: {
						key: 'cloud.common.AddressDialogLongitude',
						text: 'Longitude'
					},
					type: FieldType.Decimal,
					visible: true,
					sortable: true,
				},
				{
					id: 'Latitude',
					model: 'Address.latitude',
					label: {
						key: 'cloud.common.AddressDialogLatitude',
						text: 'Latitude'
					},
					type: FieldType.Decimal,
					visible: true,
					sortable: true,
				}
			],
			items: [...this.bpAddress],
			iconClass: null,
			skipPermissionCheck: true,
			enableColumnReorder: true,
			enableCopyPasteExcel: false,
			idProperty: 'Id'
		};
	}

}
/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { afterNextRender, Component, DoCheck, ElementRef, inject, OnInit } from '@angular/core';
import { AddressEntity } from './../../';
import { BasicsSharedAddressService } from '../../';
import { IAddressCheckDto } from '../../model/address-check-dto.interface';
import { ChangeDetector } from '../../../form-dialog-lookup-base';
import { IAddressEntity } from '@libs/ui/map';

@Component({
	selector: 'basics-shared-address-map-wrapper',
	templateUrl: './address-map-wrapper.component.html',
	styleUrls: ['./address-map-wrapper.component.scss']
})
export class BasicsSharedAddressMapWrapperComponent implements OnInit, DoCheck {
	private changeDetector = new ChangeDetector<AddressEntity>(() => this.entity);
	public entity = inject(AddressEntity);
	public clickMapToFindAddress: boolean = false;
	public addressService = inject(BasicsSharedAddressService);
	public address = this.entity.Address;
	public mapEntity!: IAddressEntity;

	/**
	 * Map wrapper constructor.
	 */
	public constructor(
		private elementRef: ElementRef
	) {
		afterNextRender(() => {
			this.adjustMapContentSize();
		});
	}

	private adjustMapContentSize() {
		// TODO: Should be removed after the map correct the size(The map hard code with width = 800px,height = 600px).
		const contentCtrl = this.elementRef.nativeElement.querySelector('.map-content');
		if (contentCtrl) {
			contentCtrl.style.width = '100%';
			contentCtrl.style.height = '100%';
		}
	}

	private updateFormattedAddress() {
		this.addressService.getFormattedAddress(this.entity).subscribe((checkDto: IAddressCheckDto) => {
			Object.assign(this.entity, checkDto);
			this.address = this.entity.Address;
			if (this.clickMapToFindAddress) {
				this.clickMapToFindAddress = false;
				return;
			}
			this.toMapEntity();
		});
	}

	private toMapEntity() {
		this.mapEntity = this.entity as IAddressEntity;
	}

	/**
	 * Initialize change detector.
	 */
	public ngOnInit() {
		this.toMapEntity();
		this.changeDetector.watch('Address').subscribe(() => {
			if (this.entity.AddressModified) {
				this.updateFormattedAddress();
			}
		});

		this.changeDetector.watchCollection(['Street', 'ZipCode', 'City', 'County', 'CountryFk', 'StateFk']).subscribe(() => {
			if (!this.entity.AddressModified) {
				this.updateFormattedAddress();
			}
		});
	}

	/**
	 * Start change detects.
	 */
	public ngDoCheck() {
		this.changeDetector.digest();
	}

	/**
	 * The handler of map loaded.
	 */
	public mapLoaded() {
		// this.data.dialog.modalOptions.bottomDescription = {
		// 	text: 'Map loaded.',
		// 	key: 'basics.common.map.message.mapLoaded'
		// };
		// TODO: the ui-map component seems have not exported any relative events to handle this.
	}

	/**
	 * The handler of pick an address from the map.
	 * @param mapEntity The picked map address.
	 */
	public pickComplete(mapEntity: AddressEntity) {
		if (mapEntity) {
			Object.assign(this.entity, mapEntity, {
				Id: this.entity.Id,
				AddressModified: true
			});
			this.clickMapToFindAddress = true;
		}
		// TODO: the ui-map component seems have not exported any relative events to handle this.
	}

	/**
	 * The callback of search address completed.
	 * @param mapEntity - The matched map address.
	 */
	public searchComplete(mapEntity?: AddressEntity) {
		if (mapEntity) {
			Object.assign(this.entity, mapEntity, {
				Id: this.entity.Id,
				Address: this.entity.Address
			});
			// this.data.dialog.modalOptions.bottomDescription = {
			// 	text: 'Address found!',
			// 	key: 'basics.common.map.message.searchCompleted'
			// };
			//const mapMessage = this.data.dialog.customButtons.find(b => b.id === 'map_message');
			//if (mapMessage) {
			//	mapMessage.caption = 'Address found!';
			//	this.data.dialog.customButtons.splice(this.data.dialog.customButtons.indexOf(mapMessage), 1);
			//}
		} else {
			// this.data.dialog.modalOptions.bottomDescription = {
			// 	text: 'Address not found!',
			// 	key: 'basics.common.map.message.addressNotFound'
			// };

			//const mapMessage = this.data.dialog.customButtons.find(b => b.id === 'map_message');
			//if (mapMessage) {
			//	mapMessage.caption = 'Address not found!';
			//}
		}
		// TODO: the ui-map component seems have not exported any relative events to handle this.
	}
}

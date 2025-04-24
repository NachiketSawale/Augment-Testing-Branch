/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, Input, OnInit } from '@angular/core';
import { ISystemInfo } from '../../interfaces/system-info.interface';
import { QRCodeToDataURLOptions, toDataURL } from 'qrcode';

/**
 * Component displays information about the system through QR codes.
 */
@Component({
	selector: 'ui-common-qr-code-detail',
	templateUrl: './qr-code-detail.component.html',
	styleUrls: ['./qr-code-detail.component.scss'],
})
export class QrCodeDetailComponent implements OnInit {

	@Input()
	public systemInfo!: ISystemInfo;

	public serverQrCodeDataURL: string = '';
	public clientQrCodeDataURL: string = '';
	public servicesQrCodeDataURL: string = '';

	public options: QRCodeToDataURLOptions = {
		margin: 5,
		version: 4,
		errorCorrectionLevel: 'L',
	};

	public async ngOnInit() {
		await this.generateServerQRCode();
		await this.generateClientQRCode();
		await this.generateServicesQRCode();
	}

	public async generateServerQRCode() {
		const textToEncode: string = this.systemInfo.serverUrl;
		try {
			const url = await this.generateQRCode(textToEncode);
			this.serverQrCodeDataURL = url;
		} catch (error) {
			console.error('Error generating QR code:', error);
		}
	}

	public async generateClientQRCode() {
		const textToEncode: string = this.systemInfo.clientUrl;
		try {
			const url = await this.generateQRCode(textToEncode);
			this.clientQrCodeDataURL = url;
		} catch (error) {
			console.error('Error generating QR code:', error);
		}
	}

	public async generateServicesQRCode() {
		const textToEncode: string = this.systemInfo.servicesUrl;
		try {
			const url = await this.generateQRCode(textToEncode);
			this.servicesQrCodeDataURL = url;
		} catch (error) {
			console.error('Error generating QR code:', error);
		}
	}

	public async generateQRCode(textToEncode: string): Promise<string> {
		const canvasElement: HTMLCanvasElement = document.createElement('canvas');

		return new Promise<string>((resolve, reject) => {
			toDataURL(canvasElement, textToEncode, this.options, (error, url) => {
				if (error) {
					reject(error);
				} else {
					resolve(url);
				}
			});
		});
	}
}

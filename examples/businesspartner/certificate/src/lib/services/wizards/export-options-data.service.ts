import { Injectable } from '@angular/core';
import { ExportOptions } from '@libs/basics/shared';

@Injectable({
	providedIn: 'root',
})
export class BusinesspartnerCertificateExportOptionsDataService {
	private exportOptions = {
		moduleName: 'businesspartner.certificate',
		mainContainer: { id: '1', label: 'businesspartner.certificate.certificateListTitle', gridId: '2c39331cf48c4016af9d17a573388100' },
		permission: '',
		excelProfileContexts: [],
		subContainers: [],
		exportOptionsCallback(ex: ExportOptions) {},
	};

	//TODO Waiting for the BP.Certificate container export button to be called
	public getExportOptions() {
		return this.exportOptions;
	}
}

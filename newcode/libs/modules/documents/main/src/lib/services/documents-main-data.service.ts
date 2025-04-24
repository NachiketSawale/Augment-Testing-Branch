/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { DocumentProjectDataRootService, IDocumentProjectEntity } from '@libs/documents/shared';
import { IDataServiceEndPointOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { DocumentsMainReadonlyProcessor } from '../processors/documents-main-readonly-processor.service';

@Injectable({
	providedIn: 'root',
})
export class DocumentsMainDataService extends DocumentProjectDataRootService<IDocumentProjectEntity> {
	public constructor() {
		const readOnlyProcessor = new DocumentsMainReadonlyProcessor();
		super(undefined,{
				apiUrl: 'documents/projectdocument/final',
				readInfo: <IDataServiceEndPointOptions>{
					endPoint: 'listDocuments',
					usePost: true,
				},
				roleInfo: <IDataServiceRoleOptions<IDocumentProjectEntity>>{
					role: ServiceRole.Root,
					itemName: 'Document',
				},
			entityActions:{
					createSupported:false,
					deleteSupported:false
			},
			processors:[readOnlyProcessor]
		});
	}

	//--todo-https://rib-40.atlassian.net/browse/DEV-22280 if this ticket close,test document.main -url:http://localhost:4200/#/api?navigate&operation=lookup&module=documents.main&company=C&invoiceid=871

	public override getColumnConfig() {
		return [
			{documentField: 'InvHeaderFk',field:'InvHeaderFk', dataField: 'Id', readOnly: false},
			{documentField: 'PrjProjectFk',field:'PrjProjectFk', dataField: 'ProjectFk', readOnly: false},
			{documentField: 'MdcControllingUnitFk',field:'MdcControllingUnitFk', dataField: 'ControllingUnitFk', readOnly: false},
			{documentField: 'BpdBusinessPartnerFk',field:'BpdBusinessPartnerFk', dataField: 'BusinessPartnerFk', readOnly: false},
			{documentField: 'PrcStructureFk',field:'PrcStructureFk', dataField: 'PrcStructureFk', readOnly: false},
			{documentField: 'PrcPackageFk',field:'PrcPackageFk', dataField: 'PrcPackageFk', readOnly: false},
			{documentField: 'ConHeaderFk',field:'ConHeaderFk', dataField: 'ConHeaderFk', readOnly: false},
			{documentField: 'PesHeaderFk',field:'PesHeaderFk', dataField: 'PesHeaderFk', readOnly: false},
			{documentField: 'PsdActivityFk',field:'PsdActivityFk', dataField: 'ActivityFk', readOnly: false},
			{documentField: 'PsdScheduleFk',field:'PsdScheduleFk', dataField: 'ScheduleFk', readOnly: false}
		];
	}
}

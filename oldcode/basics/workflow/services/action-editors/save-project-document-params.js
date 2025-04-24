/**
 * Created by uestuenel on 21.11.2016.
 */

(function () {
	'use strict';

	angular.module('basics.workflow').value('basicsWorkflowSaveProjectDocument', {
		status: {
			key: 'status',
			actionKey: 'StatusId',
			lookup: true
		},
		category: {
			key: 'category',
			actionKey: 'CategoryId',
			lookup: true
		},
		barCode: {
			key: 'barCode',
			actionKey: 'BarCode'
		},
		description: {
			key: 'description',
			actionKey: 'Description'
		},
		comment: {
			key: 'comment',
			actionKey: 'Comment'
		},
		revision: {
			key: 'revision',
			actionKey: 'Revision'
		},
		docId: {
			key: 'docId',
			actionKey: 'DocId'
		},
		docType: {
			key: 'docTypeId',
			actionKey: 'DocTypeId',
			editorMode: true,
			editorModeKey: 'editorModeDocType',
			key2: 'docTypeSelect',
			translateKey1: 'docType',
			translateKey2: 'docTypeId'
		},
		PrjDocTypeId: {
			key: 'prjDocTypeId',
			actionKey: 'PrjDocTypeId',
			editorMode: true,
			editorModeKey: 'editorModePrjDoc',
			key2: 'prjDocTypeSelect',
			translateKey1: 'prjDocType',
			translateKey2: 'prjDocTypeId'
		},
		rubricCategory: {
			key: 'rubricCategoryId',
			actionKey: 'RubricCategoryId',
			editorMode: true,
			editorModeKey: 'editorModeRubricCategoryId',
			key2: 'rubricCategorySelect',
			translateKey1: 'rubricCategory',
			translateKey2: 'rubricCategoryId'
		},
		bp: {
			key: 'bpId',
			actionKey: 'BusinessPartnerId',
			editorMode: true,
			editorModeKey: 'editorModeBp',
			key2: 'bpSelect',
			translateKey1: 'bp',
			translateKey2: 'bpId'
		},
		project: {
			key: 'projectId',
			actionKey: 'ProjectId',
			editorMode: true,
			editorModeKey: 'editorModeProject',
			key2: 'projectselect',
			translateKey1: 'project',
			translateKey2: 'projectId'
		},
		est: {
			key: 'estId',
			actionKey: 'ESTId',
			editorMode: true,
			editorModeKey: 'editorModeEst',
			key2: 'estSelect',
			translateKey1: 'est',
			translateKey2: 'estId'
		},
		schedule: {
			key: 'scheduleId',
			actionKey: 'ScheduleId',
			editorMode: true,
			editorModeKey: 'editorModeSchedule',
			key2: 'scheduleSelect',
			translateKey1: 'schedule',
			translateKey2: 'scheduleId'
		},
		activity: {
			key: 'activityId',
			actionKey: 'ActivityId',
			editorMode: true,
			editorModeKey: 'editorModeActivity',
			key2: 'activitySelect',
			translateKey1: 'activity',
			translateKey2: 'activityId'
		},
		infoRequestId: {
			key: 'infoRequestId',
			actionKey: 'InfoRequestId',
			editorMode: true,
			editorModeKey: 'editorModeInfoRequest',
			key2: 'infoRequestSelect',
			translateKey1: 'infoRequest',
			translateKey2: 'infoRequestId'
		},
		certificateId: {
			key: 'certificateId',
			actionKey: 'CertificateId',
			editorMode: true,
			editorModeKey: 'editorModeCertificate',
			key2: 'certificateSelect',
			translateKey1: 'certificate',
			translateKey2: 'certificateId'
		},
		structure: {
			key: 'structureId',
			actionKey: 'StructureId',
			editorMode: true,
			editorModeKey: 'editorModeStructure',
			key2: 'structureSelect',
			translateKey1: 'structure',
			translateKey2: 'structureId'
		},
		materialCt: {
			key: 'materialCtId',
			actionKey: 'MaterialCatalogId',
			editorMode: true,
			editorModeKey: 'editorModeMaterialCt',
			key2: 'materialCtSelect',
			translateKey1: 'materialCatalog',
			translateKey2: 'materialCatalogId'
		},
		package: {
			key: 'packageId',
			actionKey: 'PackageId',
			editorMode: true,
			editorModeKey: 'editorModePackageId',
			key2: 'packageSelect',
			translateKey1: 'package',
			translateKey2: 'packageId'
		},
		rfq: {
			key: 'rfqId',
			actionKey: 'RFQId',
			editorMode: true,
			editorModeKey: 'editorModeRfq',
			key2: 'rfqSelect',
			translateKey1: 'rfq',
			translateKey2: 'rfqId'
		},
		qtn: {
			key: 'qtnId',
			actionKey: 'QTNId',
			editorMode: true,
			editorModeKey: 'editorModeQtn',
			key2: 'qtnSelect',
			translateKey1: 'qtn',
			translateKey2: 'qtnId'
		},
		con: {
			key: 'conId',
			actionKey: 'CONId',
			editorMode: true,
			editorModeKey: 'editorModeCon',
			key2: 'conSelect',
			translateKey1: 'con',
			translateKey2: 'conId'
		},
		pes: {
			key: 'pesId',
			actionKey: 'PESId',
			editorMode: true,
			editorModeKey: 'editorModePes',
			key2: 'pesSelect',
			translateKey1: 'pes',
			translateKey2: 'pesId'
		},
		inv: {
			key: 'invId',
			actionKey: 'INVId',
			editorMode: true,
			editorModeKey: 'editorModeInv',
			key2: 'invSelect',
			translateKey1: 'inv',
			translateKey2: 'invId'
		},
		req: {
			key: 'reqId',
			actionKey: 'REQId',
			editorMode: true,
			editorModeKey: 'editorModeReq',
			key2: 'reqSelect',
			translateKey1: 'req',
			translateKey2: 'reqId'
		},
		controlUnit: {
			key: 'controlUnitId',
			actionKey: 'ControllUnitId',
			editorMode: true,
			editorModeKey: 'editorModeControlUnit',
			key2: 'controlUnitSelect',
			translateKey1: 'controlUnit',
			translateKey2: 'controlUnitId'
		},
		location: {
			key: 'locationId',
			actionKey: 'LocationId',
			editorMode: true,
			editorModeKey: 'editorModeLocationId',
			key2: 'locationSelect',
			translateKey1: 'location',
			translateKey2: 'locationId'
		},
		qto: {
			key: 'qtoId',
			actionKey: 'QTOId',
			editorMode: true,
			editorModeKey: 'editorModeQTO',
			key2: 'qtoSelect',
			translateKey1: 'qto',
			translateKey2: 'qtoId'
		},
		ppsItem: {
			key: 'ppsItemId',
			actionKey: 'PpsItemId',
			editorMode: true,
			editorModeKey: 'editorModePpsItem',
			key2: 'ppsItemSelect',
			translateKey1: 'ppsItem',
			translateKey2: 'ppsItemId'
		},
		trsRoute: {
			key: 'trsRouteId',
			actionKey: 'TrsRouteId',
			editorMode: true,
			editorModeKey: 'editorModeTrsRoute',
			key2: 'trsRouteSelect',
			translateKey1: 'trsRoute',
			translateKey2: 'trsRouteId'
		},
		dispatchHeader: {
			key: 'dispatchHeaderId',
			actionKey: 'DispatchHeaderId',
			editorMode: true,
			editorModeKey: 'editorModeDispatchHeader',
			key2: 'dispatchHeaderSelect',
			translateKey1: 'dispatchHeader',
			translateKey2: 'dispatchHeaderId'
		},
		lgmJob: {
			key: 'lgmJobId',
			actionKey: 'LgmJobId',
			editorMode: true,
			editorModeKey: 'editorModeLgmJob',
			key2: 'lgmJobSelect',
			translateKey1: 'lgmJob',
			translateKey2: 'lgmJobId'
		},
		salesBid: {
			key: 'salesBidId',
			actionKey: 'SalesBidId',
			editorMode: true,
			editorModeKey: 'editorModeSalesBid',
			key2: 'salesBidSelect',
			translateKey1: 'salesBid',
			translateKey2: 'salesBidId'
		},
		salesOrderId: {
			key: 'salesOrderId',
			actionKey: 'SalesOrderId',
			editorMode: true,
			editorModeKey: 'editorModeSalesOrder',
			key2: 'salesOrderSelect',
			translateKey1: 'salesOrder',
			translateKey2: 'salesOrderId'
		},
		salesWip: {
			key: 'salesWipId',
			actionKey: 'SalesWipId',
			editorMode: true,
			editorModeKey: 'editorModeSalesWip',
			key2: 'salesWipSelect',
			translateKey1: 'salesWip',
			translateKey2: 'salesWipId'
		},
		salesBill: {
			key: 'salesBillId',
			actionKey: 'SalesBillId',
			editorMode: true,
			editorModeKey: 'editorModeSalesBill',
			key2: 'salesBillSelect',
			translateKey1: 'salesBill',
			translateKey2: 'salesBillId'
		}
	});

})();

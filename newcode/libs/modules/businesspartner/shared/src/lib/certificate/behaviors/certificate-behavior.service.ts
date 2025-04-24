/*
 * Copyright(c) RIB Software GmbH
 */

import {runInInjectionContext, StaticProvider} from '@angular/core';
import {EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {
	createLookup,
	FieldType,
	IMenuItemEventInfo,
	InsertPosition,
	ItemType, StandardDialogButtonId
} from '@libs/ui/common';
import {ServiceLocator} from '@libs/platform/common';
import {BusinesspartnerSharedSubEntityDialogService} from '../../sub-entity-dialog/services/sub-entity-dialog.service';
import {SUB_ENTITY_DATA_SERVICE_TOKEN, ISubEntityGridDialog, ISubEntityGridDialogOptions} from '../../sub-entity-dialog/model/sub-entity-dialog.interface';
import {BusinesspartnerSharedSubsidiaryLookupService} from '../../lookup-services/subsidiary-lookup.service';
import { BusinesspartnerSharedCertificateToSubsidiaryDataService } from '../../certificate/services/certficate-to-subsidiary-data.service';
import {IEntitySelection, IParentRole} from '@libs/platform/data-access';
import { ICertificate2subsidiaryEntity, ICertificateEntity } from '@libs/businesspartner/interfaces';
import { CertificateEntityComplete } from '../model/certificate-entity-complete.class';

export class BusinesspartnerSharedCertificateGridBehavior implements IEntityContainerBehavior<IGridContainerLink<ICertificateEntity>, ICertificateEntity> {
	private static serviceCache: {[key: string]: BusinesspartnerSharedCertificateGridBehavior} = {};

	public static getService(moduleName: string, parentService: IParentRole<ICertificateEntity, CertificateEntityComplete> & IEntitySelection<ICertificateEntity>) {
		if (BusinesspartnerSharedCertificateGridBehavior.serviceCache[moduleName]) {
			return BusinesspartnerSharedCertificateGridBehavior.serviceCache[moduleName];
		}

		const service = runInInjectionContext(ServiceLocator.injector,
			() => new BusinesspartnerSharedCertificateGridBehavior(moduleName, parentService));
		BusinesspartnerSharedCertificateGridBehavior.serviceCache[moduleName] = service;
		return service;
	}
	protected constructor(protected moduleName: string, protected parentService: IParentRole<ICertificateEntity, CertificateEntityComplete> & IEntitySelection<ICertificateEntity>) {
	}

	public onCreate(containerLink: IGridContainerLink<ICertificateEntity>) {
		const moduleNameTemp = this.moduleName;
		const parentServiceTemp = this.parentService;
		containerLink.uiAddOns.toolbar.addItemsAtId(
			{
				id: 't-certificate2Subsidiarys',
				type: ItemType.Item,
				caption: {key: 'businesspartner.main.toolbarCertificate2Branch'},
				iconClass: 'tlb-icons ico-add-customer-company',
				sort: 0,
				permission: '#c',
				disabled: () => {
					return containerLink.entitySelection.getSelection().length === 0;
				},
				fn: async () => {
					const dialogService = ServiceLocator.injector.get(BusinesspartnerSharedSubEntityDialogService);
					const gridDialogOptions: ISubEntityGridDialogOptions<ICertificate2subsidiaryEntity> = {
						width: '50%',
						headerText: {key: 'businesspartner.main.certificateToSubsidiaryDailogTitle'},
						windowClass: 'grid-dialog',
						tools: {
							cssClass: 'tools',
							items: [
								{
									id: 'z1',
									sort: 10,
									type: ItemType.Item,
									caption: 'cloud.common.taskBarNewRecord',
									iconClass: 'tlb-icons ico-rec-new',
									fn: (info: IMenuItemEventInfo<ISubEntityGridDialog>) => {
										info.context.dataService.create();
									},
								},
								{
									id: 'z2',
									sort: 20,
									caption: 'cloud.common.taskBarDeleteRecord',
									iconClass: 'tlb-icons ico-rec-delete',
									type: ItemType.Item,
									fn: (info: IMenuItemEventInfo<ISubEntityGridDialog>) => {
										const selection = info.context.dataService.getSelection();
										info.context.dataService.delete(selection);
									},
								},
							]
						},
						gridConfig: {
							uuid: '20cb4e853f434d48893c684b0797d188',
							columns: [
								{
									type: FieldType.Lookup,
									id: 'subsidiaryfk',
									required: true,
									model: 'SubsidiaryFk',
									label: {key: 'businesspartner.certificate.entitySubsidiaryFk'},
									visible: true,
									sortable: true,
									lookupOptions: createLookup({
										dataServiceToken: BusinesspartnerSharedSubsidiaryLookupService,
										displayMember: 'SubsidiaryDescription',
										serverSideFilter: {
											key: 'businesspartner-main-certificate-to-subsidiary-common-filter',
											execute: ()  => {
												const selection = containerLink.entitySelection.getSelection();
												return {
													BusinessPartnerFk: selection && selection.length  ? selection[0].BusinessPartnerFk : -1
												};
											}
										}
									})
								},
								{
									type: FieldType.Lookup,
									id: 'subsidiaryAddressInfo',
									model: 'SubsidiaryFk',
									label: {key: 'businesspartner.certificate.entitySubsidiaryAddress'},
									visible: true,
									sortable: true,
									readonly: true,
									lookupOptions: createLookup({
										dataServiceToken: BusinesspartnerSharedSubsidiaryLookupService,
										displayMember: 'AddressInfo',
									})
								}
							]
						},
						isReadOnly: false,
						allowMultiSelect: true,
						buttons: [
							{
								id: StandardDialogButtonId.Ok,
							},
							{
								id: StandardDialogButtonId.Cancel,
							}
						]
					};

					const certificate2SubsidiaryDataService =
						BusinesspartnerSharedCertificateToSubsidiaryDataService.getService(moduleNameTemp, parentServiceTemp);

					const bodyProviders: StaticProvider[] = [
						{
							provide: SUB_ENTITY_DATA_SERVICE_TOKEN,
							useValue: certificate2SubsidiaryDataService
						}
					];

					const result = await dialogService.show(gridDialogOptions, bodyProviders);
					if (result) {
						if (result.closingButtonId === StandardDialogButtonId.Cancel) {
							certificate2SubsidiaryDataService.resetLocal();
						}
					}
				},
			},
			EntityContainerCommand.CreateRecord,
			InsertPosition.Before
		);
	}
}
/*
 * Copyright(c) RIB Software GmbH
 */

import { ModulePreloadInfoBase, TileSize, ITile, ISubModuleRouteInfo, IWizard, TileGroup, LazyInjectableInfo, IInitializationContext } from '@libs/platform/common';
import { ContainerModuleRouteInfo } from '@libs/ui/container-system';
// Disabling the module boundaries check is STRICTLY PROHIBITED. You must solve this differently.
// // eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { MODULE_INFO_BUSINESSPARTNER } from '@libs/businesspartner/common';
import { LAZY_INJECTABLES } from './lazy-injectable-info.model';
import { BUSINESSPARTNER_MAIN_WIZARDS } from './wizards/businesspartner-main-wizards';
import { BUSINESSPARTNER_COMMON_WIZARDS } from './wizards/businesspartner-common-wizards';
export class BusinessPartnerPreloadInfo extends ModulePreloadInfoBase {
	public static readonly instance = new BusinessPartnerPreloadInfo();

	private constructor() {
		super();
	}

	/**
	 * Returns the internal name of the module.
	 * @return {string}
	 */
	public override get internalModuleName(): string {
		return 'businesspartner';
	}

	/**
	 * Returns the desktop tiles supplied by the module.
	 * @return {ITile[]}
	 */
	public override get desktopTiles(): ITile[] {
		return [
			{
				id: 'businesspartner.main',
				tileSize: TileSize.Large,
				color: 3704191,
				textColor: 16777215,
				opacity: 0.9,
				defaultGroupId: TileGroup.Enterprise,
				iconClass: 'ico-business-partner',
				iconColor: 16777215,
				defaultSorting: 13,
				displayName: {
					text: 'Business Partner',
					key: 'cloud.desktop.moduleDisplayNameBusinessPartner',
				},
				description: {
					text: 'Business Partner',
					key: 'cloud.desktop.moduleDescriptionBusinessPartner',
				},
				permissionGuid: 'c175fc99877a45c988a7e3706a900add',
				targetRoute: 'businesspartner/main',
			},
			{
				id: 'businesspartner.evaluationschema',
				tileSize: TileSize.Large,
				color: 5221202,
				textColor: 16777215,
				opacity: 0.9,
				defaultGroupId: TileGroup.Configuration,
				iconClass: 'ico-bp-evaluation',
				iconColor: 16777215,
				defaultSorting: 7,
				displayName: {
					text: 'Evaluation Schema',
					key: 'cloud.desktop.moduleDisplayNameEvaluationSchema',
				},
				description: {
					text: 'Management of EvaluationSchema.',
					key: 'cloud.desktop.moduleDescriptionEvaluationSchema',
				},
				permissionGuid: 'f9359b3df60b4db287934cf77df54e51',
				targetRoute: 'businesspartner/evaluationschema',
			},
			{
				id: 'businesspartner.contact',
				tileSize: TileSize.Large,
				color: 5223853,
				textColor: 16777215,
				opacity: 0.9,
				defaultGroupId: TileGroup.Enterprise,
				iconClass: 'ico-contacts',
				iconColor: 16777215,
				defaultSorting: 14,
				displayName: {
					text: 'Contact',
					key: 'cloud.desktop.moduleDisplayNameForContact',
				},
				description: {
					text: 'Contact',
					key: 'cloud.desktop.moduleDescriptionContact',
				},
				permissionGuid: '91cd9c6fa29a4d62b8d8c3ccc03d9f72',
				targetRoute: 'businesspartner/contact',
			},
			{
				id: 'businesspartner.certificate',
				tileSize: TileSize.Small,
				color: 5223853,
				textColor: 16777215,
				opacity: 0.9,
				defaultGroupId: TileGroup.Enterprise,
				iconClass: 'ico-certificate',
				iconColor: 16777215,
				defaultSorting: 15,
				displayName: {
					text: 'Certificate',
					key: 'cloud.desktop.moduleDisplayNameCertificate',
				},
				description: {
					text: 'Management of Certificate',
					key: 'cloud.desktop.moduleDescriptionCertificate',
				},
				permissionGuid: 'dd844f724d314ac4a9d0f395052df8a6',
				targetRoute: 'businesspartner/certificate',
			},
		];
	}

	protected override getRouteInfos(): ISubModuleRouteInfo[] {
		return [
			ContainerModuleRouteInfo.create('main', () => import('@libs/businesspartner/main').then((module) => module.BusinessPartnerMainModule)),
			ContainerModuleRouteInfo.create('evaluationschema', () => import('@libs/businesspartner/evaluationschema').then((module) => module.BusinesspartnerEvaluationSchemaModule)),
			ContainerModuleRouteInfo.create('contact', () => import('@libs/businesspartner/contact').then((module) => module.BusinesspartnerContactModule)),
			ContainerModuleRouteInfo.create('certificate', () => import('@libs/businesspartner/certificate').then((module) => module.BusinesspartnerCertificateModule)),
		];
	}

	public override get wizards(): IWizard[] | null {
		return [
			{
				uuid: '882fa2cd388a48a6959a57efa46bf0d8',
				name: 'Change Business Partner Status',
				execute: (context) => {
					return import('@libs/businesspartner/main').then((module) => new module.BusinesspartnerMainWizard().changeBusinessPartnerStatus(context));
				},
			},
			{
				uuid: 'e223080e105242daa26ac5d82f74ec51',
				name: 'Change Business Partner Status2',
				execute: (context) => {
					return import('@libs/businesspartner/main').then((module) => new module.BusinesspartnerMainWizard().changeBusinessPartnerStatus2(context));
				},
			},
			{
				uuid: 'e90013d33ed04a1a8c3d904f1a78a1c4',
				name: 'Change Subsidiary Status',
				execute(context): Promise<void> | undefined {
					return import('@libs/businesspartner/main').then((module) => new module.BusinesspartnerMainWizard().changeSubsidiaryStatus(context));
				},
			},
			{
				uuid: 'e647d7d0aa4e42a5a6306cbcc404d628',
				name: 'Update Procurement Structure from Quote and Contract',
				execute(context): Promise<void> | undefined {
					return import('@libs/businesspartner/main').then((module) => new module.BusinesspartnerMainWizard().updatePrcStructureFromQtnContractService(context));
				},
			},
			{
				uuid: '98561975d34b487c9930a5d6f3c06224',
				name: 'Convert Address To Geographic Coordinate',
				execute(context: IInitializationContext): Promise<void> | undefined {
					return import('@libs/businesspartner/main').then((module) => new module.BusinesspartnerMainWizard().convertAddressToGeoCoordinate(context));
				},
			},
			{
				uuid: '3edd8d7491ea4dc0b5cb3d135a17a55a',
				name: 'Synchronize Contacts to Exchange Server',
				execute(context: IInitializationContext): Promise<void> | undefined {
					return import('@libs/businesspartner/main').then((module) => new module.BusinesspartnerMainWizard().contactsToExchange(context));
				},
			},
			{
				uuid: '2c476a42747548d6b7642e426d7a79cb',
				name: 'Activate Business Partner Assignment',
				execute(context): Promise<void> | undefined {
					return import('@libs/businesspartner/contact').then((module) => new module.BusinesspartnerContactWizard().activateBusinessPartnerAssignment(context));
				},
			},
			{
				uuid: '2453fc2e00964aed9e3680b3148e1e2a',
				name: 'Change Business Partner Code',
				execute(context): Promise<void> | undefined {
					return import('@libs/businesspartner/main').then((module) => new module.BusinesspartnerMainWizard().changeBpCode(context));
				},
			},
			{
				uuid: '16dcf3ac93a246539de9536aa3a207dc',
				name: 'Check Business Partner VAT No. Result',
				execute(context): Promise<void> | undefined {
					return import('@libs/businesspartner/main').then((module) => new module.BusinesspartnerMainWizard().checkVatNo(context));
				},
			},
			{
				uuid: 'd16588e4beca49dd8ce69aaab98def6c',
				name: 'Import Business Partner',
				execute(context: IInitializationContext): Promise<void> | undefined {
					return import('@libs/businesspartner/main').then((module) => new module.BusinesspartnerMainWizard().importBusinesspartner(context));
				},
			},
			{
				uuid: '5d54f25179594897b0af59765163dcb2',
				name: 'Import Business Partner Contact',
				execute(context): Promise<void> | undefined {
					return import('@libs/businesspartner/main').then((module) => new module.BusinesspartnerMainWizard().importBusinessPartnerContacts(context));
				},
			},
			{
				uuid: '0263ac0b43cc49bdb5fab95ad0a0ecbd',
				name: 'Create Requests',
				execute(context): Promise<void> | undefined {
					return import('@libs/businesspartner/main').then((module) => new module.BusinesspartnerMainWizard().createRequests(context));
				},
			},
			{
				// todo chi: how to deal with wizard to hide?
				uuid: '6ae98efa1e6c4c1c9af9918b3eba1d4e',
				name: 'Create new Business Partner',
				execute(context): Promise<void> | undefined {
					return import('@libs/businesspartner/main').then((module) => new module.BusinesspartnerMainWizard().beserveCreateBusinessPartner(context));
				},
			},
			{
				// todo chi: how to deal with wizard to hide?
				uuid: '10453e3fb69747bd8739123bb763e9cc',
				name: 'Update Current Business Partner',
				execute(context): Promise<void> | undefined {
					return import('@libs/businesspartner/main').then((module) => new module.BusinesspartnerMainWizard().beserveUpdateSingleSelectionBP(context));
				},
			},
			{
				// todo chi: how to deal with wizard to hide?
				uuid: 'deb1a1aeb15e4b70bd196f966a5c2c31',
				name: 'Update all Business Partner',
				execute(context): Promise<void> | undefined {
					return import('@libs/businesspartner/main').then((module) => new module.BusinesspartnerMainWizard().beserveUpdateAllBP(context));
				},
			},
			{
				uuid: '2d3a529369454d1e9e06bd057705737a',
				name: 'Export VCF File',
				execute(context): Promise<void> | undefined {
					const internalModuleName = context.moduleManager.activeModule?.internalModuleName;
					if (MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName === internalModuleName) {
						return import('@libs/businesspartner/main').then((bpModule) => {
							return import('@libs/businesspartner/contact').then((module) => new module.BusinesspartnerContactWizard().exportVCF(context, context.injector.get(bpModule.BusinesspartnerContactDataService)));
						});
					} else {
						return import('@libs/businesspartner/contact').then((module) => new module.BusinesspartnerContactWizard().exportVCF(context, context.injector.get(module.ContactDataService)));
					}
				},
			},
			{
				uuid: '99c227deadf041468f18cea2bc28d626',
				name: 'Disable Contact',
				execute(context): Promise<void> | undefined {
					const internalModuleName = context.moduleManager.activeModule?.internalModuleName;
					if (MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName === internalModuleName) {
						return import('@libs/businesspartner/main').then((bpModule) => {
							return import('@libs/businesspartner/contact').then((module) => new module.BusinesspartnerContactWizard().disableContact(context, context.injector.get(bpModule.BusinesspartnerContactDataService)));
						});
					} else {
						return import('@libs/businesspartner/contact').then((module) => new module.BusinesspartnerContactWizard().disableContact(context, context.injector.get(module.ContactDataService)));
					}
				},
			},
			{
				uuid: '23f1588d3b6e4840b9b374f6936521a5',
				name: 'Enable Contact',
				execute(context): Promise<void> | undefined {
					return import('@libs/businesspartner/contact').then((module) => new module.BusinesspartnerContactWizard().enableContact(context));
				},
			},
			{
				uuid: '5692c3d374d94244bd872d6559e038d2',
				name: 'Import VCF File',
				execute(context): Promise<void> | undefined {
					const internalModuleName = context.moduleManager.activeModule?.internalModuleName;
					if (MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName === internalModuleName) {
						return import('@libs/businesspartner/main').then((bpModule) => {
							return import('@libs/businesspartner/contact').then((module) => new module.BusinesspartnerContactWizard().importVCF(context, context.injector.get(bpModule.BusinesspartnerContactDataService)));
						});
					} else {
						return import('@libs/businesspartner/contact').then((module) => new module.BusinesspartnerContactWizard().importVCF(context, context.injector.get(module.ContactDataService)));
					}
				},
			},
			{
				uuid: '7bc7bea27bac4cd7afe34b0225815820',
				name: 'Change Supplier Status',
				execute(context): Promise<void> | undefined {
					return import('@libs/businesspartner/main').then((module) => new module.BusinesspartnerMainWizard().changeSupplierStatus(context));
				},
			},
			{
				uuid: '630721cefe87445d997b70bf88141489',
				name: 'Change Customer Status',
				execute(context): Promise<void> | undefined {
					return import('@libs/businesspartner/main').then((module) => new module.BusinesspartnerMainWizard().changeCustomerStatus(context));
				},
			},
			{
				uuid: '8c8066ad189742d8b5cd1f65f1891615',
				name: 'Change Bank Status',
				execute(context): Promise<void> | undefined {
					return import('@libs/businesspartner/main').then((module) => new module.BusinesspartnerMainWizard().changeBpdBankStatus(context));
				},
			},
			{
				uuid: 'a67c5601874147c89da95f40a6012c47',
				name: 'Create Requests',
				execute(context): Promise<void> | undefined {
					return import('@libs/businesspartner/certificate').then((module) => new module.BusinesspartnerCertificateWizard().createRequests(context));
				},
			},
			{
				uuid: '4952bb1597d1428b91fc9122b7eb2a4b',
				name: 'Send Email',
				execute(context: IInitializationContext): Promise<void> | undefined {
					return import('@libs/businesspartner/certificate').then((module) => new module.BusinesspartnerCertificateWizard().sendEmail(context));
				},
			},
			{
				uuid: '3d228fe680e543759c4080400f93a816',
				name: 'Send Fax',
				execute(context: IInitializationContext): Promise<void> | undefined {
					return import('@libs/businesspartner/certificate').then((module) => new module.BusinesspartnerCertificateWizard().sendFax(context));
				},
			},
			{
				uuid: '1d02a3e89f264539884baba7f9aac74a',
				name: 'Change Certificate Status',
				execute(context): Promise<void> | undefined {
					return import('@libs/businesspartner/certificate').then((module) => new module.BusinesspartnerCertificateWizard().changeStatus(context));
				},
			},
			{
				uuid: '01d63163d6c443988851e320f45893da',
				name: 'Create Reminders',
				execute(context): Promise<void> | undefined {
					return import('@libs/businesspartner/certificate').then((module) => new module.BusinesspartnerCertificateWizard().createReminders(context));
				},
			},
			{
				uuid: '2e39fb5114254d97b971b73b022c43ab',
				name: 'changeProjectDocumentStatus',
				execute(context): Promise<void> | undefined {
					return import('@libs/businesspartner/certificate').then((module) => new module.BusinesspartnerCertificateWizard().changeDocumentProjectStatus(context));
				},
			},
			{
				uuid: '24477e6a4a244fab888fd3913acc2f2e',
				name: 'inviteSelectedBidder',
				execute(context, wizardParameters): Promise<void> | undefined {
					return import('@libs/businesspartner/main').then((module) => new module.BusinesspartnerMainWizard().inviteSelectedBidder(context, wizardParameters));
				},
			},
			{

				uuid: '12f9d13b74d54c438dc7cc660743141e',
				name: 'characteristicBulkEditor',
				execute: (context) => {
					return import('@libs/businesspartner/main').then((module) => new module.BusinesspartnerMainWizard().characteristicBulkEditor(context));
				},
			},
			{
				uuid: '56d5fa5f8b464875bbe10c47736e1a16',
				name: 'changeCustomerCode',
				execute(context): Promise<void> | undefined {
					return import('@libs/businesspartner/main').then((module) => new module.BusinesspartnerMainWizard().changeCustomerCodeService(context));
				},
			},
			{
				uuid: '0fc27e104da243af9323d1c99edf56d2',
				name: 'changeSuppilerCode',
				execute(context): Promise<void> | undefined {
					return import('@libs/businesspartner/main').then((module) => new module.BusinesspartnerMainWizard().changeSupplierCodeService(context));
				},
			},
			{
				uuid: '68ea49dabf0940308445a6e61b00dd2b',
				name: 'changeEvaluationStatus',
				execute(context): Promise<void> | undefined {
					return import('@libs/businesspartner/main').then((module) => new module.BusinesspartnerMainWizard().changeEvaluationStatus(context));
				},
			},
			{
				uuid: '4366e141e4504e4da8c22ebede223232',
				name: 'reactivateOrInactivatePortalUser',
				execute(context): Promise<void> | undefined {
					return import('@libs/businesspartner/contact').then((module) => new module.BusinesspartnerContactWizard().reactivateOrInactivatePortalUser(context));
				},
			},
			...BUSINESSPARTNER_MAIN_WIZARDS,
			...BUSINESSPARTNER_COMMON_WIZARDS,

		];
	}

		/**
	 * Returns all lazy injectable providers from all sub-modules of the module.
	 *
	 * @returns The lazy injectable providers.
	 */
		public override get lazyInjectables(): LazyInjectableInfo[] {
			return LAZY_INJECTABLES;
		}


}

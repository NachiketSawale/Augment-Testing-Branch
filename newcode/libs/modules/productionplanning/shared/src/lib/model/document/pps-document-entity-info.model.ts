// /*
//  * Copyright(c) RIB Software GmbH
//  */

// import { ProviderToken } from '@angular/core';
// import { CompleteIdentification, IEntityIdentification, IInitializationContext, } from '@libs/platform/common';
// import { IEntitySelection } from '@libs/platform/data-access';
// import { EntityInfo } from '@libs/ui/business-base';
// import { IPpsDocumentEntity } from './pps-document-entity.interface';
// import { ProductionplanningSharedDocumentLayoutService } from '../../services/document/pps-document-layout.service';
// import { ProductionplanningSharedDocumentDataServiceManager } from '../../services/document/pps-document-data-service-manager.service';
// import { PpsDocumentGridBehavior } from '../../services/document/pps-document-grid-behavior.service';

// /**
//  * PPS Shared Document entity info
//  */
// export class ProductionplanningSharedDocumentEntityInfo {

// 	/**
// 	 * Create a real PPS document entity info configuration for different modules
// 	 */
// 	public static create<T extends IPpsDocumentEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>(config: {

// 		permissionUuid: string,
// 		endPoint: string,
// 		foreignKey: string,
// 		idProperty?: string,
// 		selectedItemIdProperty?: string,
// 		parentServiceFn: (context: IInitializationContext) => IEntitySelection<PT>,
// 		/**
// 		 * Permission uuid in lower case
// 		 */
// 		containerUuid: string,
// 		/**
// 		 * Form uuid in lower case
// 		 */
// 		formUuid: string;
// 		/**
// 		 * Data service
// 		 */
// 		// dataServiceToken: ProviderToken<ProductionplanningSharedDocumentDataService<T, PT, PU>>,
// 		/**
// 		 * Type Name
// 		 */
// 		typeName?: string
// 		/**
// 		 * Layout
// 		 */
// 		layout?: object,
// 		/**
// 		 * Customize layout service by extending ProductionplanningSharedDocumentLayoutService
// 		 * Default is ProductionplanningSharedDocumentLayoutService
// 		 */
// 		layoutServiceToken?: ProviderToken<ProductionplanningSharedDocumentLayoutService>
// 	}) {
// 		return EntityInfo.create<T>({
// 			grid: {
// 				title: { text: 'Document', key: 'procurement.common.document.prcDocumentContainerGridTitle' },
// 				behavior: ctx => ctx.injector.get(PpsDocumentGridBehavior)
// 			},
// 			form: {
// 				containerUuid: config.formUuid,
// 				title: { text: 'Document Detail', key: 'procurement.common.document.prcDocumentContainerFormTitle' }
// 			},
// 			// dataService: context => context.injector.get(config.dataServiceToken),
// 			dataService: context => ProductionplanningSharedDocumentDataServiceManager.getDataService<PT>({
// 				parentServiceFn: config.parentServiceFn,
// 				containerUuid: config.containerUuid,
// 				endPoint: config.endPoint,
// 				foreignKey: config.foreignKey,
// 				idProperty: config.idProperty,
// 				selectedItemIdProperty: config.selectedItemIdProperty,
// 				// provideLoadPayloadFn?: () => object,
// 			}, context),
// 			dtoSchemeId: { moduleSubModule: 'ProductionPlanning.Common', typeName: config.typeName ?? 'PpsDocumentDto' },
// 			permissionUuid: config.permissionUuid,
// 			layoutConfiguration: config.layout ? config.layout : context => {
// 				return context.injector.get(ProductionplanningSharedDocumentLayoutService).generateLayout();
// 			}
// 		});
// 	}
// }
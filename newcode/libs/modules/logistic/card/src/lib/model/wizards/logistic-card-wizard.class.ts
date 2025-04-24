/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { LogisticCardsCreateDispatchingRecordsWizard } from '../../services/wizards/logistic-card-create-dispatching-records-wizard.service';
import { LogisticCardsReserveMaterialAndStockWizard } from '../../services/wizards/logistic-card-reserve-material-and-stock-wizard.service';
import { LogisticCardWizardService } from '../../services/wizards/logistic-card-wizard.service';

/**
 *
 * This class provides functionality for logistic card wizards
 */
export class LogiscticCardWizard {
	/**
	 * This method provides functionality to change the card status
	 */
	public changeCardStatus(context: IInitializationContext) {
		const service = context.injector.get(LogisticCardWizardService);
		service.onStartChangeStatusWizard();
	}

	/**
	 * This method provides functionality to create dispatch notes from job cards
	 */
	public createDispatchNotesFromJobCards(context: IInitializationContext) {
		const service = context.injector.get(LogisticCardsCreateDispatchingRecordsWizard);
		service.createDispatchingRecords();
	}

	/**
	 * This method provides functionality to reserve material and stock
	 */
	public reserveMaterialAndStock(context: IInitializationContext) {
		const service = context.injector.get(LogisticCardsReserveMaterialAndStockWizard);
		service.reserveMaterialAndStock();
	}




}
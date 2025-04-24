/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { BasicsSharedClerkLookupService } from './basics-clerk-lookup.service';
import { TeamsButtonId } from '../teams/services/basics-shared-teams-button.service';

@Injectable({
	providedIn: 'root',
})
export class BasicsSharedClerkWithoutTeamsLookupService<TEntity extends object> extends BasicsSharedClerkLookupService<TEntity> {
	public constructor() {
		super();
		this.removeTeamsButton();
	}

	private removeTeamsButton() {
		if (this.config.buttons && this.config.buttons.length > 0) {
			this.config.buttons = this.config.buttons.filter(item => item.id !== TeamsButtonId);
		}
	}
}
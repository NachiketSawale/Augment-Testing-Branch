/*
 * Copyright(c) RIB Software GmbH
 */
import { BasicsSharedTeamsButton } from '../model/basics-shared-teams-button';
import { ILookupConfig, ILookupContext } from '@libs/ui/common';
import { ServiceLocator } from '@libs/platform/common';
import { BasicsSharedTeamsService } from './basics-shared-teams.service';
import { Injectable } from '@angular/core';
import { BasicsSharedTeamsManagementService } from './basics-shared-teams-management.service';

interface ITeamsUser {
	Email?: string | null;
}

export const TeamsButtonId: string = 'teams';

@Injectable({
	providedIn: 'root',
})
export class BasicsSharedTeamsButtonService<TItem extends ITeamsUser, TEntity extends object> {
	private readonly teamsService = ServiceLocator.injector.get(BasicsSharedTeamsService);
	private readonly teamsManageService = ServiceLocator.injector.get(BasicsSharedTeamsManagementService);

	/**
	 * prepare teams button
	 */
	public createTeamsButton() {
		if (this.teamsManageService.enableTeamsChatNavigation) {
			const teamsChatBtn = new BasicsSharedTeamsButton<TItem, TEntity>(TeamsButtonId, '', (context?: ILookupContext<TItem, TEntity>) => {
				this.openTeamsChat(context);
			});
			teamsChatBtn.css = { class: 'control-icons ico-teams' };
			// ele.title = $translate.instant('basics.clerk.teams.chatInTeams'); ///todo:title not support yet
			teamsChatBtn.isDisabled = (context) => {
				return !this.canOpenTeamsChat(context);
			};
			return teamsChatBtn;
		}
		return undefined;
	}

	private openTeamsChat(context?: ILookupContext<TItem, TEntity>) {
		const emails = this.getEmailsFromContext(context);
		this.teamsService.openTeamsGroupChat(emails);
	}

	private getEmailsFromContext(context?: ILookupContext<TItem, TEntity>): string[] {
		const emails: string[] = [];
		if (!context || !context.entity || !context.lookupInput || !context.lookupInput.selectedItem) {
			return emails;
		}
		const selectedItem = context.lookupInput.selectedItem;
		if (selectedItem.Email) {
			emails.push(selectedItem.Email);
		}
		return emails;
	}

	private canOpenTeamsChat(context?: ILookupContext<TItem, TEntity>) {
		if (!context || !context.entity || !context.lookupInput || !context.lookupInput.selectedItem) {
			return false;
		}
		/// todo this should foreach multiple selection, if any item has email, then return true
		const selectedItem = context.lookupInput.selectedItem;
		return selectedItem.Email;
	}

	/**
	 * add teams button to lookup config
	 * @param config
	 */
	public addTeamsButtonToLookup(config: ILookupConfig<TItem, TEntity>) {
		const teamsButton = this.createTeamsButton();
		if (teamsButton) {
			config.buttons = config.buttons || [];
			config.buttons.push(teamsButton);
		}
	}
}

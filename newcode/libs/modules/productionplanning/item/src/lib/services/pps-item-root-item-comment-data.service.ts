import { Inject, Injectable } from '@angular/core';
import { EntityBase, IEntityIdentification, IIdentificationData, ServiceLocator } from '@libs/platform/common';
import { BasicsSharedCommentDataService, ICommentRequestInfo, IPinBoardContainerCreationOptions, PIN_BOARD_CONTAINER_CREATION_OPTION_TOKEN } from '@libs/basics/shared';
import { IPPSItemEntity } from '../model/entities/pps-item-entity.interface';
import { PpsItemDataService } from './pps-item-data.service';
import { find } from 'lodash';

@Injectable({
    providedIn: 'root'
})
export class PpsItemRootItemCommentDataService extends BasicsSharedCommentDataService<IEntityIdentification & EntityBase, IPPSItemEntity> {

    private dataService: PpsItemDataService = ServiceLocator.injector.get(PpsItemDataService);

    public constructor(@Inject(PIN_BOARD_CONTAINER_CREATION_OPTION_TOKEN) options: IPinBoardContainerCreationOptions<IEntityIdentification & EntityBase, IPPSItemEntity>) {
        super(options);
    }

    private getRootItem(selection: IPPSItemEntity | null) {
        if (!selection) {
            return null;
        }

        const items = this.dataService.getList();
        let rootItem: IPPSItemEntity | null = selection;

        while (rootItem && rootItem.PPSItemFk !== null) {
            rootItem = find(items, { Id: rootItem.PPSItemFk }) || null;
        }

        return rootItem;
    }

    public override getMainItem() {
        const selection = this.dataService.getSelectedEntity();
        return this.getRootItem(selection);
    }

    // copied from basics-shared-comment-data-base.service.ts and remove the if statement with mainItem?.Id === identificationData.pKey1
    public override async load(identificationData: IIdentificationData) {
        this.clear();
        const mainItem = this.getMainItem();
        if (mainItem && this.getMainItemId(mainItem) !== undefined) {
            this.isLoading = true;
            const data: ICommentRequestInfo = {
                Qualifier: this.option.commentQualifier,
                ParentItemId: this.getMainItemId(mainItem),
            };

            const response = await this.lastHttp(mainItem, data);
            this.isLoading = false;
            if (response) {
                this.data = response;
                const commentEntities = (response[this.completeItemName] ?? []) as IEntityIdentification[];
                this.markAsVisible(commentEntities);
                this.setList(commentEntities);
            }
        }

        this.processor.process(this.getComments());
        return this.getComments();
    }
}
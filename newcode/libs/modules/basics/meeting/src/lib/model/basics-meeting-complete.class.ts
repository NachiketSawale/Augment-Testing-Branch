import { CompleteIdentification } from '@libs/platform/common';
import { IMtgHeaderEntity, IMtgAttendeeEntity, IMtgDocumentEntity } from '@libs/basics/interfaces';
import { BlobsEntity } from '@libs/basics/shared';

export class BasicsMeetingComplete implements CompleteIdentification<IMtgHeaderEntity> {
	public MainItemId: number = 0;

	public MtgHeaderToSave: IMtgHeaderEntity[] | null = [];

	public MtgAttendeeToSave: IMtgAttendeeEntity[] | null = [];
	public MtgAttendeeToDelete: IMtgAttendeeEntity[] | null = [];

	public MtgDocumentToSave: IMtgDocumentEntity[] | null = [];
	public MtgDocumentToDelete: IMtgDocumentEntity[] | null = [];

	public BlobSpecificationToSave: BlobsEntity | null = null;
}

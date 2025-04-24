/*
 * Copyright(c) RIB Software GmbH
 */
import { CommentType, PinBoardContainerFactory } from '@libs/basics/shared';
import { BusinesspartnerMainCertificateDataService } from '../../services/certificate-data.service';

/**
 * Businesspartner main certificate pin borad Entity info model.
 */
export const BP_MAIN_CERTIFICATE_PIN_BOARD_CONTAINER_DEFINITION = PinBoardContainerFactory.create({
	uuid: 'dc43044581c047268996e6214ef5860e',
	permission: 'b2167043a37a4512944edaa52986a6c3',
	title: 'businesspartner.main.pinboard.certificateCommentTitle',
	commentQualifier: 'businesspartner.certificate.certificates.comment',
	commentType: CommentType.Standard,
    parentServiceToken: BusinesspartnerMainCertificateDataService
});
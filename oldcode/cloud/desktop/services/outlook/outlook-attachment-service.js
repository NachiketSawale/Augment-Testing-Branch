/**
 * Created by wed on 8/11/2023.
 */

(function (angular, MicrosoftGraph) {
	'use strict';

	angular.module('cloud.desktop').factory('cloudDesktopOutlookAttachmentService', [
		'globals',
		'$http',
		'cloudDesktopOutlookMainService',
		function (
			globals,
			$http,
			outlookMainService
		) {
			const sizes = {
				largeSize: 3 * 1024 * 1024, // 3MB,
				inlineSize: 1.5 * 1024 * 1024, // 1.5M,
				inlineMaxImageSize: 0.5 * 1024 * 1024 // 0.5M
			};
			const largeFileOptions = {
				rangeSize: 1024 * 1024, // 1MB
				uploadEventHandlers: {
					progress: (range) => {
						console.log(`Uploaded bytes ${range ? range.minValue : '-'} to ${range ? range.maxValue : '-'}`);
					}
				}
			};

			const isLargeFile = function (size) {
				return size >= sizes.largeSize;
			};

			const isPossibleInlineFile = function (size) {
				return size <= sizes.inlineSize;
			};

			const isAllowImageSize = function (size) {
				return size <= sizes.inlineMaxImageSize;
			};

			const createAttachment = function (name, extProps) {
				return Object.assign({
					name: name,
					'@odata.type': '#microsoft.graph.fileAttachment'
				}, extProps);
			};

			const uploadSingleClientLargeFile = function (graphClient, messageId, file) {
				const largeFileUploadUrl = `/me/messages/${messageId}/attachments/createUploadSession`;
				return MicrosoftGraph.LargeFileUploadTask.createUploadSession(graphClient, largeFileUploadUrl, {
					AttachmentItem: {
						attachmentType: 'file',
						name: file.name,
						size: file.size
					}
				}).then(uploadSession => {
					const fileUpload = new MicrosoftGraph.FileUpload(file, file.name, file.size);
					const uploadTask = new MicrosoftGraph.LargeFileUploadTask(graphClient, fileUpload, uploadSession, largeFileOptions);
					return uploadTask.upload();
				});
			};

			const uploadClientLargeFile = function (graphClient, messageId, files) {
				const arrFiles = [...files].map(file => {
					return function () {
						return uploadSingleClientLargeFile(graphClient, messageId, file);
					};
				});
				return arrFiles.reduce(function (chain, currFn) {
					return chain.then(currFn);
				}, Promise.resolve());
			};

			const uploadClientSmallFile = function (graphClient, messageId, files) {
				const arrFiles = [...files].map(file => {
					return function () {
						return graphClient.api(`/me/messages/${messageId}/attachments`).post(file);
					};
				});
				return arrFiles.reduce(function (chain, currFn) {
					return chain.then(currFn);
				}, Promise.resolve());
			};

			const uploadServerFile = function (msalClient, messageId, attachments) {
				return msalClient.acquireTokenAsync().then((accessToken) => {
					return $http.post(globals.webApiBaseUrl + 'basics/common/outlook/upload', {
						messageId: messageId,
						attachments: attachments,
						accessToken: accessToken
					}).then(response => {
						return response.data;
					});
				});
			};

			const processAttachments = function (bodyContent, attachments) {
				attachments.forEach(m => {
					if (m['contentId'] && m.contentType && m.contentBytes) {
						bodyContent = bodyContent.replace(new RegExp('cid:' + m['contentId'], 'g'), `data:${m.contentType};base64,${m.contentBytes}`);
					}
				});
				return bodyContent;
			};

			const getAttachments = function (messageId, attachments) {
				const requests = attachments.map(m => {
					return function () {
						return outlookMainService.graphClient.api(`/me/messages/${messageId}/attachments/${m.id}`).get();
					};
				});
				return requests.reduce(function (chain, currFn) {
					return chain.then(result => {
						return currFn().then(currR => {
							return result.concat(currR);
						});
					});
				}, Promise.resolve([]));
			}

			const getAttachmentById = function(graphClient, messageId, attachmentId){
				return graphClient.api(`/me/messages/${messageId}/attachments/${attachmentId}`).get();
			}

			const createDocumentFromOutlookAttachment = function(attachment){
				return $http.post(globals.webApiBaseUrl + 'basics/common/outlook/copy', {
					attachments: [attachment],
					sectionType: 'DocumentsProject'
				}).then(response => {
					return response.data;
				});
			}

			return {
				sizes: sizes,
				isLargeFile: isLargeFile,
				isPossibleInlineFile: isPossibleInlineFile,
				isAllowImageSize: isAllowImageSize,
				createAttachment: createAttachment,
				uploadServerFile: uploadServerFile,
				uploadClientLargeFile: uploadClientLargeFile,
				uploadClientSmallFile: uploadClientSmallFile,
				processAttachments: processAttachments,
				getAttachments: getAttachments,
				getAttachmentById: getAttachmentById,
				createDocumentFromOutlookAttachment: createDocumentFromOutlookAttachment
			};
		}
	]);

})(angular, window.MicrosoftGraph);
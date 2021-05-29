import AWS from "aws-sdk";

AWS.config.update({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

/**
 * ex) Upload file to S3
 * @param {String} attachmentId the attachment id
 * @param {Buffer} data the file data
 * @param {String} mimetype the MIME type
 * @param {String} fileName the original file name
 * @return {Promise} promise to upload file to S3
 */
export const uploadToS3 = async (file, userId, folderName) => {
  try {
    const { filename, createReadStream } = await file;
    const readStream = createReadStream();
    const objectName = `${folderName}/${userId}-${Date.now()}-${filename}`;
    const { Location } = await new AWS.S3()
      .upload(
        {
          Bucket: process.env.AWS_BUCKET,
          Key: objectName,
          ACL: "public-read",
          Body: readStream,
        },
        (err) => {
          if (err) console.log("err", err);
        }
      )
      .promise();
    return Location;
  } catch (e) {
    return e;
  }
};

/**
 * * Delete file from S3
 * @param {String} attachmentId the attachment id
 * @return {Promise} promise resolved to deleted data
 */
export const deleteFromS3 = async (fileUrl) => {
  try {
    const objectName = fileUrl.replace(
      `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/`,
      ""
    );
    await new AWS.S3()
      .deleteObject(
        {
          Bucket: process.env.AWS_BUCKET,
          Key: objectName,
        },
        (err) => {
          if (err) console.log("err", err);
        }
      )
      .promise();
  } catch (e) {
    console.log(e);
    return e;
  }
};

/**
 * Download file from S3
 * @param {String} attachmentId the attachment id
 * @return {Promise} promise resolved to downloaded data
 */
async function downloadFromS3(attachmentId) {
  const file = await s3
    .getObject({
      Bucket: config.AMAZON.ATTACHMENT_S3_BUCKET,
      Key: attachmentId,
    })
    .promise();
  return {
    data: file.Body,
    mimetype: file.ContentType,
  };
}

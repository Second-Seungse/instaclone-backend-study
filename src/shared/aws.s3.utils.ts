import AWS from "aws-sdk";
import stream from "stream";

type S3UploadConfig = {
  accessKeyId: string;
  secretAccessKey: string;
  destinationBucketName: string;
  region?: string;
};

export type File = {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream?: any;
};

export type UploadedFileResponse = {
  filename: string;
  mimetype: string;
  encoding: string;
  url: string;
};

export interface IUploader {
  singleFileUploadResolver: (
    parent,
    { file }: { file: Promise<File> }
  ) => Promise<UploadedFileResponse>;
}

type S3UploadStream = {
  writeStream: stream.PassThrough;
  promise: Promise<AWS.S3.ManagedUpload.SendData>;
};

export class AWSS3Uploader implements IUploader {
  private s3: AWS.S3;
  public config: S3UploadConfig;

  constructor(config: S3UploadConfig) {
    AWS.config = new AWS.Config();
    AWS.config.update({
      region: config.region,
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    });

    this.s3 = new AWS.S3();
    this.config = config;
  }

  private createUploadStream(key: string): S3UploadStream {
    const pass = new stream.PassThrough();
    return {
      writeStream: pass,
      promise: this.s3
        .upload({
          Bucket: this.config.destinationBucketName,
          Key: key,
          Body: pass,
        })
        .promise(),
    };
  }

  private createDestinationFilePath(
    fileName: string,
    mimetype: string,
    encoding: string
  ): string {
    return fileName;
  }

  async singleFileUploadResolver(
    parent,
    file
  ): Promise<UploadedFileResponse> {

    console.log("00", file);

    const { filename, mimetype, encoding, createReadStream } = await file;

    // Create the destination file path
    const filePath = this.createDestinationFilePath(
      filename,
      mimetype,
      encoding
    );

    console.log("2", filePath);

    // Create an upload stream that goes to S3
    const uploadStream = this.createUploadStream(filePath);

    console.log("3", uploadStream);

    // Pipe the file data into the upload stream
    // createReadStream.pipe(uploadStream.writeStream);

    // Start the stream
    const result = await uploadStream.promise;

    console.log("4", result);

    // Get the link representing the uploaded file
    const link = result.Location;

    console.log("5", link);

    // (optional) save it to our database

    return { filename, mimetype, encoding, url: result.Location };
  }
}

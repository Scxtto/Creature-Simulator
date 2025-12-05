import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from "@aws-sdk/client-sqs";

const sqsClient = new SQSClient({ region: "ap-southeast-2" });
const QUEUE_URL = "https://sqs.ap-southeast-2.amazonaws.com/901444280953/11580062-a3-complete";
const MAX_AGE_MILLISECONDS = 120 * 1000; // 120 seconds in milliseconds

export const handler = async (event) => {
  try {
    console.log("Checking messages in the SQS complete queue...");

    // Receive messages from the SQS queue
    const receiveParams = {
      QueueUrl: QUEUE_URL,
      MaxNumberOfMessages: 10,
      AttributeNames: ["SentTimestamp"],
      WaitTimeSeconds: 0,
    };
    const response = await sqsClient.send(new ReceiveMessageCommand(receiveParams));

    if (response.Messages) {
      const now = Date.now();

      for (const message of response.Messages) {
        const sentTimestamp = parseInt(message.Attributes.SentTimestamp, 10);
        const age = now - sentTimestamp;

        // Check if the message is older than 120 seconds
        if (age > MAX_AGE_MILLISECONDS) {
          console.log(`Deleting message with ID: ${message.MessageId}, age: ${age} ms`);

          // Delete the message
          const deleteParams = {
            QueueUrl: QUEUE_URL,
            ReceiptHandle: message.ReceiptHandle,
          };
          await sqsClient.send(new DeleteMessageCommand(deleteParams));
        }
      }

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Checked and deleted old messages from the SQS complete queue",
        }),
      };
    } else {
      console.log("No messages found in the queue.");
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "No messages to delete",
        }),
      };
    }
  } catch (err) {
    console.log("Error processing SQS messages:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error processing SQS messages",
        error: err.message,
      }),
    };
  }
};

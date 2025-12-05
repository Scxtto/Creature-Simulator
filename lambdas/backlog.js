import { CloudWatchClient, PutMetricDataCommand } from "@aws-sdk/client-cloudwatch";
import { SQSClient, GetQueueAttributesCommand } from "@aws-sdk/client-sqs";

const cloudWatchClient = new CloudWatchClient({ region: "ap-southeast-2" });
const sqsClient = new SQSClient({ region: "ap-southeast-2" });

// Environment variables for queue URL and CloudWatch namespace
const QUEUE_URL = "https://sqs.ap-southeast-2.amazonaws.com/901444280953/11580062-a3-pending";
const NAMESPACE = "test/11580062RatioScale";

export const handler = async (event) => {
  try {
    // 1. Get the number of messages in the SQS queue
    const sqsResponse = await sqsClient.send(
      new GetQueueAttributesCommand({
        QueueUrl: QUEUE_URL,
        AttributeNames: ["ApproximateNumberOfMessages", "ApproximateNumberOfMessagesNotVisible"],
      })
    );

    // Retrieve waiting and in-flight message counts
    const waitingMessages = parseInt(sqsResponse.Attributes.ApproximateNumberOfMessages, 10);
    const inFlightMessages = parseInt(sqsResponse.Attributes.ApproximateNumberOfMessagesNotVisible, 10);

    // 2. Calculate the ratio of waiting messages to in-flight messages
    const ratio = inFlightMessages > 0 ? waitingMessages / inFlightMessages : 0;

    // 3. Publish the custom metric to CloudWatch
    const putMetricDataCommand = new PutMetricDataCommand({
      Namespace: NAMESPACE,
      MetricData: [
        {
          MetricName: "WaitingToInFlightMessageRatio",
          Value: ratio,
          Unit: "None",
        },
      ],
    });
    await cloudWatchClient.send(putMetricDataCommand);

    console.log(`Published metric with value: ${ratio}`);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Metric published successfully", ratio }),
    };
  } catch (error) {
    console.error("Error publishing metric:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to publish metric", error }),
    };
  }
};

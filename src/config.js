export default {
  MAX_ATTACHMENT_SIZE: 5000000,
  STRIPE_KEY: "pk_test_SHMgaMI6U1lfn5i05oMxKTVM00ne6RLkT9",
    s3: {
      REGION: "us-east-1",
      BUCKET: "itc6480-uploads"
    },
    apiGateway: {
      REGION: "us-east-1",
      URL: "https://0wswag2e6j.execute-api.us-east-1.amazonaws.com/prod"
    },
    cognito: {
      REGION: "us-east-1",
      USER_POOL_ID: "us-east-1_dP7RKg4kv",
      APP_CLIENT_ID: "413h5cpi2oaou1ivlfakc26qnh",
      IDENTITY_POOL_ID: "us-east-1:dc08904a-735e-4008-9b81-df6178be1bcc"
    }
  };

The graphql schema is in amplify/backend/api/enviroReadings/schema.graphql

You'll need to start with ```amplify configure``` and ```amplify init```

The output from ```amplify api add`` is shown below and used a copy of the
schema.graphql as referenced above

```
amplify api add

? Please select from one of the below mentioned services: GraphQL
? Provide API name: enviroReadings
? Choose the default authorization type for the API API key
? Enter a description for the API key: Enviro Readings API
? After how many days from now the API key should expire (1-365): 365
? Do you want to configure advanced settings for the GraphQL API Yes, I want to make some additional changes.
? Choose the additional authorization types you want to configure for the API (Press <space> to select, <a> to toggle all, <i> to invert selection)
? Do you have an annotated GraphQL schema? Yes
? Provide your schema file path: schema.graphql

The following types do not have '@auth' enabled. Consider using @auth with @model
	 - Reading
	 - Monitor
Learn more about @auth here: https://aws-amplify.github.io/docs/cli-toolchain/graphql#auth 


GraphQL schema compiled successfully.

Edit your schema at /home/iwright/examples/enviro-app/amplify/backend/api/enviroReadings/schema.graphql or place .graphql files in a directory at /home/iwright/examples/enviro-app/amplify/backend/api/enviroReadings/schema
Successfully added resource enviroReadings locally

Some next steps:
"amplify push" will build all your local backend resources and provision it in the cloud
"amplify publish" will build all your local backend and frontend resources (if you have hosting category added) and provision it in the cloud

```

```
amplify hosting add

? Select the environment setup: DEV (S3 only with HTTP)
? hosting bucket name "your site name"
? index doc for the website index.html
? error doc for the website index.html

You can now publish your app using the following command:
Command: amplify publish
```

This library exists to share visual components as well as entire modules between the Procosys MC webapp, commissioning webapp and other Equinor solutions, such as Echo Infield.

These are the existing and planned modules:
* Attachments 
* MCCR checklists
* Tag OCR (pending major upgrade)
* CPCL checklists (planned)
* Punch (planned)
* Commissioning Action log (planned)
* Commissioning Tasks (not planned, but expected)

Most modules require your app, represented by an Azure App Registration, to have access to the relevant Procosys API. Please contact the Procosys team to obtain this access.

How to use this library:
* Run "yarn" in the root of this repo
* Run "yarn link"

To link to this library
* Run "yarn start"
* Run "yarn link @equinor/procosys-webapp-components" in the app you want to test the code in.

To unlink
* Run "yarn unlink @equinor/procosys-webapp-components" in the app you tested the code in.

For info on how to contribute and publish changes to the package, please check out the guide in the Procosys Wiki Frontend section.

## Installing the package

This package is published to **npmjs.com** under the public `@equinor` scope, so no special registry configuration is required. Install it like any other dependency:

```
yarn add @equinor/procosys-webapp-components
```

or

```
npm install @equinor/procosys-webapp-components
```

## Publishing

Publishing is automated via the `Publish package` GitHub Actions workflow (`.github/workflows/publish.yml`). On every push to `main`, the workflow builds the package and publishes it to npmjs.com **only if** the version in `package.json` has not already been published. This means routine commits to `main` won't fail when the version is unchanged.

To release a new version:

1. Bump the `version` field in `package.json`.
2. Merge to `main`. The workflow publishes the new version automatically.

### Required secret

The workflow authenticates with npm using an `NPM_TOKEN` repository (or organization) secret. Create an npm **Automation** access token for an account with publish rights to the `@equinor` scope, then add it under **Settings → Secrets and variables → Actions** as `NPM_TOKEN`.
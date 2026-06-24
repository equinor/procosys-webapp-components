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

This package is published to **GitHub Packages** (not npmjs.com). To install it, configure npm/yarn to resolve the `@equinor` scope from the GitHub Packages registry.

1. Create or update an `.npmrc` file in the root of your project:

   ```
   @equinor:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
   ```

2. Provide a GitHub Personal Access Token (classic) with the `read:packages` scope via the `GITHUB_TOKEN` environment variable (or paste the token directly in `.npmrc`, but never commit it):

   ```
   export GITHUB_TOKEN=your_token_here
   ```

3. Install the package:

   ```
   yarn add @equinor/procosys-webapp-components
   ```

   or

   ```
   npm install @equinor/procosys-webapp-components
   ```

In CI, you can use the automatically provided `GITHUB_TOKEN` secret instead of a personal access token.

## Publishing

Publishing is automated via the `Publish package` GitHub Actions workflow (`.github/workflows/publish.yml`). On every push to `main`, the workflow builds the package and publishes it to GitHub Packages **only if** the version in `package.json` has not already been published.

To release a new version, bump the `version` field in `package.json` and merge to `main`.
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
* Run "yarn link @procosys/procosys-webapp-components" in the app you want to test the code in.

To unlink
* Run "yarn unlink @procosys/procosys-webapp-components" in the app you tested the code in.

For info on how to contribute and publish changes to the package, please check out the guide in the Procosys Wiki Frontend section.

## Installing the package

This package is published to **GitHub Packages** under the `@procosys` scope (owned by the [ProCoSys](https://github.com/ProCoSys) organization). The `@procosys` scope is independent of the `@equinor` scope, so the EDS packages (`@equinor/eds-*`) and other `@equinor` dependencies continue to be resolved from npmjs.com as normal.

1. In the consuming project, create or update an `.npmrc` file in the repository root to route **only** the `@procosys` scope to GitHub Packages:

   ```
   @procosys:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
   ```

   Leave the `@equinor` scope untouched so it keeps resolving from the default npmjs.com registry.

2. Provide a GitHub Personal Access Token (classic) with the `read:packages` scope (with access to the ProCoSys organization) via the `NODE_AUTH_TOKEN` environment variable:

   ```
   export NODE_AUTH_TOKEN=your_token_here
   ```

   In CI (GitHub Actions), the automatically provided `GITHUB_TOKEN` works if the workflow runs in the ProCoSys organization; otherwise use a PAT secret.

3. Install the package:

   ```
   yarn add @procosys/procosys-webapp-components
   ```

   or

   ```
   npm install @procosys/procosys-webapp-components
   ```

## Publishing

Publishing is automated via the `📦 Publish package` GitHub Actions workflow (`.github/workflows/publish.yml`). On every push to `main`, the workflow builds the package and publishes it to GitHub Packages **only if** the version in `package.json` has not already been published. This means routine commits to `main` won't fail when the version is unchanged.

To release a new version:

1. Bump the `version` field in `package.json`.
2. Merge to `main`. The workflow publishes the new version automatically.

### Required secret

Because this repository lives in the `equinor` organization but the package is published to the `@procosys` (ProCoSys org) GitHub Packages registry, the workflow authenticates using a **`PROCOSYS_NPM_TOKEN`** secret. Create a GitHub Personal Access Token (classic) with the `write:packages` scope and access to the ProCoSys organization, then add it under **Settings → Secrets and variables → Actions** as `PROCOSYS_NPM_TOKEN`.

> If this repository is moved to the ProCoSys organization, the workflow can be simplified to use the automatic `GITHUB_TOKEN` instead of a PAT.
This documentation covers the TypeScript-based front-end code of RIB 4.0.
It includes any identifiers exported from any of the modules.

# Application Structure

The application is split up into multiple modules, whose code is hosted in the [`application` repository](https://dev.azure.com/ribdev/itwo40/_git/application).
Fundamentally, three roots can be distinguished:

- **platform:** The core code of the application.
- **ui:** Reusable UI elements.
- **modules:** All business (and administration) modules.

# About This Documentation

This documentation is generated automatically.

## Source

The documentation is generated using [Typedoc](https://typedoc.org/).
It uses documentation comments from the codebase in the `application` repository.

For module descriptions, additional Markdown files can be placed in the `.typedoc` subdirectory of each sub-module and referenced in the module's `typedoc.json` file.

### Format

Your documentation text can be formatted using Markdown.
Check out the [Typedoc documentation](https://typedoc.org/guides/doccomments/) for more information on the supported format.

### Text Replacement

In your Markdown files and documentation comments, you may use the following placeholders (prefix with `@@`):

| Placeholder | Meaning                                                                                                                        |
|-|--------------------------------------------------------------------------------------------------------------------------------|
| `product` | The product name.                                                                                                              |
| `company` | The company name.                                                                                                              |
| `dev###` | Link to JIRA ticket with ID DEV-###.                                                                                           |
| `rfd###` | Link to RIB Enterprise JIRA ticket with ID RFD-###.                                                                            |
| `ado###` | Link to DevOps work item with ID ###.                                                                                          |
| `apilink:...` | Link to API documentation with route ... (e.g. `ts/ui_common`) using our [API Link tool](https://devcenter.itwo40.eu/apilink). |
| `devcenter` | Link to the Dev-Center website.                                                                                                |

## Deployment

Deployment happens automatically based on a DevOps pipeline.
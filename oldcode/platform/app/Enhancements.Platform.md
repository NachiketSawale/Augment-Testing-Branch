## Enhancement in Client Context

Now we transport 2 clientId within the context from server to client.

**Purpose**

- signedInClientId: representing the login company selected while company selection dialog.
- clientId: representing the company of type 'mandant', can be signedInClientId itself in case its a 'mandant', or its next parent with type = 'mandant'

Picture: see (1)

## Server Side current context

the new property 'SignedInClientId' is available in the CurrentContext as well.

Picture: see (2)

[platform-context](http://rib-s-wiki01.rib-software.com/cloud/Attachments/images/platform/context/platform-context.jpg)



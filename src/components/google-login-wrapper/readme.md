# google-login-wrapper



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description                                  | Type            | Default           |
| ------------- | -------------- | -------------------------------------------- | --------------- | ----------------- |
| `checkStatus` | `check-status` |                                              | `boolean`       | `false`           |
| `clientId`    | `client-id`    |                                              | `string`        | `undefined`       |
| `expand`      | `expand`       |                                              | `"" \| "block"` | `""`              |
| `scope`       | `scope`        | Space-separated string of scopes to request. | `string`        | `"profile email"` |


## Events

| Event          | Description | Type                       |
| -------------- | ----------- | -------------------------- |
| `googleError`  |             | `CustomEvent<Error>`       |
| `googleLogin`  |             | `CustomEvent<ISocialUser>` |
| `googleStatus` |             | `CustomEvent<ISocialUser>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

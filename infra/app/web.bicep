param name string
param location string = resourceGroup().location
param tags object = {}

param identityName string
param apiBaseUrl string
param applicationInsightsName string
param containerAppsEnvironmentName string
param containerRegistryName string
param managedCertificateName string
param serviceName string = 'web'
param exists bool
@secure()
param googleLoginClientSecret string

resource webIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: identityName
  location: location
}

module app '../core/host/container-app-upsert.bicep' = {
  name: '${serviceName}-container-app'
  params: {
    name: name
    location: location
    tags: union(tags, { 'azd-service-name': serviceName })
    identityType: 'UserAssigned'
    identityName: identityName
    exists: exists
    containerAppsEnvironmentName: containerAppsEnvironmentName
    containerRegistryName: containerRegistryName
    customDomain: 'cnstlltn.ai'
    env: [
      {
        name: 'REACT_APP_APPLICATIONINSIGHTS_CONNECTION_STRING'
        value: applicationInsights.properties.ConnectionString
      }
      {
        name: 'REACT_APP_API_BASE_URL'
        value: apiBaseUrl
      }
      {
        name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
        value: applicationInsights.properties.ConnectionString
      }
      {
        name: 'AUTH_LOGIN_PARAMS'
        value: 'response_type=code id_token&resource=194094976957-s4uccitb516kkvcra1brbbe40398i6rl.apps.googleusercontent.com'
      }
    ]
    managedCertificateName: managedCertificateName
    secrets: [
      {
        name: 'google-login-client-secret'
        value: googleLoginClientSecret
      }
    ]
    targetPort: 80
  }
}

resource applicationInsights 'Microsoft.Insights/components@2020-02-02' existing = {
  name: applicationInsightsName
}

output CUSTOM_DOMAIN_VERIFICATION_ID string = app.outputs.customDomainVerificationId
output SERVICE_WEB_IDENTITY_PRINCIPAL_ID string = webIdentity.properties.principalId
output SERVICE_WEB_NAME string = app.outputs.name
output SERVICE_WEB_URI string = app.outputs.uri
output SERVICE_WEB_IMAGE_NAME string = app.outputs.imageName

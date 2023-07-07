param name string
param location string = resourceGroup().location
param tags object = {}

param containerAppsEnvironmentName string
param containerRegistryName string
param containerRegistryResourceGroupName string = ''
param logAnalyticsWorkspaceName string
param managedCertificateName string
param applicationInsightsName string = ''

module containerAppsEnvironment 'container-apps-environment.bicep' = {
  name: '${name}-container-apps-environment'
  params: {
    name: containerAppsEnvironmentName
    location: location
    tags: tags
    logAnalyticsWorkspaceName: logAnalyticsWorkspaceName
    applicationInsightsName: applicationInsightsName
  }
}

module managedCertificate 'managed-certificate.bicep' = {
  name: managedCertificateName
  params: {
    managedCertificateName: managedCertificateName
    location: location
    environmentName: containerAppsEnvironmentName
  }
}

module containerRegistry 'container-registry.bicep' = {
  name: '${name}-container-registry'
  scope: !empty(containerRegistryResourceGroupName) ? resourceGroup(containerRegistryResourceGroupName) : resourceGroup()
  params: {
    name: containerRegistryName
    location: location
    tags: tags
  }
}

output appIpAddress string = containerAppsEnvironment.outputs.appIpAddress
output defaultDomain string = containerAppsEnvironment.outputs.defaultDomain
output environmentName string = containerAppsEnvironment.outputs.name
output environmentId string = containerAppsEnvironment.outputs.id

output registryLoginServer string = containerRegistry.outputs.loginServer
output registryName string = containerRegistry.outputs.name

@description('The custom domain container')
param customDomain string

@description('Name of the managed certificate for custom domain')
param managedCertificateName string

param environmentName string
param location string = resourceGroup().location

resource managedCertificate 'Microsoft.App/managedEnvironments/managedCertificates@2022-11-01-preview' = {
  name: managedCertificateName
  location: location
  dependsOn: [ webApp ]
  parent: containerAppsEnvironment
  properties: {
    domainControlValidation: 'TXT'
    subjectName: customDomain
  }
}

resource containerAppsEnvironment 'Microsoft.App/managedEnvironments@2023-04-01-preview' existing = {
  name: environmentName
}


resource webApp 'Microsoft.App/containerApps@2023-04-01-preview' existing = {
  name: 'web'
}

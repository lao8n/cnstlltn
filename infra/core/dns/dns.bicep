param environmentName string

resource dns_zone 'Microsoft.Network/dnsZones@2018-05-01' existing = {
  name: 'cnstlltn.ai'

  resource cname 'CNAME@2018-05-01' = {
    name: '@'
    properties: {
      TTL: 3600
      CNAMERecord: {
        cname: containerAppsEnvironment.properties.defaultDomain
      }
    }
  }

  resource verification 'TXT@2018-05-01' = {
    name: 'asuid'
    properties: {
      TTL: 3600
      TXTRecords: [
        {
          value: [containerAppsEnvironment.properties.customDomainConfiguration.customDomainVerificationId]
        }
      ]
    }
  }
}

resource containerAppsEnvironment 'Microsoft.App/managedEnvironments@2023-04-01-preview' existing = {
  name: environmentName
}

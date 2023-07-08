param webContainerAppName string
param dnsZoneName string
param location string = resourceGroup().location
param verificationId string

resource dnsZone 'Microsoft.Network/dnsZones@2018-05-01' = {
  name: dnsZoneName
  location: location
}

resource cname 'Microsoft.Network/dnsZones/CNAME@2018-05-01' = {
  name: 'www'
  parent: dnsZone
  properties: {
    TTL: 3600
    CNAMERecord: {
      cname: '${webContainerAppName}.${location}.azurecontainer.io'
    }
  }
}

resource txtRecord 'Microsoft.Network/dnsZones/TXT@2018-05-01' = {
  name: '@'
  parent: dnsZone
  properties: {
    TTL: 3600
    TXTRecords: [
      {
        value: [
          verificationId
        ]
      }
    ]
  }
}

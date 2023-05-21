export interface GeoCode {
    place_id: number
    licence: string
    powered_by: string
    osm_type: string
    osm_id: number
    lat: string
    lon: string
    display_name: string
    address: Address
    boundingbox: string[]
  }
  
  export interface Address {
    house_number: string
    road: string
    town: string
    county: string
    state: string
    region: string
    postcode: string
    country: string
    country_code: string
  }
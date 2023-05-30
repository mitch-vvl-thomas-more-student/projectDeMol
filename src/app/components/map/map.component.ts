import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CapacitorOpenstreetmap } from 'capacitor-openstreetmap';
import * as Leaflet from 'leaflet';



@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() lat: string;
  @Input() lng: string;
  map: Leaflet.Map;
  #customIcon = Leaflet.icon({
    iconUrl: 'assets/icon/map-marker.png',
    iconSize: [12, 24], // adjust the size of the icon
  });
  observer: ResizeObserver;
  
  constructor() { }

  ngOnInit() {
    this.leafletMap();
  }

  leafletMap() {
    this.map = new Leaflet.Map('mapId').setView([Number(this.lat), Number(this.lng)], 35);

    Leaflet.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: 'project-de-mol'
    }).addTo(this.map);

    const circle = Leaflet.circle([Number(this.lat), Number(this.lng)], {
      color: 'blue',
      fillColor: 'lightblue',
      fillOpacity: 0.5,
      radius: 20
    }).addTo(this.map);

    const markPoint = Leaflet.marker([Number(this.lat), Number(this.lng)], { icon: this.#customIcon }).addTo(this.map);

    //   markPoint.bindPopup('<p>Tashi Delek - Bangalore.</p>');
    //Using setInterval can help the reloading or refreshing of the map itself.
    // setInterval(() => {
    //   this.map.invalidateSize();
    // }, 500);

    setTimeout(() => {
      this.map.invalidateSize();
    }, 1000);
    
  }

  ngOnDestroy() {
    this.observer.disconnect();

    this.map.eachLayer(layer => {
      if (layer instanceof Leaflet.Marker || layer instanceof Leaflet.Circle) {
        this.map.removeLayer(layer);
      }
    });
  }
  ngAfterViewInit() {
    this.observer = new ResizeObserver(() => {
      this.map.invalidateSize();
    });
  
    const map = document.getElementById('mapId');
    if (map) {
    this.observer.observe(map);
    }
  }  

  // async ngOnInit() {

  // await CapacitorOpenstreetmap.initialize({
  //   mapId: 'map',
  //   latitude: Number(this.lat),
  //   longitude: Number(this.lng),
  //   zoom: 30
  // });
  // await CapacitorOpenstreetmap.addMarker({
  //   id: 'address',
  //   location: { lat: Number(this.lat), lng: Number(this.lng) }
  // });
  // await CapacitorOpenstreetmap.addCircle({
  //   id: 'address-marker',
  //   latitude: Number(this.lat),
  //   longitude: Number(this.lng),
  //   color: 'blue',
  //   fillColor: 'lightblue',
  //   fillOpacity: 0.4,
  //   radius: 20
  // });


  //  }
}
